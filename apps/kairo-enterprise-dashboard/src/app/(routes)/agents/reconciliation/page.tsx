"use client";

import {
  ReconciliationApiKeySetup,
  ReconciliationAnswerModal,
  ReconciliationResults,
  ReconciliationUpload,
} from "@/app/components/agents/reconciliation";
import { AskKairoAI } from "@/app/components/ask-kairo";
import { useDashboardContext } from "@/app/components/dashboard";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import {
  createOrganizationApiKey,
  applyReconciliationSessionMessage,
  clearReconciliationQuestion,
  fetchOrganizationApiKeys,
  fetchReconciliationResult,
  reconciliationStore,
  resetReconciliation,
  runReconciliation,
  setReconciliationStatus,
} from "@/app/store/reconciliation";
import { URL } from "@/lib/constants";
import { Icon } from "@iconify/react";
import { Button, ButtonClass, Flex, Loading, Tag, TagType } from "@kairo/ui";
import { showErrorNotification } from "@kairo/utils";
import { useEntity } from "simpler-state";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  .Reconciliation__status {
    min-height: 18rem;
    padding: 3rem;
    border: 1px solid ${({ theme }) => theme.colors.gray_03};
    border-radius: 2rem;
    background: ${({ theme }) => theme.colors.ui_07};
    text-align: center;
  }

  .Reconciliation__runId {
    color: ${({ theme }) => theme.colors.text_03};
    font-size: 0.8125rem;
  }
`;

function ReconciliationContent() {
  const state = useEntity(reconciliationStore);
  const { authUser } = useDashboardContext();
  const [apiKey, setApiKey] = useState("");
  const sessionRef = useRef<{ runId: string; sessionId: string } | null>(null);

  useEffect(() => () => resetReconciliation(), []);

  useEffect(() => {
    if (!state.run || state.result || !apiKey) return;

    if (sessionRef.current?.runId !== state.run.runId) {
      sessionRef.current = {
        runId: state.run.runId,
        sessionId: crypto.randomUUID(),
      };
    }
    const sessionId = sessionRef.current.sessionId;

    const controller = new AbortController();
    const successfulStatuses = new Set([
      "completed",
      "complete",
      "succeeded",
      "success",
    ]);
    const terminalStatuses = new Set([
      ...successfulStatuses,
      "failed",
      "cancelled",
      "canceled",
    ]);
    const maxAttempts = 3;

    const connect = async () => {
      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        let completed = false;
        let sessionStarted = false;
        try {
          const response = await fetch("/api/reconciliation/session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Api-Key": apiKey,
            },
            body: JSON.stringify({ wsUrl: state.run!.wsUrl, sessionId }),
            signal: controller.signal,
          });
          if (!response.ok || !response.body)
            throw new Error("Session connection failed");

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          while (!controller.signal.aborted) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              if (!line.trim()) continue;
              const message = JSON.parse(line) as {
                type?: string;
                phase?: string;
                message?: string;
                report?: unknown;
                status?: string;
                discrepancies?: unknown[];
              };
              sessionStarted = true;
              applyReconciliationSessionMessage(message);

              if (message.type === "error") {
                const errorMessage =
                  message.message || "Reconciliation session failed";
                setReconciliationStatus("failed");
                showErrorNotification({ message: errorMessage });
                await reader.cancel();
                return;
              }

              if (message.type === "report" && message.report) {
                completed = true;
                await reader.cancel();
                return;
              }

              const status = message.status?.toLowerCase();
              if (
                message.discrepancies ||
                (status && terminalStatuses.has(status))
              ) {
                completed = true;
                if (
                  !message.discrepancies &&
                  status &&
                  successfulStatuses.has(status)
                ) {
                  await fetchReconciliationResult(
                    state.run!.runId,
                    apiKey,
                    true,
                  );
                }
                await reader.cancel();
                return;
              }
            }
          }
        } catch {
          if (controller.signal.aborted) return;
        }

        if (completed || sessionStarted || controller.signal.aborted) return;
        if (attempt < maxAttempts) {
          setReconciliationStatus(`reconnecting (${attempt}/${maxAttempts})`);
          await new Promise((resolve) =>
            window.setTimeout(resolve, 1000 * attempt),
          );
        }
      }
      setReconciliationStatus("session unavailable");
    };

    void connect();
    return () => {
      controller.abort();
    };
  }, [state.run, state.result, apiKey]);

  const submitAnswer = async (answer: string) => {
    if (!state.question || !sessionRef.current) return;
    try {
      const response = await fetch("/api/reconciliation/session/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify({
          sessionId: sessionRef.current.sessionId,
          questionId: state.question.questionId,
          text: answer,
        }),
      });
      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new Error(error.message || "Failed to send response");
      }
      clearReconciliationQuestion();
      setReconciliationStatus("processing response");
    } catch (error) {
      showErrorNotification({
        message:
          error instanceof Error ? error.message : "Failed to send response",
      });
      throw error;
    }
  };

  return (
    <PageContainer>
      {!apiKey ? (
        <ReconciliationApiKeySetup
          apiKeys={state.apiKeys}
          loading={state.fetchingApiKeys || state.creatingApiKey}
          onLoadExisting={fetchOrganizationApiKeys}
          onGenerate={() => {
            const orgName = authUser?.organizations?.[0]?.name || "Kairo";
            return createOrganizationApiKey(`${orgName} reconciliation`);
          }}
          onContinue={setApiKey}
        />
      ) : !state.run ? (
        <ReconciliationUpload
          loading={state.running}
          onSubmit={(files) => runReconciliation(files, apiKey)}
        />
      ) : state.result ? (
        <ReconciliationResults result={state.result} />
      ) : (
        <Flex
          className="Reconciliation__status"
          direction="column"
          align="center"
          justify="center"
          gap="1rem"
        >
          <Loading>Reconciling transaction sources...</Loading>
          <Tag type={TagType.YELLOW}>{state.status}</Tag>
          <p className="Reconciliation__runId">Run ID: {state.run.runId}</p>
        </Flex>
      )}
      {state.question && (
        <ReconciliationAnswerModal
          question={state.question.message}
          onSubmit={submitAnswer}
        />
      )}
    </PageContainer>
  );
}

function ReconciliationHeadingActions() {
  const { result } = useEntity(reconciliationStore);

  return (
    <Flex align="center" gap="1rem">
      {result && (
        <>
          <Button
            classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
            onClick={resetReconciliation}
          >
            <Icon
              icon="material-symbols:refresh-rounded"
              width={18}
              height={18}
            />
            New reconciliation
          </Button>
          {/* <ActionMenu actions={[]} positions={["bottom"]}>
            <Button
              classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
              size={ButtonSize.WIDTH_140}
            >
              More actions
              <Icon icon="mi:chevron-down" width={16} height={16} />
            </Button>
          </ActionMenu> */}
        </>
      )}
      <AskKairoAI iconOnly />
    </Flex>
  );
}

export default function ReconciliationPage() {
  const router = useRouter();
  const breadcrumbs = [
    { title: "Agents", onClick: () => router.push(URL.AGENTS_URL) },
    { title: "Reconciliation" },
  ];

  return (
    <DashboardLayout
      pageTitle="Reconciliation"
      subTitle="Match and resolve transactions across connected systems."
      breadcrumbs={breadcrumbs}
      appendElementToHeading={<ReconciliationHeadingActions />}
    >
      <ReconciliationContent />
    </DashboardLayout>
  );
}
