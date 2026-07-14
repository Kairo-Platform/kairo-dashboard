"use client";

import { useCallback, useState } from "react";
import { setOAuthReturnTo } from "@/lib/auth";
import { xApiAuth } from "@/services/xApi";
import { parseApiError } from "@/lib/utils";

export function useGoogleOAuth(returnTo?: string) {
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const startGoogleOAuth = useCallback(async () => {
    setOauthError(null);
    setOauthLoading(true);

    if (returnTo) {
      setOAuthReturnTo(returnTo);
    }

    try {
      await xApiAuth.startGoogleOAuth();
    } catch (error) {
      setOauthError(
        parseApiError(error, "Failed to start Google sign-in. Try again."),
      );
      setOauthLoading(false);
    }
  }, [returnTo]);

  return {
    oauthLoading,
    oauthError,
    startGoogleOAuth,
    clearOauthError: () => setOauthError(null),
  };
}
