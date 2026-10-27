"use client";

import { SEARCH_DEBOUNCE_MS } from "@/lib/constants/SEARCH_DEBOUNCE_MS";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import { useEntity } from "simpler-state";
import {
  Button,
  ButtonClass,
  ButtonSize,
  EmptyState,
  Flex,
  Loading,
  Modal,
  ModalSize,
} from "@kairo/ui";
import {
  CheckboxInput,
  FormInput,
  FormTextarea,
  RadioInput,
  SelectInput,
} from "@kairo/ui/inputs";
import { showSuccessNotification } from "@kairo/utils";
import {
  broadcastsStore,
  createBroadcast,
  fetchBroadcastUsers,
  fetchBroadcastSchema,
  resetBroadcastUsers,
} from "@/app/store/broadcasts";
import type { BackendButton } from "@/services/Flow";
import type { BroadcastAudience } from "@/services/Broadcasts";

const CreateBroadcastModalContainer = styled.div`
  fieldset {
    border: 0;
    padding: 0;
    margin: 0;
    min-width: 0;
  }
  .hint {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text_03};
  }
  .recipients {
    max-height: 17rem;
    overflow-y: auto;
    padding: 0.25rem;
  }
  .error {
    color: ${({ theme }) => theme.colors.red};
    font-size: 0.875rem;
  }
  h4 {
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

const BroadcastButtonRow = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));
  gap: 0.75rem;
  position: relative;
  width: 100%;
  min-width: 0;
  max-width: none;
  padding-top: 1rem;
  align-items: start;

  > :not(.broadcast-button-remove) {
    width: 100%;
    min-width: 0;
    max-width: none;
  }

  .broadcast-button-remove {
    position: absolute;
    top: 0;
    right: 0;
  }
`;

type Props = { onClose: () => void; onSuccess?: () => void };

