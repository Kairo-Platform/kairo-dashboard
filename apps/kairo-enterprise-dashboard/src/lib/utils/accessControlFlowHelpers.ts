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
    (stage: { type?: string }) => stage.type === currentStage,
  );

  return { current: currentStageIndex + 1, total: stages.length };
}
