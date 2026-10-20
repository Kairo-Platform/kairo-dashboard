"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
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
} from "@kairo/ui/inputs";
import { showSuccessNotification } from "@kairo/utils";
import {
  broadcastsStore,
  createBroadcast,
  fetchBroadcastUsers,
  resetBroadcastUsers,
} from "@/app/store/broadcasts";
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

type Props = { onClose: () => void; onSuccess?: () => void };

export default function CreateBroadcastModal({ onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<BroadcastAudience>("ALL");
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const request = useRef<{ signature: string; id: string } | null>(null);
  const { users, loadingUsers, submitting } = useEntity(broadcastsStore);
  const targeted =
    audience === "SELECTED" || audience === "ALL_EXCEPT_SELECTED";

  useEffect(() => {
    const timer = setTimeout(
      () => void fetchBroadcastUsers(page, search.trim()),
      300,
    );
    return () => clearTimeout(timer);
  }, [page, search]);
  useEffect(() => () => resetBroadcastUsers(), []);

  const options = [
    { label: "All users", value: "ALL" },
    { label: "Active users — onboarding completed", value: "ACTIVE" },
    { label: "Not onboarded — signup not completed", value: "INACTIVE" },
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
    const payload = {
      title: title.trim(),
      message: message.trim(),
      audience,
      userIds: targeted ? [...selected].sort() : [],
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
        message: `Broadcast queued for ${result.totalCount} user${result.totalCount === 1 ? "" : "s"}.`,
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
                defaultMessage={{
                  content:
                    "The title and message will be sent together on WhatsApp.",
                }}
              />
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
                {!users?.analytics.suspensionSupported && (
                  <p className="hint">
                    Suspended users will be available when account suspension is
                    supported.
                  </p>
                )}
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
                          label: `${user.displayName || "Unnamed user"} — ${user.channelUserId}`,
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
                    >
                      Next
                    </Button>
                  </Flex>
                </Flex>
              )}
              <p className="hint">
                Messages wait until the user is idle and has finished any
                ongoing task. Users outside WhatsApp’s messaging window remain
                queued until they return. Unsent broadcasts expire after 7 days.
              </p>
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <Flex align="center" justify="flex-end" gap="1rem">
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
