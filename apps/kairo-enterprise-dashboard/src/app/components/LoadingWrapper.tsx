"use client";

import { useState, useEffect, type PropsWithChildren } from "react";
import styled from "styled-components";
import { Loading, LoadingOverlay } from "@kairo/ui";
import { hydrateSession } from "@/lib/auth";

const FullScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
`;

export const LoadingWrapper = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      await hydrateSession();
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return (
      <FullScreenContainer>
        <LoadingOverlay>
          <Loading />
        </LoadingOverlay>
      </FullScreenContainer>
    );
  }

  return <>{children}</>;
};

export default LoadingWrapper;
