"use client";

import { getOrgId } from "@/lib/auth/client";
import {
  flow,
  unwrapFlowResponse,
  type BackendWhatsAppConnectResponse,
  type BackendChannelConfig,
  type InstagramConnection,
} from "@/services/Flow";
import {
  fetchInstagramConnection,
  saveInstagramConnection,
} from "@/app/store/flow";
import { Icon } from "@iconify/react";
import { useModal } from "@kairo/hooks";
import { showErrorNotification } from "@kairo/utils";
import {
  Button,
  ButtonClass,
  ButtonSize,
  Flex,
  Loading,
  Modal,
} from "@kairo/ui";
import { FileInput, FormInput } from "@kairo/ui/inputs";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { z } from "zod";
import {
  getChannelBrandColor,
  isWhatsAppChannel,
  isInstagramChannel,
} from "./helpers";
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

const connectSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  phoneNumber: z.string().min(7, "Phone number is required"),
  secretKey: z.string().min(1, "Secret key is required"),
  callbackURL: z.string().url("Enter a valid callback URL"),
});

const whatsappConnectSchema = z.object({
  phoneNumberId: z
    .string()
    .trim()
    .regex(/^\d+$/, "Enter a numeric phone number ID"),
  phoneNumber: z
    .string()
    .trim()
    .regex(
      /^\+[1-9]\d{6,14}$/,
      "Enter a phone number with country code, e.g. +2348012345678",
    ),
  whatsappBusinessAccountId: z
    .string()
    .trim()
    .regex(/^\d+$/, "Enter a numeric WhatsApp Business Account ID"),
  accessToken: z.string().trim().min(1, "Access token is required"),
  appSecret: z.string().trim().min(1, "App secret is required"),
  onboardingFlowId: z
    .string()
    .trim()
    .regex(/^\d+$/, "Enter a numeric onboarding Flow ID"),
  verifyToken: z.string().trim().optional(),
  businessFlowId: z
    .string()
    .trim()
    .regex(/^\d*$/, "Enter a numeric business Flow ID")
    .optional(),
  transferAuthorizationTemplateName: z.string().trim().optional(),
  transferPinFlowId: z
    .string()
    .trim()
    .regex(/^\d*$/, "Enter a numeric transfer PIN Flow ID")
    .optional(),
});

type ConnectFormData = {
  businessName: string;
  phoneNumber: string;
  secretKey: string;
  callbackURL: string;
  logoFiles: FileList | null;
};

type WhatsAppFormData = z.input<typeof whatsappConnectSchema>;

type ConnectFormErrors = Partial<{
  businessName: string;
  phoneNumber: string;
  secretKey: string;
  callbackURL: string;
}>;

type WhatsAppFormErrors = Partial<Record<keyof WhatsAppFormData, string>>;

const EMPTY_CONNECT_FORM: ConnectFormData = {
  businessName: "",
  phoneNumber: "",
  secretKey: "",
  callbackURL: "",
  logoFiles: null,
};

const EMPTY_WHATSAPP_FORM: WhatsAppFormData = {
  phoneNumberId: "",
  phoneNumber: "",
  whatsappBusinessAccountId: "",
  accessToken: "",
  appSecret: "",
  onboardingFlowId: "",
  verifyToken: "",
  businessFlowId: "",
  transferAuthorizationTemplateName: "",
  transferPinFlowId: "",
};

