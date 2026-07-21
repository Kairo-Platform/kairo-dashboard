"use client";

import { EmptyState, Flex, Loading, Table, Tag, TagType } from "@kairo/ui";
import styled from "styled-components";
import { DATE_TIME_FORMAT, formatDate } from "@kairo/lib/utils";
import { ConversationsTableFilters } from "./ConversationsTableFilters";
import { Icon } from "@iconify/react";
import humanize from "underscore.string/humanize";

export const ConversationsTableContainer = styled.div`
  .MessageBubble {
    display: inline-block;
    max-width: 18rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0rem 0.75rem 0.75rem 0.75rem;
    background-color: ${(props) => props.theme.colors.gray_03};
    color: ${(props) => props.theme.colors.text_01};
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
`;

export type Conversation = {
  id: string;
  user: string;
  message: string;
  channel: string;
  status: string;
  createdAt: Date | string;
};

export type ConversationsTableProps = {
  conversations: Conversation[];
  loading?: boolean;
  onRefresh?: () => void;
  onViewConversation?: (id: string) => void;
  onSeeAll?: () => void;
  page?: number;
  limit?: number;
  totalCount?: number;
};

const CONVERSATION_STATUS_TAG: Record<string, (typeof TagType)[keyof typeof TagType]> = {
  open: TagType.PURPLE_COOL,
  resolved: TagType.GREEN,
  escalated: TagType.RED,
  pending: TagType.YELLOW,
  closed: TagType.GREY,
};

export const ConversationsTable = ({
  conversations,
  loading = false,
  onViewConversation,
  page,
  limit,
  totalCount,
}: ConversationsTableProps) => {
  const headers = [
    {
      title: "User",
      render: (row: Conversation) => row.user ?? "N/A",
    },
    {
      title: "Message",
      render: (row: Conversation) => (
        <span className="MessageBubble" title={row.message}>
          {row.message ?? "N/A"}
        </span>
      ),
    },
    {
      title: "Channel",
      render: (row: Conversation) => row.channel ?? "N/A",
    },
    {
      title: "Status",
      render: (row: Conversation) => {
        const statusKey = String(row.status || "").toLowerCase();
        return (
          <Tag type={CONVERSATION_STATUS_TAG[statusKey] || TagType.GREY}>
            {humanize(String(row.status || "N/A"))}
          </Tag>
        );
      },
    },
    {
      title: "Date & Time",
      render: (row: Conversation) =>
        String(formatDate(row.createdAt, DATE_TIME_FORMAT) ?? "N/A"),
    },
  ];

  return (
    <ConversationsTableContainer>
      {
        loading ? (
          <Flex
            justify="center"
            align="center"
            style={{ height: "10rem" }}
          >
            <Loading>
              Fetching conversations...
            </Loading>
          </Flex>
        ) :
          conversations.length > 0 ? (
            <Flex direction="column" gap="1rem">
              <ConversationsTableFilters />
              <Table
                headers={headers}
                rows={conversations}
                pageNumber={page}
                limitNumber={limit}
                totalCount={totalCount}
                onRowClick={onViewConversation ? ({ row }: { row: Conversation }) => onViewConversation(row.id) : undefined}
              />
            </Flex>
          ) :
            <EmptyState
              title="No conversations yet"
              message="Conversations with your agents will appear here."
              icon={<Icon icon="arcticons:conversations" width={20} height={20} />}
            />
      }
    </ConversationsTableContainer>
  );
};

export default ConversationsTable;
