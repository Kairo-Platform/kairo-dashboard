"use client";

import { Suspense, useEffect, useMemo } from "react";
import { ConversationsTable } from "@/app/components/conversations";
import { DashboardLayout } from "@/app/components/dashboard";
import { flowStore, fetchFlowConversations } from "@/app/store/flow";
import { useEntity } from "simpler-state";
import { getOrgId } from "@/lib/auth/client";
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
  const page = parseConversationNumber(searchParams.get("page"), 1);
  const limit = parseConversationNumber(searchParams.get("limit"), 10);
  const search = searchParams.get("search") || undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;

  const conversationFilters = useMemo(
    () => ({ agent: "all" as const, page, limit, search, startDate, endDate }),
    [page, limit, search, startDate, endDate],
  );
  const conversationState = useEntity(flowStore);
  useEffect(() => {
    void fetchFlowConversations(conversationFilters).catch(() => {});
  }, [conversationFilters]);
  const currentConversations =
    conversationState.conversationsQueryKey ===
      JSON.stringify(conversationFilters) &&
    conversationState.conversationsOrgId === getOrgId();
  const conversations = {
    data: currentConversations ? conversationState.flowConversations : null,
    loading:
      !currentConversations || conversationState.fetchingFlowConversations,
  };
  const flowConversations = conversations.data;
  const fetchingFlowConversations = conversations.loading;

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
          totalCount={flowConversations?.totalCount ?? 0}
          onViewConversation={(userId) =>
            router.push(
              `${URL.DASHBOARD_CONVERSATION_DETAILS_URL.replace(":userId", encodeURIComponent(userId))}?${searchParams.toString()}`,
            )
          }
        />
      </Suspense>
    </DashboardLayout>
  );
}
