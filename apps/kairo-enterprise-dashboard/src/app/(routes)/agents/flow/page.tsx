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
import { getOrgId } from "@/lib/auth/client";
import {
  flow,
  unwrapFlowResponse,
  type BackendBankingBackendState,
} from "@/services/Flow";
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
import { useCallback, useEffect, useState } from "react";
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
  const [bankingBackend, setBankingBackend] =
    useState<BackendBankingBackendState | null>(null);
  const [fetchingBankingBackend, setFetchingBankingBackend] = useState(true);
  const [bankingBackendError, setBankingBackendError] = useState<string | null>(
    null,
  );

  const loadBankingBackend = useCallback(() => {
    const orgId = getOrgId();
    const request = orgId
      ? flow.getBankingBackend(orgId)
      : Promise.reject(new Error("Session expired. Please sign in again."));
    return request
      .then((response) => {
        setBankingBackend(
          unwrapFlowResponse<BackendBankingBackendState>(response),
        );
      })
      .catch((error: unknown) => {
        const apiError = error as { error?: unknown; message?: unknown } | null;
        setBankingBackendError(
          typeof apiError?.error === "string"
            ? apiError.error
            : typeof apiError?.message === "string"
              ? apiError.message
              : "Failed to load infrastructure configuration.",
        );
      })
      .finally(() => {
        setFetchingBankingBackend(false);
      });
  }, []);

  const { flowChannels, fetchingFlowChannels } = useEntity(flowStore);

  useEffect(() => {
    fetchFlowChannels().catch(() => {});
    void loadBankingBackend();
  }, [loadBankingBackend]);

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
  const hasConfiguredInfrastructure = bankingBackend?.configured === true;
  const showDashboard =
    hasConnectedChannel &&
    hasConfiguredInfrastructure &&
    (flowSetupCompleted || currentStep === 1);
  const setupStep = currentStep === 1 && hasConnectedChannel ? 3 : currentStep;

  const handleChannelConnected = (id: string) => {
    setConnectedChannelIds((prev) => [...prev, id]);
    fetchFlowChannels().catch(() => {});
  };

  const infrastructures = FALLBACK_INFRASTRUCTURES.map((item) => ({
    ...item,
    isConnected:
      bankingBackend?.configured === true &&
      item.id === bankingBackend.kind.toLowerCase(),
  }));
  const handleInfrastructureConfigured = (
    state: BackendBankingBackendState,
  ) => {
    setBankingBackend(state);
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
                ...(hasConfiguredInfrastructure
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
        {fetchingBankingBackend ||
        (fetchingFlowChannels &&
          currentStep === 1 &&
          connectedChannelIds.length === 0) ? (
          <Flex align="center" justify="center" style={{ height: "10rem" }}>
            <Loading>Loading Flow setup ...</Loading>
          </Flex>
        ) : bankingBackendError ? (
          <Flex direction="column" gap="1rem" align="center">
            <p role="alert">{bankingBackendError}</p>
            <Button
              classes={[ButtonClass.OUTLINED]}
              onClick={() => {
                setFetchingBankingBackend(true);
                setBankingBackendError(null);
                void loadBankingBackend();
              }}
            >
              Retry
            </Button>
          </Flex>
        ) : !showDashboard ? (
          <>
            {setupStep === 1 && (
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
            {setupStep === 2 && (
              <ConnectChannels
                channels={channels}
                onChannelConnected={handleChannelConnected}
                onContinue={() => {
                  if (hasConfiguredInfrastructure) setFlowSetupCompleted(true);
                  else setCurrentStep(3);
                }}
              />
            )}
            {setupStep === 3 && (
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
          <FlowConversationsPage />
        )}
      </FlowPageContainer>
    </DashboardLayout>
  );
}
