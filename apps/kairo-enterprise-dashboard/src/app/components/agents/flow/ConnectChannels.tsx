"use client";

import { Icon } from "@iconify/react";
import { useModal } from "@kairo/hooks";
import { Button, ButtonClass, ButtonSize, Flex, Modal } from "@kairo/ui";
import { FileInput, FormInput } from "@kairo/ui/inputs";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { ICONS } from "@kairo/lib/utils";

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
    border-color: var(--channel-brand-color, ${(props) => props.theme.colors.green_01});
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

type Channel = {
  id: string;
  name: string;
  icon: string | React.ReactNode;
  isConnected: boolean;
  brandColor?: string;
};

type ConnectChannelsProps = {
  channels: Channel[];
  onContinue: () => void;
};

const CHANNEL_BRAND_COLORS: Record<string, string> = {
  whatsapp: "#1FAF38",
  telegram: "#2AABEE",
  instagram: "#C837AB",
  twitter: "#000000",
};

const getChannelBrandColor = (channel: Channel) =>
  channel.brandColor ?? CHANNEL_BRAND_COLORS[channel.id] ?? "#46AE70";

const DUMMY_CHANNELS: Channel[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: ICONS.WHATSAPP,
    isConnected: false,
    brandColor: CHANNEL_BRAND_COLORS.whatsapp,
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: ICONS.TELEGRAM,
    isConnected: false,
    brandColor: CHANNEL_BRAND_COLORS.telegram,
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: ICONS.INSTAGRAM,
    isConnected: false,
    brandColor: CHANNEL_BRAND_COLORS.instagram,
  },
  {
    id: "twitter",
    name: "X/Twitter",
    icon: ICONS.TWITTER,
    isConnected: false,
    brandColor: CHANNEL_BRAND_COLORS.twitter,
  },
];

const isWhatsAppChannel = (channel: Channel | null) =>
  channel?.id === "whatsapp" || channel?.name.toLowerCase() === "whatsapp";

const connectSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  phoneNumber: z.string().min(7, "Phone number is required"),
  secretKey: z.string().min(1, "Secret key is required"),
  callbackURL: z.string().url("Enter a valid callback URL"),
});

const whatsappConnectSchema = z.object({
  phoneId: z.string().min(1, "WhatsApp Phone Id is required"),
  businessId: z.string().min(1, "WhatsApp business ID is required"),
  accessToken: z.string().min(1, "Access token is required"),
  appSecrets: z.string().min(1, "App secrets is required"),
  verificationToken: z.string().optional(),
});

type ConnectFormData = {
  businessName: string;
  phoneNumber: string;
  secretKey: string;
  callbackURL: string;
  logoFiles: FileList | null;
};

type WhatsAppFormData = {
  phoneId: string;
  businessId: string;
  accessToken: string;
  appSecrets: string;
  verificationToken: string;
};

type ConnectFormErrors = Partial<{
  businessName: string;
  phoneNumber: string;
  secretKey: string;
  callbackURL: string;
}>;

type WhatsAppFormErrors = Partial<{
  phoneId: string;
  businessId: string;
  accessToken: string;
  appSecrets: string;
  verificationToken: string;
}>;

const EMPTY_CONNECT_FORM: ConnectFormData = {
  businessName: "",
  phoneNumber: "",
  secretKey: "",
  callbackURL: "",
  logoFiles: null,
};

const EMPTY_WHATSAPP_FORM: WhatsAppFormData = {
  phoneId: "",
  businessId: "",
  accessToken: "",
  appSecrets: "",
  verificationToken: "",
};

const WHATSAPP_SUCCESS_CREDENTIALS = {
  callbackUrl: "https://api.usekairo.co/webhooks/whatsapp",
  verificationToken: "kairo_verify_token_2026",
  publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQE...",
} as const;

