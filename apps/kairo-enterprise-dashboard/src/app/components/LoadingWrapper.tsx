"use client";

import { useState, useEffect, type PropsWithChildren } from "react";
import styled from "styled-components";
import { Loading, LoadingOverlay } from "@kairo/ui";
import { hydrateSession } from "@/lib/auth";
import { usePathname } from "next/navigation";

const FullScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
`;

export const LoadingWrapper = ({ children }: PropsWithChildren) => {
  const secureForm = usePathname() === "/secure/forms";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (secureForm) return;
    void (async () => {
      await hydrateSession();
      setIsLoading(false);
    })();
  }, [secureForm]);

  if (isLoading && !secureForm) {
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
