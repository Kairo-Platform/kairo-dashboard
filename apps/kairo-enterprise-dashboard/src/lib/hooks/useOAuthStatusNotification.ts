"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { showErrorNotification } from "@kairo/utils";
import {
  getOAuthStatusMessage,
  OAUTH_CALLBACK_STATUS,
  parseOAuthCallbackStatus,
} from "@/lib/auth";

export function useOAuthStatusNotification(cleanPath: string) {
  const router = useRouter();

  useEffect(() => {
    const status = parseOAuthCallbackStatus(
      new URLSearchParams(window.location.search).get("status"),
    );
    if (!status || status === OAUTH_CALLBACK_STATUS.SUCCESS) return;

    showErrorNotification({ message: getOAuthStatusMessage(status) });
    router.replace(cleanPath);
  }, [cleanPath, router]);
}
