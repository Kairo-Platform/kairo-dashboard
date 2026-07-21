"use client";

import { Icon } from "@iconify/react";
import { Flex } from "@kairo/ui";
import Link from "next/link";
import styled from "styled-components";

export type FlowSettingsCard = {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
};

type FlowSettingsHubProps = {
  cards: FlowSettingsCard[];
};

const FlowSettingsHubContainer = styled.div`
  .FlowSettingsHub__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(16rem, 24.5rem));
    gap: 2rem;
    margin-top: 1.5rem;

    @media (max-width: ${({ theme }) => theme.breakpoint.md}) {
      grid-template-columns: 1fr;
    }
  }

  .FlowSettingsHub__card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 11.3rem;
    padding: 1rem 1.5rem 1.5rem;
    border: 1.5px solid ${({ theme }) => theme.colors.gray_02};
    border-radius: 1.25rem;
    background-color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
    color: inherit;
    transition:
      border-color 0.2s ease,
      transform 0.2s ease;

    &:hover,
    &:focus-visible {
      border-color: ${({ theme }) => theme.colors.orange};
      transform: translateY(-2px);
      outline: none;
    }

    &-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 2.5rem;
      background-color: ${({ theme }) => theme.colors.gray_05};
      color: ${({ theme }) => theme.colors.text_01};
    }

    &-title {
      font-size: 1.5rem;
      font-weight: 500;
      line-height: 2rem;
      color: ${({ theme }) => theme.colors.text_01};
      margin-bottom: 0.375rem;
    }

    &-description {
      font-size: 0.8125rem;
      font-weight: 500;
      line-height: 1.125rem;
      color: ${({ theme }) => theme.colors.text_02};
    }
  }
`;

export const FlowSettingsHub = ({ cards }: FlowSettingsHubProps) => {
  return (
    <FlowSettingsHubContainer>
      <div className="FlowSettingsHub__grid">
        {cards.map((card) => (
          <Link key={card.id} href={card.href} className="FlowSettingsHub__card">
            <span className="FlowSettingsHub__card-icon">
              <Icon icon={card.icon} width={20} height={20} />
            </span>
            <Flex direction="column" gap="0">
              <h3 className="FlowSettingsHub__card-title">{card.title}</h3>
              <p className="FlowSettingsHub__card-description">
                {card.description}
              </p>
            </Flex>
          </Link>
        ))}
      </div>
    </FlowSettingsHubContainer>
  );
};

export default FlowSettingsHub;
