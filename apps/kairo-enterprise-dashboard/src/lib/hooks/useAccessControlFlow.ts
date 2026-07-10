"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@kairo/utils";
import { xApiAuth } from "@/services/xApi";
import { USER_STATUS } from "@/lib/constants/USER_STATUS";
import { getApiData, parseApiError } from "@/lib/utils";

export interface UseAccessControlFlowOptions {
  forEntity?: boolean;
  sessionData: any;
  setSessionData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  onComplete: (params: { user: any; gat?: string; responseData: any }) => void;
  blockedStatuses?: string[];
  stageSuccessMessage?: string;
  pendingSuccessMessage?: string;
}

export function useAccessControlFlow({
  sessionData,
  setSessionData,
  setLoading,
  onComplete,
  blockedStatuses = [USER_STATUS.SUSPENDED, USER_STATUS.INVITED],
  stageSuccessMessage = "Stage completed successfully",
}: UseAccessControlFlowOptions) {
  const sessionId: string | undefined = sessionData?.sessionId;
  const previousStageRef = useRef<string | null>(null);
  const [loadingPrevStage, setLoadingPrevStage] = useState(false);

  const service = useMemo(() => xApiAuth, []);

  const handleStageSubmit = useCallback(
    async (_stage: string, data: any) => {
      if (!sessionId) return;

      setLoading(true);
      try {
        const response: any = await service.processFlowStage({
          sessionId,
          data: data ?? null,
        });

        if (
          response.statusCode === 406 &&
          response.data &&
          typeof response.data === "object"
        ) {
          const fieldMessages = Object.entries(response.data || {}).map(
            ([key, value]) => `${key}: ${value}`,
          );
          const combined = `${response.message || "Input Validation Error"} - ${fieldMessages.join("; ")}`;
          throw new Error(combined);
        }

        if (response.statusCode !== 200 || response.errCode) throw response;

        const responseData = getApiData(response) ?? response.data ?? response;
        previousStageRef.current = responseData?.previousStage ?? null;

        if (responseData?.isComplete) {
          if (responseData?.authPayload) {
            const { gat, user } = responseData.authPayload;
            const userStatus = user?.status?.toUpperCase();

            if (blockedStatuses.includes(userStatus)) {
              const statusMessages: Record<string, string> = {
                SUSPENDED:
                  "Your account has been suspended. Please contact support.",
                INVITED:
                  "Your account has not been activated yet. Please complete your registration.",
              };
              showErrorNotification({
                message:
                  statusMessages[userStatus] ??
                  "Your account is not authorized to login. Please contact support.",
              });
              return;
            }

            onComplete({ user, gat, responseData });
            return;
          }

          onComplete({
            user: null,
            gat: undefined,
            responseData,
          });
          return;
        }

        const sessionResponse: any = await service.retrieveCurrentFlowSession({
          sessionId,
        });

        if (sessionResponse.statusCode !== 200 || sessionResponse.errCode) {
          throw sessionResponse;
        }

        const session = getApiData(sessionResponse);
        if (session) {
          setSessionData(session);
          showSuccessNotification({ message: stageSuccessMessage });
        }
      } catch (error) {
        showErrorNotification({
          message: parseApiError(error, "Failed to process stage"),
        });
      } finally {
        setLoading(false);
      }
    },
    [
      sessionId,
      service,
      setLoading,
      setSessionData,
      onComplete,
      blockedStatuses,
      stageSuccessMessage,
    ],
  );

  const handleResendOtp = useCallback(async () => {
    if (!sessionId) return;

    setLoading(true);
    try {
      const response: any = await service.resendVerificationCode({ sessionId });
      if (response.statusCode !== 200 || response.errCode) throw response;
      showSuccessNotification({ message: "OTP resent successfully" });
    } catch (error) {
      showErrorNotification({
        message: parseApiError(error, "Failed to resend OTP"),
      });
    } finally {
      setLoading(false);
    }
  }, [sessionId, service, setLoading]);

  const handleNavigateToPrevStage = useCallback(async () => {
    const targetStage = previousStageRef.current;
    if (!sessionId || !targetStage) return;

    setLoadingPrevStage(true);
    try {
      const response: any = await service.navigateFlowStage({
        sessionId,
        data: { targetStage },
      });
      if (response.statusCode !== 200 || response.errCode) throw response;

      const data = getApiData<{ previousStage?: string | null }>(response);
      if (data) {
        setSessionData((prev: any) => ({ ...prev, ...data }));
        previousStageRef.current = data.previousStage ?? null;
      }
    } catch (error) {
      showErrorNotification({
        message: parseApiError(error, "Failed to navigate to previous stage"),
      });
    } finally {
      setLoadingPrevStage(false);
    }
  }, [sessionId, service, setSessionData]);

  return {
    handleStageSubmit,
    handleResendOtp,
    handleNavigateToPrevStage,
    loadingPrevStage,
  };
}
