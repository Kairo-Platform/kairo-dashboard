"use client";

import { loadChannelForm, saveChannelForm } from "@/app/store/flow";
import type { BackendChannelConfig, ChannelFormValues } from "@/services/Flow";
import {
  channelFormPayload,
  channelFormValues,
  channelInputTypes,
} from "@/services/Flow/channelForms";
import { Icon } from "@iconify/react";
import { showErrorNotification } from "@kairo/utils";
import {
  Button,
  ButtonClass,
  ButtonSize,
  Flex,
  Loading,
  Modal,
} from "@kairo/ui";
import {
  FormInput,
  FormTextarea,
  SelectInput,
  SwitchInput,
} from "@kairo/ui/inputs";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { getChannelBrandColor } from "./helpers";
import { FALLBACK_CHANNELS } from "./resources";
import type { FlowChannel } from "./types";

const ConnectChannelsContainer = styled.div`
  max-width: 50rem;
  width: 100%;
  margin: 0 auto;
  border: 1.5px solid ${(props) => props.theme.colors.gray_02};
  border-radius: 2rem;
  padding: 1.5rem;

  .ConnectChannels_channels {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    gap: 1rem;
  }

  .channelCard {
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
      color: inherit;
      padding: 0.5rem;
      background-color: ${(props) => props.theme.colors.gray_02};
      border-radius: 0.5rem;

      svg {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }

  .channelCard.is-connected {
    border-color: var(
      --channel-brand-color,
      ${(props) => props.theme.colors.green_01}
    );
    background-color: color-mix(
      in srgb,
      var(--channel-brand-color, ${(props) => props.theme.colors.green_01}) 10%,
      transparent
    );
  }

  .ConnectChannels__help {
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.25rem;
    letter-spacing: -0.008125rem;
    color: ${(props) => props.theme.colors.text_02};
  }

  .ConnectChannels__helpLink {
    color: ${(props) => props.theme.colors.orange};
    text-decoration: underline;
    text-underline-offset: 0.125rem;
  }

  .ConnectChannels__success {
    display: flex;
    flex-direction: column;
    gap: 3.5rem;
    width: 100%;
  }

  .ConnectChannels__successHeader {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    text-align: center;
  }

  .ConnectChannels__successIcon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 4.375rem;
    height: 4.375rem;
    border-radius: 2.5rem;
    background-color: ${(props) => `${props.theme.colors.green}18`};
    color: ${(props) => props.theme.colors.green};
  }

  .ConnectChannels__successTitle {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.875rem;
    letter-spacing: -0.0375rem;
    color: ${(props) => props.theme.colors.text_01};
  }

  .ConnectChannels__successSubtitle {
    margin: 0.25rem 0 0;
    max-width: 27.5rem;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.25rem;
    letter-spacing: -0.008125rem;
    color: ${(props) => props.theme.colors.text_02};
  }

  .ConnectChannels__successMeta {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: 100%;
  }

  .ConnectChannels__successMetaHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .ConnectChannels__successMetaHint {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.5rem;
    letter-spacing: -0.009375rem;
    color: ${(props) => props.theme.colors.text_02};
  }

  .ConnectChannels__copyAll {
    appearance: none;
    border: none;
    background: transparent;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0;
    cursor: pointer;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.25rem;
    letter-spacing: -0.008125rem;
    color: ${(props) => props.theme.colors.orange};
    white-space: nowrap;
  }

  .ConnectChannels__credentialList {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 0.75rem;
    overflow: hidden;
    background-color: ${(props) => props.theme.colors.gray_01};
  }

  .ConnectChannels__credentialRow {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    background-color: ${(props) => props.theme.colors.gray_01};

    &:first-child {
      padding-top: 1rem;
    }

    &:last-child {
      padding-bottom: 1rem;
    }
  }

  .ConnectChannels__credentialLabel {
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.25rem;
    letter-spacing: -0.008125rem;
    color: ${(props) => props.theme.colors.text_02};
  }

  .ConnectChannels__credentialValue {
    display: flex;
    align-items: center;
    min-height: 3.5rem;
    width: 100%;
    border: 1.2px solid ${(props) => props.theme.colors.gray_02};
    border-radius: 0.75rem;
    background-color: ${(props) => props.theme.colors.ui_07};
    overflow: hidden;
  }

  .ConnectChannels__credentialText {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.3125rem;
    letter-spacing: -0.01875rem;
    color: ${(props) => props.theme.colors.text_01};
    word-break: break-all;
  }

  .ConnectChannels__credentialLinkIcon {
    flex-shrink: 0;
    color: ${(props) => props.theme.colors.text_02};
  }

  .ConnectChannels__copyButton {
    appearance: none;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    height: 3.5rem;
    padding: 0.8125rem 0.875rem;
    border: none;
    border-left: 1.5px solid ${(props) => props.theme.colors.gray_03};
    border-radius: 0 0.75rem 0.75rem 0;
    background-color: ${(props) => props.theme.colors.ui_07};
    cursor: pointer;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.25rem;
    letter-spacing: -0.009375rem;
    color: ${(props) => props.theme.colors.text_01};

    svg {
      color: ${(props) => props.theme.colors.orange};
    }

    &:hover {
      background-color: ${(props) => props.theme.colors.gray_02};
    }
  }
`;

