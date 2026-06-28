"use client";

import { FC, useState, useEffect, useRef } from "react";
import styled from "styled-components";

const StarsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
export interface StarRatingProps {
  rating?: number;
  maxRating?: number;
  /** allow user to set rating via mouse */
  setRating?: boolean;
  onChange?: (rating: number) => void;
  starColor?: string;
}

export const StarRating: FC<StarRatingProps> = ({
  rating = 0,
  maxRating = 5,
  setRating = false,
  onChange = () => {},
  starColor = "#FFD700",
}) => {
  const [selectedRating, setSelectedRating] = useState<number>(rating);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = (starRating: number) => {
    if (!setRating) return;
    setHoverRating(starRating);
  };

  const handleMouseLeave = () => {
    if (!setRating) return;
    setHoverRating(0);
  };

  const handleClick = (starRating: number) => {
    if (!setRating) return;
    setSelectedRating(starRating);
    onChange(starRating);
  };

  useEffect(() => {
    setSelectedRating(rating);
  }, [rating]);

  // Force inline fill with !important and remove Dark Reader attributes so
  // the extension can't override star color.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const spans = container.querySelectorAll("span.star");
    const displayRating = hoverRating || selectedRating || rating;

    spans.forEach((span, i) => {
      const path = span.querySelector("svg path");
      if (!path) return;

      const starIndex = i + 1;
      const color = starIndex <= displayRating ? starColor : "#ccc";

      try {
        // style may throw in some environments (SVGPathElement typing), fallback to setAttribute
        // @ts-expect-error DOM typings for SVGStyleDeclaration may be restrictive
        path.style.setProperty("fill", color, "important");
      } catch (e) {
        path.setAttribute("fill", color);
      }
    });
  }, [starColor, hoverRating, selectedRating, rating, maxRating]);

  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starRating = index + 1;

    const displayRating = hoverRating || selectedRating || rating;

    return (
      <span
        key={index}
        className={`star ${starRating <= displayRating ? "filled" : ""}`}
        style={{
          color: starRating <= displayRating ? starColor : "#ccc",
          cursor: setRating ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={() => handleMouseEnter(starRating)}
        onClick={() => handleClick(starRating)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25px"
          height="25px"
          viewBox="0 0 24 24"
        >
          <path
            fill={starRating <= displayRating ? starColor : "#ccc"}
            d="m12 16.102l-3.63 2.192q-.16.079-.297.064q-.136-.016-.265-.094q-.13-.08-.196-.226t-.012-.319l.966-4.11l-3.195-2.77q-.135-.11-.178-.263t.019-.293q.044-.141.165-.23q.104-.087.28-.118l4.216-.368l1.644-3.892q.068-.165.196-.238T12 5.364t.288.073t.195.238l1.644 3.892l4.215.368q.177.03.281.119q.104.088.166.229q.061.14.018.293t-.178.263l-3.195 2.77l.966 4.11q.056.171-.011.318t-.197.226q-.128.08-.265.095q-.136.015-.296-.064z"
          />
        </svg>
      </span>
    );
  });

  return (
    <StarsContainer ref={containerRef} onMouseLeave={handleMouseLeave}>
      {stars}
    </StarsContainer>
  );
};

export default StarRating;
