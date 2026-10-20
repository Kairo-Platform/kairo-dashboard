"use client";

import { EmptyState, Flex, Loading, Table, Tag, TagType } from "@kairo/ui";
import { Icon } from "@iconify/react";
import { DATE_TIME_FORMAT, formatDate } from "@kairo/lib/utils";
import { ConversationsTableContainer } from "@/app/components/conversations/ConversationsTable";
import { BroadcastTableFilters } from "./BroadcastTableFilters";
import type {
  BroadcastPage,
  BroadcastRecipient,
  BroadcastStatus,
  BroadcastSummary,
} from "@/services/Broadcasts";

export const broadcastStatusLabel = (status: string) =>
  status === "UNKNOWN"
    ? "Outcome unknown"
    : status === "PARTIAL"
      ? "Partially sent"
      : status.charAt(0) + status.slice(1).toLowerCase();
export const broadcastAudienceLabel = (audience: string) =>
  ({
    ALL: "All users",
    ACTIVE: "Active users",
    INACTIVE: "Not onboarded",
    SUSPENDED: "Suspended users",
    SELECTED: "Selected users",
    ALL_EXCEPT_SELECTED: "All except selected",
  })[audience] ?? audience;
export function BroadcastStatusTag({ status }: { status: BroadcastStatus }) {
  const type =
    status === "SENT"
      ? TagType.GREEN
      : status === "UNKNOWN"
        ? TagType.RED
        : status === "QUEUED" || status === "SENDING" || status === "PARTIAL"
          ? TagType.YELLOW
          : TagType.GREY;
  return <Tag type={type}>{broadcastStatusLabel(status)}</Tag>;
}
const date = (value: string) =>
  String(formatDate(value, DATE_TIME_FORMAT) ?? "N/A");
const reasonLabel = (reason: string | null) => {
  if (!reason) return "N/A";
  if (reason.endsWith("_IN_PROGRESS") || reason === "MESSAGE_IN_PROGRESS")
    return "Waiting for the current conversation step";
  const labels: Record<string, string> = {
    OUTSIDE_WHATSAPP_WINDOW: "Waiting for the user to message again",
    WHATSAPP_WINDOW_CLOSED: "Waiting for the user to message again",
    RECENT_ACTIVITY: "Waiting for a quiet moment",
    DELIVERY_DEADLINE: "Delivery deadline passed",
    SEND_OUTCOME_UNKNOWN: "Send outcome could not be confirmed",
    CHANNEL_UNAVAILABLE: "Channel unavailable",
    DELIVERY_UNAVAILABLE: "Delivery temporarily unavailable",
    WORKFLOW_STATE_UNAVAILABLE: "Waiting for conversation state",
    USER_UNAVAILABLE: "User unavailable",
  };
  return labels[reason] ?? reason.toLowerCase().replaceAll("_", " ");
};

export function BroadcastListTable({
  data,
  loading,
  page,
  limit,
  onView,
}: {
  data: BroadcastPage<BroadcastSummary> | null;
  loading: boolean;
  page: number;
  limit: number;
  onView: (id: string) => void;
}) {
  return (
    <ConversationsTableContainer>
      <BroadcastTableFilters />
      {loading ? (
        <Flex justify="center" style={{ padding: "3rem" }}>
          <Loading>Fetching broadcasts...</Loading>
        </Flex>
      ) : data?.items.length ? (
        <Table
          rows={data.items}
          headers={[
            { title: "Title", render: (row: BroadcastSummary) => row.title },
            {
              title: "Audience",
              render: (row: BroadcastSummary) =>
                broadcastAudienceLabel(row.audience),
            },
            {
              title: "Recipients",
              render: (row: BroadcastSummary) => row.totalCount,
            },
            {
              title: "Sent",
              render: (row: BroadcastSummary) => row.counts.SENT,
            },
            {
              title: "Status",
              render: (row: BroadcastSummary) => (
                <BroadcastStatusTag status={row.status} />
              ),
            },
            {
              title: "Date & Time",
              render: (row: BroadcastSummary) => date(row.createdAt),
            },
          ]}
          pageNumber={page}
          limitNumber={limit}
          totalCount={data.totalCount}
          onRowClick={({ row }: { row: BroadcastSummary }) => onView(row.id)}
        />
      ) : (
        <EmptyState
          title="No broadcasts found"
          message="Broadcasts matching your filters will appear here."
          icon={
            <Icon icon="solar:notification-unread-lines-linear" width={24} />
          }
        />
      )}
    </ConversationsTableContainer>
  );
}

export function BroadcastRecipientsTable({
  data,
  loading,
  page,
  limit,
}: {
  data: BroadcastPage<BroadcastRecipient> | null;
  loading: boolean;
  page: number;
  limit: number;
}) {
  return (
    <ConversationsTableContainer>
      <BroadcastTableFilters recipients />
      {loading ? (
        <Flex justify="center" style={{ padding: "3rem" }}>
          <Loading>Fetching recipients...</Loading>
        </Flex>
      ) : data?.items.length ? (
        <Table
          rows={data.items}
          headers={[
            {
              title: "User",
              render: (row: BroadcastRecipient) => row.displayName ?? "N/A",
            },
            {
              title: "WhatsApp number",
              render: (row: BroadcastRecipient) => row.channelUserId,
            },
            {
              title: "Status",
              render: (row: BroadcastRecipient) => (
                <BroadcastStatusTag status={row.status} />
              ),
            },
            {
              title: "Details",
              render: (row: BroadcastRecipient) => reasonLabel(row.reason),
            },
            {
              title: "Last updated",
              render: (row: BroadcastRecipient) => date(row.updatedAt),
            },
          ]}
          pageNumber={page}
          limitNumber={limit}
          totalCount={data.totalCount}
        />
      ) : (
        <EmptyState
          title="No recipients found"
          message="Try changing your search or status filter."
          icon={<Icon icon="solar:users-group-rounded-linear" width={24} />}
        />
      )}
    </ConversationsTableContainer>
  );
}
