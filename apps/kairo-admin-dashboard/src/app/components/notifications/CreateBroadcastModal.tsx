"use client";

import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Button, ButtonClass, ButtonSize, Flex, Modal, ModalSize } from "../ui";
import { CheckboxInput, FormInput, FormTextarea } from "../ui/inputs";
import { USER_TYPE } from "@/app/lib/shared-constants";
import {
  parseApiError,
  showErrorNotification,
  showSuccessNotification,
} from "@/app/lib/utils";
// import { NotificationServiceBackOffice } from "@/services/notificationApiBackOffice/NotificationServiceBackOffice";

const CreateBroadcastModalContainer = styled.div`
  .CheckboxLabel {
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.text_03};
    font-weight: 400;
  }
`;

const CHANNEL_OPTIONS = ["WEB", "MOBILE", "POS"];
const DEFAULT_RECEIVER_GROUP = ["ALL"];
const DEFAULT_PLATFORMS = [...CHANNEL_OPTIONS];
const EXCLUDED_USER_TYPES = new Set<string>([
  USER_TYPE.SYS_ADMIN,
  USER_TYPE.USER,
  USER_TYPE.BUSINESS,
]);

type CreateBroadcastModalProps = {
  onClose?: () => void;
  onSuccess?: () => void;
};

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");

export const CreateBroadcastModal: React.FC<CreateBroadcastModalProps> = ({
  onClose = () => {},
  onSuccess = () => {},
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [receiverGroup, setReceiverGroup] = useState<string[]>(
    DEFAULT_RECEIVER_GROUP,
  );
  const [platforms, setPlatforms] = useState<string[]>(DEFAULT_PLATFORMS);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState<{
    title?: string;
    body?: string;
    receiverGroup?: string;
    platforms?: string;
  }>({});

  const receiverOptions = useMemo(
    () => [
      { label: "All entities", value: "ALL" },
      ...Object.values(USER_TYPE)
        .filter((value) => !EXCLUDED_USER_TYPES.has(value))
        .map((value) => ({
          label: formatLabel(value),
          value,
        })),
    ],
    [],
  );

  const receiverOptionsColumns = useMemo(
    () => [receiverOptions.slice(0, 5), receiverOptions.slice(5)],
    [receiverOptions],
  );

  const submitBroadcast = async () => {
    if (!title.trim()) {
      setInputError((prev) => ({ ...prev, title: "Title is required" }));
      return;
    }

    if (!body.trim()) {
      setInputError((prev) => ({ ...prev, body: "Message is required" }));
      return;
    }

    if (!receiverGroup.length) {
      setInputError((prev) => ({
        ...prev,
        receiverGroup: "Choose at least one recipient",
      }));
      return;
    }

    if (!platforms.length) {
      setInputError((prev) => ({
        ...prev,
        platforms: "Choose at least one channel",
      }));
      return;
    }

    setLoading(true);
    try {
      // await NotificationServiceBackOffice.createBroadcast({
      //   title: title.trim(),
      //   body: body.trim(),
      //   receiverGroup,
      //   platforms,
      // });

      showSuccessNotification({ message: "Broadcast sent successfully" });
      onSuccess();
      onClose();
    } catch (error) {
      showErrorNotification({
        message: parseApiError(error, "Failed to send broadcast"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreateBroadcastModalContainer>
      <Modal title="Create broadcast" onClose={onClose} size={ModalSize.MEDIUM}>
        <form>
          <Flex direction="column" gap="1.5rem">
            <FormInput
              type="text"
              label="Title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setInputError((prev) => ({ ...prev, title: undefined }));
              }}
              message={
                inputError.title
                  ? { type: "error", content: inputError.title }
                  : undefined
              }
              required
            />

            <FormTextarea
              label="Message"
              value={body}
              rows={2}
              onChange={(event) => {
                setBody(event.target.value);
                setInputError((prev) => ({ ...prev, body: undefined }));
              }}
              message={
                inputError.body
                  ? { type: "error", content: inputError.body }
                  : undefined
              }
              defaultMessage={{
                content: "Keep message short for POS devices",
              }}
              required
            />

            <Flex
              direction="column"
              gap="0.5rem"
              style={{ marginTop: "0.5rem" }}
            >
              <h4 className="CheckboxLabel">Choose recipient(s)</h4>
              <Flex gap="1.5rem" style={{ width: "100%" }} wrap="wrap">
                <CheckboxInput
                  options={receiverOptionsColumns[0]}
                  value={receiverGroup}
                  onChange={(values) => {
                    setReceiverGroup(values);
                    setInputError((prev) => ({
                      ...prev,
                      receiverGroup: undefined,
                    }));
                  }}
                  message={
                    inputError.receiverGroup
                      ? { type: "error", content: inputError.receiverGroup }
                      : undefined
                  }
                />

                {receiverOptionsColumns[1].length > 0 && (
                  <CheckboxInput
                    options={receiverOptionsColumns[1]}
                    value={receiverGroup}
                    onChange={(values) => {
                      setReceiverGroup(values);
                      setInputError((prev) => ({
                        ...prev,
                        receiverGroup: undefined,
                      }));
                    }}
                  />
                )}
              </Flex>
            </Flex>

            <Flex direction="column" gap="0.5rem">
              <h4 className="CheckboxLabel">Choose delivery channels</h4>
              <CheckboxInput
                options={CHANNEL_OPTIONS}
                value={platforms}
                onChange={(values) => {
                  setPlatforms(values);
                  setInputError((prev) => ({ ...prev, platforms: undefined }));
                }}
                message={
                  inputError.platforms
                    ? { type: "error", content: inputError.platforms }
                    : undefined
                }
              />
            </Flex>

            <Flex align="center" justify="flex-end" gap="1rem">
              <Button
                classes={[ButtonClass.OUTLINED_GREY_TO_PRIMARY]}
                size={ButtonSize.WIDTH_140}
                onClick={() => onClose()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                classes={[ButtonClass.SOLID]}
                size={ButtonSize.WIDTH_140}
                onClick={() => void submitBroadcast()}
                loading={loading}
              >
                Send broadcast
              </Button>
            </Flex>
          </Flex>
        </form>
      </Modal>
    </CreateBroadcastModalContainer>
  );
};

export default CreateBroadcastModal;
