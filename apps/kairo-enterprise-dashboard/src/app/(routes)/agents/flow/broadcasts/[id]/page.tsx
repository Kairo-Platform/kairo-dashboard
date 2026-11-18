"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEntity } from "simpler-state";
import {
  Button,
  ButtonClass,
  ConfirmationModal,
  EmptyState,
  Flex,
  Loading,
} from "@kairo/ui";
import { showSuccessNotification } from "@kairo/utils";
import styled from "styled-components";
import { DashboardLayout } from "@/app/components/dashboard";
import {
  BroadcastRecipientsTable,
  BroadcastStatusTag,
  broadcastAudienceLabel,
  broadcastSentCount,
} from "@/app/components/notifications/BroadcastHistory";
import {
  broadcastHistoryStore,
  cancelBroadcast,
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
  const [showCancel, setShowCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const cancellationPending = useRef(false);
  useEffect(() => {
    void fetchBroadcastHistory(query, id);
  }, [query, id]);
  const current =
    state.orgId === getOrgId() &&
    state.queryKey === JSON.stringify({ id, query });
  const details = current ? state.details : null;
  const loading = !current || state.loading;
  const closeCancel = () => {
    if (!cancellationPending.current) setShowCancel(false);
  };
  const handleCancel = async () => {
    if (cancellationPending.current || !details) return;
    cancellationPending.current = true;
    setCancelling(true);
    try {
      await cancelBroadcast(id);
      setShowCancel(false);
      showSuccessNotification({
        message: "Remaining queued messages cancelled.",
      });
      await fetchBroadcastHistory(query, id);
    } finally {
      cancellationPending.current = false;
      setCancelling(false);
    }
  };
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
        <Flex gap="0.75rem" wrap="wrap">
          <Button
            classes={[ButtonClass.OUTLINED]}
            disabled={cancelling || loading}
            onClick={() => void fetchBroadcastHistory(query, id)}
          >
            Refresh
          </Button>
          {!!details?.broadcast.counts.QUEUED && (
            <Button
              classes={[ButtonClass.SOLID_RED]}
              onClick={() => setShowCancel(true)}
              disabled={cancelling || loading}
              loading={cancelling}
            >
              Cancel broadcast
            </Button>
          )}
        </Flex>
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
            {!!details.buttons?.length && (
              <Flex gap="0.75rem" wrap="wrap" style={{ marginBottom: "1rem" }}>
                {details.buttons.map((button) => (
                  <span key={button.action}>{button.label}</span>
                ))}
              </Flex>
            )}
            <Flex gap="1.5rem" wrap="wrap" className="meta">
              <span>{broadcastAudienceLabel(details.broadcast.audience)}</span>
              <span>{details.broadcast.totalCount} recipients</span>
              <span>
                {broadcastSentCount(details.broadcast)} sent ·{" "}
                {details.broadcast.counts.QUEUED} queued
              </span>
              {!!details.broadcast.counts.FAILED && <span>{details.broadcast.counts.FAILED} failed</span>}
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
            Sent means the channel accepted the message. WhatsApp delivery updates
            appear as Delivered, Read or Failed when received.
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
      {showCancel && details && (
        <ConfirmationModal
          title="Cancel broadcast?"
          confirmButtonText="Cancel broadcast"
          cancelButtonText="Keep broadcast"
          confirmButtonClasses={[ButtonClass.SOLID_RED]}
          onClose={closeCancel}
          onConfirm={handleCancel}
          confirming={cancelling}
          closeOnConfirm={false}
        >
          <p>
            Stop the remaining queued messages for{" "}
            <strong>{details.broadcast.title}</strong>? Messages already sent or
            currently sending cannot be recalled.
          </p>
        </ConfirmationModal>
      )}
    </DashboardLayout>
  );
}
