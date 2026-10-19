"use client";

import { Suspense, useEffect, useMemo } from "react";
import { ConversationsTable } from "../../conversations";
import {
  DashboardAnalyticsCardGrid,
  DashboardLineChart,
} from "../../dashbaord-analytics";
import { styled } from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import { flowStore, fetchFlowConversations } from "@/app/store/flow";
import { analyticsStore, fetchAnalytics } from "@/app/store/analytics";
import { useEntity } from "simpler-state";
import { getOrgId } from "@/lib/auth/client";
import {
  mapConversation,
  parseConversationNumber,
} from "@/services/Flow/conversations";
import { chartPoints, metricValue } from "@/services/Analytics/mappers";
import { URL } from "@/lib/constants";
import { formatDate } from "@kairo/lib/utils";

const FlowConversationsPageContainer = styled.div`
  main {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
  }

  .CardsSection .cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;
    width: 100%;
  }
`;

export const FlowConversationsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseConversationNumber(searchParams.get("page"), 1);
  const limit = parseConversationNumber(searchParams.get("limit"), 10);
  const search = searchParams.get("search") || undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;
  const today = String(formatDate(new Date(), "YYYY-MM-DD"));

  const conversationFilters = useMemo(
    () => ({
      agent: "flow" as const,
      page,
      limit,
      search,
      startDate: startDate || today,
      endDate: endDate || today,
    }),
    [page, limit, search, startDate, endDate, today],
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

  const analyticsFilters = useMemo(
    () => ({ agent: "flow" as const, startDate, endDate }),
    [startDate, endDate],
  );
  const analyticsState = useEntity(analyticsStore);
  useEffect(() => {
    void fetchAnalytics(analyticsFilters).catch(() => {});
  }, [analyticsFilters]);
  const currentAnalytics =
    analyticsState.queryKey === JSON.stringify(analyticsFilters) &&
    analyticsState.orgId === getOrgId();
  const analytics = {
    data: currentAnalytics ? analyticsState.analytics : null,
    loading: !currentAnalytics || analyticsState.fetchingAnalytics,
  };
  const metrics = analytics.data;
  const cards = [
    {
      title: "Total conversations",
      percentage: metrics?.percentageChanges?.totalConversations,
      value: metricValue(metrics?.totalConversations),
      icon: "iconoir:message",
    },
    {
      title: "Open conversations",
      percentage: metrics?.percentageChanges?.openConversations,
      value: metricValue(metrics?.openConversations),
      icon: "iconoir:message",
    },
  ];
  return (
    <FlowConversationsPageContainer>
      <main>
        <section className="CardsSection">
          <DashboardAnalyticsCardGrid cards={cards} />
        </section>

        <section className="LineChartsSection">
          <DashboardLineChart
            title="Average response time (in seconds)"
            chartValues={chartPoints(metrics?.averageResponseTime, metrics)}
            subTitleAmount={metricValue(metrics?.averageResponseTimeSeconds)}
            subTitle="seconds (estimated)"
            showPercentage
            percentage={metrics?.percentageChanges?.averageResponseTimeSeconds}
            emptyLabel={analytics.loading ? "Loading..." : "N/A"}
            chartHeight={260}
          />
        </section>
        <section>
          <Suspense fallback={null}>
            <ConversationsTable
              conversations={
                flowConversations?.items.map(mapConversation) ?? []
              }
              loading={fetchingFlowConversations}
              page={flowConversations?.page ?? page}
              limit={flowConversations?.limit ?? limit}
              totalCount={flowConversations?.totalCount ?? 0}
              onViewConversation={(userId) =>
                router.push(
                  `${URL.AGENTS_FLOW_CONVERSATION_DETAILS_URL.replace(":userId", encodeURIComponent(userId))}?${searchParams.toString()}`,
                )
              }
            />
          </Suspense>
        </section>
      </main>
    </FlowConversationsPageContainer>
  );
};

export default FlowConversationsPage;