export const ConnectChannels = ({
  channels,
  onContinue,
}: ConnectChannelsProps) => {
  const initialChannels = useMemo(
    () => (channels?.length ? channels : DUMMY_CHANNELS),
    [channels],
  );

  const [localChannels, setLocalChannels] = useState<Channel[]>(initialChannels);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null,
  );

  const selectedChannel = useMemo(
    () => localChannels.find((c) => c.id === selectedChannelId) ?? null,
    [localChannels, selectedChannelId],
  );

  useEffect(() => {
    setLocalChannels(initialChannels);
    setSelectedChannelId(null);
  }, [initialChannels]);

  const {
    showModal: showConnectChannelModal,
    toggleModal: toggleConnectChannelModal,
  } = useModal(false);

  const {
    showModal: showSuccessModal,
    toggleModal: toggleSuccessModal,
  } = useModal(false);

  const [formData, setFormData] = useState<ConnectFormData>(EMPTY_CONNECT_FORM);
  const [whatsAppFormData, setWhatsAppFormData] =
    useState<WhatsAppFormData>(EMPTY_WHATSAPP_FORM);

  const [formErrors, setFormErrors] = useState<ConnectFormErrors>({});
  const [whatsAppFormErrors, setWhatsAppFormErrors] =
    useState<WhatsAppFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successChannel, setSuccessChannel] = useState<Channel | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const hasConnected = localChannels.some((c) => c.isConnected);
  const firstNotConnected = localChannels.find((c) => !c.isConnected) ?? null;
  const isWhatsApp = isWhatsAppChannel(selectedChannel);

  const openConnectModal = (channel: Channel) => {
    if (channel.isConnected) return;
    setSelectedChannelId(channel.id);
    setFormErrors({});
    setWhatsAppFormErrors({});
    setFormData(EMPTY_CONNECT_FORM);
    setWhatsAppFormData(EMPTY_WHATSAPP_FORM);
    toggleConnectChannelModal();
  };

  const closeConnectModal = () => {
    setFormErrors({});
    setWhatsAppFormErrors({});
    setSelectedChannelId(null);
    toggleConnectChannelModal();
  };

  const closeSuccessModal = () => {
    setSuccessChannel(null);
    setCopiedKey(null);
    toggleSuccessModal();
  };

  const copyValue = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 1500);
    } catch {
      // Clipboard may be unavailable in some environments.
    }
  };

  const copyAllCredentials = () => {
    const all = [
      `Callback URL: ${WHATSAPP_SUCCESS_CREDENTIALS.callbackUrl}`,
      `Verification Token: ${WHATSAPP_SUCCESS_CREDENTIALS.verificationToken}`,
      `Public Key: ${WHATSAPP_SUCCESS_CREDENTIALS.publicKey}`,
    ].join("\n");
    void copyValue("all", all);
  };

  const markChannelConnected = () => {
    if (!selectedChannel) return;
    const connectedChannel = selectedChannel;
    const showWhatsAppSuccess = isWhatsAppChannel(connectedChannel);

    setIsSubmitting(true);
    setTimeout(() => {
      setLocalChannels((prev) =>
        prev.map((c) =>
          c.id === connectedChannel.id ? { ...c, isConnected: true } : c,
        ),
      );
      setIsSubmitting(false);
      setFormErrors({});
      setWhatsAppFormErrors({});
      setSelectedChannelId(null);
      toggleConnectChannelModal();

      if (showWhatsAppSuccess) {
        setSuccessChannel(connectedChannel);
        toggleSuccessModal();
      }
    }, 300);
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannel) return;

    const result = whatsappConnectSchema.safeParse({
      phoneId: whatsAppFormData.phoneId,
      businessId: whatsAppFormData.businessId,
      accessToken: whatsAppFormData.accessToken,
      appSecrets: whatsAppFormData.appSecrets,
      verificationToken: whatsAppFormData.verificationToken || undefined,
    });

    if (!result.success) {
      const fieldErrors: WhatsAppFormErrors = {};
      for (const [key, value] of Object.entries(
        result.error.flatten().fieldErrors,
      )) {
        const msg = value?.[0];
        if (!msg) continue;
        if (key === "phoneId") fieldErrors.phoneId = msg;
        if (key === "businessId") fieldErrors.businessId = msg;
        if (key === "accessToken") fieldErrors.accessToken = msg;
        if (key === "appSecrets") fieldErrors.appSecrets = msg;
        if (key === "verificationToken") fieldErrors.verificationToken = msg;
      }
      setWhatsAppFormErrors(fieldErrors);
      return;
    }

    markChannelConnected();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannel) return;

    if (isWhatsAppChannel(selectedChannel)) {
      handleWhatsAppSubmit(e);
      return;
    }

    const payload = {
      businessName: formData.businessName,
      phoneNumber: formData.phoneNumber,
      secretKey: formData.secretKey,
      callbackURL: formData.callbackURL,
    };

    const result = connectSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: ConnectFormErrors = {};
      for (const [key, value] of Object.entries(
        result.error.flatten().fieldErrors,
      )) {
        const msg = value?.[0];
        if (!msg) continue;
        if (key === "businessName") fieldErrors.businessName = msg;
        if (key === "phoneNumber") fieldErrors.phoneNumber = msg;
        if (key === "secretKey") fieldErrors.secretKey = msg;
        if (key === "callbackURL") fieldErrors.callbackURL = msg;
      }
      setFormErrors(fieldErrors);
      return;
    }

    markChannelConnected();
  };

  return (
    <ConnectChannelsContainer>
      <Flex direction="column" gap="2rem">
        <Flex justify="space-between" align="center" gap="1rem">
          <h2>Connect Channels</h2>
          <Button
            classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
            onClick={() => {
              if (firstNotConnected) openConnectModal(firstNotConnected);
            }}
            disabled={!firstNotConnected}
          >
            <Icon icon="ri:add-line" width={24} height={24} />
            Add Channel
          </Button>
        </Flex>

        <div className="ConnectChannels_channels">
          {localChannels.map((channel) => {
            const isConnected = channel.isConnected;
            return (
              <div
                key={channel.id}
                className={`channelCard${isConnected ? " is-connected" : ""}`}
                style={
                  isConnected
                    ? ({
                        "--channel-brand-color": getChannelBrandColor(channel),
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <Flex gap="0.5rem" align="center">
                  {typeof channel.icon === "string" ? (
                    <Icon icon={channel.icon} className="channelCard__icon" width={24} height={24} />
                  ) : (
                    <span className="channelCard__icon">{channel.icon}</span>
                  )}
                  <p>{channel.name}</p>
                </Flex>

                {!isConnected && (<Button
                  classes={[
                    isConnected ? ButtonClass.SOLID : ButtonClass.OUTLINED,
                    ButtonClass.WITH_ICON,
                  ]}
                  style={{ height: "2.5rem" }}
                  disabled={isConnected}
                  onClick={() => openConnectModal(channel)}
                >
                  Connect
                </Button>)}
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
            style={{ width: "140px" }}
          >
            Continue
          </Button>
        </Flex>
      </Flex>

      {showConnectChannelModal && selectedChannel && (
        <Modal
          title={`Connect ${selectedChannel.name}`}
          onClose={closeConnectModal}
        >
          <form onSubmit={handleSubmit} noValidate>
            <Flex direction="column" gap="1.5rem">
              {isWhatsApp ? (
                <>
                  <FormInput
                    label="WhatsApp Phone Id"
                    name="phoneId"
                    placeholder="Enter phone ID"
                    value={whatsAppFormData.phoneId}
                    onChange={(e) =>
                      setWhatsAppFormData((prev) => ({
                        ...prev,
                        phoneId: e.target.value,
                      }))
                    }
                    message={
                      whatsAppFormErrors.phoneId
                        ? { type: "error", content: whatsAppFormErrors.phoneId }
                        : undefined
                    }
                    required
                  />

                  <FormInput
                    label="WhatsApp business ID"
                    name="businessId"
                    placeholder="Enter business ID"
                    value={whatsAppFormData.businessId}
                    onChange={(e) =>
                      setWhatsAppFormData((prev) => ({
                        ...prev,
                        businessId: e.target.value,
                      }))
                    }
                    message={
                      whatsAppFormErrors.businessId
                        ? {
                          type: "error",
                          content: whatsAppFormErrors.businessId,
                        }
                        : undefined
                    }
                    required
                  />

                  <FormInput
                    label="Access token"
                    name="accessToken"
                    placeholder="Enter access token"
                    type="password"
                    value={whatsAppFormData.accessToken}
                    onChange={(e) =>
                      setWhatsAppFormData((prev) => ({
                        ...prev,
                        accessToken: e.target.value,
                      }))
                    }
                    message={
                      whatsAppFormErrors.accessToken
                        ? {
                          type: "error",
                          content: whatsAppFormErrors.accessToken,
                        }
                        : undefined
                    }
                    required
                  />

                  <FormInput
                    label="App secrets"
                    name="appSecrets"
                    placeholder="Enter app secrets"
                    type="password"
                    value={whatsAppFormData.appSecrets}
                    onChange={(e) =>
                      setWhatsAppFormData((prev) => ({
                        ...prev,
                        appSecrets: e.target.value,
                      }))
                    }
                    message={
                      whatsAppFormErrors.appSecrets
                        ? {
                          type: "error",
                          content: whatsAppFormErrors.appSecrets,
                        }
                        : undefined
                    }
                    required
                  />

                  <FormInput
                    label="Verification token (Optional)"
                    name="verificationToken"
                    placeholder="Enter token"
                    value={whatsAppFormData.verificationToken}
                    onChange={(e) =>
                      setWhatsAppFormData((prev) => ({
                        ...prev,
                        verificationToken: e.target.value,
                      }))
                    }
                    message={
                      whatsAppFormErrors.verificationToken
                        ? {
                          type: "error",
                          content: whatsAppFormErrors.verificationToken,
                        }
                        : undefined
                    }
                  />

                  <p className="ConnectChannels__help">
                    Need help? View our{" "}
                    <a
                      className="ConnectChannels__helpLink"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      WhatsApp Configuration Guide
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <FormInput
                    label="Business name"
                    name="businessName"
                    placeholder="Enter name"
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        businessName: e.target.value,
                      }))
                    }
                    message={
                      formErrors.businessName
                        ? { type: "error", content: formErrors.businessName }
                        : undefined
                    }
                    required
                  />

                  <FormInput
                    label="Phone number"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                    message={
                      formErrors.phoneNumber
                        ? { type: "error", content: formErrors.phoneNumber }
                        : undefined
                    }
                    required
                  />

                  <FormInput
                    label="Secret key"
                    name="secretKey"
                    placeholder="Enter API key"
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

                  <FormInput
                    label="Callback URL"
                    name="callbackURL"
                    placeholder="Enter callback URL"
                    type="text"
                    value={formData.callbackURL}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        callbackURL: e.target.value,
                      }))
                    }
                    message={
                      formErrors.callbackURL
                        ? { type: "error", content: formErrors.callbackURL }
                        : undefined
                    }
                    required
                  />

                  <FileInput
                    label="Upload image (optional)"
                    files={formData.logoFiles}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        logoFiles: e.target.files,
                      }));
                    }}
                  />
                </>
              )}

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
                  {isWhatsApp ? "Connect" : "Continue"}
                </Button>
              </Flex>
            </Flex>
          </form>
        </Modal>
      )}

      {showSuccessModal && successChannel && (
        <Modal
          onClose={closeSuccessModal}
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
                  {successChannel.name} connected successfully!
                </h3>
                <p className="ConnectChannels__successSubtitle">
                  Your WhatsApp connection is active. Use the information below
                  to configure your Meta Webhook.
                </p>
              </div>
            </div>

            <div className="ConnectChannels__successMeta">
              <div className="ConnectChannels__successMetaHeader">
                <p className="ConnectChannels__successMetaHint">
                  Copy these values into your Meta Developer Console.
                </p>
                <button
                  type="button"
                  className="ConnectChannels__copyAll"
                  onClick={copyAllCredentials}
                >
                  <Icon icon="tabler:copy" width={16} height={16} />
                  {copiedKey === "all" ? "Copied" : "Copy all"}
                </button>
              </div>

              <div className="ConnectChannels__credentialList">
                <div className="ConnectChannels__credentialRow">
                  <p className="ConnectChannels__credentialLabel">Callback URL</p>
                  <div className="ConnectChannels__credentialValue">
                    <div className="ConnectChannels__credentialText">
                      <Icon
                        icon="flowbite:link-outline"
                        width={20}
                        height={20}
                        className="ConnectChannels__credentialLinkIcon"
                      />
                      <span>{WHATSAPP_SUCCESS_CREDENTIALS.callbackUrl}</span>
                    </div>
                    <button
                      type="button"
                      className="ConnectChannels__copyButton"
                      onClick={() =>
                        void copyValue(
                          "callbackUrl",
                          WHATSAPP_SUCCESS_CREDENTIALS.callbackUrl,
                        )
                      }
                    >
                      <Icon icon="tabler:copy" width={20} height={20} />
                      {copiedKey === "callbackUrl" ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="ConnectChannels__credentialRow">
                  <p className="ConnectChannels__credentialLabel">
                    Verification Token
                  </p>
                  <div className="ConnectChannels__credentialValue">
                    <div className="ConnectChannels__credentialText">
                      <span>
                        {WHATSAPP_SUCCESS_CREDENTIALS.verificationToken}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="ConnectChannels__copyButton"
                      onClick={() =>
                        void copyValue(
                          "verificationToken",
                          WHATSAPP_SUCCESS_CREDENTIALS.verificationToken,
                        )
                      }
                    >
                      <Icon icon="tabler:copy" width={20} height={20} />
                      {copiedKey === "verificationToken" ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="ConnectChannels__credentialRow">
                  <p className="ConnectChannels__credentialLabel">Public Key</p>
                  <div className="ConnectChannels__credentialValue">
                    <div className="ConnectChannels__credentialText">
                      <span>{WHATSAPP_SUCCESS_CREDENTIALS.publicKey}</span>
                    </div>
                    <button
                      type="button"
                      className="ConnectChannels__copyButton"
                      onClick={() =>
                        void copyValue(
                          "publicKey",
                          WHATSAPP_SUCCESS_CREDENTIALS.publicKey,
                        )
                      }
                    >
                      <Icon icon="tabler:copy" width={20} height={20} />
                      {copiedKey === "publicKey" ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Flex justify="flex-end" align="center" gap="0.75rem">
              <Button
                classes={[ButtonClass.OUTLINED]}
                size={ButtonSize.WIDTH_140}
                type="button"
                onClick={closeSuccessModal}
              >
                Cancel
              </Button>
              <Button
                classes={[ButtonClass.SOLID]}
                size={ButtonSize.WIDTH_140}
                type="button"
                onClick={closeSuccessModal}
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

