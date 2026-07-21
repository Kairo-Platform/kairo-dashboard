"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Button, ButtonClass, ButtonSize, Flex } from "@/app/components/ui";
import { FormInput } from "@/app/components/ui/inputs";
import { applyLoginSession } from "@/lib/auth";
import { xApiAuth } from "@/services/xApi";
import { URL } from "@/lib/constants/URL";
import { useGoogleOAuth, useOAuthStatusNotification } from "@/lib/hooks";
import {
  type LoginWithEmailAndPasswordFieldErrors,
  validateLoginWithEmailAndPassword,
} from "@kairo/utils";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { parseApiError } from "@/lib/utils";
import { showErrorNotification } from "@kairo/utils";
import { useDarkMode } from "@/app/providers/DarkModeProvider";

const PageContainer = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  position: relative;
  background-color: ${(props) => props.theme.colors.bgColor};

  .logo {
    position: absolute;
    top: 2rem;
    left: 2rem;
    width: 10rem;
    height: auto;
    object-fit: contain;
    object-position: left;
    z-index: 100;

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
  background: ${(props) => props.theme.colors.ui_07};
  border: 1px solid ${(props) => props.theme.colors.dividerColor};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

  .title {
    font-size: 2rem;
    font-weight: 500;
    color: ${(props) => props.theme.colors.text_01};
  }

  .subtitle {
    font-size: 1rem;
    font-weight: 500;
    color: ${(props) => props.theme.colors.text_02};
  }

  .account-prompt {
    text-align: center;
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.text_02};
  }

  .oauth-error {
    margin: 0;
    text-align: center;
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.buttonRed};
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  color: ${(props) => props.theme.colors.text_02};
  font-size: 0.875rem;
  font-weight: 500;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: ${(props) => props.theme.colors.dividerColor};
  }
`;

export default function EnterpriseLoginPage() {
  const router = useRouter();
  const { darkModeEnabled } = useDarkMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] =
    useState<LoginWithEmailAndPasswordFieldErrors>({});
  const { oauthLoading, oauthError, startGoogleOAuth } = useGoogleOAuth(
    URL.LOGIN_URL,
  );
  useOAuthStatusNotification(URL.LOGIN_URL);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const validation = validateLoginWithEmailAndPassword({ email, password });
    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const response = (await xApiAuth.login({
        email: validation.data.email,
        password: validation.data.password,
      })) as Record<string, any>;

      if (response?.statusCode && response.statusCode !== 200) {
        throw response;
      }

      const applied = await applyLoginSession(response);
      if (!applied) {
        throw new Error("Login did not return a session");
      }

      router.replace(URL.DASHBOARD_URL);
    } catch (error) {
      showErrorNotification({ message: parseApiError(error, "Sign in failed. Check your credentials.") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Image
        src={
          darkModeEnabled
            ? "/kairo-assets/kairo-logo-white.svg"
            : "/kairo-assets/kairo-logo.svg"
        }
        alt="Kairo"
        width={100}
        height={100}
        className="logo"
      />

      <Card>
        <Flex
          direction="column"
          align="center"
          justify="center"
          gap="0.3rem"
          style={{ marginBottom: "2rem" }}
        >
          <h1 className="title">Login</h1>
          <p className="subtitle">Log in to your Kairo dashboard.</p>
        </Flex>

        <form onSubmit={handleSubmit} noValidate>
          <Flex direction="column" gap="1.5rem">
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setFieldErrors((current) => ({ ...current, email: undefined }));
              }}
              message={
                fieldErrors.email
                  ? { type: "error", content: fieldErrors.email }
                  : undefined
              }
            />

            <FormInput
              label="Password"
              name="password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setFieldErrors((current) => ({
                  ...current,
                  password: undefined,
                }));
              }}
              message={
                fieldErrors.password
                  ? { type: "error", content: fieldErrors.password }
                  : undefined
              }
            />

            <Button
              type="submit"
              classes={[ButtonClass.SOLID]}
              size={ButtonSize.FULL}
              disabled={loading || oauthLoading}
              loading={loading}
              style={{ borderRadius: "0.765rem", marginTop: "1rem" }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <p className="account-prompt">
              Don&apos;t have an account?{" "}
              <Button
                type="button"
                classes={[ButtonClass.TEXT_ONLY, ButtonClass.PADDING_0]}
                disabled={loading || oauthLoading}
                onClick={() => router.push(URL.SIGNUP_URL)}
              >
                Sign up instead
              </Button>
            </p>

            <OrDivider>Or</OrDivider>

            <Button
              type="button"
              classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
              size={ButtonSize.FULL}
              disabled={loading || oauthLoading}
              loading={oauthLoading}
              style={{ borderRadius: "0.765rem" }}
              onClick={() => void startGoogleOAuth()}
            >
              <Icon icon="material-icon-theme:google" width={20} height={20} />
              Continue with Google
            </Button>

            {oauthError ? <p className="oauth-error">{oauthError}</p> : null}
          </Flex>
        </form>
      </Card>
    </PageContainer>
  );
}
