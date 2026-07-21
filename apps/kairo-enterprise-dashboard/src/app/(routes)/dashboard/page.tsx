"use client";

import styled from "styled-components";
import { DashboardLayout } from "@/app/components/dashboard";
import {
  DashboardAnalyticsCardGrid,
  DashboardDoughnutChart,
  DashboardLineChart,
  DashboardRecentConversationsTable,
} from "@/app/components/dashbaord-analytics";
import { AskKairoAI } from "@/app/components/ask-kairo";
import { useRouter } from "next/navigation";
import { URL } from "@/lib/constants";
import { KairoBillingSummaryModal } from "@/app/components/billing";

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

const conversationTrend = [
  { label: "12:00", value: 42 },
  { label: "2:00", value: 58 },
  { label: "4:00", value: 51 },
  { label: "6:00", value: 73 },
  { label: "8:00", value: 66 },
  { label: "10:00", value: 80 },
  { label: "12:00", value: 47 },
];

const resolutionBreakdown = [
  { label: "Support", value: 38, color: "#804625" },
  { label: "Fraud", value: 24, color: "#BF6938" },
  { label: "Reconcile", value: 22, color: "#FF8C4A" },
  { label: "Risk", value: 16, color: "#FFC5A4" },
];

const recentConversations = [
  {
    id: "1",
    user: "Ada Okonkwo",
    message: "What's my current wallet balance?",
    channel: "Whatsapp",
    status: "open",
    dateTime: "2026-07-14T09:15:00",
  },
  {
    id: "2",
    user: "James Ade",
    message: "My transaction failed but I was debited.",
    channel: "Whatsapp",
    status: "escalated",
    dateTime: "2026-07-14T08:42:00",
  },
  {
    id: "3",
    user: "Chioma Bello",
    message: "What is going on? I haven't received my transfer yet.",
    channel: "Whatsapp",
    status: "resolved",
    dateTime: "2026-07-13T17:05:00",
  },
  {
    id: "4",
    user: "Michael Uche",
    message: "Where can I find my latest statement?",
    channel: "Whatsapp",
    status: "pending",
    dateTime: "2026-07-13T14:21:00",
  },
  {
    id: "5",
    user: "Sarah Danladi",
    message: "Send ₦20,000 to my GTB account",
    channel: "Whatsapp",
    status: "closed",
    dateTime: "2026-07-12T11:48:00",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  const cards = [
    {
      title: "Total conversations",
      value: 0,
      icon: "iconoir:message-solid",
      percentage: 0,
      featured: true,
    },
    {
      title: "Active users",
      value: 0,
      icon: "iconoir:user",
      percentage: 0,
    },
    {
      title: "AI overall health score",
      value: 0,
      valueSuffix: "/100",
      icon: "mingcute:ai-fill",
      percentage: 0,
    },
    {
      title: "Human escalation rates",
      value: 0,
      icon: "system-uicons:heart-rate",
      percentage: 0,
    },
  ];

  return (
    <DashboardLayout
      pageTitle="Dashboard"
      subTitle="Monitor operations, agents, alerts, and insights in real time."
      appendElementToHeading={<AskKairoAI iconOnly />}
    >
      <PageContainer>
        <section className="CardsSection">
          <DashboardAnalyticsCardGrid cards={cards} />
        </section>

        <section className="LineChartsSection">
          <DashboardLineChart
            title="Conversation volume"
            titleIcon="mdi:message"
            subTitle="today"
            subTitleAmount="120,006"
            chartValues={conversationTrend}
            chartHeight={300}
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
                <span className="DoughnutCenterIntent__value">84%</span>
                <span className="DoughnutCenterIntent__label">Intent</span>
              </div>
            }
          />
        </section>

        <section className="RecentConversationsSection">
          <DashboardRecentConversationsTable
            conversations={recentConversations}
            onSeeAll={() => router.push(URL.DASHBOARD_CONVERSATIONS_URL)}
          />
        </section>
      </PageContainer>

      <KairoBillingSummaryModal />
    </DashboardLayout>
  );
}