const WHATSAPP_FIELDS: {
  name: keyof WhatsAppFormData;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}[] = [
  {
    name: "phoneNumberId",
    label: "WhatsApp phone number ID",
    placeholder: "Enter numeric phone number ID",
    required: true,
  },
  {
    name: "phoneNumber",
    label: "WhatsApp business phone number",
    placeholder: "+2348012345678",
    type: "text",
    required: true,
  },
  {
    name: "whatsappBusinessAccountId",
    label: "WhatsApp Business Account ID",
    placeholder: "Enter numeric business account ID",
    required: true,
  },
  {
    name: "accessToken",
    label: "Access token",
    placeholder: "Enter Meta access token",
    type: "password",
    required: true,
  },
  {
    name: "appSecret",
    label: "App secret",
    placeholder: "Enter Meta app secret",
    type: "password",
    required: true,
  },
  {
    name: "onboardingFlowId",
    label: "Onboarding Flow ID",
    placeholder: "Enter numeric onboarding Flow ID",
    required: true,
  },
  {
    name: "verifyToken",
    label: "Verification token (optional)",
    placeholder: "Generated by Kairo if omitted",
  },
  {
    name: "businessFlowId",
    label: "Business Flow ID (optional)",
    placeholder: "Needed for business setup",
  },
  {
    name: "transferAuthorizationTemplateName",
    label: "Transfer Authorization Template (optional)",
    placeholder: "Enter transfer authorization template name",
  },
  {
    name: "transferPinFlowId",
    label: "Transfer PIN Flow ID (optional)",
    placeholder: "Needed for secure PIN authorization",
  },
];

type ChannelSuccessCredentials = {
  callbackUrl: string;
  verificationToken: string;
  publicKey?: string;
  accountId?: string;
  username?: string;
  expiresAt?: string;
};

const EMPTY_INSTAGRAM_FORM = { accountId: "", accessToken: "", expiresAt: "" };
type InstagramFormErrors = Partial<
  Record<keyof typeof EMPTY_INSTAGRAM_FORM, string>
>;
const instagramConnectSchema = z.object({
  accountId: z
    .string()
    .trim()
    .regex(/^\d{1,64}$/, "Enter a valid Instagram account ID"),
  accessToken: z.string().trim().max(8192, "The access token is too long"),
  expiresAt: z.string(),
});

