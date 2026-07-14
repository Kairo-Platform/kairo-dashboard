"use client";

import styled from "styled-components";
import { Button, ButtonClass, Flex } from "@/app/components/ui";
import { DashboardLayout } from "@/app/components/dashboard";
import {
  DashboardDoughnutChart,
  DashboardLineChart,
  DashboardRecentConversationsTable,
} from "@/app/components/dashbaord-analytics";
import { Icon } from "@iconify/react";

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
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.5rem;
    width: 100%;

    @media (max-width: ${(props) => props.theme.breakpoint.lg}) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      grid-template-columns: 1fr;
    }

    .card {
      padding: 1rem;
      border-radius: 0.75rem;
      border: 1.5px solid ${(props) => props.theme.colors.gray_02};
      height: 100%;
      width: 100%;
      min-width: 0;

      &__title {
        font-size: 1rem;
        font-weight: 500;
        color: ${(props) => props.theme.colors.text_02};
      }

      &__value {
        font-size: 1.5rem;
        font-weight: 600;
        color: ${(props) => props.theme.colors.text_01};
      }

      &__percentage {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 1rem;
        font-weight: 500;

        &--up {
          color: ${(props) => props.theme.colors.green};
        }

        &--down {
          color: ${(props) => props.theme.colors.red};
        }
      }
    }
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
`;

const conversationTrend = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 58 },
  { label: "Wed", value: 51 },
  { label: "Thu", value: 73 },
  { label: "Fri", value: 66 },
  { label: "Sat", value: 39 },
  { label: "Sun", value: 47 },
];

const resolutionBreakdown = [
  { label: "Support", value: 62, color: "#FF6B1A" },
  { label: "Fraud", value: 18, color: "#FF8C4A" },
  { label: "Reconcile", value: 12, color: "#BF5014" },
  { label: "Risk", value: 8, color: "#FFC5A4" },
];

const recentConversations = [
  {
    id: "1",
    user: "Ada Okonkwo",
    message: "What's my current wallet balance?",
    channel: "WhatsApp",
    status: "open",
    dateTime: "2026-07-14T09:15:00",
  },
  {
    id: "2",
    user: "James Ade",
    message: "My transaction failed but I was debited.",
    channel: "WhatsApp",
    status: "escalated",
    dateTime: "2026-07-14T08:42:00",
  },
  {
    id: "3",
    user: "Chioma Bello",
    message: "What is going on? I haven't received my transfer yet.",
    channel: "WhatsApp",
    status: "resolved",
    dateTime: "2026-07-13T17:05:00",
  },
  {
    id: "4",
    user: "Michael Uche",
    message: "Where can I find my latest statement?",
    channel: "WhatsApp",
    status: "pending",
    dateTime: "2026-07-13T14:21:00",
  },
  {
    id: "5",
    user: "Sarah Danladi",
    message: "Send ₦20,000 to my GTB account",
    channel: "WhatsApp",
    status: "closed",
    dateTime: "2026-07-12T11:48:00",
  },
];

export default function DashboardPage() {
  const cards = [
    {
      title: "Total conversations",
      value: 100,
      icon: "iconoir:message",
      percentage: 10,
    },
    {
      title: "Active users",
      value: 10,
      icon: "iconoir:user",
      percentage: 10,
    },
    {
      title: "Resolution rates",
      value: 300,
      icon: "system-uicons:heart-rate",
      percentage: -4,
    },
    {
      title: "Human escalation rates",
      value: 5,
      icon: "system-uicons:heart-rate",
      percentage: -2,
    },
    {
      title: "Average response time",
      value: 10,
      icon: "mingcute:time-line",
      percentage: 10,
    },
    {
      title: "Active agents",
      value: 10,
      icon: "system-uicons:heart-rate",
      percentage: 10,
    },
    {
      title: "Field intent rate",
      value: 10,
      icon: "system-uicons:heart-rate",
      percentage: -6,
    },
    {
      title: "AI overall health score",
      value: 90,
      icon: "system-uicons:heart-rate",
      percentage: 10,
    },
  ];

  return (
    <DashboardLayout
      pageTitle="Dashboard"
      subTitle="Monitor operations, agents, alerts, and insights in real time."
      appendElementToHeading={
        <Button
          classes={[ButtonClass.GRADIENT, ButtonClass.WITH_ICON]}
          style={{ height: "2.5rem" }}
          onClick={() => { }}
        >
          <Icon icon="mingcute:ai-fill" width={20} height={20} />
          Ask AI
        </Button>
      }
    >
      <PageContainer>
        <section className="CardsSection">
          {cards.map((card) => {
            const isUp = card.percentage >= 0;

            return (
              <div className="card" key={card.title}>
                <Flex gap="0.5rem" align="center" className="card__title">
                  <Icon icon={card.icon} width={20} height={20} />
                  <span>{card.title}</span>
                </Flex>
                <Flex
                  gap="0.5rem"
                  direction="column"
                  style={{ marginTop: "1.5rem" }}
                >
                  <p className="card__value">{card.value}</p>
                  <p
                    className={`card__percentage card__percentage--${isUp ? "up" : "down"}`}
                  >
                    <Icon
                      icon={
                        isUp
                          ? "iconamoon:arrow-up-2-fill"
                          : "iconamoon:arrow-down-2-fill"
                      }
                      width={16}
                      height={16}
                    />
                    <span>{Math.abs(card.percentage)}%</span>
                  </p>
                </Flex>
              </div>
            );
          })}
        </section>

        <section className="LineChartsSection">
          <DashboardLineChart
            title="Conversation volume"
            subTitle="Today"
            chartValues={conversationTrend}
            chartHeight={260}
          />
        </section>

        <section className="DoughnutChartsSection">
          <DashboardDoughnutChart
            title="Intent breakdown"
            chartValues={resolutionBreakdown}
            chartWidth={260}
            chartHeight={260}
          />
        </section>

        <section className="RecentConversationsSection">
          <DashboardRecentConversationsTable
            conversations={recentConversations}
            onSeeAll={() => { }}
          />
        </section>
      </PageContainer>
    </DashboardLayout>
  );
}
