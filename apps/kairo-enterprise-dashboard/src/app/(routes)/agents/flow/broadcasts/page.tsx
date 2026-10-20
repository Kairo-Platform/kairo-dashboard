"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEntity } from "simpler-state";
import { Button, ButtonClass } from "@kairo/ui";
import { DashboardLayout } from "@/app/components/dashboard";
import CreateBroadcastModal from "@/app/components/notifications/CreateBroadcastModal";
import { BroadcastListTable } from "@/app/components/notifications/BroadcastHistory";
import {
  broadcastHistoryStore,
  fetchBroadcastHistory,
} from "@/app/store/broadcasts";
import { getOrgId } from "@/lib/auth/client";
import { URL } from "@/lib/constants";
import { parseConversationNumber } from "@/services/Flow/conversations";

export default function BroadcastsPage() {
  const router = useRouter();
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const params = useSearchParams();
  const page = parseConversationNumber(params.get("page"), 1);
  const limit = Math.min(100, parseConversationNumber(params.get("limit"), 10));
  const search = params.get("search") || undefined;
  const startDate = params.get("startDate") || undefined;
  const endDate = params.get("endDate") || undefined;
  const status = params.get("status") || undefined;
  const query = useMemo(
    () => ({ page, limit, search, startDate, endDate, status }),
    [page, limit, search, startDate, endDate, status],
  );
  const state = useEntity(broadcastHistoryStore);
  useEffect(() => {
    void fetchBroadcastHistory(query);
  }, [query]);
  const current =
    state.orgId === getOrgId() && state.queryKey === JSON.stringify({ query });
  return (
    <DashboardLayout
      pageTitle="Broadcasts"
      breadcrumbs={[
        { title: "Flow", onClick: () => router.push(URL.AGENTS_FLOW_URL) },
        { title: "Broadcasts" },
      ]}
      appendElementToHeading={
        <Button
          classes={[ButtonClass.OUTLINED]}
          onClick={() => setBroadcastOpen(true)}
        >
          Send broadcast
        </Button>
      }
    >
      {broadcastOpen && (
        <CreateBroadcastModal
          onClose={() => setBroadcastOpen(false)}
          onSuccess={() => void fetchBroadcastHistory(query)}
        />
      )}
      <BroadcastListTable
        data={current ? state.list : null}
        loading={!current || state.loading}
        page={page}
        limit={limit}
        onView={(id) =>
          router.push(
            `${URL.AGENTS_FLOW_BROADCAST_DETAILS_URL.replace(":id", encodeURIComponent(id))}?back=${encodeURIComponent(params.toString())}`,
          )
        }
      />
    </DashboardLayout>
  );
}
