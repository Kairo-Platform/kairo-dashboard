"use client";

import styled from "styled-components";
import { DashboardLayout } from "@/app/components/dashboard";
import { Flex } from "@/app/components/ui";
import { auth } from "@/app/store/auth";
import { useEntity } from "simpler-state";
import { getGreeting } from "@/app/lib/utils";

const WelcomeCard = styled.div`
  padding: 1.5rem;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.white};
`;

export default function DashboardPage() {
  const { authUser } = useEntity(auth);
  const firstName =
    authUser && "firstName" in authUser
      ? String(authUser.firstName)
      : "there";

  return (
    <DashboardLayout pageTitle="Dashboard">
      <WelcomeCard>
        <Flex direction="column" gap="0.5rem">
          <h3>{getGreeting()}, {firstName}</h3>
          <p>Welcome to the Kairo admin dashboard.</p>
        </Flex>
      </WelcomeCard>
    </DashboardLayout>
  );
}
