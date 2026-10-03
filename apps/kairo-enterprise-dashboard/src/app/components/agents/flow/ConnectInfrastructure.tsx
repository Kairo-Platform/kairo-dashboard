"use client";

import { Icon } from "@iconify/react";
import { useModal } from "@kairo/hooks";
import { Button, ButtonClass, ButtonSize, Flex, Modal } from "@kairo/ui";
import { FormInput } from "@kairo/ui/inputs";
import { z } from "zod";
import { useState } from "react";
import { getOrgId } from "@/lib/auth/client";
import { flow, unwrapFlowResponse } from "@/services/Flow";
import { showErrorNotification, showSuccessNotification } from "@kairo/utils";
import styled from "styled-components";
import { FALLBACK_INFRASTRUCTURES } from "./resources";
import type { FlowInfrastructure } from "./types";

const INFRASTRUCTURE_ICON = "bitcoin-icons:coins-filled";

const ConnectInfrastructureContainer = styled.div`
  max-width: 50rem;
  width: 100%;
  margin: 0 auto;
  border: 1.5px solid ${(props) => props.theme.colors.gray_02};
  border-radius: 2rem;
  padding: 1.5rem;

  .ConnectInfrastructure_list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    gap: 1rem;
  }

  .ConnectInfrastructure__subtitle {
    color: ${(props) => props.theme.colors.text_02};
  }

  .infrastructureCard {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    max-width: 20rem;
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    border: 1.5px solid ${(props) => props.theme.colors.gray_02};

    &__icon {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      background-color: ${(props) => props.theme.colors.gray_02};
      color: ${(props) => props.theme.colors.orange};
      border-radius: 0.5rem;
    }

    &__description {
      font-size: 0.8125rem;
      font-weight: 500;
      line-height: 1.25rem;
      letter-spacing: -0.008125rem;
      color: ${(props) => props.theme.colors.text_02};
    }

    &__connected {
      display: inline-flex;
      align-items: center;
      gap: 0.3125rem;
      height: 1.875rem;
      padding: 0 0.75rem 0 0.375rem;
      border-radius: 2.5rem;
      border: 1px solid #ddf5da;
      background-color: #f4fcf3;
      color: ${(props) => props.theme.colors.green};
      font-size: 0.8125rem;
      font-weight: 500;
      line-height: 1.125rem;
      letter-spacing: -0.008125rem;
      white-space: nowrap;
    }
  }
`;

type ConnectInfrastructureProps = {
  infrastructures?: FlowInfrastructure[];
  onContinue: () => void;
  onConfigured?: (id: string) => void;
  variant?: "setup" | "standalone";
};

