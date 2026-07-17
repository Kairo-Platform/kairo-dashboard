"use client";

import { Icon } from "@iconify/react";
import { Flex } from "@kairo/ui";
import { styled } from "styled-components";

const AnalyticsCardGridContainer = styled.div`
  .cards {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.5rem;
    width: 100%;

    @media (max-width: ${(props) => props.theme.breakpoint.lg}) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      grid-template-columns: 1fr;
    }
  }
      
  .card {
    padding: 1rem;
    border-radius: 0.75rem;
    border: 1.5px solid ${(props) => props.theme.colors.gray_02};
    height: 100%;
    width: 100%;
    min-width: 0;

    &__title {
      font-size: 1rem;
      font-weight: 500;
      color: ${(props) => props.theme.colors.text_02};
    }

    &__value {
      font-size: 1.5rem;
      font-weight: 600;
      color: ${(props) => props.theme.colors.text_01};
    }

    &__percentage {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 1rem;
      font-weight: 500;

      &--up {
        color: ${(props) => props.theme.colors.green};
      }

      &--down {
        color: ${(props) => props.theme.colors.red};
      }
    }
  }
  
`;

type DashboardAnalyticsCardGridProps = {
  cards: {
    title: string;
    value: number;
    percentage: number;
    icon: string;
  }[];
}

export const DashboardAnalyticsCardGrid = ({ cards }: DashboardAnalyticsCardGridProps) => {
  return (
    <AnalyticsCardGridContainer>
      <div className="cards">
        {
          cards.map((card) => {
            const isUp = card.percentage >= 0;

            return (
              <div className="card" key={card.title}>
                <Flex gap="0.5rem" align="center" className="card__title">
                  <Icon icon={card.icon} width={20} height={20} />
                  <span>{card.title}</span>
                </Flex>
                <Flex
                  gap="0.5rem"
                  direction="column"
                  style={{ marginTop: "1.5rem" }}
                >
                  <p className="card__value">{card.value}</p>
                  <p
                    className={`card__percentage card__percentage--${isUp ? "up" : "down"}`}
                  >
                    <Icon
                      icon={
                        isUp
                          ? "iconamoon:arrow-up-2-fill"
                          : "iconamoon:arrow-down-2-fill"
                      }
                      width={16}
                      height={16}
                    />
                    <span>{Math.abs(card.percentage)}%</span>
                  </p>
                </Flex>
              </div>
            );
          })
        }
      </div>
    </AnalyticsCardGridContainer>
  )
}

export default DashboardAnalyticsCardGrid;