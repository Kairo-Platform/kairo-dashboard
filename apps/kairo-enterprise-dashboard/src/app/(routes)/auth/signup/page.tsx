"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Button, ButtonClass, ButtonSize, Flex } from "@/app/components/ui";
import { FormInput } from "@/app/components/ui/inputs";
import { applyAuthPayload } from "@/lib/auth";
import { xApiAuth } from "@/services/xApi";
import { URL } from "@/lib/constants/URL";
import { useGoogleOAuth, useOAuthStatusNotification } from "@/lib/hooks";
import {
  showErrorNotification,
  type SignupWithEmailAndPasswordFieldErrors,
  validateSignupWithEmailAndPassword,
} from "@kairo/utils";
import { parseApiError } from "@/lib/utils";

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
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

  .title {
    font-size: 2rem;
    font-weight: 500;
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

export default function EnterpriseSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] =
    useState<SignupWithEmailAndPasswordFieldErrors>({});
  const { oauthLoading, oauthError, startGoogleOAuth } = useGoogleOAuth(
    URL.SIGNUP_URL,
  );
  useOAuthStatusNotification(URL.SIGNUP_URL);

  const clearFieldError = (field: keyof SignupWithEmailAndPasswordFieldErrors) =>
    setFieldErrors((current) => ({ ...current, [field]: undefined }));

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const validation = validateSignupWithEmailAndPassword({
      name,
      orgName,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const response = (await xApiAuth.signup({
        name: validation.data.name,
        orgName: validation.data.orgName,
        email: validation.data.email,
        password: validation.data.password,
      })) as Record<string, any>;

      if (response?.statusCode && response.statusCode !== 200) {
        throw response;
      }

      const authPayload =
        response.authPayload ?? response.body?.data ?? response.data ?? response;

      if (authPayload?.gat || authPayload?.user) {
        applyAuthPayload(authPayload.user ?? null, authPayload.gat);
        router.replace(URL.DASHBOARD_URL);
        return;
      }

      router.replace(URL.LOGIN_URL);
    } catch (error) {
      showErrorNotification({ message: parseApiError(error, "Sign up failed. Check your details and try again.") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Image
        src="/kairo-assets/kairo-logo.svg"
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
          <h1 className="title">Sign up</h1>
          <p className="subtitle">Create your Kairo dashboard account.</p>
        </Flex>

        <form onSubmit={handleSubmit} noValidate>
          <Flex direction="column" gap="1.5rem">
            <FormInput
              label="Name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearFieldError("name");
              }}
              message={
                fieldErrors.name
                  ? { type: "error", content: fieldErrors.name }
                  : undefined
              }
            />

            <FormInput
              label="Organization name"
              name="orgName"
              type="text"
              placeholder="Enter your organization name"
              value={orgName}
              onChange={(event) => {
                setOrgName(event.target.value);
                clearFieldError("orgName");
              }}
              message={
                fieldErrors.orgName
                  ? { type: "error", content: fieldErrors.orgName }
                  : undefined
              }
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearFieldError("email");
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
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearFieldError("password");
              }}
              message={
                fieldErrors.password
                  ? { type: "error", content: fieldErrors.password }
                  : undefined
              }
            />

            <FormInput
              label="Confirm password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                clearFieldError("confirmPassword");
              }}
              message={
                fieldErrors.confirmPassword
                  ? { type: "error", content: fieldErrors.confirmPassword }
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
              {loading ? "Signing up..." : "Sign up"}
            </Button>

            <p className="account-prompt">
              Already have an account?{" "}
              <Button
                type="button"
                classes={[ButtonClass.TEXT_ONLY, ButtonClass.PADDING_0]}
                disabled={loading || oauthLoading}
                onClick={() => router.push(URL.LOGIN_URL)}
              >
                Login with email and password instead
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
