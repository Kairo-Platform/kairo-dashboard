"use client";

import { Suspense, useEffect } from "react";
import { ConversationsTable } from "@/app/components/conversations";
import { DashboardLayout } from "@/app/components/dashboard";
import { useEntity } from "simpler-state";
import { fetchFlowConversations, flowStore } from "@/app/store/flow";
import {
  mapConversation,
  parseConversationNumber,
} from "@/services/Flow/conversations";
import { URL } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { AskKairoAI } from "@/app/components/ask-kairo";

export default function ConversationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { flowConversations, fetchingFlowConversations } = useEntity(flowStore);
  const page = parseConversationNumber(searchParams.get("page"), 1);
  const limit = parseConversationNumber(searchParams.get("limit"), 10);
  const size = parseConversationNumber(searchParams.get("size"));
  const search = searchParams.get("search") || undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;

  useEffect(() => {
    void fetchFlowConversations({
      page,
      limit,
      size,
      search,
      startDate,
      endDate,
    }).catch(() => {});
  }, [page, limit, size, search, startDate, endDate]);

  const breadcrumbs = [
    {
      title: "Dashboard",
      onClick: () => router.push(URL.DASHBOARD_URL),
    },
    {
      title: "Conversations",
    },
  ];

  return (
    <DashboardLayout
      pageTitle="Conversations"
      breadcrumbs={breadcrumbs}
      appendElementToHeading={<AskKairoAI />}
    >
      <Suspense fallback={null}>
        <ConversationsTable
          conversations={flowConversations?.items.map(mapConversation) ?? []}
          loading={fetchingFlowConversations}
          page={flowConversations?.page ?? page}
          limit={flowConversations?.limit ?? limit}
          totalCount={flowConversations?.total ?? 0}
          onViewConversation={(id) =>
            router.push(
              `${URL.DASHBOARD_CONVERSATION_DETAILS_URL.replace(":id", id)}?${searchParams.toString()}`,
            )
          }
        />
      </Suspense>
    </DashboardLayout>
  );
}
