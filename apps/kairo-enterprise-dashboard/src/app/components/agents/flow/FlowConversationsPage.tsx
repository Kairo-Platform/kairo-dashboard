import { Suspense } from "react";
import { ConversationsTable } from "../../conversations";
import { DashboardAnalyticsCardGrid, DashboardLineChart } from "../../dashbaord-analytics";
import { styled } from "styled-components";

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

export const FlowConversationsPage = () => {

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
  ]
  return (
    <FlowConversationsPageContainer>
      <main>
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
              conversations={[
                {
                  id: "1",
                  user: "John Doe",
                  message: "What's my current wallet balance?",
                  channel: "Email",
                  status: "open",
                  createdAt: new Date(),
                },
                {
                  id: "2",
                  user: "James Miller",
                  message: "Send ₦20,000 to my GTB account",
                  channel: "Phone",
                  status: "resolved",
                  createdAt: new Date(),
                },
              ]}
              loading={false}
              onRefresh={() => { }}
              page={1}
              limit={10}
              totalCount={10}
            />
          </Suspense>
        </section>
      </main>
    </FlowConversationsPageContainer>
  )
}

export default FlowConversationsPage;