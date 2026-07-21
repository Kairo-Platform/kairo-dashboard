"use client";

import styled from "styled-components";
import {
  Button,
  ButtonClass,
  EmptyState,
  Flex,
  Loading,
  Table,
  Tag,
  TagType,
} from "@/app/components/ui";
import { Icon } from "@iconify/react";
import { DATE_TIME_FORMAT, formatDate } from "@kairo/lib/utils";

export type ConversationStatus =
  | "open"
  | "resolved"
  | "escalated"
  | "pending"
  | "closed";

export type RecentConversation = {
  id?: string;
  user: string;
  message: string;
  channel: string;
  status: ConversationStatus | string;
  dateTime: string | Date;
};

const STATUS_TAG: Record<string, (typeof TagType)[keyof typeof TagType]> = {
  open: TagType.PURPLE_COOL,
  resolved: TagType.GREEN,
  escalated: TagType.RED,
  pending: TagType.YELLOW,
  closed: TagType.GREY,
};

const humanize = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const DashboardRecentConversationsTableContainer = styled.div`
  border-radius: 1.5rem;
  border: 1.5px solid ${(props) => props.theme.colors.gray_03};
  background-color: ${(props) => props.theme.colors.ui_07};
  overflow: hidden;
  width: 100%;

  .TableHeader {
    position: relative;
    padding: 1.5rem 2rem 0 1.5rem;

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      flex-direction: column !important;
      gap: 1rem !important;
    }
  }

  .MessageColumn {
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

  .TableTitle {
    h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
    }
    p {
      margin: 0;
      color: ${(props) => props.theme.colors.text_02};
      font-size: 0.875rem;
    }
  }

  .SeeAllBtn {
    color: ${(props) => props.theme.colors.orange};

    &:hover {
      text-decoration: underline;
    }
  }
`;

type DashboardRecentConversationsTableProps = {
  conversations?: RecentConversation[];
  onRowClick?: (args: { row: RecentConversation; index: number }) => void;
  onRefresh?: () => void;
  loading?: boolean;
  onSeeAll?: () => void;
  title?: string;
  subTitle?: string;
  emptyAction?: {
    show: boolean;
    label?: string;
    onClick: () => void;
  };
};

export const DashboardRecentConversationsTable = ({
  conversations = [],
  onRowClick,
  loading = false,
  onSeeAll,
  title = "Recent conversations",
  subTitle = "Track the latest conversations on flow",
  emptyAction = {
    show: false,
    onClick: () => undefined,
  },
}: DashboardRecentConversationsTableProps) => {
  const tableHeaders = [
    {
      title: "User",
      render: (row: RecentConversation) => row.user || "—",
    },
    {
      title: "Message",
      render: (row: RecentConversation) => (
        <span className="MessageColumn" title={row.message}>
          {row.message || "—"}
        </span>
      ),
    },
    {
      title: "Channel",
      render: (row: RecentConversation) => row.channel || "—",
    },
    {
      title: "Status",
      render: (row: RecentConversation) => {
        const statusKey = String(row.status || "").toLowerCase();
        return (
          <Tag type={STATUS_TAG[statusKey] || TagType.GREY}>
            {humanize(String(row.status || "N/A"))}
          </Tag>
        );
      },
    },
    {
      title: "Date & Time",
      render: (row: RecentConversation) =>
        String(formatDate(row.dateTime, DATE_TIME_FORMAT) ?? "—"),
    },
  ];

  return (
    <DashboardRecentConversationsTableContainer>
      <Flex
        justify="space-between"
        align="center"
        gap="2rem"
        wrap="wrap"
        className="TableHeader"
      >
        <div className="TableTitle">
          <h2>{title}</h2>
          <p>{subTitle}</p>
        </div>

        {onSeeAll && (
          <Button type="button" classes={[ButtonClass.TEXT_ONLY]} onClick={onSeeAll} className="SeeAllBtn">
            <span>See all</span>
          </Button>
        )}
      </Flex>

      {loading ? (
        <Flex
          justify="center"
          align="center"
          style={{ padding: "2rem 0", minHeight: "20rem" }}
        >
          <Loading>Loading conversations...</Loading>
        </Flex>
      ) : conversations.length > 0 ? (
        <Table
          headers={tableHeaders}
          rows={conversations}
          onRowClick={onRowClick}
          showPagination={false}
          style={{
            border: "none",
            borderRadius: "0rem",
            marginBottom: "0rem",
          }}
        />
      ) : (
        <EmptyState
          title="No conversations to show yet"
          message="We’ll show recent conversation details here when you have them."
          icon={
            <Icon
              icon="iconoir:message"
              width={48}
              height={48}
              color="#FF6B1A"
            />
          }
        >
          {emptyAction.show ? (
            <Button
              classes={[ButtonClass.WITH_ICON, ButtonClass.OUTLINED]}
              onClick={emptyAction.onClick}
            >
              <Icon icon="ri:add-line" width={24} height={24} />
              <span>{emptyAction.label || "Start a conversation"}</span>
            </Button>
          ) : null}
        </EmptyState>
      )}
    </DashboardRecentConversationsTableContainer>
  );
};

export default DashboardRecentConversationsTable;
