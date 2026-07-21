"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import Image from "next/image";
import { Loading } from "@/app/components/ui";
import {
  applyOAuthSession,
  consumeOAuthReturnTo,
  OAUTH_CALLBACK_STATUS,
  parseOAuthCallbackStatus,
  parseOAuthIsNewUser,
} from "@/lib/auth";
import { URL } from "@/lib/constants/URL";
import { getApiData, isApiError } from "@/lib/utils";
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
        redirectToAuthWithStatus(router, status);
        return;
      }

      if (status !== OAUTH_CALLBACK_STATUS.SUCCESS || !code) {
        redirectToAuthWithStatus(router, OAUTH_CALLBACK_STATUS.ERROR);
        return;
      }

      try {
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

        if (!cancelled && isNewUser) {
          showSuccessNotification({
            message: "Welcome to Kairo! Your account is ready.",
          });
        }

        // Drop code from the URL before navigating away.
        router.replace(URL.DASHBOARD_URL);
      } catch {
        redirectToAuthWithStatus(router, OAUTH_CALLBACK_STATUS.ERROR);
      }
    };

    void finish();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return <Loading />;
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
      <Suspense fallback={<Loading />}>
        <OAuthCallbackContent />
      </Suspense>
    </PageContainer>
  );
}
