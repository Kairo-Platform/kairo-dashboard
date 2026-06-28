"use client";

import React, { memo } from "react";
import Image from "next/image";
import styled from "styled-components";

const ColoredValueCardContainer = styled.div`
  margin-bottom: 2rem;
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));

  .colored-card {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 1rem;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.15);
    border-radius: 5px;

    img {
      filter: brightness(0) invert(1);
    }
  }

  .cyan {
    background-color: ${(props) => props.theme.colors.primaryColor};
  }

  .light-blue {
    background-color: ${(props) => props.theme.colors.lightBlue};
  }

  .purple {
    background-color: ${(props) => props.theme.colors.purple};
  }

  .colored-card--lhs {
    color: ${(props) => props.theme.colors.white};
  }

  .colored-card--text {
    font-size: 14px;
    margin-bottom: 5px;
    line-height: 16px;
  }

  .colored-card--amount {
    font-weight: 500;
    font-size: 1.7rem;
    line-height: 43px;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  @media (max-width: 1200px) {
    .colored-card--amount {
      font-size: 1.4rem;
      line-height: 30px;
    }
  }

  @media (min-width: 1500px) {
    grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  }
`;

type CardValue = {
  text: string;
  amount: string | number;
  bgColor: "cyan" | "light-blue" | "purple" | string;
  icon?: React.ReactNode;
};

type GridProps = {
  cardValues: CardValue[];
};

export const ColoredValueCard: any = {};

ColoredValueCard.Card = memo(({ cardValue }: { cardValue: CardValue }) => {
  return (
    <div className={`colored-card ${cardValue.bgColor}`}>
      <div className="colored-card--lhs">
        <p className="colored-card--text">{cardValue.text}</p>
        <p className="colored-card--amount">{cardValue.amount}</p>
      </div>

      {cardValue.icon ? (
        cardValue.icon
      ) : (
        <Image
          src="/dashboard/sidebar/posDevicesIcon.svg"
          width={40}
          height={45}
          alt="device"
        />
      )}
    </div>
  );
});

ColoredValueCard.Card.displayName = "ColoredValueCard.Card";

ColoredValueCard.Grid = memo(({ cardValues }: GridProps) => {
  return (
    <ColoredValueCardContainer>
      {cardValues.map((cardValue) => (
        <ColoredValueCard.Card
          key={`${cardValue.text}-${cardValue.bgColor}`}
          cardValue={cardValue}
        />
      ))}
    </ColoredValueCardContainer>
  );
});

ColoredValueCard.Grid.displayName = "ColoredValueCard.Grid";

export default ColoredValueCard;
