"use client";

import { Icon } from "@iconify/react";
import {
  ActionMenu,
  Button,
  ButtonClass,
  Divider,
  Flex,
  Loading,
  EmptyState,
  InitialsAvatar,
} from "@kairo/ui";
import { flowStore, fetchConversationDetail } from "@/app/store/flow";
import { useEntity } from "simpler-state";
import { getOrgId } from "@/lib/auth/client";
import { parseConversationNumber } from "@/services/Flow/conversations";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";

type MessageSender = "user" | "agent";

type TextMessage = {
  id: string;
  sender: MessageSender;
  text: string;
  time: string;
  type?: "text";
};

type ReceiptMessage = {
  id: string;
  sender: "agent";
  type: "receipt";
  time: string;
  receipt: {
    amount: string;
    status: string;
    transactionRef: string;
    recipientName: string;
    recipientDetails: string;
    senderName: string;
    senderDetails: string;
  };
};

type ChatMessage = TextMessage | ReceiptMessage;

type ActivityLog = {
  id: string;
  title: string;
  subtitle?: string;
  time: string;
};

const activityLogs: ActivityLog[] = [];

const ConversationDetailsContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(22rem, 1fr);
  min-height: 70vh;
  background-color: ${({ theme }) => theme.colors.ui_07};
  border: 1px solid ${({ theme }) => theme.colors.gray_02};
  border-radius: 0 0 1.5rem 0;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoint.lg}) {
    grid-template-columns: 1fr;
  }

  h3 {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.875rem;
    color: ${({ theme }) => theme.colors.text_01};
  }

  .MessageSection {
    container: conversation-messages / inline-size;
    display: flex;
    flex-direction: column;
    min-width: 0;
    border-right: 1px solid ${({ theme }) => theme.colors.gray_02};

    .UserInfoHeader {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray_02};
      min-height: 6rem;
      padding: 1rem;

      .UserInfoIdentity {
        min-width: 0;

        > div:first-child {
          flex-shrink: 0;
        }
      }

      .UserInfo {
        min-width: 0;

        &__name {
          color: ${({ theme }) => theme.colors.text_01};
          overflow-wrap: anywhere;
        }

        &__channel {
          font-size: 0.9375rem;
          font-weight: 500;
          color: ${({ theme }) => theme.colors.green};
          overflow-wrap: anywhere;
        }

        &__status {
          font-size: 0.8125rem;
          font-weight: 500;
          color: ${({ theme }) => theme.colors.text_02};
        }
      }

      .MessagePagination {
        grid-column: 1 / -1;
        grid-row: 2;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        min-width: 0;

        > div {
          flex: 1;
          min-width: 0;
        }

        .btn {
          width: 100%;
          height: auto;
          min-height: 3rem;
          padding: 0.5rem 0.75rem;
          white-space: normal;
        }

        &__page {
          flex-basis: 100%;
          order: -1;
          text-align: center;
          overflow-wrap: anywhere;
        }
      }

      @container conversation-messages (min-width: 30rem) {
        padding-inline: 1.5rem;

        .MessagePagination {
          &__page {
            flex-basis: auto;
            order: 0;
          }
        }
      }

      @container conversation-messages (min-width: 54rem) {
        grid-template-columns: minmax(0, 1fr) auto auto;
        gap: 2rem;

        .MessagePagination {
          grid-column: 2;
          grid-row: 1;

          > div {
            flex: none;
          }
        }
      }
    }

    .MessageContent {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      max-height: 80dvh;
      padding: 1.5rem 1.5rem 0;

      &__scroll {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-bottom: 1.5rem;
      }

      &__date {
        align-self: center;
        padding: 0.25rem 0.75rem;
        border-radius: 0.5rem;
        background-color: ${({ theme }) => theme.colors.gray_02};
        font-size: 0.8125rem;
        font-weight: 500;
        color: ${({ theme }) => theme.colors.text_01};
      }

      .chatBubble {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        max-width: min(27rem, 85%);
        padding: 0.875rem;
        font-size: 1rem;
        font-weight: 500;
        line-height: 1.5rem;
        white-space: pre-wrap;
        word-break: break-word;

        &__time {
          font-size: 0.8125rem;
          font-weight: 500;
          align-self: flex-end;
        }

        &--user {
          align-self: flex-start;
          background-color: ${({ theme }) => theme.colors.orange};
          color: ${({ theme }) => theme.colors.white};
          border-radius: 0 1rem 1rem 1rem;

          .chatBubble__time {
            color: rgba(255, 255, 255, 0.75);
          }
        }

        &--agent {
          align-self: flex-end;
          background-color: ${({ theme }) => theme.colors.gray_02};
          color: ${({ theme }) => theme.colors.text_01};
          border-radius: 1rem 0 1rem 1rem;

          .chatBubble__time {
            color: ${({ theme }) => theme.colors.text_02};
          }
        }

        &--receipt {
          align-self: flex-end;
          max-width: min(26rem, 90%);
          padding: 0;
          background: transparent;
        }
      }

      .receiptCard {
        background-color: ${({ theme }) => theme.colors.ui_07};
        border: 1px solid ${({ theme }) => theme.colors.gray_02};
        border-radius: 0.75rem;
        padding: 1.0625rem 0.75rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 0 0 5px ${({ theme }) => theme.colors.gray_02};

        &__title {
          font-size: 0.6875rem;
          font-weight: 500;
          color: ${({ theme }) => theme.colors.text_02};
        }

        &__amount {
          font-size: 1.5rem;
          font-weight: 600;
          color: ${({ theme }) => theme.colors.text_01};
          text-align: center;
        }

        &__status {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.25rem;
          padding: 0.25rem 0.75rem 0.25rem 0.5rem;
          border-radius: 1.5rem;
          background-color: ${({ theme }) => `${theme.colors.green}12`};
          color: ${({ theme }) => theme.colors.green};
          font-size: 0.5rem;
          font-weight: 500;
        }

        &__rows {
          width: 100%;
        }

        &__row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.625rem 0;
          border-bottom: 1px dashed ${({ theme }) => theme.colors.gray_02};
          font-size: 0.625rem;

          &:last-child {
            border-bottom: none;
          }

          &-label {
            color: ${({ theme }) => theme.colors.text_02};
            font-weight: 500;
          }

          &-value {
            text-align: right;
            color: ${({ theme }) => theme.colors.text_01};
            font-weight: 500;

            span {
              display: block;
              font-size: 0.5rem;
              font-weight: 400;
              color: ${({ theme }) => theme.colors.text_02};
            }
          }
        }

        &__footer {
          font-size: 0.4375rem;
          color: ${({ theme }) => theme.colors.text_02};
        }
      }

      &__composer {
        border-top: 1px solid ${({ theme }) => theme.colors.gray_02};
        padding: 1rem 1.5rem 1.5rem;
      }

      &__inputWrap {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        min-height: 4.375rem;
        padding: 0.75rem 0.75rem 0.75rem 1.5rem;
        border-radius: 2.375rem;
        background-color: ${({ theme }) => theme.colors.gray_02};
        border: 1.2px solid ${({ theme }) => theme.colors.gray_02};

        input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 1rem;
          font-weight: 500;
          color: ${({ theme }) => theme.colors.text_01};

          &::placeholder {
            color: ${({ theme }) => theme.colors.text_02};
          }
        }

        .sendBtn {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: ${({ theme }) => `${theme.colors.orange}40`};
          color: ${({ theme }) => theme.colors.orange};
          border: none;
          cursor: pointer;
          flex-shrink: 0;

          &:hover {
            background-color: ${({ theme }) => `${theme.colors.orange}55`};
          }
        }
      }
    }
  }

  .UserInfoSection {
    display: flex;
    flex-direction: column;
    min-width: 0;
    background-color: ${({ theme }) => theme.colors.ui_07};

    .ConversationInfoHeader {
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray_02};
      height: 6rem;
      padding-inline: 1.5rem;
    }

    .ConversationInfo {
      display: flex;
      flex-direction: column;
      padding: 0 1.5rem 1.25rem;
      overflow-y: auto;

      &__profile {
        padding: 0.5rem 1rem 1.25rem;
        text-align: center;

        > div:first-child {
          width: 3.9375rem;
          height: 3.9375rem;
          font-size: 1.5rem;
          margin: 0 auto 0.9375rem;
          background-color: ${({ theme }) => theme.colors.text_02};
        }

        &-name {
          font-size: 1.25rem;
          font-weight: 500;
          color: ${({ theme }) => theme.colors.text_01};
        }

        &-phone {
          font-size: 0.9375rem;
          font-weight: 500;
          color: ${({ theme }) => theme.colors.text_02};
        }
      }

      &__meta {
        display: flex;
        flex-direction: column;
        width: 100%;
      }

      &__row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.625rem 1.25rem;
        font-size: 0.9375rem;
        font-weight: 500;

        &-label {
          color: ${({ theme }) => theme.colors.text_02};
        }

        &-value {
          color: ${({ theme }) => theme.colors.text_01};
          text-align: right;
        }
      }

      &__activity {
        padding-top: 0.5rem;

        &-title {
          font-size: 1.125rem;
          font-weight: 500;
          color: ${({ theme }) => theme.colors.text_01};
          margin-bottom: 0.75rem;
          padding-left: 0.5rem;
        }

        &-list {
          display: flex;
          flex-direction: column;
          gap: 0.6875rem;
          padding-left: 0.5rem;
        }

        &-item {
          display: flex;
          gap: 0.625rem;
          align-items: flex-start;
        }

        &-bullet {
          width: 0.5rem;
          height: 0.5rem;
          margin-top: 0.45rem;
          border-radius: 50%;
          background-color: ${({ theme }) => theme.colors.orange};
          flex-shrink: 0;
        }

        &-body {
          flex: 1;
          min-width: 0;
        }

        &-text {
          font-size: 0.9375rem;
          font-weight: 500;
          color: ${({ theme }) => theme.colors.text_01};
          line-height: 1.5rem;

          span {
            color: ${({ theme }) => theme.colors.text_02};
            font-size: 0.8125rem;
          }
        }

        &-time {
          font-size: 0.75rem;
          font-weight: 500;
          color: ${({ theme }) => theme.colors.text_02};
          margin-top: 0.125rem;
        }
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoint.lg}) {
    grid-template-columns: 1fr;

    .MessageSection {
      border-right: none;
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray_02};
    }
  }
