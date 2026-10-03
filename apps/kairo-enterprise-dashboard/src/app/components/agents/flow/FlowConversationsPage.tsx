"use client";

import { Suspense, useEffect } from "react";
import { ConversationsTable } from "../../conversations";
import {
  DashboardAnalyticsCardGrid,
  DashboardLineChart,
} from "../../dashbaord-analytics";
import { styled } from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import { useEntity } from "simpler-state";
import { fetchFlowConversations, flowStore } from "@/app/store/flow";
import {
  mapConversation,
  parseConversationNumber,
} from "@/services/Flow/conversations";
import { Button, ButtonClass, Flex } from "@kairo/ui";
import { URL } from "@/lib/constants";

const FlowConversationsPageContainer = styled.div`
  main {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
  }

  .CardsSection .cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;
    width: 100%;
  }
`;

const dummyData = [
  {
    label: "July 1",
    value: 0.4,
  },
  {
    label: "July 2",
    value: 30,
  },
  {
    label: "July 3",
    value: 50,
  },
  {
    label: "July 4",
    value: 20,
  },
  {
    label: "July 5",
    value: 40,
  },
  {
    label: "July 6",
    value: 10,
  },
  {
    label: "July 7",
    value: 3,
  },
];

type FlowConversationsPageProps = {
  needsInfrastructure?: boolean;
  onConnectInfrastructure?: () => void;
};

export const FlowConversationsPage = ({
  needsInfrastructure = false,
  onConnectInfrastructure,
}: FlowConversationsPageProps = {}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { flowConversations, fetchingFlowConversations } = useEntity(flowStore);
  const page = parseConversationNumber(searchParams.get("page"), 1);
  const limit = parseConversationNumber(searchParams.get("limit"), 10);
  const size = parseConversationNumber(searchParams.get("size"));
  const search = searchParams.get("search") || undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;

  useEffect(() => {
    void fetchFlowConversations({
      page,
      limit,
      size,
      search,
      startDate,
      endDate,
    }).catch(() => {
      // The store displays the request error.
    });
  }, [page, limit, size, search, startDate, endDate]);

  const cards = [
    {
      title: "Total conversations",
      value: 100,
      icon: "iconoir:message",
      percentage: 10,
    },
    {
      title: "Open conversations",
      value: 50,
      icon: "iconoir:message",
      percentage: 4,
    },
  ];
  return (
    <FlowConversationsPageContainer>
      <main>
        {needsInfrastructure && (
          <Flex align="center" justify="space-between" gap="1rem">
            <div>
              <h2>Set up banking infrastructure</h2>
              <p>
                Configure Orange to enable banking operations for your
                organization.
              </p>
            </div>
            <Button
              classes={[ButtonClass.SOLID]}
              onClick={onConnectInfrastructure}
            >
              Connect infrastructure
            </Button>
          </Flex>
        )}
        <section className="CardsSection">
          <DashboardAnalyticsCardGrid cards={cards} />
        </section>

        <section className="LineChartsSection">
          <DashboardLineChart
            title="Average response time (in seconds)"
            chartValues={dummyData}
            chartHeight={260}
          />
        </section>
        <section>
          <Suspense fallback={null}>
            <ConversationsTable
              conversations={
                flowConversations?.items.map(mapConversation) ?? []
              }
              loading={fetchingFlowConversations}
              page={flowConversations?.page ?? page}
              limit={flowConversations?.limit ?? limit}
              totalCount={flowConversations?.total ?? 0}
              onViewConversation={(id) =>
                router.push(
                  `${URL.AGENTS_FLOW_CONVERSATION_DETAILS_URL.replace(":id", id)}?${searchParams.toString()}`,
                )
              }
            />
          </Suspense>
        </section>
      </main>
    </FlowConversationsPageContainer>
  );
};

export default FlowConversationsPage;
