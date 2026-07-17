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
    border-color: ${(props) => props.theme.colors.green_01};
    background-color: ${(props) => `${props.theme.colors.green_01}10`};
  }
`;


type Channel = {
  id: string;
  name: string;
  icon: string | React.ReactNode;
  isConnected: boolean;
};

type ConnectChannelsProps = {
  channels: Channel[];
  onContinue: () => void;
};

const DUMMY_CHANNELS: Channel[] = [
  { id: "whatsapp", name: "WhatsApp", icon: ICONS.WHATSAPP, isConnected: false },
  { id: "telegram", name: "Telegram", icon: ICONS.TELEGRAM, isConnected: false },
  { id: "instagram", name: "Instagram", icon: ICONS.INSTAGRAM, isConnected: false },
  { id: "twitter", name: "X/Twitter", icon: ICONS.TWITTER, isConnected: false },
];

const connectSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  phoneNumber: z.string().min(7, "Phone number is required"),
  secretKey: z.string().min(1, "Secret key is required"),
  callbackURL: z.string().url("Enter a valid callback URL"),
});

type ConnectFormData = {
  businessName: string;
  phoneNumber: string;
  secretKey: string;
  callbackURL: string;
  logoFiles: FileList | null;
};

type ConnectFormErrors = Partial<{
  businessName: string;
  phoneNumber: string;
  secretKey: string;
  callbackURL: string;
}>;

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

  const [formData, setFormData] = useState<ConnectFormData>({
    businessName: "",
    phoneNumber: "",
    secretKey: "",
    callbackURL: "",
    logoFiles: null,
  });

  const [formErrors, setFormErrors] = useState<ConnectFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasConnected = localChannels.some((c) => c.isConnected);
  const firstNotConnected = localChannels.find((c) => !c.isConnected) ?? null;

  const openConnectModal = (channel: Channel) => {
    if (channel.isConnected) return;
    setSelectedChannelId(channel.id);
    setFormErrors({});
    setFormData({
      businessName: "",
      phoneNumber: "",
      secretKey: "",
      callbackURL: "",
      logoFiles: null,
    });
    toggleConnectChannelModal();
  };

  const closeConnectModal = () => {
    setFormErrors({});
    setSelectedChannelId(null);
    toggleConnectChannelModal();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannel) return;

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

    setIsSubmitting(true);
    // Dummy success: mark channel as connected locally.
    setTimeout(() => {
      setLocalChannels((prev) =>
        prev.map((c) =>
          c.id === selectedChannel.id ? { ...c, isConnected: true } : c,
        ),
      );
      setIsSubmitting(false);
      closeConnectModal();
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
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="1.5rem">
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

              <Flex justify="flex-end" align="center" gap="1rem" style={{ marginTop: "2rem" }}>
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
                  Continue
                </Button>
              </Flex>
            </Flex>
          </form>
        </Modal>
      )}
    </ConnectChannelsContainer>
  );
};

export default ConnectChannels;