const connectSchema = z.object({
  url: z
    .string()
    .trim()
    .url("Enter a valid MCP endpoint URL")
    .refine((value) => {
      try {
        const url = new URL(value);
        return (
          url.protocol === "https:" ||
          (url.protocol === "http:" &&
            ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
        );
      } catch {
        return false;
      }
    }, "Use HTTPS, or HTTP for localhost only"),
  bearerToken: z
    .string()
    .trim()
    .refine((value) => !/[\r\n]/.test(value), "Enter a valid bearer token"),
});

type ConnectFormData = z.input<typeof connectSchema>;
type ConnectFormErrors = Partial<Record<keyof ConnectFormData, string>>;

export const ConnectInfrastructure = ({
  infrastructures = FALLBACK_INFRASTRUCTURES,
  onContinue,
  onConfigured,
  variant = "setup",
}: ConnectInfrastructureProps) => {
  const [savedInfrastructureId, setSavedInfrastructureId] = useState<
    string | null
  >(null);
  const [selectedInfrastructureId, setSelectedInfrastructureId] = useState<
    string | null
  >(null);
  const localInfrastructures = infrastructures.map((item) => ({
    ...item,
    isConnected: savedInfrastructureId
      ? item.id === savedInfrastructureId
      : item.isConnected,
  }));
  const selectedInfrastructure = localInfrastructures.find(
    (item) => item.id === selectedInfrastructureId,
  );

  const { showModal: showConnectModal, toggleModal: toggleConnectModal } =
    useModal(false);

  const [formData, setFormData] = useState<ConnectFormData>({
    url: "",
    bearerToken: "",
  });

  const [formErrors, setFormErrors] = useState<ConnectFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasConnected = localInfrastructures.some((item) => item.isConnected);

  const openConnectModal = (item: FlowInfrastructure) => {
    setSelectedInfrastructureId(item.id);
    setFormErrors({});
    setFormData({ url: "", bearerToken: "" });
    toggleConnectModal();
  };

  const closeConnectModal = () => {
    if (isSubmitting) return;
    setFormData({ url: "", bearerToken: "" });
    setFormErrors({});
    setSelectedInfrastructureId(null);
    toggleConnectModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInfrastructure || isSubmitting) return;

    const result = connectSchema
      .superRefine((data, context) => {
        if (
          selectedInfrastructure.id === "orange" &&
          !data.bearerToken.replace(/^Bearer(?:\s+|$)/i, "").trim()
        ) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["bearerToken"],
            message: "Bearer token is required for Orange",
          });
        }
      })
      .safeParse(formData);
    if (!result.success) {
      const fieldErrors: ConnectFormErrors = {};
      for (const [key, value] of Object.entries(
        result.error.flatten().fieldErrors,
      )) {
        const msg = value?.[0];
        if (!msg) continue;
        if (key === "url") fieldErrors.url = msg;
        if (key === "bearerToken") fieldErrors.bearerToken = msg;
      }
      setFormErrors(fieldErrors);
      return;
    }

    const orgId = getOrgId();
    if (!orgId) {
      showErrorNotification({
        message: "Session expired. Please sign in again.",
      });
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const token = result.data.bearerToken.replace(/^Bearer\s+/i, "");
      const response = await flow.saveBankingBackend(orgId, {
        kind: selectedInfrastructure.id === "orange" ? "ORANGE" : "CUSTOM",
        url: result.data.url,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = unwrapFlowResponse<{ status: string }>(response);
      if (data.status !== "saved")
        throw new Error("Failed to save infrastructure configuration.");
      setSavedInfrastructureId(selectedInfrastructure.id);
      onConfigured?.(selectedInfrastructure.id);
      setFormData({ url: "", bearerToken: "" });
      setSelectedInfrastructureId(null);
      toggleConnectModal();
      showSuccessNotification({
        message:
          "Infrastructure configuration saved. Connectivity has not been tested.",
      });
    } catch (error) {
      const apiError = error as { error?: unknown; message?: unknown } | null;
      showErrorNotification({
        message:
          typeof apiError?.error === "string"
            ? apiError.error
            : typeof apiError?.message === "string"
              ? apiError.message
              : "Failed to save infrastructure configuration.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ConnectInfrastructureContainer>
      <Flex direction="column" gap="2rem">
        <div>
          <h2>Connect infrastructure</h2>
          {hasConnected && (
            <p className="ConnectInfrastructure__subtitle">
              Saving a new configuration replaces your organization’s current
              banking backend.
            </p>
          )}
        </div>

        <div className="ConnectInfrastructure_list">
          {localInfrastructures.map((item) => {
            const isConnected = item.isConnected;
            return (
              <div key={item.id} className="infrastructureCard">
                <Flex gap="0.75rem" align="center">
                  <span className="infrastructureCard__icon">
                    <Icon icon={INFRASTRUCTURE_ICON} width={24} height={24} />
                  </span>
                  <div>
                    <p>{item.name}</p>
                    {item.description ? (
                      <p className="infrastructureCard__description">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </Flex>

                {isConnected ? (
                  <span className="infrastructureCard__connected">
                    <Icon
                      icon="fluent:checkmark-circle-32-regular"
                      width={16}
                      height={16}
                    />
                    Configured
                    <Button
                      classes={[ButtonClass.OUTLINED]}
                      onClick={() => openConnectModal(item)}
                    >
                      Update
                    </Button>
                  </span>
                ) : (
                  <Button
                    classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
                    style={{ height: "2.5rem" }}
                    onClick={() => openConnectModal(item)}
                  >
                    Connect
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <Flex justify="flex-end" style={{ marginTop: "2rem" }}>
          <Button
            classes={[ButtonClass.SOLID]}
            size={ButtonSize.WIDTH_140}
            disabled={isSubmitting || (variant === "setup" && !hasConnected)}
            onClick={onContinue}
            style={{ width: "auto", minWidth: "140px" }}
          >
            {variant === "setup"
              ? "Continue to dashboard"
              : "Back to dashboard"}
          </Button>
        </Flex>
      </Flex>

      {showConnectModal && selectedInfrastructure && (
        <Modal
          title={`Connect ${selectedInfrastructure.name}`}
          onClose={closeConnectModal}
        >
          <form onSubmit={handleSubmit} noValidate>
            <Flex direction="column" gap="1.5rem">
              <FormInput
                label="MCP endpoint URL"
                name="url"
                placeholder="https://orange-host/mcp"
                type="text"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    url: e.target.value,
                  }))
                }
                message={
                  formErrors.url
                    ? { type: "error", content: formErrors.url }
                    : undefined
                }
                required
              />

              <FormInput
                label={
                  selectedInfrastructure.id === "orange"
                    ? "Bearer token"
                    : "Bearer token (optional)"
                }
                name="bearerToken"
                placeholder="Enter provider token"
                type="password"
                value={formData.bearerToken}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bearerToken: e.target.value,
                  }))
                }
                message={
                  formErrors.bearerToken
                    ? { type: "error", content: formErrors.bearerToken }
                    : undefined
                }
                required={selectedInfrastructure.id === "orange"}
              />

              <Flex
                justify="flex-end"
                align="center"
                gap="1rem"
                style={{ marginTop: "2rem" }}
              >
                <Button
                  classes={[ButtonClass.OUTLINED]}
                  size={ButtonSize.WIDTH_140}
                  type="button"
                  onClick={closeConnectModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  classes={[ButtonClass.SOLID]}
                  style={{ minWidth: ButtonSize.WIDTH_140 }}
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Save configuration
                </Button>
              </Flex>
            </Flex>
          </form>
        </Modal>
      )}
    </ConnectInfrastructureContainer>
  );
};

export default ConnectInfrastructure;
