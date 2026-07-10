"use client";

import { type FC, useEffect } from "react";
import styled from "styled-components";
import { Button, ButtonClass, Flex } from "@/app/components/ui";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

const ErrorBoundaryContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.bgColor};
  padding: 2rem;
`;

const ErrorContent = styled.div`
  background: ${(props) => props.theme.colors.white};
  border-radius: 12px;
  padding: 3rem 2rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
  text-align: center;

  @media (max-width: ${(props) => props.theme.breakpoint.md}) {
    padding: 2rem 1.5rem;
  }
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.colors.red_01};
`;

const ErrorTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text_01};
  margin: 0 0 0.5rem 0;
`;

const ErrorMessage = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text_04};
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
`;

const ErrorDetails = styled.div`
  background: ${(props) => props.theme.colors.ui_04};
  border-left: 4px solid ${(props) => props.theme.colors.red_01};
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: left;
  max-height: 200px;
  overflow-y: auto;

  pre {
    margin: 0;
    font-size: 0.75rem;
    color: ${(props) => props.theme.colors.text_02};
    word-break: break-word;
    white-space: pre-wrap;
  }
`;

const ButtonGroup = styled(Flex)`
  gap: 1rem;

  @media (max-width: ${(props) => props.theme.breakpoint.sm}) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`;

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalErrorBoundary: FC<ErrorBoundaryProps> = ({ error, reset }) => {
  const router = useRouter();

  useEffect(() => {
    console.error(
      process.env.NODE_ENV === "production"
        ? "Global error caught:"
        : "Error:",
      error,
    );
  }, [error]);

  return (
    <ErrorBoundaryContainer>
      <ErrorContent>
        <ErrorIcon>
          <Icon icon="mdi:alert-circle" />
        </ErrorIcon>

        <ErrorTitle>Something went wrong</ErrorTitle>

        <ErrorMessage>
          We encountered an unexpected error. Please try again or contact
          support if the problem persists.
        </ErrorMessage>

        {process.env.NODE_ENV !== "production" && error.message && (
          <ErrorDetails>
            <pre>{error.message}</pre>
            {error.digest && <pre>Digest: {error.digest}</pre>}
          </ErrorDetails>
        )}

        <ButtonGroup justify="center" align="center">
          <div>
            <Button
              classes={[ButtonClass.SOLID]}
              onClick={() => reset()}
              style={{ minWidth: "150px" }}
            >
              Try Again
            </Button>
          </div>

          <div>
            <Button
              classes={[ButtonClass.OUTLINED]}
              onClick={() => router.back()}
              style={{ minWidth: "150px" }}
            >
              Go Back
            </Button>
          </div>
        </ButtonGroup>
      </ErrorContent>
    </ErrorBoundaryContainer>
  );
};

export default GlobalErrorBoundary;
