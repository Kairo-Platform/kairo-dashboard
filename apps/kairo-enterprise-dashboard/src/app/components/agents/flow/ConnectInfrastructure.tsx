"use client";

import { Icon } from "@iconify/react";
import { useModal } from "@kairo/hooks";
import { Button, ButtonClass, ButtonSize, Flex, Modal } from "@kairo/ui";
import { FormInput } from "@kairo/ui/inputs";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

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
      background-color: ${(props) => `${props.theme.colors.orange}15`};
      color: ${(props) => props.theme.colors.orange};
      border-radius: 0.5rem;
    }

    &__description {
      font-size: 0.875rem;
      color: ${(props) => props.theme.colors.text_04};
    }
  }

  .infrastructureCard.is-connected {
    border-color: ${(props) => props.theme.colors.green_01};
    background-color: ${(props) => `${props.theme.colors.green_01}10`};
  }
`;

type Infrastructure = {
  id: string;
  name: string;
  description?: string;
  isConnected: boolean;
};

type ConnectInfrastructureProps = {
  infrastructures?: Infrastructure[];
  onContinue: () => void;
};

const DUMMY_INFRASTRUCTURES: Infrastructure[] = [
  {
    id: "orange",
    name: "Orange",
    description: "Payment system",
    isConnected: false,
  },
];

const connectSchema = z.object({
  publicKey: z.string().min(1, "Public key is required"),
  secretKey: z.string().min(1, "Secret key is required"),
});

type ConnectFormData = {
  publicKey: string;
  secretKey: string;
};

type ConnectFormErrors = Partial<{
  publicKey: string;
  secretKey: string;
}>;

export const ConnectInfrastructure = ({
  infrastructures,
  onContinue,
}: ConnectInfrastructureProps) => {
  const initialInfrastructures = useMemo(
    () => (infrastructures?.length ? infrastructures : DUMMY_INFRASTRUCTURES),
    [infrastructures],
  );

  const [localInfrastructures, setLocalInfrastructures] = useState<
    Infrastructure[]
  >(initialInfrastructures);
  const [selectedInfrastructureId, setSelectedInfrastructureId] = useState<
    string | null
  >(null);

  const selectedInfrastructure = useMemo(
    () =>
      localInfrastructures.find((item) => item.id === selectedInfrastructureId) ??
      null,
    [localInfrastructures, selectedInfrastructureId],
  );

  useEffect(() => {
    setLocalInfrastructures(initialInfrastructures);
    setSelectedInfrastructureId(null);
  }, [initialInfrastructures]);

  const {
    showModal: showConnectModal,
    toggleModal: toggleConnectModal,
  } = useModal(false);

  const [formData, setFormData] = useState<ConnectFormData>({
    publicKey: "",
    secretKey: "",
  });

  const [formErrors, setFormErrors] = useState<ConnectFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasConnected = localInfrastructures.some((item) => item.isConnected);
  const firstNotConnected =
    localInfrastructures.find((item) => !item.isConnected) ?? null;

  const openConnectModal = (item: Infrastructure) => {
    if (item.isConnected) return;
    setSelectedInfrastructureId(item.id);
    setFormErrors({});
    setFormData({ publicKey: "", secretKey: "" });
    toggleConnectModal();
  };

  const closeConnectModal = () => {
    setFormErrors({});
    setSelectedInfrastructureId(null);
    toggleConnectModal();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInfrastructure) return;

    const result = connectSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: ConnectFormErrors = {};
      for (const [key, value] of Object.entries(
        result.error.flatten().fieldErrors,
      )) {
        const msg = value?.[0];
        if (!msg) continue;
        if (key === "publicKey") fieldErrors.publicKey = msg;
        if (key === "secretKey") fieldErrors.secretKey = msg;
      }
      setFormErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setLocalInfrastructures((prev) =>
        prev.map((item) =>
          item.id === selectedInfrastructure.id
            ? { ...item, isConnected: true }
            : item,
        ),
      );
      setIsSubmitting(false);
      closeConnectModal();
    }, 300);
  };

  return (
    <ConnectInfrastructureContainer>
      <Flex direction="column" gap="2rem">
        <h2>Connect Infrastructure</h2>

        <div className="ConnectInfrastructure_list">
          {localInfrastructures.map((item) => {
            const isConnected = item.isConnected;
            return (
              <div
                key={item.id}
                className={`infrastructureCard${isConnected ? " is-connected" : ""}`}
              >
                <Flex gap="0.5rem" align="center">
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

                {!isConnected && (
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
            disabled={!hasConnected}
            onClick={onContinue}
            style={{ width: "auto", minWidth: "140px" }}
          >
            Continue to dashboard
          </Button>
        </Flex>
      </Flex>

      {showConnectModal && selectedInfrastructure && (
        <Modal
          title={`Connect ${selectedInfrastructure.name}`}
          onClose={closeConnectModal}
        >
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="1.5rem">
              <FormInput
                label="Public key"
                name="publicKey"
                placeholder="Enter public key"
                type="password"
                value={formData.publicKey}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    publicKey: e.target.value,
                  }))
                }
                message={
                  formErrors.publicKey
                    ? { type: "error", content: formErrors.publicKey }
                    : undefined
                }
                required
              />

              <FormInput
                label="Secret key"
                name="secretKey"
                placeholder="Enter secret key"
                type="password"
                value={formData.secretKey}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    secretKey: e.target.value,
                  }))
                }
                message={
                  formErrors.secretKey
                    ? { type: "error", content: formErrors.secretKey }
                    : undefined
                }
                required
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
                >
                  Cancel
                </Button>
                <Button
                  classes={[ButtonClass.SOLID]}
                  size={ButtonSize.WIDTH_140}
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Connect
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