export default function CreateBroadcastModal({ onClose, onSuccess }: Props) {
  const [buttons, setButtons] = useState<BackendButton[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<BroadcastAudience>("ALL");
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const lastRequestedSearch = useRef("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const request = useRef<{ signature: string; id: string } | null>(null);
  const { users, loadingUsers, submitting, schema } =
    useEntity(broadcastsStore);
  const targeted =
    audience === "SELECTED" || audience === "ALL_EXCEPT_SELECTED";

  useEffect(() => {
    const query = search.trim();
    const timer = setTimeout(
      () => {
        lastRequestedSearch.current = query;
        void fetchBroadcastUsers(page, query);
      },
      query === lastRequestedSearch.current ? 0 : SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [page, search]);
  useEffect(() => {
    void fetchBroadcastSchema();
    return () => resetBroadcastUsers();
  }, []);
  const updateButton = (index: number, update: Partial<BackendButton>) =>
    setButtons((previous) =>
      previous.map((button, i) =>
        i === index ? { ...button, ...update } : button,
      ),
    );

  const options = [
    { label: "All users", value: "ALL" },
    { label: "Active users (onboarding completed)", value: "ACTIVE" },
    {
      label: "Onboarded (business not activated)",
      value: "BUSINESS_NOT_ACTIVATED",
    },
    { label: "Onboarded (business activated)", value: "BUSINESS_ACTIVATED" },
    { label: "Not onboarded (signup not completed)", value: "INACTIVE" },
    ...(users?.analytics.suspensionSupported
      ? [{ label: "Suspended users", value: "SUSPENDED" }]
      : []),
    { label: "Selected users", value: "SELECTED" },
    { label: "All users except selected", value: "ALL_EXCEPT_SELECTED" },
  ];
  const rows = users?.items.filter((user) => user.channel === "WHATSAPP") ?? [];
  const visibleIds = rows.map((user) => user.id);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError("Please enter a title and message.");
      return;
    }
    if (
      title.trim().length > 120 ||
      `*${title.trim()}*\n\n${message.trim()}`.length > 4096
    ) {
      setError(
        "Keep the title within 120 characters and the complete message within 4096 characters.",
      );
      return;
    }
    if (targeted && !selected.length) {
      setError("Please select at least one user.");
      return;
    }
    if (
      buttons.length &&
      (!schema ||
        buttons.some(
          (button) =>
            !button.label.trim() ||
            !button.action ||
            (
              schema.buttonActions.find(
                (action) => action.value === button.action,
              )?.payloadFields ?? []
            ).some(
              (field) => field.required && !button.payload?.[field.key]?.trim(),
            ),
        ))
    ) {
      setError(
        "Please complete the button labels, actions and required fields.",
      );
      return;
    }
    if (
      buttons.length &&
      `*${title.trim()}*\n\n${message.trim()}`.length >
        (schema?.maxInteractiveTextLength ?? 1024)
    ) {
      setError(
        "Keep broadcasts with buttons within 1024 characters, including the title.",
      );
      return;
    }
    if (buttons.some((button) => button.type === "URL") && buttons.length > 1) {
      setError("Use one link button or up to three reply buttons.");
      return;
    }
    if (
      buttons.some(
        (button) =>
          button.label.trim().length > (schema?.maxButtonLabelLength ?? 20),
      )
    ) {
      setError(
        `Keep button labels within ${schema?.maxButtonLabelLength ?? 20} characters.`,
      );
      return;
    }
    const payload = {
      title: title.trim(),
      message: message.trim(),
      audience,
      userIds: targeted ? [...selected].sort() : [],
      buttons: buttons.map((button) => ({
        ...button,
        label: button.label.trim(),
      })),
    };
    const signature = JSON.stringify(payload);
    if (request.current?.signature !== signature)
      request.current = { signature, id: crypto.randomUUID() };
    setError("");
    try {
      const result = await createBroadcast({
        ...payload,
        requestId: request.current.id,
      });
      showSuccessNotification({
        message:
          audience === "BUSINESS_ACTIVATED" ||
          audience === "BUSINESS_NOT_ACTIVATED"
            ? "Broadcast queued. Business activation eligibility will be checked before delivery."
            : `Broadcast queued for ${result.totalCount} user${result.totalCount === 1 ? "" : "s"}.`,
      });
      onSuccess?.();
      onClose();
    } catch {
      /* Store displays the API error; retain requestId for a safe retry. */
    }
  };

  return (
    <CreateBroadcastModalContainer>
      <Modal
        title="Create broadcast"
        onClose={() => {
          if (!submitting) onClose();
        }}
        size={ModalSize.MEDIUM}
      >
        <form onSubmit={submit}>
          <fieldset disabled={submitting}>
            <Flex direction="column" gap="1.5rem">
              <FormInput
                label="Title"
                aria-label="Title"
                type="text"
                value={title}
                maxLength={120}
                required
                onChange={(event) => setTitle(event.target.value)}
              />
              <FormTextarea
                label="Message"
                aria-label="Message"
                value={message}
                rows={4}
                maxLength={4000}
                required
                onChange={(event) => setMessage(event.target.value)}
              />
              <Flex direction="column" gap="0.75rem">
                <h4>Buttons (optional)</h4>
                {buttons.map((button, index) => (
                  <BroadcastButtonRow
                    key={index}
                    $columns={
                      2 +
                      (schema?.buttonActions.find(
                        (action) => action.value === button.action,
                      )?.payloadFields?.length ?? 0)
                    }
                  >
                    <SelectInput
                      style={{ width: "100%", maxWidth: "none", minWidth: 0 }}
                      label="Button action"
                      placeholder="Select an action"
                      value={button.action}
                      options={(schema?.buttonActions ?? []).map((action) => ({
                        label: action.label,
                        value: action.value,
                      }))}
                      onChange={(value: string | { value: string }) => {
                        const action = schema?.buttonActions.find(
                          (item) =>
                            item.value ===
                            (typeof value === "string" ? value : value.value),
                        );
                        const previousAction = schema?.buttonActions.find(
                          (item) => item.value === button.action,
                        );
                        const useActionLabel =
                          !button.label.trim() ||
                          button.label === previousAction?.label;
                        updateButton(index, {
                          action: action?.value ?? "",
                          label: useActionLabel
                            ? (action?.label ?? "")
                            : button.label,
                          type: action?.type ?? "REPLY",
                          payload: {},
                        });
                      }}
                    />
                    <FormInput
                      style={{
                        width: "100%",
                        maxWidth: "none",
                        minWidth: 0,
                        marginTop: "0.2rem",
                      }}
                      label="Button label"
                      value={button.label}
                      maxLength={schema?.maxButtonLabelLength ?? 20}
                      onChange={(event) =>
                        updateButton(index, { label: event.target.value })
                      }
                    />
                    {(
                      schema?.buttonActions.find(
                        (action) => action.value === button.action,
                      )?.payloadFields ?? []
                    ).map((field) => (
                      <FormInput
                        key={field.key}
                        style={{
                          width: "100%",
                          maxWidth: "none",
                          minWidth: 0,
                          marginTop: "0.2rem",
                        }}
                        label={field.description ?? field.key}
                        required={field.required}
                        type={field.type === "URI" ? "url" : "text"}
                        value={button.payload?.[field.key] ?? ""}
                        onChange={(event) =>
                          updateButton(index, {
                            payload: {
                              ...button.payload,
                              [field.key]: event.target.value,
                            },
                          })
                        }
                      />
                    ))}
                    <Button
                      type="button"
                      classes={[
                        ButtonClass.ICON_ONLY,
                        ButtonClass.OUTLINED_RED,
                      ]}
                      className="broadcast-button-remove"
                      aria-label={`Remove button ${index + 1}`}
                      title="Remove button"
                      onClick={() =>
                        setButtons((previous) =>
                          previous.filter((_, i) => i !== index),
                        )
                      }
                    >
                      <Icon icon="ci:close-md" width={18} height={18} />
                    </Button>
                  </BroadcastButtonRow>
                ))}
                <Button
                  classes={[ButtonClass.OUTLINED]}
                  disabled={
                    !schema ||
                    buttons.length >= schema.maxReplyButtons ||
                    buttons.some((button) => button.type === "URL")
                  }
                  onClick={() =>
                    setButtons((previous) => [
                      ...previous,
                      { label: "", action: "", type: "REPLY", payload: {} },
                    ])
                  }
                  style={{ height: "2rem" }}
                >
                  Add button
                </Button>
              </Flex>
              <Flex direction="column" gap="0.75rem">
                <h4>Choose recipients</h4>
                <RadioInput
                  name="broadcastAudience"
                  options={options}
                  value={audience}
                  onChange={(value) => {
                    setAudience(value as BroadcastAudience);
                    setError("");
                  }}
                />
              </Flex>
              {targeted && (
                <Flex direction="column" gap="0.75rem">
                  <FormInput
                    label={
                      audience === "SELECTED"
                        ? "Select recipients"
                        : "Exclude users"
                    }
                    placeholder="Search users by name"
                    aria-label="Search users by name"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setPage(1);
                    }}
                  />
                  <Flex align="center" justify="space-between">
                    <p className="hint">
                      {selected.length}{" "}
                      {audience === "SELECTED" ? "selected" : "excluded"}
                    </p>
                    {!!selected.length && (
                      <Button
                        classes={[ButtonClass.OUTLINED]}
                        onClick={() => setSelected([])}
                        style={{ height: "2rem" }}
                      >
                        Clear selection
                      </Button>
                    )}
                  </Flex>
                  <div className="recipients">
                    {loadingUsers ? (
                      <Loading>Loading users ...</Loading>
                    ) : !rows.length ? (
                      <EmptyState
                        title="No users found"
                        message="Try another name."
                      />
                    ) : (
                      <CheckboxInput
                        options={rows.map((user) => ({
                          value: user.id,
                          label: `${user.displayName || "Unnamed user"} (${user.channelUserId})`,
                        }))}
                        value={selected.filter((id) => visibleIds.includes(id))}
                        onChange={(values) =>
                          setSelected((previous) => [
                            ...previous.filter(
                              (id) => !visibleIds.includes(id),
                            ),
                            ...values,
                          ])
                        }
                      />
                    )}
                  </div>
                  <Flex align="center" justify="space-between" gap="1rem">
                    <Button
                      classes={[ButtonClass.OUTLINED]}
                      disabled={page === 1 || loadingUsers}
                      onClick={() => setPage((value) => value - 1)}
                      style={{ width: "6rem", height: "2rem" }}
                    >
                      Previous
                    </Button>
                    <span className="hint">
                      Page {page} of {Math.max(1, users?.totalPages ?? page)}
                    </span>
                    <Button
                      classes={[ButtonClass.OUTLINED]}
                      disabled={
                        loadingUsers || !users || page >= users.totalPages
                      }
                      onClick={() => setPage((value) => value + 1)}
                      style={{ width: "6rem", height: "2rem" }}
                    >
                      Next
                    </Button>
                  </Flex>
                </Flex>
              )}
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <Flex
                align="center"
                justify="flex-end"
                gap="1rem"
                style={{ marginTop: "1rem" }}
              >
                <Button
                  classes={[ButtonClass.OUTLINED_GREY_TO_PRIMARY]}
                  size={ButtonSize.WIDTH_140}
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  classes={[ButtonClass.SOLID]}
                  size={ButtonSize.WIDTH_140}
                  loading={submitting}
                >
                  Send broadcast
                </Button>
              </Flex>
            </Flex>
          </fieldset>
        </form>
      </Modal>
    </CreateBroadcastModalContainer>
  );
}
