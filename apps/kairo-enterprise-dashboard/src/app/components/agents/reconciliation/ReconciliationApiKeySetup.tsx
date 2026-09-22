"use client";

import { Icon } from "@iconify/react";
import {
  Button,
  ButtonClass,
  ButtonSize,
  Divider,
  Flex,
  Modal,
  ModalSize,
  Tag,
  TagType,
} from "@kairo/ui";
import { useMemo, useState } from "react";
import { FormInput, SelectInput } from "@kairo/ui/inputs";
import styled from "styled-components";
import type { OrganizationApiKey } from "@/services/Organization";

const SetupContainer = styled.section`
  max-width: 64rem;
  margin: 5rem auto 0;

  .Setup__heading {
    text-align: center;
  }
  .Setup__heading p {
    margin-top: 0.25rem;
    color: ${({ theme }) => theme.colors.text_02};
  }

  .Setup__options {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2rem;
    margin-top: 4rem;

    @media (max-width: ${({ theme }) => theme.breakpoint.lg}) {
      grid-template-columns: 1fr;
    }
  }

  .Setup__option {
    min-height: 17rem;
    padding: 1.5rem;
    border: 1px solid ${({ theme }) => theme.colors.gray_03};
    border-radius: 1.25rem;
    background: ${({ theme }) => theme.colors.ui_07};
    color: ${({ theme }) => theme.colors.text_01};
    cursor: pointer;
    text-align: left;
    transition: border-color 0.2s ease;

    &.isActive {
      border: 2px solid ${({ theme }) => theme.colors.primaryColor};
    }
    &:hover {
      border-color: ${({ theme }) => theme.colors.primaryColor};
    }
  }

  .Setup__optionIcon {
    width: 3.375rem;
    height: 3.375rem;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.gray_02};
  }

  .Setup__optionText {
    margin-top: 6rem;
  }
  .Setup__optionText h3 {
    font-size: 1.125rem;
    font-weight: 500;
  }
  .Setup__optionText p {
    margin-top: 0.625rem;
    color: ${({ theme }) => theme.colors.text_02};
    font-size: 0.8125rem;
    line-height: 1.5;
  }

  .Setup__details {
    max-width: 35rem;
    margin: 2rem auto 0;
    padding-top: 2rem;
  }

  .Setup__field {
    width: 100%;
  }
`;

type KeyMode = "generate" | "existing" | "manual";

type Props = {
  apiKeys: OrganizationApiKey[];
  loading?: boolean;
  onLoadExisting: () => Promise<OrganizationApiKey[]>;
  onGenerate: () => Promise<OrganizationApiKey>;
  onContinue: (apiKey: string) => void;
};

const resolveKey = (apiKey: OrganizationApiKey) =>
  apiKey.key || `${apiKey.prefix}${apiKey.id}`;

