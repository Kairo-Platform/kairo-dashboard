"use client";

import { FlowConversationsPage } from "@/app/components/agents/flow";
import ConnectChannels from "@/app/components/agents/flow/ConnectChannels";
import ConnectInfrastructure from "@/app/components/agents/flow/ConnectInfrastructure";
import {
  FALLBACK_CHANNELS,
  FALLBACK_INFRASTRUCTURES,
} from "@/app/components/agents/flow/resources";
import { AskKairoAI } from "@/app/components/ask-kairo";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import { URL } from "@/lib/constants";
import { fetchFlowChannels, flowStore } from "@/app/store/flow";
import { useEntity } from "simpler-state";
import { Icon } from "@iconify/react";
import {
  ActionMenu,
  Button,
  ButtonClass,
  ButtonSize,
  EmptyState,
  Flex,
  Loading
} from "@kairo/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

const FlowPageContainer = styled.div`
  margin-top: 3rem;

  .EmptyState_container {
    background-color: ${({ theme }) => theme.colors.ui_01};
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
    border-radius: 2rem;
    
    @media (min-width: ${({ theme }) => theme.breakpoint.xl}) {
      max-width: 30rem;
      width: 100%;

      > div {
        margin-block: 1rem !important;
      }
    }
  }
`;

type FlowView = "dashboard" | "add-channel";

export default function FlowPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [flowSetupCompleted, setFlowSetupCompleted] = useState<boolean>(false);
  const [view, setView] = useState<FlowView>("dashboard");
  const [channels, setChannels] = useState(FALLBACK_CHANNELS);

  const { flowChannels, fetchingFlowChannels } = useEntity(flowStore);

  useEffect(() => {
    fetchFlowChannels().catch(() => { });
  }, []);

  useEffect(() => {
    if (!Array.isArray(flowChannels) || flowChannels.length === 0) return;

    const mapped = FALLBACK_CHANNELS.map((fc) => {
      const match = flowChannels.find(
        (bc) => bc.channel?.toUpperCase() === fc.id.toUpperCase(),
      );
      return match ? { ...fc, isConnected: match.status === "CONNECTED" } : fc;
    });
    setChannels(mapped);

    if (mapped.some((c) => c.isConnected)) {
      setFlowSetupCompleted(true);
    }
  }, [flowChannels]);

  const handleChannelConnected = (id: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isConnected: true } : c)),
    );
    fetchFlowChannels().catch(() => { });
  };

  const infrastructures = FALLBACK_INFRASTRUCTURES.map((item) =>
    item.id === "orange" ? { ...item, isConnected: true } : item,
  );

  const breadcrumbs = [
    {
      title: "Agents",
      onClick: () => router.push(URL.AGENTS_URL)
    },
    {
      title: "Flow",
    }
  ];
  return (
    <DashboardLayout
      pageTitle="Flow"
      subTitle="Streamline your payment processes from start to finish, effortlessly."
      breadcrumbs={breadcrumbs}
      appendElementToHeading={
        flowSetupCompleted && (
          <Flex align="center" gap="1rem">
            <Button
              classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
              onClick={() => router.push(URL.AGENTS_FLOW_SETTINGS_URL)}
            >
              <Icon icon="solar:settings-line-duotone" width={16} height={16} />
              Settings
            </Button>
            <ActionMenu
              children={
                <Button
                  classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
                  size={ButtonSize.WIDTH_140}
                >
                  More actions
                  <Icon icon="mi:chevron-down" width={16} height={16} />
                </Button>
              }
              actions={[{
                title: "Add channel",
                onClick: () => setView("add-channel"),
              },
              {
                title: "Send broadcast",
                onClick: () => {
                },
              },
              ]}
              positions={["bottom"]}
            />
            <AskKairoAI iconOnly />
          </Flex>
        )
      }
    >
      <FlowPageContainer>
        {fetchingFlowChannels ? (
          <Flex align="center" justify="center" style={{ height: "10rem" }}>
            <Loading>Loading channels ...</Loading>
          </Flex>
        ) : !flowSetupCompleted ? (
          <>
            {currentStep === 1 && (
              <Flex align="center" justify="center" style={{ height: "100%" }}>
                <div className="EmptyState_container">
                  <EmptyState
                    title="Welcome to Flow"
                    message="Flow will respond to your requests across any channel you connect."
                    icon={<Icon icon="hugeicons:flow" width={40} height={40} />}
                    children={
                      <Button
                        classes={[ButtonClass.SOLID, ButtonClass.WITH_ICON]}
                        onClick={() => setCurrentStep(2)}
                      >
                        Begin setup
                        <Icon icon="material-symbols:chevron-right" width={20} height={20} />
                      </Button>
                    }
                  />
                </div>
              </Flex>
            )}
            {currentStep === 2 && (
              <ConnectChannels
                channels={channels}
                onChannelConnected={handleChannelConnected}
                onContinue={() => setCurrentStep(3)}
              />
            )}
            {currentStep === 3 && (
              <ConnectInfrastructure
                infrastructures={infrastructures}
                onContinue={() => setFlowSetupCompleted(true)}
              />
            )}
          </>
        ) : view === "add-channel" ? (
          <ConnectChannels
            channels={channels}
            variant="standalone"
            onBack={() => setView("dashboard")}
            onChannelConnected={handleChannelConnected}
          />
        ) : (
          <FlowConversationsPage />
        )}
      </FlowPageContainer>
    </DashboardLayout>
  );
}
