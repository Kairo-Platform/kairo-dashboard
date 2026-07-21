"use client";

import { Icon } from "@iconify/react";
import { Flex } from "@kairo/ui";
import { styled } from "styled-components";

const AnalyticsCardGridContainer = styled.div`
  .cards {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;
    width: 100%;

    @media (max-width: ${(props) => props.theme.breakpoint.lg}) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      grid-template-columns: 1fr;
    }
  }

  .card {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 9.375rem;
    padding: 1.875rem 1.5rem 1rem;
    border-radius: 1.25rem;
    border: 1.5px solid ${(props) => props.theme.colors.gray_03};
    background-color: ${(props) => props.theme.colors.white};
    height: 100%;
    width: 100%;
    min-width: 0;

    &--featured {
      background-color: #401b07;
      border-color: ${(props) => props.theme.colors.gray_03};

      .card__title {
        color: ${(props) => props.theme.colors.white};
      }

      .card__value {
        color: ${(props) => props.theme.colors.white};
      }

      .card__valueSuffix {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    &__title {
      font-size: 0.9375rem;
      font-weight: 500;
      line-height: 1.3125rem;
      letter-spacing: -0.0375rem;
      color: ${(props) => props.theme.colors.text_03};
    }

    &__value {
      font-size: 1.75rem;
      font-weight: 500;
      line-height: 2.25rem;
      letter-spacing: -0.035rem;
      color: ${(props) => props.theme.colors.text_01};
    }

    &__valueSuffix {
      font-size: 0.9375rem;
      font-weight: 500;
      line-height: 1.3125rem;
      letter-spacing: -0.01875rem;
      color: ${(props) => props.theme.colors.text_03};
      margin-left: 0.125rem;
    }

    &__percentage {
      display: inline-flex;
      align-items: center;
      gap: 0.125rem;
      font-size: 0.8125rem;
      font-weight: 500;
      line-height: 1.125rem;

      &--up {
        color: ${(props) => props.theme.colors.green};
      }

      &--down {
        color: ${(props) => props.theme.colors.red};
      }
    }
  }
`;

export type DashboardAnalyticsCard = {
  title: string;
  value: number | string;
  percentage: number;
  icon: string;
  featured?: boolean;
  valueSuffix?: string;
};

type DashboardAnalyticsCardGridProps = {
  cards: DashboardAnalyticsCard[];
};

export const DashboardAnalyticsCardGrid = ({
  cards,
}: DashboardAnalyticsCardGridProps) => {
  return (
    <AnalyticsCardGridContainer>
      <div className="cards">
        {cards.map((card) => {
          const isUp = card.percentage >= 0;
          const percentageLabel = `${isUp ? "+" : "-"}${Math.abs(card.percentage).toFixed(1)}%`;

          return (
            <div
              className={`card${card.featured ? " card--featured" : ""}`}
              key={card.title}
            >
              <Flex direction="column" gap="1rem" style={{ width: "100%" }}>
                <Flex gap="0.375rem" align="center" className="card__title">
                  <Icon icon={card.icon} width={16} height={16} color={card.featured ? "#FF6B1A" : ""} />
                  <span>{card.title}</span>
                </Flex>
                <Flex direction="column" gap="0.125rem">
                  <p className="card__value">
                    {card.value}
                    {card.valueSuffix ? (
                      <span className="card__valueSuffix">{card.valueSuffix}</span>
                    ) : null}
                  </p>
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
                    <span>{percentageLabel}</span>
                  </p>
                </Flex>
              </Flex>
            </div>
          );
        })}
      </div>
    </AnalyticsCardGridContainer>
  );
};

export default DashboardAnalyticsCardGrid;
