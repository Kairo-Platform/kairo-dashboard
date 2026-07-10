"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export type StyledRegistryProps = {
  children: React.ReactNode;
  nonce?: string;
};

export default function StyledRegistry({
  children,
  nonce,
}: StyledRegistryProps) {
  const [sheet] = useState<ServerStyleSheet | null>(() =>
    typeof window === "undefined" ? new ServerStyleSheet() : null,
  );

  useServerInsertedHTML(() => {
    if (!sheet) return null;
    const styles = sheet.getStyleElement();

    return (
      <>
        {styles.map((style, idx) =>
          React.cloneElement(style, {
            key: idx,
            nonce,
          }),
        )}
      </>
    );
  });

  const isProd = process.env.NODE_ENV === "production";

  return sheet ? (
    <StyleSheetManager sheet={sheet.instance} nonce={nonce}>
      {children}
    </StyleSheetManager>
  ) : (
    <StyleSheetManager disableCSSOMInjection={isProd} nonce={nonce}>
      {children}
    </StyleSheetManager>
  );
}
