"use client";

import {
  FlowConversationSettings,
  type FlowConversationSettingsHandle,
} from "@/app/components/agents/flow";
import { DashboardLayout } from "@/app/components/dashboard";
import { URL } from "@/lib/constants";
import { parseApiError } from "@/lib/utils/parseApiError";
import { Button, ButtonClass, ButtonSize, Flex } from "@kairo/ui";
import { showErrorNotification, showSuccessNotification } from "@kairo/utils";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import styled from "styled-components";

const FlowConversationSettingsPageContainer = styled.div`
  .FlowConversationSettingsPage__intro {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    padding-bottom: 1.875rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray_02};

    h2 {
      font-size: 1.75rem;
      font-weight: 500;
      line-height: 2.25rem;
      color: ${({ theme }) => theme.colors.text_01};
    }

    p {
      font-size: 1.125rem;
      font-weight: 500;
      line-height: 1.75rem;
      color: ${({ theme }) => theme.colors.text_02};
    }
  }
`;

export default function FlowConversationsSettingsPage() {
  const router = useRouter();
  const conversationSettingsRef = useRef<FlowConversationSettingsHandle>(null);
  const [isSaving, setIsSaving] = useState(false);

  const breadcrumbs = [
    {
      title: "Agents",
      onClick: () => router.push(URL.AGENTS_URL),
    },
    {
      title: "Flow",
      onClick: () => router.push(URL.AGENTS_FLOW_URL),
    },
    {
      title: "Settings",
      onClick: () => router.push(URL.AGENTS_FLOW_SETTINGS_URL),
    },
    {
      title: "Conversations settings",
    },
  ];

  const handleSaveSettings = async () => {
    if (!conversationSettingsRef.current || isSaving) return;

    setIsSaving(true);
    try {
      await conversationSettingsRef.current.save();
      showSuccessNotification({ message: "Settings saved" });
    } catch (error) {
      showErrorNotification({
        message: parseApiError(error, "Failed to save settings"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout pageTitle="" breadcrumbs={breadcrumbs}>
      <FlowConversationSettingsPageContainer>
        <Flex
          align="flex-start"
          justify="space-between"
          gap="1.5rem"
          className="FlowConversationSettingsPage__intro"
        >
          <div>
            <h2>Conversation settings</h2>
            <p>Configure how Flow communicates with your users</p>
          </div>
          <Button
            classes={[ButtonClass.SOLID]}
            size={ButtonSize.WIDTH_140}
            type="button"
            onClick={handleSaveSettings}
            loading={isSaving}
            disabled={isSaving}
          >
            Save settings
          </Button>
        </Flex>
        <FlowConversationSettings ref={conversationSettingsRef} />
      </FlowConversationSettingsPageContainer>
    </DashboardLayout>
  );
}
