import humanize from "underscore.string/humanize";
import { setAuthUser } from "@/app/store/auth";
import AuthUtils from "@/app/lib/utils/AuthUtils";

export function computeStepInfo(sessionData: any): {
  current: number;
  total: number;
} {
  const progress = sessionData?.progress;

  if (
    progress &&
    typeof progress === "object" &&
    typeof progress.currentStepCount === "number" &&
    typeof progress.totalStepCount === "number"
  ) {
    return {
      current: progress.currentStepCount,
      total: progress.totalStepCount,
    };
  }

  if (
    progress &&
    typeof progress.current === "number" &&
    typeof progress.total === "number"
  ) {
    return { current: progress.current, total: progress.total };
  }

  const stages =
    sessionData?.accessControl?.stages || sessionData?.stages || [];
  const currentStage = sessionData?.currentStage || "";
  const currentStageIndex = stages.findIndex(
    (s: any) => s.type === currentStage,
  );
  return { current: currentStageIndex + 1, total: stages.length };
}

export function applyAuthPayload(user: any, gat?: string): void {
  if (gat) AuthUtils.setAuthToken(gat);
  if (user?.id) {
    setAuthUser(user);
    AuthUtils.setUserId(user.id);
    AuthUtils.setUserType(user.type || user.userType);
  }
}
