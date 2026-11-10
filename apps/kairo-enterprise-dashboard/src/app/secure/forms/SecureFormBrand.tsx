"use client";

import Image from "next/image";
import styled from "styled-components";
import { useDarkMode } from "@/app/providers/DarkModeProvider";

const Brand = styled.div<{ $centered: boolean }>`
  display: flex;
  justify-content: ${({ $centered }) => ($centered ? "center" : "flex-start")};
  align-items: center;
`;

export default function SecureFormBrand({
  centered = false,
  className,
}: {
  centered?: boolean;
  className?: string;
}) {
  const { darkModeEnabled } = useDarkMode();
  return (
    <Brand $centered={centered} className={className}>
      <Image
        src={
          darkModeEnabled
            ? "/kairo-assets/kairo-logo-white.svg"
            : "/kairo-assets/kairo-logo.svg"
        }
        alt="Kairo"
        width={109}
        height={38}
        priority
      />
    </Brand>
  );
}
