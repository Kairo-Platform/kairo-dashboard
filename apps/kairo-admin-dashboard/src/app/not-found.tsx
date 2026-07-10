"use client";

import { type FC } from "react";
import styled from "styled-components";
import { Button, ButtonClass } from "@/app/components/ui";
import { Flex } from "@/app/components/ui";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

const NotFoundContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.bgColor};
  padding: 2rem;
`;

const NotFoundContent = styled.div`
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

const NotFoundIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.colors.text_04};
`;

const NotFoundTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text_01};
  margin: 0 0 0.5rem 0;
`;

const NotFoundMessage = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text_04};
  margin: 0 0 2rem 0;
  line-height: 1.5;
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

const NotFoundPage: FC = () => {
  const router = useRouter();

  return (
    <NotFoundContainer>
      <NotFoundContent>
        <NotFoundIcon>
          <Icon icon="streamline-freehand:server-error-404-not-found" />
        </NotFoundIcon>

        <NotFoundTitle>Page not found</NotFoundTitle>

        <NotFoundMessage>
          The page you are looking for does not exist or may have been moved.
        </NotFoundMessage>

        <ButtonGroup justify="center" align="center">
          <div>
            <Button
              classes={[ButtonClass.SOLID]}
              onClick={() => router.back()}
              style={{ minWidth: "150px" }}
            >
              Go Back
            </Button>
          </div>
        </ButtonGroup>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default NotFoundPage;
