"use client";

import {
  FlowConversationSettings,
  NO_CONVERSATION_SETTINGS_CHANGES_ERROR,
  type FlowConversationSettingsHandle,
} from "@/app/components/agents/flow";
import { DashboardLayout } from "@/app/components/dashboard";
import { URL } from "@/lib/constants";
import { parseApiError } from "@/lib/utils/parseApiError";
import { Icon } from "@iconify/react";
import {
  Button,
  ButtonClass,
  ButtonSize,
  ConfirmationModal,
  Flex,
} from "@kairo/ui";
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

  .FlowConversationSettingsPage__headerActions {
    flex-shrink: 0;
  }
`;

export default function FlowConversationsSettingsPage() {
  const router = useRouter();
  const conversationSettingsRef = useRef<FlowConversationSettingsHandle>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

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

    if (!conversationSettingsRef.current.hasUnsavedChanges()) {
      showErrorNotification({
        message: NO_CONVERSATION_SETTINGS_CHANGES_ERROR,
      });
      return;
    }

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

  const handleConfirmClearChanges = () => {
    conversationSettingsRef.current?.discardChanges();
    setShowClearConfirmModal(false);
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
          {hasUnsavedChanges && (
            <Flex
              align="center"
              gap="0.75rem"
              className="FlowConversationSettingsPage__headerActions"
            >
              <Button
                classes={[ButtonClass.ICON_ONLY, ButtonClass.OUTLINED]}
                type="button"
                onClick={() => setShowClearConfirmModal(true)}
                disabled={isSaving}
                aria-label="Clear changes"
              >
                <Icon icon="iconoir:cancel" width={20} height={20} />
              </Button>
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
          )}
        </Flex>
        <FlowConversationSettings
          ref={conversationSettingsRef}
          onUnsavedChangesChange={setHasUnsavedChanges}
        />
      </FlowConversationSettingsPageContainer>

      {showClearConfirmModal && (
        <ConfirmationModal
          title="Clear changes"
          confirmButtonText="Clear changes"
          cancelButtonText="Keep editing"
          confirmButtonClasses={[ButtonClass.SOLID_RED]}
          onClose={() => setShowClearConfirmModal(false)}
          onCancel={() => setShowClearConfirmModal(false)}
          onConfirm={handleConfirmClearChanges}
        >
          <p style={{ textAlign: "center", margin: 0 }}>
            Discard your unsaved conversation settings changes? This cannot be
            undone.
          </p>
        </ConfirmationModal>
      )}
    </DashboardLayout>
  );
}