export const ConnectChannels = ({
  channels,
  onContinue,
  onChannelConnected,
  variant = "setup",
  onBack,
}: ConnectChannelsProps) => {
  const initialChannels = useMemo(
    () => (channels?.length ? channels : FALLBACK_CHANNELS),
    [channels],
  );

  const [connectionOverrides, setConnectionOverrides] = useState<
    Record<string, boolean>
  >({});
  const localChannels = useMemo(
    () =>
      initialChannels.map((channel) => ({
        ...channel,
        isConnected: connectionOverrides[channel.id] ?? channel.isConnected,
      })),
    [initialChannels, connectionOverrides],
  );
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null,
  );

  const selectedChannel = useMemo(
    () => localChannels.find((c) => c.id === selectedChannelId) ?? null,
    [localChannels, selectedChannelId],
  );

  const {
    showModal: showConnectChannelModal,
    toggleModal: toggleConnectChannelModal,
  } = useModal(false);

  const { showModal: showSuccessModal, toggleModal: toggleSuccessModal } =
    useModal(false);

  const { showModal: showChannelPicker, toggleModal: toggleChannelPicker } =
    useModal(false);
  const [instagramForm, setInstagramForm] = useState(EMPTY_INSTAGRAM_FORM);
  const [instagramErrors, setInstagramErrors] = useState<InstagramFormErrors>(
    {},
  );
  const [instagramConnection, setInstagramConnection] =
    useState<InstagramConnection | null>(null);
  const [formData, setFormData] = useState<ConnectFormData>(EMPTY_CONNECT_FORM);
  const [whatsAppFormData, setWhatsAppFormData] =
    useState<WhatsAppFormData>(EMPTY_WHATSAPP_FORM);

  const [formErrors, setFormErrors] = useState<ConnectFormErrors>({});
  const [whatsAppFormErrors, setWhatsAppFormErrors] =
    useState<WhatsAppFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successChannel, setSuccessChannel] = useState<FlowChannel | null>(
    null,
  );
  const [successCredentials, setSuccessCredentials] =
    useState<ChannelSuccessCredentials | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const hasConnected = localChannels.some((c) => c.isConnected);
  const firstNotConnected = localChannels.find((c) => !c.isConnected) ?? null;
  const isWhatsApp = isWhatsAppChannel(selectedChannel);
  const isInstagram = isInstagramChannel(selectedChannel);
  const successValues = successCredentials
    ? [
        {
          key: "callbackUrl",
          label: "Callback URL",
          value: successCredentials.callbackUrl,
        },
        {
          key: "verificationToken",
          label: "Verification Token",
          value: successCredentials.verificationToken,
        },
        {
          key: "publicKey",
          label: "Public Key",
          value: successCredentials.publicKey,
        },
        {
          key: "accountId",
          label: "Instagram account ID",
          value: successCredentials.accountId,
        },
        {
          key: "username",
          label: "Username",
          value: successCredentials.username,
        },
        {
          key: "expiresAt",
          label: "Token expiry",
          value: successCredentials.expiresAt,
        },
      ].filter(
        (entry): entry is { key: string; label: string; value: string } =>
          Boolean(entry.value),
      )
    : [];

  const configRequestId = useRef(0);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [configLoadFailed, setConfigLoadFailed] = useState(false);

  useEffect(
    () => () => {
      configRequestId.current++;
    },
    [],
  );

  const loadWhatsAppConfig = async () => {
    const requestId = ++configRequestId.current;
    setIsLoadingConfig(true);
    setConfigLoadFailed(false);
    try {
      const orgId = getOrgId();
      if (!orgId) throw new Error("Session expired. Please sign in again.");
      const response = await flow.getChannelConfig(orgId, "whatsapp");
      if (requestId !== configRequestId.current) return;
      const config = unwrapFlowResponse<BackendChannelConfig>(response);
      const savedForm = { ...EMPTY_WHATSAPP_FORM };
      for (const entry of config.entries) {
        if (Object.prototype.hasOwnProperty.call(savedForm, entry.key)) {
          savedForm[entry.key as keyof WhatsAppFormData] = entry.value;
        }
      }
      setWhatsAppFormData(savedForm);
    } catch (error) {
      if (requestId !== configRequestId.current) return;
      setConfigLoadFailed(true);
      const apiError = error as { error?: unknown; message?: unknown } | null;
      showErrorNotification({
        message:
          typeof apiError?.error === "string"
            ? apiError.error
            : typeof apiError?.message === "string"
              ? apiError.message
              : "Failed to load WhatsApp configuration.",
      });
    } finally {
      if (requestId === configRequestId.current) setIsLoadingConfig(false);
    }
  };

  const loadInstagramConfig = async () => {
    const requestId = ++configRequestId.current;
    setIsLoadingConfig(true);
    setConfigLoadFailed(false);
    try {
      const config = await fetchInstagramConnection();
      if (requestId !== configRequestId.current) return;
      setInstagramConnection(config);
      setInstagramForm({
        ...EMPTY_INSTAGRAM_FORM,
        accountId: config.accountId,
      });
      setConnectionOverrides((current) => ({
        ...current,
        instagram: config.status === "CONNECTED",
      }));
    } catch {
      if (requestId === configRequestId.current) setConfigLoadFailed(true);
    } finally {
      if (requestId === configRequestId.current) setIsLoadingConfig(false);
    }
  };

  const openConnectModal = (channel: FlowChannel) => {
    configRequestId.current++;
    setIsLoadingConfig(false);
    setConfigLoadFailed(false);
    setSelectedChannelId(channel.id);
    setFormErrors({});
    setWhatsAppFormErrors({});
    setInstagramForm(EMPTY_INSTAGRAM_FORM);
    setInstagramErrors({});
    setInstagramConnection(null);
    setSuccessCredentials(null);
    setFormData(EMPTY_CONNECT_FORM);
    setWhatsAppFormData(EMPTY_WHATSAPP_FORM);
    toggleConnectChannelModal();
    if (channel.isConnected && isWhatsAppChannel(channel))
      void loadWhatsAppConfig();
    if (isInstagramChannel(channel)) void loadInstagramConfig();
  };

  const closeConnectModal = () => {
    if (isSubmitting) return;
    configRequestId.current++;
    setIsLoadingConfig(false);
    setConfigLoadFailed(false);
    setFormErrors({});
    setWhatsAppFormErrors({});
    setWhatsAppFormData(EMPTY_WHATSAPP_FORM);
    setInstagramForm(EMPTY_INSTAGRAM_FORM);
    setSelectedChannelId(null);
    toggleConnectChannelModal();
  };

  const closeSuccessModal = () => {
    setSuccessChannel(null);
    setSuccessCredentials(null);
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
    if (!successCredentials) return;
    const all = successValues
      .map(({ label, value }) => `${label}: ${value}`)
      .join("\n");
    void copyValue("all", all);
  };

  const markChannelConnected = (
    connectedChannel: FlowChannel,
    credentials?: ChannelSuccessCredentials,
  ) => {
    setConnectionOverrides((current) => ({
      ...current,
      [connectedChannel.id]: true,
    }));
    onChannelConnected?.(connectedChannel.id);
    setFormErrors({});
    setWhatsAppFormErrors({});
    setSelectedChannelId(null);
    toggleConnectChannelModal();

    setInstagramForm(EMPTY_INSTAGRAM_FORM);
    if (credentials) {
      setSuccessCredentials(credentials);
      setSuccessChannel(connectedChannel);
      toggleSuccessModal();
    }
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannel || isSubmitting || isLoadingConfig || configLoadFailed)
      return;

    const result = whatsappConnectSchema.safeParse(whatsAppFormData);

    if (!result.success) {
      const fieldErrors: WhatsAppFormErrors = {};
      for (const [key, value] of Object.entries(
        result.error.flatten().fieldErrors,
      )) {
        const msg = value?.[0];
        if (!msg) continue;
        fieldErrors[key as keyof WhatsAppFormData] = msg;
      }
      setWhatsAppFormErrors(fieldErrors);
      return;
    }

    const orgId = getOrgId();
    if (!orgId) {
      showErrorNotification({
        message: "Session expired. Please sign in again.",
      });
      return;
    }

    const connectedChannel = selectedChannel;
    setIsSubmitting(true);

    flow
      .connectWhatsApp(orgId, {
        ...result.data,
        verifyToken: result.data.verifyToken || undefined,
        businessFlowId: result.data.businessFlowId || undefined,
        transferAuthorizationTemplateName:
          result.data.transferAuthorizationTemplateName || undefined,
        transferPinFlowId: result.data.transferPinFlowId || undefined,
      })
      .then((res) => {
        const data = unwrapFlowResponse<BackendWhatsAppConnectResponse>(res);
        markChannelConnected(connectedChannel, {
          callbackUrl: data.webhookUrl,
          verificationToken: data.verifyToken,
          publicKey: data.publicKey,
        });
      })
      .catch((err: unknown) => {
        const apiError =
          err && typeof err === "object"
            ? (err as { error?: unknown; message?: unknown })
            : undefined;
        const message =
          typeof apiError?.error === "string" && apiError.error.trim()
            ? apiError.error
            : typeof apiError?.message === "string" && apiError.message.trim()
              ? apiError.message
              : "Failed to connect WhatsApp.";
        showErrorNotification({ message });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleInstagramSubmit = async () => {
    if (!selectedChannel || isSubmitting || isLoadingConfig || configLoadFailed)
      return;
    const result = instagramConnectSchema.safeParse(instagramForm);
    const errors: InstagramFormErrors = {};
    if (!result.success) {
      for (const [key, messages] of Object.entries(
        result.error.flatten().fieldErrors,
      )) {
        if (messages?.[0])
          errors[key as keyof InstagramFormErrors] = messages[0];
      }
    }
    if (
      !instagramForm.accessToken.trim() &&
      instagramConnection?.status !== "CONNECTED"
    )
      errors.accessToken = "Enter an Instagram access token";
    if (instagramForm.expiresAt) {
      if (!instagramForm.accessToken.trim())
        errors.accessToken = "Enter a new token to change its expiry";
      const expiry = new Date(instagramForm.expiresAt).getTime();
      if (
        !Number.isFinite(expiry) ||
        expiry <= Date.now() ||
        expiry > Date.now() + 60 * 86400000
      )
        errors.expiresAt =
          "Choose a future expiry within 60 days, as supplied by Meta";
    }
    setInstagramErrors(errors);
    if (!result.success || Object.keys(errors).length) return;
    const requestId = configRequestId.current;
    const connectedChannel = selectedChannel;
    setIsSubmitting(true);
    try {
      const connection = await saveInstagramConnection({
        accountId: result.data.accountId,
        accessToken: result.data.accessToken || undefined,
        expiresAt: result.data.expiresAt
          ? new Date(result.data.expiresAt).toISOString()
          : undefined,
      });
      if (requestId !== configRequestId.current) return;
      markChannelConnected(connectedChannel, {
        callbackUrl: connection.webhookUrl,
        verificationToken: connection.verifyToken,
        accountId: connection.accountId,
        username: connection.username ? `@${connection.username}` : undefined,
        expiresAt: connection.expiresAt
          ? new Date(connection.expiresAt).toLocaleString()
          : undefined,
      });
    } catch {
      // The store reports errors through the existing notification system.
    } finally {
      if (requestId === configRequestId.current) setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannel || isSubmitting || isLoadingConfig || configLoadFailed)
      return;

    if (isInstagramChannel(selectedChannel)) {
      void handleInstagramSubmit();
      return;
    }
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

    // Non-WhatsApp channels: no API yet — simulate connection locally
    const connectedChannel = selectedChannel;
    setIsSubmitting(true);
    setTimeout(() => {
      markChannelConnected(connectedChannel);
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <ConnectChannelsContainer>
      <Flex direction="column" gap="2rem">
        <Flex justify="space-between" align="center" gap="1rem">
          <h2>Connect Channels</h2>
          <Button
            classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
            onClick={() => {
              toggleChannelPicker();
            }}
            disabled={!firstNotConnected}
          >
            <Icon icon="ri:add-line" width={24} height={24} />
            Add channel
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
                  onClick={() => openConnectModal(channel)}
                >
                  {isConnected ? "Update" : "Connect"}
                </Button>
              </div>
            );
          })}
        </div>

        <Flex justify="flex-end" style={{ marginTop: "2rem" }}>
          {variant === "setup" ? (
            <Button
              classes={[ButtonClass.SOLID]}
              size={ButtonSize.WIDTH_140}
              disabled={!hasConnected}
              onClick={onContinue}
              style={{ width: "140px" }}
            >
              Continue
            </Button>
          ) : (
            <Button
              classes={[ButtonClass.SOLID]}
              size={ButtonSize.WIDTH_140}
              onClick={onBack}
              style={{ width: "140px" }}
            >
              Done
            </Button>
          )}
        </Flex>
      </Flex>

      {showChannelPicker && (
        <Modal title="Add channel" onClose={toggleChannelPicker}>
          <Flex direction="column" gap="1rem">
            {localChannels
              .filter((channel) => !channel.isConnected)
              .map((channel) => (
                <Button
                  key={channel.id}
                  classes={[ButtonClass.OUTLINED]}
                  onClick={() => {
                    toggleChannelPicker();
                    openConnectModal(channel);
                  }}
                >
                  {channel.name}
                </Button>
              ))}
          </Flex>
        </Modal>
      )}

      {showConnectChannelModal && selectedChannel && (
        <Modal
          title={`${selectedChannel.isConnected ? "Update" : "Connect"} ${selectedChannel.name}`}
          onClose={closeConnectModal}
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
                onClick={closeConnectModal}
              >
                Cancel
              </Button>
              <Button
                classes={[ButtonClass.SOLID]}
                size={ButtonSize.WIDTH_140}
                type="submit"
                form="connect-channel-form"
                disabled={isSubmitting || isLoadingConfig || configLoadFailed}
                loading={isSubmitting}
              >
                {selectedChannel.isConnected
                  ? "Update"
                  : isWhatsApp || isInstagram
                    ? "Connect"
                    : "Continue"}
              </Button>
            </Flex>
          )}
        >
          <form id="connect-channel-form" onSubmit={handleSubmit} noValidate>
            <Flex direction="column" gap="1.5rem">
              {isLoadingConfig ? (
                <Loading>
                  Loading {selectedChannel.name} configuration ...
                </Loading>
              ) : configLoadFailed ? (
                <Flex direction="column" gap="1rem">
                  <p>Could not load the saved configuration.</p>
                  <Button
                    type="button"
                    classes={[ButtonClass.OUTLINED]}
                    onClick={() =>
                      void (isInstagram
                        ? loadInstagramConfig()
                        : loadWhatsAppConfig())
                    }
                  >
                    Retry
                  </Button>
                </Flex>
              ) : isInstagram ? (
                <>
                  <FormInput
                    label="Instagram account ID"
                    name="instagramAccountId"
                    inputMode="numeric"
                    placeholder="Enter Instagram account ID"
                    required
                    value={instagramForm.accountId}
                    onChange={(e) =>
                      setInstagramForm((current) => ({
                        ...current,
                        accountId: e.target.value,
                      }))
                    }
                    message={
                      instagramErrors.accountId
                        ? { type: "error", content: instagramErrors.accountId }
                        : undefined
                    }
                  />
                  <FormInput
                    label="Access token"
                    name="instagramAccessToken"
                    type="password"
                    autoComplete="new-password"
                    placeholder={
                      instagramConnection?.status === "CONNECTED"
                        ? "Leave blank to keep the saved token"
                        : "Enter Instagram access token"
                    }
                    required={instagramConnection?.status !== "CONNECTED"}
                    value={instagramForm.accessToken}
                    onChange={(e) =>
                      setInstagramForm((current) => ({
                        ...current,
                        accessToken: e.target.value,
                      }))
                    }
                    message={
                      instagramErrors.accessToken
                        ? {
                            type: "error",
                            content: instagramErrors.accessToken,
                          }
                        : undefined
                    }
                  />
                  <FormInput
                    label="Long-lived token expiry (optional)"
                    name="instagramTokenExpiry"
                    type="datetime-local"
                    value={instagramForm.expiresAt}
                    onChange={(e) =>
                      setInstagramForm((current) => ({
                        ...current,
                        expiresAt: e.target.value,
                      }))
                    }
                    message={
                      instagramErrors.expiresAt
                        ? { type: "error", content: instagramErrors.expiresAt }
                        : undefined
                    }
                  />
                  <p className="ConnectChannels__help">
                    Use an Instagram Login token with profile and messaging
                    permissions. For an existing long-lived token, enter its
                    expiry from Meta in your local time. Otherwise, leave expiry
                    blank to exchange a short-lived token automatically.
                  </p>
                  {instagramConnection?.username && (
                    <p className="ConnectChannels__help">
                      Account: @{instagramConnection.username}.
                      {instagramConnection.status === "RECONNECT_REQUIRED" &&
                        " Enter a new token to reconnect."}
                      {instagramConnection.expiresAt &&
                        ` Saved token expires: ${new Date(instagramConnection.expiresAt).toLocaleString()}.`}
                    </p>
                  )}
                </>
              ) : isWhatsApp ? (
                <>
                  {WHATSAPP_FIELDS.map((field) => (
                    <FormInput
                      key={field.name}
                      {...field}
                      value={whatsAppFormData[field.name] ?? ""}
                      onChange={(e) =>
                        setWhatsAppFormData((prev) => ({
                          ...prev,
                          [field.name]: e.target.value,
                        }))
                      }
                      message={
                        whatsAppFormErrors[field.name]
                          ? {
                              type: "error",
                              content: whatsAppFormErrors[field.name] ?? "",
                            }
                          : undefined
                      }
                    />
                  ))}

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
            </Flex>
          </form>
        </Modal>
      )}

      {showSuccessModal && successChannel && successCredentials && (
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
                  {successChannel.name}{" "}
                  {successChannel.isConnected ? "updated" : "connected"}{" "}
                  successfully!
                </h3>
                <p className="ConnectChannels__successSubtitle">
                  Your {successChannel.name} connection is active. Use the
                  information below to configure your Meta Webhook.
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
                {successValues.map(({ key, label, value }) => (
                  <div className="ConnectChannels__credentialRow" key={key}>
                    <p className="ConnectChannels__credentialLabel">{label}</p>
                    <div className="ConnectChannels__credentialValue">
                      <div className="ConnectChannels__credentialText">
                        <span>{value}</span>
                      </div>
                      <button
                        type="button"
                        className="ConnectChannels__copyButton"
                        onClick={() => void copyValue(key, value)}
                      >
                        <Icon icon="tabler:copy" width={20} height={20} />
                        {copiedKey === key ? "Copied" : "Copy"}
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
