"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEntity } from "simpler-state";
import { Button, ButtonClass, EmptyState, Flex, Loading } from "@kairo/ui";
import styled from "styled-components";
import { DashboardLayout } from "@/app/components/dashboard";
import {
  BroadcastRecipientsTable,
  BroadcastStatusTag,
  broadcastAudienceLabel,
} from "@/app/components/notifications/BroadcastHistory";
import {
  broadcastHistoryStore,
  fetchBroadcastHistory,
} from "@/app/store/broadcasts";
import { getOrgId } from "@/lib/auth/client";
import { URL } from "@/lib/constants";
import { parseConversationNumber } from "@/services/Flow/conversations";
import { DATE_TIME_FORMAT, formatDate } from "@kairo/lib/utils";

const MessageCard = styled.section`
  background: ${({ theme }) => theme.colors.ui_07};
  border: 1px solid ${({ theme }) => theme.colors.gray_03};
  border-radius: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  overflow-wrap: anywhere;
  .message {
    white-space: pre-wrap;
    margin: 1rem 0;
  }
  .meta {
    color: ${({ theme }) => theme.colors.text_02};
  }
`;
export default function BroadcastDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const params = useSearchParams();
  const page = parseConversationNumber(params.get("page"), 1);
  const limit = Math.min(100, parseConversationNumber(params.get("limit"), 10));
  const search = params.get("search") || undefined;
  const status = params.get("status") || undefined;
  const query = useMemo(
    () => ({ page, limit, search, status }),
    [page, limit, search, status],
  );
  const state = useEntity(broadcastHistoryStore);
  useEffect(() => {
    void fetchBroadcastHistory(query, id);
  }, [query, id]);
  const current =
    state.orgId === getOrgId() &&
    state.queryKey === JSON.stringify({ id, query });
  const details = current ? state.details : null;
  const loading = !current || state.loading;
  return (
    <DashboardLayout
      pageTitle="Broadcast details"
      breadcrumbs={[
        { title: "Flow", onClick: () => router.push(URL.AGENTS_FLOW_URL) },
        {
          title: "Broadcasts",
          onClick: () =>
            router.push(
              `${URL.AGENTS_FLOW_BROADCASTS_URL}?${params.get("back") || ""}`,
            ),
        },
        { title: "Details" },
      ]}
      appendElementToHeading={
        <Button
          classes={[ButtonClass.OUTLINED]}
          onClick={() => void fetchBroadcastHistory(query, id)}
        >
          Refresh
        </Button>
      }
    >
      {loading ? (
        <Loading>Fetching broadcast...</Loading>
      ) : details ? (
        <>
          <MessageCard>
            <Flex justify="space-between" align="center" wrap="wrap" gap="1rem">
              <h2>{details.broadcast.title}</h2>
              <BroadcastStatusTag status={details.broadcast.status} />
            </Flex>
            <p className="message">{details.message}</p>
            <Flex gap="1.5rem" wrap="wrap" className="meta">
              <span>{broadcastAudienceLabel(details.broadcast.audience)}</span>
              <span>{details.broadcast.totalCount} recipients</span>
              <span>
                {details.broadcast.counts.SENT} sent ·{" "}
                {details.broadcast.counts.QUEUED} queued
              </span>
              <span>
                Created:{" "}
                {String(
                  formatDate(details.broadcast.createdAt, DATE_TIME_FORMAT),
                )}
              </span>
              <span>
                Expires:{" "}
                {String(
                  formatDate(details.broadcast.expiresAt, DATE_TIME_FORMAT),
                )}
              </span>
            </Flex>
          </MessageCard>
          <h2>Recipients</h2>
          <p style={{ marginBottom: "1rem" }}>
            Sent means WhatsApp accepted the message; it does not confirm
            delivery or that it was read.
          </p>
          <BroadcastRecipientsTable
            data={state.recipients}
            loading={loading}
            page={page}
            limit={limit}
          />
        </>
      ) : (
        <EmptyState
          title="Broadcast unavailable"
          message="This broadcast could not be loaded."
        />
      )}
    </DashboardLayout>
  );
}
