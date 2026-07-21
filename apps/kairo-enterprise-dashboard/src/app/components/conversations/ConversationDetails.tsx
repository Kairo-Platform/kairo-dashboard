"use client";

import { URL } from "@/lib/constants";
import { Icon } from "@iconify/react";
import {
  ActionMenu,
  Button,
  ButtonClass,
  Divider,
  Flex,
  InitialsAvatar,
} from "@kairo/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

const DUMMY_USER = {
  id: "1",
  name: "Chinedu Okafor",
  phone: "+234 812 000 4521",
  channel: "Whatsapp",
  statusLabel: "Active · 2min ago",
  conversationStatus: "Opened",
  timeStarted: "Today, 10:14 AM",
  messageCount: "10",
  averageResponse: "24 secs",
};

const DUMMY_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    sender: "user",
    text: "What is my current balance?",
    time: "1:20",
  },
  {
    id: "m2",
    sender: "agent",
    text: "Your current wallet balance is ₦142,500.00.\n\nLast transaction: ₦15,000 received from Emeka Mba on Jun 22 at 3:41 PM.",
    time: "1:20",
  },
  {
    id: "m3",
    sender: "user",
    text: "Can I send ₦50,000 to my GTB account ending 4521?",
    time: "1:20",
  },
  {
    id: "m4",
    sender: "agent",
    text: "Sure! Just to confirm you'd like to send ₦50,000 to your GTB account ending in 4521 (Chinedu Okafor).\n\nReply YES to confirm or CANCEL to stop.",
    time: "1:20",
  },
  {
    id: "m5",
    sender: "user",
    text: "YES",
    time: "1:20",
  },
  {
    id: "m6",
    sender: "agent",
    text: "Transfer successful! ₦50,000 has been sent to GTB ···4521. Your new balance is ₦92,500.00.",
    time: "1:20",
  },
  {
    id: "m7",
    sender: "agent",
    type: "receipt",
    time: "1:20",
    receipt: {
      amount: "₦50,000",
      status: "Successful",
      transactionRef: "REF2938289449",
      recipientName: "Chinedu Okafor",
      recipientDetails: "Kairo wallet | 484320043998",
      senderName: "Emeke Ike",
      senderDetails: "UBA | 634**********998",
    },
  },
];

const DUMMY_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "a1",
    title: "Balance query",
    subtitle: "— Reconcile agent",
    time: "11:20",
  },
  {
    id: "a2",
    title: "Identity check passed before transfer",
    time: "11:20",
  },
  {
    id: "a3",
    title: "₦50,000 transfer via Relay agent · NIP ref #TXN2806412",
    time: "11:20",
  },
];

const INFO_ROWS = [
  { label: "Channel", value: DUMMY_USER.channel },
  { label: "Status", value: DUMMY_USER.conversationStatus },
  { label: "Time started", value: DUMMY_USER.timeStarted },
  { label: "No of messages", value: DUMMY_USER.messageCount },
  { label: "Average response", value: DUMMY_USER.averageResponse },
];

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
    display: flex;
    flex-direction: column;
    min-width: 0;
    border-right: 1px solid ${({ theme }) => theme.colors.gray_02};

    .UserInfoHeader {
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray_02};
      height: 6rem;
      padding-inline: 1.5rem;

      .UserInfo {
        &__name {
          color: ${({ theme }) => theme.colors.text_01};
        }

        &__channel {
          font-size: 0.9375rem;
          font-weight: 500;
          color: ${({ theme }) => theme.colors.green};
        }

        &__status {
          font-size: 0.8125rem;
          font-weight: 500;
          color: ${({ theme }) => theme.colors.text_02};
        }
      }
    }

    .MessageContent {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
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

export const ConversationDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  void id;

  return (
    <ConversationDetailsContainer>
      <section className="MessageSection">
        <Flex
          justify="space-between"
          align="center"
          gap="2rem"
          className="UserInfoHeader"
        >
          <Flex align="center" gap="1rem">
            <InitialsAvatar name={DUMMY_USER.name} avatarUrl="" />
            <div className="UserInfo">
              <h3 className="UserInfo__name">{DUMMY_USER.name}</h3>
              <Flex align="center" gap="0.75rem">
                <p className="UserInfo__channel">{DUMMY_USER.channel}</p>
                <p className="UserInfo__status">{DUMMY_USER.statusLabel}</p>
              </Flex>
            </div>
          </Flex>

          <Button
            classes={[ButtonClass.ICON_ONLY]}
            onClick={() => router.push(URL.DASHBOARD_CONVERSATIONS_URL)}
          >
            <Icon icon="iconoir:cancel" width={20} height={20} />
          </Button>
        </Flex>

        <div className="MessageContent">
          <div className="MessageContent__scroll">
            <span className="MessageContent__date">Today</span>

            {DUMMY_MESSAGES.map((message) => {
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
              <button type="button" className="sendBtn" aria-label="Send message">
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
            <InitialsAvatar name={DUMMY_USER.name} avatarUrl="" />
            <p className="ConversationInfo__profile-name">{DUMMY_USER.name}</p>
            <p className="ConversationInfo__profile-phone">{DUMMY_USER.phone}</p>
          </Flex>

          <Divider />

          <div className="ConversationInfo__meta">
            {INFO_ROWS.map((row) => (
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
              {DUMMY_ACTIVITY_LOGS.map((log) => (
                <div key={log.id} className="ConversationInfo__activity-item">
                  <span className="ConversationInfo__activity-bullet" />
                  <div className="ConversationInfo__activity-body">
                    <p className="ConversationInfo__activity-text">
                      {log.title}
                      {log.subtitle ? <span> {log.subtitle}</span> : null}
                    </p>
                    <p className="ConversationInfo__activity-time">{log.time}</p>
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