`;

const renderMessageText = (text: string) => {
  const boldParts = text.split(/(₦[\d,]+(?:\.\d{2})?|YES|CANCEL)/g);
  return boldParts.map((part, index) => {
    if (/^(₦[\d,]+(?:\.\d{2})?|YES|CANCEL)$/.test(part)) {
      return <strong key={`${part}-${index}`}>{part}</strong>;
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
};

export const ConversationDetails = ({
  userId,
  backUrl,
}: {
  userId: string;
  backUrl?: string;
}) => {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = parseConversationNumber(searchParams.get("messagePage"), 1);
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;
  const agent: "flow" | "all" = pathname.includes("/agents/flow/")
    ? "flow"
    : "all";
  const filters = useMemo(
    () => ({ page, limit: 50, startDate, endDate, agent }),
    [page, startDate, endDate, agent],
  );
  const detailState = useEntity(flowStore);
  useEffect(() => {
    void fetchConversationDetail(userId, filters).catch(() => {});
  }, [userId, filters]);
  const currentDetail =
    detailState.conversationDetailQueryKey === JSON.stringify([userId, filters]) &&
    detailState.conversationDetailOrgId === getOrgId();
  const detail = {
    data: currentDetail ? detailState.conversationDetail : null,
    loading: !currentDetail || detailState.fetchingConversationDetail,
  };
  const conversation = detail.data;
  const backParams = new URLSearchParams(searchParams.toString());
  backParams.delete("messagePage");
  const query = backParams.toString();
  function changeMessagePage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("messagePage", String(nextPage));
    router.replace(`?${params}`, { scroll: false });
  }
  const messages: ChatMessage[] = [...(conversation?.messages ?? [])]
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    .map((message) => ({
      id: message.id,
      sender: message.sender === "KAIRO" ? "agent" : "user",
      text: message.text,
      time: new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  if (detail.loading)
    return (
      <Flex justify="center" align="center" style={{ minHeight: "20rem" }}>
        <Loading>Fetching conversations...</Loading>
      </Flex>
    );

  if (!conversation)
    return (
      <EmptyState
        title="Conversation not found"
        message="Return to the conversations list to select a chat."
      />
    );
  const user = {
    name: conversation.user.displayName || conversation.user.channelUserId,
    phone: conversation.user.channelUserId,
    channel: conversation.user.channel,
    statusLabel: "N/A",
  };
  const firstMessage = [...conversation.messages].sort(
    (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
  )[0];
  const infoRows = [
    { label: "Channel", value: user.channel },
    { label: "Status", value: "N/A" },
    {
      label: "Time started",
      value:
        conversation.totalPages === 1 && firstMessage
          ? new Date(firstMessage.createdAt).toLocaleString()
          : "N/A",
    },
    { label: "No of messages", value: String(conversation.totalCount) },
    { label: "Average response", value: "N/A" },
  ];

  return (
    <ConversationDetailsContainer>
      <section className="MessageSection">
        <div className="UserInfoHeader">
          <Flex align="center" gap="1rem" className="UserInfoIdentity">
            <InitialsAvatar name={user.name} avatarUrl="" />
            <div className="UserInfo">
              <h3 className="UserInfo__name">{user.name}</h3>
              <Flex align="center" gap="0.75rem" wrap="wrap">
                <p className="UserInfo__channel">{user.channel}</p>
                <p className="UserInfo__status">{user.statusLabel}</p>
              </Flex>
            </div>
          </Flex>

          {conversation.totalPages > 1 && (
            <nav className="MessagePagination" aria-label="Message pagination">
              <Button
                classes={[ButtonClass.OUTLINED]}
                disabled={page >= conversation.totalPages}
                onClick={() => changeMessagePage(page + 1)}
              >
                Older messages
              </Button>
              <span className="MessagePagination__page">
                Page {page} of {conversation.totalPages}
              </span>
              <Button
                classes={[ButtonClass.OUTLINED]}
                disabled={page <= 1}
                onClick={() => changeMessagePage(page - 1)}
              >
                Newer messages
              </Button>
            </nav>
          )}

          <Button
            classes={[ButtonClass.ICON_ONLY]}
            aria-label="Close conversation"
            onClick={() =>
              router.push(
                `${backUrl ?? pathname.substring(0, pathname.lastIndexOf("/"))}${query ? `?${query}` : ""}`,
              )
            }
          >
            <Icon icon="iconoir:cancel" width={20} height={20} />
          </Button>
        </div>

        <div className="MessageContent">
          <div className="MessageContent__scroll">
            {messages.length === 0 && <p>No messages in this date range.</p>}
            <span className="MessageContent__date">
              {firstMessage
                ? new Date(firstMessage.createdAt).toLocaleDateString()
                : "N/A"}
            </span>

            {messages.map((message) => {
              if (message.type === "receipt") {
                return (
                  <div
                    key={message.id}
                    className="chatBubble chatBubble--receipt"
                  >
                    <div className="receiptCard">
                      <p className="receiptCard__title">Transaction Receipt</p>
                      <div>
                        <p className="receiptCard__amount">
                          {message.receipt.amount}
                        </p>
                        <Flex justify="center">
                          <span className="receiptCard__status">
                            <Icon
                              icon="fluent:checkmark-circle-20-filled"
                              width={10}
                              height={10}
                            />
                            {message.receipt.status}
                          </span>
                        </Flex>
                      </div>
                      <div className="receiptCard__rows">
                        <div className="receiptCard__row">
                          <span className="receiptCard__row-label">
                            Transaction ref
                          </span>
                          <span className="receiptCard__row-value">
                            {message.receipt.transactionRef}
                          </span>
                        </div>
                        <div className="receiptCard__row">
                          <span className="receiptCard__row-label">
                            Recepient Details
                          </span>
                          <span className="receiptCard__row-value">
                            {message.receipt.recipientName}
                            <span>{message.receipt.recipientDetails}</span>
                          </span>
                        </div>
                        <div className="receiptCard__row">
                          <span className="receiptCard__row-label">
                            Sender Details
                          </span>
                          <span className="receiptCard__row-value">
                            {message.receipt.senderName}
                            <span>{message.receipt.senderDetails}</span>
                          </span>
                        </div>
                      </div>
                      <p className="receiptCard__footer">Powered by Kairo</p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={message.id}
                  className={`chatBubble chatBubble--${message.sender}`}
                >
                  <p>{renderMessageText(message.text)}</p>
                  <span className="chatBubble__time">{message.time}</span>
                </div>
              );
            })}
          </div>

          <div className="MessageContent__composer">
            <div className="MessageContent__inputWrap">
              <input
                type="text"
                placeholder="Type a message here...."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                aria-label="Type a message"
              />
              <button
                type="button"
                className="sendBtn"
                aria-label="Send message"
              >
                <Icon icon="tabler:send" width={20} height={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="UserInfoSection">
        <Flex
          align="center"
          gap="2rem"
          justify="space-between"
          className="ConversationInfoHeader"
        >
          <h3>Conversation info</h3>
          <ActionMenu
            actions={[
              { title: "Assign to staff" },
              { title: "Take over conversation" },
              { title: "Close conversation" },
            ]}
            positions={["bottom"]}
            padding={4}
          >
            <Button
              classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
              style={{ height: "2.5rem" }}
            >
              More actions
              <Icon icon="mi:chevron-down" width={16} height={16} />
            </Button>
          </ActionMenu>
        </Flex>

        <div className="ConversationInfo">
          <Flex
            direction="column"
            align="center"
            justify="center"
            gap="0.125rem"
            className="ConversationInfo__profile"
          >
            <InitialsAvatar name={user.name} avatarUrl="" />
            <p className="ConversationInfo__profile-name">{user.name}</p>
            <p className="ConversationInfo__profile-phone">{user.phone}</p>
          </Flex>

          <Divider />

          <div className="ConversationInfo__meta">
            {infoRows.map((row) => (
              <div key={row.label} className="ConversationInfo__row">
                <span className="ConversationInfo__row-label">{row.label}</span>
                <span className="ConversationInfo__row-value">{row.value}</span>
              </div>
            ))}
          </div>

          <Divider />

          <div className="ConversationInfo__activity">
            <p className="ConversationInfo__activity-title">Activity logs</p>
            <div className="ConversationInfo__activity-list">
              {activityLogs.length === 0 && <p>N/A</p>}
              {activityLogs.map((log) => (
                <div key={log.id} className="ConversationInfo__activity-item">
                  <span className="ConversationInfo__activity-bullet" />
                  <div className="ConversationInfo__activity-body">
                    <p className="ConversationInfo__activity-text">
                      {log.title}
                      {log.subtitle ? <span> {log.subtitle}</span> : null}
                    </p>
                    <p className="ConversationInfo__activity-time">
                      {log.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ConversationDetailsContainer>
  );
};

export default ConversationDetails;
