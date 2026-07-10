"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Button, ButtonClass, ButtonSize, Flex } from "@/app/components/ui";
import { FormInput } from "@/app/components/ui/inputs";
import { URL } from "@/app/lib/constants";
import { applyAuthPayload, parseApiError } from "@/app/lib/utils";
import { backOfficeAuthService } from "@/services/backOffice";
import {
  type LoginWithEmailAndPasswordFieldErrors,
  validateLoginWithEmailAndPassword,
} from "@kairo/utils";
import Image from "next/image";

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
  }

  @media (max-width: 768px) {
    .logo {
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
`;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] =
    useState<LoginWithEmailAndPasswordFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const validation = validateLoginWithEmailAndPassword({ email, password });
    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const response = await backOfficeAuthService.login({
        email: validation.data.email,
        password: validation.data.password,
      }) as Record<string, any>;

      if (response?.statusCode && response.statusCode !== 200) {
        throw response;
      }

      const authPayload =
        response.authPayload ?? response.body?.data ?? response.data ?? response;

      applyAuthPayload(authPayload.user ?? null, authPayload.gat);
      router.replace(URL.DASHBOARD_URL);
    } catch (error) {
      setSubmitError(parseApiError(error, "Failed to log in"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Image src="/kairo-assets/kairo-logo.svg" alt="Kairo" width={100} height={100} className="logo" />

      <Card>
        <Flex
          direction="column"
          align="center"
          justify="center"
          gap="0.3rem"
          style={{ marginBottom: "2rem" }}
        >
          <h1 className="title">Login</h1>
          <p className="subtitle">Log in to Kairo admin dashboard.</p>
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
                  : submitError
                    ? { type: "error", content: submitError }
                    : undefined
              }
            />

            <Button
              type="submit"
              classes={[ButtonClass.SOLID]}
              size={ButtonSize.FULL}
              disabled={loading}
              style={{ borderRadius: "0.765rem", marginTop: "2rem" }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </Flex>
        </form>
      </Card>
    </PageContainer>
  );
}
