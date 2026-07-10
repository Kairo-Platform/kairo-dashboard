"use client";

import styled from "styled-components";
import { Button, ButtonClass, Flex } from "@/app/components/ui";
import { AuthUtils } from "@/lib/auth";
import { URL } from "@/lib/constants/URL";
import { useRouter } from "next/navigation";

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

export default function DashboardPage() {
  const router = useRouter();

  return (
    <PageContainer>
      <Card>
        <Title>Enterprise Dashboard</Title>
        <Description>
          Authenticated shell placeholder. Add enterprise routes and BFF proxies
          here as services are migrated.
        </Description>
        <Flex justify="center">
          <Button
            classes={[ButtonClass.OUTLINED]}
            onClick={() => {
              void AuthUtils.logout(() => {
                router.replace(URL.HOME_URL);
              });
            }}
          >
            Sign out
          </Button>
        </Flex>
      </Card>
    </PageContainer>
  );
}
