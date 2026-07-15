"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import Image from "next/image";
import {
  applyOAuthSession,
  consumeOAuthReturnTo,
  getOAuthStatusMessage,
  OAUTH_CALLBACK_STATUS,
  parseOAuthCallbackStatus,
  parseOAuthIsNewUser,
} from "@/lib/auth";
import { URL } from "@/lib/constants/URL";
import { getApiData, isApiError, parseApiError } from "@/lib/utils";
import { xApiAuth } from "@/services/xApi";
import { showSuccessNotification } from "@kairo/utils";

const PageContainer = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  position: relative;

  .logo {
    position: absolute;
    top: 2rem;
    left: 2rem;
    width: 10rem;
    height: auto;
    object-fit: contain;
    object-position: left;

    @media (max-width: 768px) {
      left: 50%;
      transform: translateX(-50%);
      width: 8rem;
    }
  }
`;

const Card = styled.div`
  width: min(100%, 420px);
  padding: 2rem;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  text-align: center;

  .title {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .message {
    font-size: 0.95rem;
    color: ${(props) => props.theme.colors.text_02};
  }

  .error {
    color: ${(props) => props.theme.colors.buttonRed};
  }
`;

function redirectToAuthWithStatus(
  router: ReturnType<typeof useRouter>,
  status: typeof OAUTH_CALLBACK_STATUS.DENIED | typeof OAUTH_CALLBACK_STATUS.ERROR,
) {
  const returnTo = consumeOAuthReturnTo(URL.LOGIN_URL);
  router.replace(`${returnTo}?status=${status}`);
}

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Completing OAuth sign-in…");
  const [isError, setIsError] = useState(false);
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    let cancelled = false;

    const finish = async () => {
      const status = parseOAuthCallbackStatus(searchParams.get("status"));
      const code = searchParams.get("code");
      const isNewFromQuery = parseOAuthIsNewUser(searchParams.get("new"));

      if (
        status === OAUTH_CALLBACK_STATUS.DENIED ||
        status === OAUTH_CALLBACK_STATUS.ERROR
      ) {
        const statusMessage = getOAuthStatusMessage(status);
        if (!cancelled) {
          setIsError(true);
          setMessage(statusMessage);
        }
        redirectToAuthWithStatus(router, status);
        return;
      }

      if (status !== OAUTH_CALLBACK_STATUS.SUCCESS || !code) {
        const statusMessage = getOAuthStatusMessage(OAUTH_CALLBACK_STATUS.ERROR);
        if (!cancelled) {
          setIsError(true);
          setMessage(statusMessage);
        }
        redirectToAuthWithStatus(router, OAUTH_CALLBACK_STATUS.ERROR);
        return;
      }

      try {
        if (!cancelled) {
          setMessage("Exchanging sign-in code…");
        }

        const response = await xApiAuth.exchangeOAuthCode(code);

        if (isApiError(response)) {
          throw response;
        }

        const session =
          getApiData<{
            token?: string;
            userId?: string;
            orgId?: string;
            isNewUser?: boolean;
          }>(response) ?? response;

        const token = session?.token;
        const userId = session?.userId;
        const orgId = session?.orgId;
        const isNewUser = session?.isNewUser ?? isNewFromQuery ?? false;

        if (!token || !userId) {
          throw new Error("OAuth exchange did not return a session");
        }

        await applyOAuthSession({ token, userId, orgId });

        if (!cancelled) {
          setMessage(getOAuthStatusMessage(OAUTH_CALLBACK_STATUS.SUCCESS));
          if (isNewUser) {
            showSuccessNotification({
              message: "Welcome to Kairo — your account is ready.",
            });
          }
        }

        // Drop code from the URL before navigating away.
        router.replace(URL.DASHBOARD_URL);
      } catch (error) {
        const statusMessage = parseApiError(
          error,
          getOAuthStatusMessage(OAUTH_CALLBACK_STATUS.ERROR),
        );
        if (!cancelled) {
          setIsError(true);
          setMessage(statusMessage);
        }
        redirectToAuthWithStatus(router, OAUTH_CALLBACK_STATUS.ERROR);
      }
    };

    void finish();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <Card>
      <p className="title">OAuth sign-in</p>
      <p className={`message ${isError ? "error" : ""}`}>{message}</p>
    </Card>
  );
}

export default function OAuthCallbackPage() {
  return (
    <PageContainer>
      <Image
        src="/kairo-assets/kairo-logo.svg"
        alt="Kairo"
        width={100}
        height={100}
        className="logo"
      />
      <Suspense
        fallback={
          <Card>
            <p className="title">OAuth sign-in</p>
            <p className="message">Completing OAuth sign-in…</p>
          </Card>
        }
      >
        <OAuthCallbackContent />
      </Suspense>
    </PageContainer>
  );
}
