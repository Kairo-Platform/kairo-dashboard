"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Button, ButtonClass, Flex } from "@/app/components/ui";
import { AuthUtils } from "@/lib/auth";
import { URL } from "@/lib/constants/URL";

const PageContainer = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
`;

const Card = styled.div`
  max-width: 560px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.75rem;
  color: ${(props) => props.theme.colors.text_01};
`;

const Description = styled.p`
  color: ${(props) => props.theme.colors.text_02};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

export default function HomePage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    void (async () => {
      const loggedIn = await AuthUtils.isLoggedIn();
      setAuthenticated(loggedIn);

      if (loggedIn) {
        router.replace(URL.DASHBOARD_URL);
      }
    })();
  }, [router]);

  if (authenticated) {
    return null;
  }

  return (
    <PageContainer>
      <Card>
        <Title>Kairo Enterprise Dashboard</Title>
        <Description>
          Enterprise app shell wired with shared theme, UI, and cookie-based
          auth.
        </Description>
        <Flex justify="center">
          <Button
            classes={[ButtonClass.SOLID]}
            onClick={() => router.push(URL.LOGIN_URL)}
          >
            Sign in
          </Button>
        </Flex>
      </Card>
    </PageContainer>
  );
}
