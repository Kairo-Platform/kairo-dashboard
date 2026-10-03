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
  Loading,
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

type FlowView = "dashboard" | "add-channel" | "add-infrastructure";

export default function FlowPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [flowSetupCompleted, setFlowSetupCompleted] = useState<boolean>(false);
  const [view, setView] = useState<FlowView>("dashboard");
  const [connectedChannelIds, setConnectedChannelIds] = useState<string[]>([]);
  const [configuredInfrastructureId, setConfiguredInfrastructureId] = useState<
    string | null
  >(null);

  const { flowChannels, fetchingFlowChannels } = useEntity(flowStore);

  useEffect(() => {
    fetchFlowChannels().catch(() => {});
  }, []);

  const channels = FALLBACK_CHANNELS.map((channel) => {
    const backendChannel = flowChannels.find(
      (item) => item.channel?.toUpperCase() === channel.id.toUpperCase(),
    );
    return {
      ...channel,
      isConnected:
        connectedChannelIds.includes(channel.id) ||
        backendChannel?.status === "CONNECTED",
    };
  });
  const hasConnectedChannel = channels.some((channel) => channel.isConnected);
  // A newly connected channel stays in the wizard until the user continues.
  const showDashboard =
    flowSetupCompleted || (currentStep === 1 && hasConnectedChannel);

  const handleChannelConnected = (id: string) => {
    setConnectedChannelIds((prev) => [...prev, id]);
    fetchFlowChannels().catch(() => {});
  };

  const infrastructures = FALLBACK_INFRASTRUCTURES.map((item) => ({
    ...item,
    isConnected: item.id === configuredInfrastructureId,
  }));
  const handleInfrastructureConfigured = (id: string) => {
    setConfiguredInfrastructureId(id);
  };

  const breadcrumbs = [
    {
      title: "Agents",
      onClick: () => router.push(URL.AGENTS_URL),
    },
    {
      title: "Flow",
    },
  ];
  return (
    <DashboardLayout
      pageTitle="Flow"
      subTitle="Streamline your payment processes from start to finish, effortlessly."
      breadcrumbs={breadcrumbs}
      appendElementToHeading={
        showDashboard && (
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
              actions={[
                {
                  title: "Add channel",
                  onClick: () => setView("add-channel"),
                },
                ...(configuredInfrastructureId
                  ? [
                      {
                        title: "Add infrastructure",
                        onClick: () => setView("add-infrastructure"),
                      },
                    ]
                  : []),
                {
                  title: "Send broadcast",
                  onClick: () => {},
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
        {fetchingFlowChannels &&
        currentStep === 1 &&
        connectedChannelIds.length === 0 ? (
          <Flex align="center" justify="center" style={{ height: "10rem" }}>
            <Loading>Loading channels ...</Loading>
          </Flex>
        ) : !showDashboard ? (
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
                        <Icon
                          icon="material-symbols:chevron-right"
                          width={20}
                          height={20}
                        />
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
                onConfigured={handleInfrastructureConfigured}
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
        ) : view === "add-infrastructure" ? (
          <ConnectInfrastructure
            infrastructures={infrastructures}
            variant="standalone"
            onConfigured={handleInfrastructureConfigured}
            onContinue={() => setView("dashboard")}
          />
        ) : (
          <FlowConversationsPage
            needsInfrastructure={!configuredInfrastructureId}
            onConnectInfrastructure={() => setView("add-infrastructure")}
          />
        )}
      </FlowPageContainer>
    </DashboardLayout>
  );
}