type ConnectChannelsProps = {
  channels: FlowChannel[];
  onContinue?: () => void;
  onChannelConnected?: (channelId: string) => void;
  variant?: "setup" | "standalone";
  onBack?: () => void;
};

export const ConnectChannels = ({
  channels,
  onContinue,
  onChannelConnected,
  variant = "setup",
  onBack,
}: ConnectChannelsProps) => {
  const [connectionOverrides, setConnectionOverrides] = useState<
    Record<string, boolean>
  >({});
  const localChannels = useMemo(
    () =>
      (channels?.length ? channels : FALLBACK_CHANNELS).map((channel) => ({
        ...channel,
        isConnected: connectionOverrides[channel.id] ?? channel.isConnected,
      })),
    [channels, connectionOverrides],
  );
  const [selectedChannel, setSelectedChannel] = useState<FlowChannel | null>(
    null,
  );
  const [showChannelPicker, setShowChannelPicker] = useState(false);
  const [config, setConfig] = useState<BackendChannelConfig | null>(null);
  const [values, setValues] = useState<ChannelFormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<{
    channel: FlowChannel;
    config: BackendChannelConfig;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const requestId = useRef(0);
  useEffect(
    () => () => {
      requestId.current++;
    },
    [],
  );

  const loadConfig = async (channel: FlowChannel) => {
    const id = ++requestId.current;
    setIsLoading(true);
    setLoadFailed(false);
    setConfig(null);
    setValues({});
    setErrors({});
    try {
      const next = await loadChannelForm(channel.id);
      if (id !== requestId.current) return;
      setConfig(next);
      setValues(channelFormValues(next));
      setConnectionOverrides((current) => ({
        ...current,
        [channel.id]: next.status === "CONNECTED",
      }));
    } catch {
      if (id === requestId.current) setLoadFailed(true);
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  };
  const open = (channel: FlowChannel) => {
    setShowChannelPicker(false);
    setSelectedChannel(channel);
    setSuccess(null);
    void loadConfig(channel);
  };
  const close = () => {
    if (isSubmitting) return;
    requestId.current++;
    setSelectedChannel(null);
    setConfig(null);
    setValues({});
    setErrors({});
  };
  const unsupported = config?.schema.fields.some(
    (field) => field.visible && !channelInputTypes.has(field.type),
  );
  const unavailable = !config?.enabled || unsupported;
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !selectedChannel ||
      !config ||
      isLoading ||
      loadFailed ||
      isSubmitting ||
      unavailable
    )
      return;
    const payload = channelFormPayload(config.schema.fields, values);
    setErrors(payload.errors);
    if (Object.keys(payload.errors).length) return;
    const channel = {
      ...selectedChannel,
      isConnected: config.status === "CONNECTED",
    };
    const id = requestId.current;
    setIsSubmitting(true);
    let saved = false;
    try {
      await saveChannelForm(channel.id, payload.body);
      saved = true;
      if (id !== requestId.current) return;
      setValues({});
      setConnectionOverrides((current) => ({ ...current, [channel.id]: true }));
      onChannelConnected?.(channel.id);
      const next = await loadChannelForm(channel.id);
      if (id !== requestId.current) return;
      setSuccess({ channel, config: next });
      setSelectedChannel(null);
      setConfig(null);
    } catch {
      if (saved && id === requestId.current) {
        setLoadFailed(true);
        showErrorNotification({
          message:
            "The connection was saved, but its configuration could not be reloaded. Click Retry to load the saved details.",
        });
      }
    } finally {
      if (id === requestId.current) setIsSubmitting(false);
    }
  };
  const copyValue = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(
        () => setCopiedKey((current) => (current === key ? null : current)),
        1500,
      );
    } catch {
      showErrorNotification({
        message: "Could not copy. Please select and copy the value.",
      });
    }
  };
  const successEntries =
    success?.config.entries.filter(
      (entry) => entry.showOnSuccess && entry.value,
    ) ?? [];
  const closeSuccess = () => {
    setSuccess(null);
    setCopiedKey(null);
  };
  const change = (key: string, value: string | boolean) =>
    setValues((current) => ({ ...current, [key]: value }));

  return (
    <ConnectChannelsContainer>
      <Flex direction="column" gap="2rem">
        <Flex justify="space-between" align="center" gap="1rem">
          <h2>Connect Channels</h2>
          <Button
            classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
            disabled={!localChannels.some((channel) => !channel.isConnected)}
            onClick={() => setShowChannelPicker(true)}
          >
            <Icon icon="ri:add-line" width={24} height={24} />
            Add channel
          </Button>
        </Flex>
        <div className="ConnectChannels_channels">
          {localChannels.map((channel) => (
            <div
              key={channel.id}
              className={`channelCard${channel.isConnected ? " is-connected" : ""}`}
              style={
                channel.isConnected
                  ? ({
                      "--channel-brand-color": getChannelBrandColor(channel),
                    } as React.CSSProperties)
                  : undefined
              }
            >
              <Flex gap="0.5rem" align="center">
                {typeof channel.icon === "string" ? (
                  <Icon
                    icon={channel.icon}
                    className="channelCard__icon"
                    width={24}
                    height={24}
                  />
                ) : (
                  <span className="channelCard__icon">{channel.icon}</span>
                )}
                <p>{channel.name}</p>
              </Flex>
              <Button
                classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
                style={{ height: "2.5rem" }}
                onClick={() => open(channel)}
              >
                {channel.isConnected ? "Update" : "Connect"}
              </Button>
            </div>
          ))}
        </div>
        <Flex justify="flex-end" style={{ marginTop: "2rem" }}>
          <Button
            classes={[ButtonClass.SOLID]}
            size={ButtonSize.WIDTH_140}
            disabled={
              variant === "setup" &&
              !localChannels.some((channel) => channel.isConnected)
            }
            onClick={variant === "setup" ? onContinue : onBack}
          >
            {variant === "setup" ? "Continue" : "Done"}
          </Button>
        </Flex>
      </Flex>
      {showChannelPicker && (
        <Modal title="Add channel" onClose={() => setShowChannelPicker(false)}>
          <Flex direction="column" gap="1rem">
            {localChannels
              .filter((channel) => !channel.isConnected)
              .map((channel) => (
                <Button
                  key={channel.id}
                  classes={[ButtonClass.OUTLINED]}
                  onClick={() => open(channel)}
                >
                  {channel.name}
                </Button>
              ))}
          </Flex>
        </Modal>
      )}
      {selectedChannel && (
        <Modal
          title={`${config?.status === "CONNECTED" ? "Update" : "Connect"} ${selectedChannel.name}`}
          onClose={close}
          Footer={() => (
            <Flex
              justify="flex-end"
              align="center"
              gap="0.75rem"
              style={{ marginTop: "2rem" }}
            >
              <Button
                classes={[ButtonClass.OUTLINED]}
                size={ButtonSize.WIDTH_140}
                type="button"
                onClick={close}
              >
                Cancel
              </Button>
              <Button
                classes={[ButtonClass.SOLID]}
                size={ButtonSize.WIDTH_140}
                type="submit"
                form="connect-channel-form"
                disabled={
                  isSubmitting ||
                  isLoading ||
                  loadFailed ||
                  Boolean(unavailable)
                }
                loading={isSubmitting}
              >
                {config?.status === "CONNECTED" ? "Update" : "Connect"}
              </Button>
            </Flex>
          )}
        >
          <form id="connect-channel-form" onSubmit={submit} noValidate>
            <Flex direction="column" gap="1.5rem">
              {isLoading ? (
                <Loading>
                  Loading {selectedChannel.name} configuration ...
                </Loading>
              ) : loadFailed ? (
                <Button
                  type="button"
                  classes={[ButtonClass.OUTLINED]}
                  onClick={() => void loadConfig(selectedChannel)}
                >
                  Retry
                </Button>
              ) : (
                config && (
                  <>
                    {config.schema.fields
                      .filter((field) => field.visible)
                      .map((field) => {
                        const label = `${field.label}${field.required ? "" : " (optional)"}`;
                        const message = errors[field.key]
                          ? {
                              type: "error" as const,
                              content: errors[field.key],
                            }
                          : undefined;
                        const disabled =
                          isSubmitting || !config.enabled || field.readOnly;
                        const common = {
                          name: field.key,
                          label,
                          required: field.required,
                          placeholder: field.placeholder,
                          message,
                          disabled,
                        };
                        return (
                          <Flex key={field.key} direction="column" gap="0.5rem">
                            {field.type === "textarea" ? (
                              <FormTextarea
                                {...common}
                                value={String(values[field.key] ?? "")}
                                maxLength={field.maxLength ?? undefined}
                                onChange={(event) =>
                                  change(field.key, event.target.value)
                                }
                              />
                            ) : field.type === "select" ? (
                              <SelectInput
                                {...common}
                                options={field.options}
                                value={values[field.key] ?? ""}
                                onChange={(value: string) =>
                                  change(field.key, value)
                                }
                              />
                            ) : field.type === "boolean" ? (
                              <>
                                <SwitchInput
                                  name={field.key}
                                  label={label}
                                  disabled={disabled}
                                  value={Boolean(values[field.key])}
                                  onChange={(value) => change(field.key, value)}
                                />
                                {message && <p>{message.content}</p>}
                              </>
                            ) : channelInputTypes.has(field.type) ? (
                              <FormInput
                                {...common}
                                type={field.type}
                                inputMode={field.inputMode ?? undefined}
                                autoComplete={
                                  field.type === "password"
                                    ? "new-password"
                                    : undefined
                                }
                                maxLength={field.maxLength ?? undefined}
                                value={String(values[field.key] ?? "")}
                                onChange={(event) =>
                                  change(field.key, event.target.value)
                                }
                              />
                            ) : (
                              <p>
                                Update the dashboard to use this input type.
                              </p>
                            )}
                            {field.helpText && (
                              <p className="ConnectChannels__help">
                                {field.helpText}
                              </p>
                            )}
                          </Flex>
                        );
                      })}
                    {config.schema.helpText && (
                      <p className="ConnectChannels__help">
                        {config.schema.helpText}
                      </p>
                    )}
                    {!config.enabled && (
                      <p>
                        {config.unavailableReason ??
                          "This channel is not available yet."}
                      </p>
                    )}
                  </>
                )
              )}
            </Flex>
          </form>
        </Modal>
      )}
      {success && (
        <Modal
          onClose={closeSuccess}
          showModalHeader={false}
          useDefaultTitleLayout={false}
          useDefaultCloseButton
        >
          <div className="ConnectChannels__success">
            <div className="ConnectChannels__successHeader">
              <span className="ConnectChannels__successIcon" aria-hidden>
                <Icon icon="carbon:checkmark-filled" width={36} height={36} />
              </span>
              <div>
                <h3 className="ConnectChannels__successTitle">
                  {success.channel.name}{" "}
                  {success.channel.isConnected ? "updated" : "connected"}{" "}
                  successfully!
                </h3>
                <p className="ConnectChannels__successSubtitle">
                  Your {success.channel.name} connection is active. Use the
                  information below to configure your channel.
                </p>
              </div>
            </div>
            <div className="ConnectChannels__successMeta">
              <div className="ConnectChannels__successMetaHeader">
                <p className="ConnectChannels__successMetaHint">
                  Channel configuration
                </p>
                <button
                  type="button"
                  className="ConnectChannels__copyAll"
                  onClick={() =>
                    void copyValue(
                      "all",
                      successEntries
                        .map((entry) => `${entry.displayName}: ${entry.value}`)
                        .join("\n"),
                    )
                  }
                >
                  <Icon icon="tabler:copy" width={16} height={16} />
                  {copiedKey === "all" ? "Copied" : "Copy all"}
                </button>
              </div>
              <div className="ConnectChannels__credentialList">
                {successEntries.map((entry) => (
                  <div
                    className="ConnectChannels__credentialRow"
                    key={entry.key}
                  >
                    <p className="ConnectChannels__credentialLabel">
                      {entry.displayName}
                    </p>
                    <div className="ConnectChannels__credentialValue">
                      <div className="ConnectChannels__credentialText">
                        <span>{entry.value}</span>
                      </div>
                      <button
                        type="button"
                        className="ConnectChannels__copyButton"
                        onClick={() => void copyValue(entry.key, entry.value)}
                      >
                        <Icon icon="tabler:copy" width={20} height={20} />
                        {copiedKey === entry.key ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Flex justify="flex-end" align="center" gap="0.75rem">
              <Button
                classes={[ButtonClass.OUTLINED]}
                size={ButtonSize.WIDTH_140}
                type="button"
                onClick={closeSuccess}
              >
                Cancel
              </Button>
              <Button
                classes={[ButtonClass.SOLID]}
                size={ButtonSize.WIDTH_140}
                type="button"
                onClick={closeSuccess}
              >
                Done
              </Button>
            </Flex>
          </div>
        </Modal>
      )}
    </ConnectChannelsContainer>
  );
};
export default ConnectChannels;
