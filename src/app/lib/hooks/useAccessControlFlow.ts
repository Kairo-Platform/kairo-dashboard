"use client";

import { useCallback, useMemo, useRef, useState } from "react";
// import { auth as xApiAuth } from "@/services/UserServiceX-Api";
// import { backOfficeAuthService } from "@/services/UserServiceBackOffice";
import {
  parseApiError,
  showErrorNotification,
  showSuccessNotification,
} from "@/app/lib/utils";
import { USER_STATUS } from "../shared-constants";

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
  forEntity = false,
  sessionData,
  setSessionData,
  setLoading,
  onComplete,
  blockedStatuses = [USER_STATUS.SUSPENDED, USER_STATUS.INVITED],
  stageSuccessMessage = "Stage completed successfully",
  pendingSuccessMessage = "Process completed successfully",
}: UseAccessControlFlowOptions) {
  const sessionId: string | undefined = sessionData?.sessionId;
  const previousStageRef = useRef<string | null>(null);
  const [loadingPrevStage, setLoadingPrevStage] = useState(false);

  // const service = useMemo(
  //   () => (forEntity ? xApiAuth : backOfficeAuthService),
  //   [forEntity],
  // );

  const handleStageSubmit = useCallback(
    async (_stage: string, data: any) => {
      if (!sessionId) return;

      setLoading(true);
      // try {
      //   const response = await service.processFlowStage({
      //     sessionId,
      //     data: data ?? null,
      //   });

      //   if (
      //     response.statusCode === 406 &&
      //     response.data &&
      //     typeof response.data === "object"
      //   ) {
      //     const fieldMessages = Object.entries(response.data || {}).map(
      //       ([k, v]) => `${k}: ${v}`,
      //     );
      //     const combined = `${response.message || "Input Validation Error"} - ${fieldMessages.join("; ")}`;
      //     throw new Error(combined);
      //   }

      //   if (response.statusCode !== 200 || response.errCode) throw response;

      //   previousStageRef.current = response.data.previousStage ?? null;

      //   if (response.data?.isComplete) {
      //     if (response.data?.authPayload) {
      //       const { gat, user } = response.data.authPayload;
      //       const userStatus = user?.status?.toUpperCase();

      //       if (blockedStatuses) {
      //         if (blockedStatuses.includes(userStatus)) {
      //           const statusMessages: Record<string, string> = {
      //             SUSPENDED:
      //               "Your account has been suspended. Please contact support.",
      //             INVITED:
      //               "Your account has not been activated yet. Please complete your registration.",
      //           };
      //           showErrorNotification({
      //             message:
      //               statusMessages[userStatus] ??
      //               "Your account is not authorized to login. Please contact support.",
      //           });
      //           return;
      //         }
      //         onComplete({ user, gat, responseData: response.data });
      //         return;
      //       }

      //       setSessionData(response.data);
      //       showSuccessNotification({ message: pendingSuccessMessage });
      //       return;
      //     }

      //     // Admin / onboarding flows complete without an authPayload
      //     onComplete({
      //       user: null,
      //       gat: undefined,
      //       responseData: response.data,
      //     });
      //     return;
      //   }

      //   const sessionResponse = await service.retrieveCurrentFlowSession({
      //     sessionId,
      //   });

      //   if (sessionResponse.statusCode !== 200 || sessionResponse.errCode) {
      //     throw sessionResponse;
      //   }

      //   if (sessionResponse.data) {
      //     setSessionData(sessionResponse.data);
      //     showSuccessNotification({ message: stageSuccessMessage });
      //   }
      // } catch (error) {
      //   showErrorNotification({
      //     message: parseApiError(error, "Failed to process stage"),
      //   });
      // } finally {
      //   setLoading(false);
      // }
    },
    [
      sessionId,
      setLoading,
      setSessionData,
      onComplete,
      blockedStatuses,
      stageSuccessMessage,
      pendingSuccessMessage,
    ],
  );

  const handleResendOtp = useCallback(async () => {
    if (!sessionId) return;

    setLoading(true);
    try {
      // const response = await service.resendVerificationCode({ sessionId });
      // if (response.statusCode !== 200 || response.errCode) throw response;
      showSuccessNotification({ message: "OTP resent successfully" });
    } catch (error) {
      showErrorNotification({
        message: parseApiError(error, "Failed to resend OTP"),
      });
    } finally {
      setLoading(false);
    }
  }, [sessionId, setLoading]);

  const handleNavigateToPrevStage = useCallback(async () => {
    const targetStage = previousStageRef.current;
    if (!sessionId || !targetStage) return;

    setLoadingPrevStage(true);
    try {
      // const response = await service.navigateFlowStage({
      //   sessionId,
      //   data: { targetStage },
      // });
      // if (response.statusCode !== 200 || response.errCode) throw response;
      // if (response.data) {
      //   setSessionData((prev: any) => ({ ...prev, ...response.data }));
      //   previousStageRef.current = response.data.previousStage ?? null;
      // }
    } catch (error) {
      showErrorNotification({
        message: parseApiError(error, "Failed to navigate to previous stage"),
      });
    } finally {
      setLoadingPrevStage(false);
    }
  }, [sessionId, setSessionData]);

  return {
    handleStageSubmit,
    handleResendOtp,
    handleNavigateToPrevStage,
    loadingPrevStage,
  };
}
