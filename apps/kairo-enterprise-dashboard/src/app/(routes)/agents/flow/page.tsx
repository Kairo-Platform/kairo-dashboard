"use client";

import { FlowConversationsPage } from "@/app/components/agents/flow";
import ConnectChannels from "@/app/components/agents/flow/ConnectChannels";
import ConnectInfrastructure from "@/app/components/agents/flow/ConnectInfrastructure";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import { URL } from "@/lib/constants";
import { Icon } from "@iconify/react";
import { ICONS } from "@kairo/lib/utils";
import { ActionMenu, Button, ButtonClass, ButtonSize, EmptyState, Flex } from "@kairo/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled, { useTheme } from "styled-components";

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

export default function FlowPage() {
  const router = useRouter();
  const theme = useTheme();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [flowSetupCompleted, setFlowSetupCompleted] = useState<boolean>(false)

  const dummyChannels = [
    { id: "whatsapp", name: "WhatsApp", icon: ICONS.WHATSAPP, isConnected: false },
    { id: "telegram", name: "Telegram", icon: ICONS.TELEGRAM, isConnected: false },
    { id: "instagram", name: "Instagram", icon: ICONS.INSTAGRAM, isConnected: false },
    { id: "twitter", name: "X/Twitter", icon: ICONS.TWITTER, isConnected: false },
  ];

  const dummyInfrastructures = [
    {
      id: "orange",
      name: "Orange",
      description: "Payment system",
      isConnected: false,
    },
  ];

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
        !flowSetupCompleted ? (
          <Button
            classes={[ButtonClass.GRADIENT, ButtonClass.ICON_ONLY]}
            style={{ padding: "0.5rem" }}
            onClick={() => { }}
          >
            <Icon icon="mingcute:ai-fill" style={{ color: theme.colors.white }} width={20} height={20} />
          </Button>
        ) : (
          <Flex align="center" gap="1rem">
            <Button
              classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
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
                onClick: () => {
                },
              },
              {
                title: "Send broadcast",
                onClick: () => {
                },
              },
              ]}
              positions={["bottom"]}
            />
          </Flex>
        )
      }
    >
      <FlowPageContainer>
        {!flowSetupCompleted ? (
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
                channels={dummyChannels}
                onContinue={() => setCurrentStep(3)}
              />
            )}
            {currentStep === 3 && (
              <ConnectInfrastructure
                infrastructures={dummyInfrastructures}
                onContinue={() => setFlowSetupCompleted(true)}
              />
            )}
          </>
        ) : (
          <FlowConversationsPage />
        )}
      </FlowPageContainer>
    </DashboardLayout>
  );
}
