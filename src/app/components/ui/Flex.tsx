import React, { CSSProperties, ReactNode } from "react";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  direction?: CSSProperties["flexDirection"];
  gap?: CSSProperties["gap"];
  justify?: CSSProperties["justifyContent"];
  align?: CSSProperties["alignItems"];
  wrap?: CSSProperties["flexWrap"];
  flexGrow?: CSSProperties["flexGrow"];
  style?: CSSProperties;
}

export const Flex: React.FC<FlexProps> = ({
  children,
  className,
  direction,
  gap = "1rem",
  justify,
  align,
  wrap = "nowrap",
  flexGrow,
  style,
  ...rest
}) => {
  const combinedStyle: CSSProperties = {
    display: "flex",
    flexDirection: direction,
    flexWrap: wrap,
    gap,
    justifyContent: justify,
    alignItems: align,
    flexGrow: flexGrow as any,
    ...style,
  };

  return (
    <div style={combinedStyle} className={className} {...rest}>
      {children}
    </div>
  );
};

export default Flex;
