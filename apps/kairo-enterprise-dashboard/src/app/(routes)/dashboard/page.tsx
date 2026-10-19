"use client";

import { Suspense, useEffect, useMemo } from "react";
import { flowStore, fetchFlowConversations } from "@/app/store/flow";
import { analyticsStore, fetchAnalytics } from "@/app/store/analytics";
import { useEntity } from "simpler-state";
import { getOrgId } from "@/lib/auth/client";
import {
  mapConversation,
  parseConversationNumber,
} from "@/services/Flow/conversations";

import styled from "styled-components";
import { DashboardLayout } from "@/app/components/dashboard";
import {
  DashboardRecentConversationsTable,
  DashboardAnalyticsCardGrid,
  DashboardDoughnutChart,
  DashboardLineChart,
} from "@/app/components/dashbaord-analytics";
import { chartPoints, metricValue } from "@/services/Analytics/mappers";
import { DashboardDateFilters } from "@/app/components/dashbaord-analytics/DashboardDateFilters";
import { AskKairoAI } from "@/app/components/ask-kairo";
import { useRouter, useSearchParams } from "next/navigation";
import { URL } from "@/lib/constants";
import { KairoBillingSummaryModal } from "@/app/components/billing";
import { Flex } from "@kairo/ui";
import { formatDate } from "@kairo/lib/utils";

const PageContainer = styled.main`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  align-items: stretch;
  padding: 2rem 0;

  @media (max-width: ${(props) => props.theme.breakpoint.lg}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${(props) => props.theme.breakpoint.md}) {
    grid-template-columns: 1fr;
  }

  .CardsSection {
    grid-column: 1 / -1;
  }

  .LineChartsSection {
    grid-column: span 2;
    min-width: 0;

    @media (max-width: ${(props) => props.theme.breakpoint.lg}) {
      grid-column: 1 / -1;
    }
  }

  .DoughnutChartsSection {
    grid-column: span 1;
    min-width: 0;

    @media (max-width: ${(props) => props.theme.breakpoint.lg}) {
      grid-column: 1 / -1;
    }
  }

  .RecentConversationsSection {
    grid-column: 1 / -1;
    min-width: 0;
  }

  .DoughnutCenterIntent {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.125rem;
    pointer-events: none;
  }

  .DoughnutCenterIntent__value {
    font-size: 2.5rem;
    font-weight: 600;
    line-height: 3rem;
    color: ${(props) => props.theme.colors.text_08};
  }

  .DoughnutCenterIntent__label {
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.25rem;
    color: ${(props) => props.theme.colors.text_02};
  }
`;

export default function DashboardPage() {
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
      agent: "all" as const,
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
    () => ({ agent: "all" as const, startDate, endDate }),
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
  const conversationTrend = chartPoints(metrics?.conversationVolume, metrics);
  const totalMessages = metrics?.conversationVolume.reduce(
    (total, point) => total + (point.value ?? 0),
    0,
  );
  const colors = ["#804625", "#BF6938", "#FF8C4A", "#FFC5A4"];
  const resolutionBreakdown = (metrics?.intentBreakdown ?? []).map(
    (item, index) => ({
      label: item.intent,
      value: item.count,
      color: colors[index % colors.length]!,
    }),
  );
  const intentCount = metrics?.intentBreakdown?.reduce(
    (total, item) => total + item.count,
    0,
  );
  const cards = [
    {
      title: "Total conversations",
      percentage: metrics?.percentageChanges?.totalConversations,
      value: metricValue(metrics?.totalConversations),
      icon: "iconoir:message-solid",
      featured: true,
    },
    {
      title: "Active users",
      percentage: metrics?.percentageChanges?.activeUsers,
      value: metricValue(metrics?.activeUsers),
      icon: "iconoir:user",
    },
    {
      title: "AI overall health score",
      percentage: metrics?.percentageChanges?.aiOverallHealthScore,
      value: metricValue(metrics?.aiOverallHealthScore),
      valueSuffix: metrics?.aiOverallHealthScore == null ? undefined : "/100",
      icon: "mingcute:ai-fill",
    },
    {
      title: "Human escalation rates",
      percentage: metrics?.percentageChanges?.humanEscalationRate,
      valueSuffix: metrics?.humanEscalationRate == null ? undefined : "%",
      value: metricValue(metrics?.humanEscalationRate),
      icon: "system-uicons:heart-rate",
    },
  ];

  return (
    <DashboardLayout
      pageTitle="Dashboard"
      subTitle="Monitor operations, agents, alerts, and insights in real time."
      appendElementToHeading={
        <Flex>
          <DashboardDateFilters />
          <AskKairoAI iconOnly />
        </Flex>
      }
    >
      <PageContainer>
        <section className="CardsSection">
          <DashboardAnalyticsCardGrid cards={cards} />
        </section>

        <section className="LineChartsSection">
          <DashboardLineChart
            title="Conversation volume"
            titleIcon="mdi:message"
            subTitle={
              startDate || endDate
                ? "messages in selected period"
                : "messages today"
            }
            subTitleAmount={metricValue(totalMessages)}
            showPercentage
            percentage={metrics?.percentageChanges?.conversationVolume}
            chartValues={conversationTrend}
            chartHeight={300}
            emptyLabel={analytics.loading ? "Loading..." : "N/A"}
          />
        </section>

        <section className="DoughnutChartsSection">
          <DashboardDoughnutChart
            title="Intent breakdown"
            chartValues={resolutionBreakdown}
            chartWidth={230}
            chartHeight={230}
            cutout="68%"
            useCustomLegend
            centerContent={
              <div className="DoughnutCenterIntent">
                <span className="DoughnutCenterIntent__value">
                  {metricValue(intentCount)}
                </span>
                <span className="DoughnutCenterIntent__label">Intent</span>
              </div>
            }
          />
        </section>

        <section className="RecentConversationsSection">
          <Suspense fallback={null}>
            <DashboardRecentConversationsTable
              conversations={
                flowConversations?.items.map(mapConversation) ?? []
              }
              loading={fetchingFlowConversations}
              onSeeAll={() =>
                router.push(
                  `${URL.DASHBOARD_CONVERSATIONS_URL}?${searchParams.toString()}`,
                )
              }
              onRowClick={({ row }) => {
                if (row.userId)
                  router.push(
                    `${URL.DASHBOARD_CONVERSATION_DETAILS_URL.replace(":userId", encodeURIComponent(row.userId))}?${searchParams.toString()}`,
                  );
              }}
            />
          </Suspense>
        </section>
      </PageContainer>

      {/* <KairoBillingSummaryModal /> */}
    </DashboardLayout>
  );
}