export const ReconciliationApiKeySetup = ({
  apiKeys,
  loading = false,
  onLoadExisting,
  onGenerate,
  onContinue,
}: Props) => {
  const [mode, setMode] = useState<KeyMode>("generate");
  const [selectedId, setSelectedId] = useState("");
  const [manualKey, setManualKey] = useState("");
  const [manualKeyError, setManualKeyError] = useState("");
  const [existingKeyError, setExistingKeyError] = useState("");
  const [existingKeysLoaded, setExistingKeysLoaded] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const selectedKey = useMemo(
    () => apiKeys.find((item) => item.id === selectedId),
    [apiKeys, selectedId],
  );

  const proceed = async () => {
    if (mode === "generate") {
      const generated = await onGenerate();
      onContinue(resolveKey(generated));
      return;
    }
    if (mode === "existing" && !existingKeysLoaded) {
      await onLoadExisting();
      setExistingKeysLoaded(true);
      setShowKeyModal(true);
      return;
    }
    if (mode === "existing" || mode === "manual") setShowKeyModal(true);
  };

  const continueFromModal = () => {
    if (mode === "existing") {
      if (!selectedKey) {
        setExistingKeyError("Select an API key");
        return;
      }
      onContinue(resolveKey(selectedKey));
      return;
    }
    if (!manualKey.trim()) {
      setManualKeyError("Enter an API key");
      return;
    }
    onContinue(manualKey.trim());
  };

  const closeKeyModal = () => {
    setShowKeyModal(false);
    setExistingKeyError("");
    setManualKeyError("");
  };

  const options: Array<{
    mode: KeyMode;
    title: string;
    description: string;
    icon: string;
  }> = [
    {
      mode: "generate",
      title: "Generate a Kairo API key",
      description:
        "Create a secure organization key automatically and continue to reconciliation.",
      icon: "solar:key-outline",
    },
    {
      mode: "existing",
      title: "Use an existing API key",
      description: "Select a key already created for your organization.",
      icon: "material-symbols:key-outline-rounded",
    },
    {
      mode: "manual",
      title: "Enter an API key",
      description: "Provide a Kairo API key from another approved source.",
      icon: "solar:key-outline",
    },
  ];

  return (
    <SetupContainer>
      <div className="Setup__heading">
        <h2>Choose how to provide your API key</h2>
        <p>An API key is required to securely run the reconciliation agent.</p>
      </div>
      <div className="Setup__options">
        {options.map((option) => (
          <button
            type="button"
            key={option.mode}
            className={`Setup__option${mode === option.mode ? " isActive" : ""}`}
            onClick={() => setMode(option.mode)}
          >
            <Flex justify="space-between" align="start">
              <Flex
                className="Setup__optionIcon"
                align="center"
                justify="center"
              >
                <Icon icon={option.icon} width={24} height={24} />
              </Flex>
              {option.mode === "generate" && (
                <Tag type={TagType.GREEN}>Recommended</Tag>
              )}
            </Flex>
            <div className="Setup__optionText">
              <h3>{option.title}</h3>
              <p>{option.description}</p>
            </div>
          </button>
        ))}
      </div>

      <Flex className="Setup__details" direction="column" gap="1.5rem">
        <Divider />

        <Flex justify="end">
          <Button
            classes={[ButtonClass.SOLID, ButtonClass.WITH_ICON]}
            loading={loading}
            disabled={loading}
            size={ButtonSize.WIDTH_140}
            onClick={() => void proceed()}
          >
            Continue
            <Icon
              icon="material-symbols:chevron-right-rounded"
              width={20}
              height={20}
            />
          </Button>
        </Flex>
      </Flex>
      {showKeyModal && mode !== "generate" && (
        <Modal
          title={mode === "existing" ? "Select an API key" : "Enter an API key"}
          subtitle={
            mode === "existing"
              ? "Choose an existing key for this reconciliation."
              : "Provide the Kairo API key you want to use."
          }
          size={ModalSize.SMALL}
          onClose={closeKeyModal}
        >
          <div className="Setup__field">
            {mode === "existing" ? (
              <SelectInput
                name="reconciliation-api-key"
                label="Organization API key"
                placeholder="Select an API key"
                value={selectedId}
                options={apiKeys.map((apiKey) => ({
                  value: apiKey.id,
                  label: `${apiKey.name} (${apiKey.prefix}••••)`,
                }))}
                onChange={(value: string) => {
                  setSelectedId(String(value));
                  if (existingKeyError) setExistingKeyError("");
                }}
                message={
                  existingKeyError
                    ? { type: "error", content: existingKeyError }
                    : undefined
                }
              />
            ) : (
              <FormInput
                id="manual-reconciliation-api-key"
                type="password"
                autoComplete="off"
                placeholder="Enter API key"
                value={manualKey}
                onChange={(event) => {
                  setManualKey(event.target.value);
                  if (manualKeyError) setManualKeyError("");
                }}
                message={
                  manualKeyError
                    ? { type: "error", content: manualKeyError }
                    : undefined
                }
              />
            )}
          </div>

          <Divider
            style={{
              marginTop: mode === "existing" ? "4rem" : "",
            }}
          />
          
          <Flex
            justify="end"
            align="center"
            gap="0.75rem"
            style={{ marginTop: "1rem" }}
          >
            <Button classes={[ButtonClass.OUTLINED]} onClick={closeKeyModal}>
              Cancel
            </Button>
            <Button classes={[ButtonClass.SOLID]} onClick={continueFromModal}>
              Continue
            </Button>
          </Flex>
        </Modal>
      )}
    </SetupContainer>
  );
};
