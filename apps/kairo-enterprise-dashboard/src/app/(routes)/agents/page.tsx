"use client";

import { DashboardLayout } from "@/app/components/dashboard";
import { Button, ButtonClass, Flex, Tag, TagType } from "@kairo/ui";
import { Icon } from "@iconify/react";
import { styled } from "styled-components";
import Link from "next/link";
import { URL } from "@/lib/constants";

const AgentsPageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(15rem, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: ${(props) => props.theme.breakpoint.xl}) {
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  }

  .Agent_type_card {
    padding: 2rem;
    border: 1px solid ${(props) => props.theme.colors.gray_02};
    border-radius: 2rem;
    cursor: pointer;
    transition: all 0.3s ease-out;

    &:hover,
    &:focus {
      border: 1px solid ${(props) => props.theme.colors.primaryColor};
      scale: 1.02;
    }

    &__info {
      margin-top: 3rem;

      &__description {
        color: ${(props) => props.theme.colors.text_02};
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.5;
      }
    }
  }
`

export default function AgentsPage() {
  const agents = [
    {
      title: "Reconciliation",
      slug: "Core",
      description: "Automatically match and verify your transactions with zero discrepancies.",
      icon: "material-symbols:folder-match-outline",
      url: URL.AGENTS_RECONCILIATION_URL,
    },
    {
      title: "Support",
      description: "Resolve customer issues faster with smart, centralized assistance.",
      icon: "streamline:customer-support-1-remix",
      url: URL.AGENTS_SUPPORT_URL,
    },
    {
      title: "Fraud",
      description: "Detect and stop suspicious activity before it impacts your business.",
      icon: "grommet-icons:technology",
      url: URL.AGENTS_FRAUD_URL,
    },
    {
      title: "Risk",
      description: "Stay ahead of threats with real-time risk monitoring and control.",
      icon: "material-symbols:warning-outline-rounded",
      url: URL.AGENTS_RISK_URL,
    },
    {
      title: "Relay",
      description: "Seamlessly connect and route data across your entire ecosystem.",
      icon: "fluent:flow-dot-16-regular",
      url: URL.AGENTS_RELAY_URL,
    },
    {
      title: "Insights",
      description: "Turn your data into clear, actionable intelligence that drives decisions.",
      icon: "si:insights-fill",
      url: URL.AGENTS_INSIGHTS_URL,
    },
    {
      title: "Flow",
      description: "Streamline your payment processes from start to finish, effortlessly.",
      icon: "hugeicons:flow",
      url: URL.AGENTS_FLOW_URL,
    },
  ]
  return (
    <DashboardLayout
      pageTitle="Agents"
      subTitle="Manage all agents, their activity and performance."
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
      <AgentsPageContainer>
        {agents.map((agent) => (
          <Link href={agent.url} className="Agent_type_card">
            <Flex align="center" className="Agent_type_card__icon">
              <Icon icon={agent.icon} width={20} height={20} />
              {agent.slug && (<Tag type={TagType.YELLOW_DARK}>{agent.slug}</Tag>)}
            </Flex>
            <Flex
              direction="column"
              gap="0.5rem"
              className="Agent_type_card__info"
            >
              <h3 className="Agent_type_card__info__title">{agent.title}</h3>
              <p className="Agent_type_card__info__description">
                {agent.description}
              </p>
            </Flex>
          </Link>
        ))}
      </AgentsPageContainer>
    </DashboardLayout>
  )
}