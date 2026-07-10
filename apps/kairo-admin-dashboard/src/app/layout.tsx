import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import Theme from "./styles/Theme";
import "./globals.css";
import "./styles/notifications.css";
import { LoadingWrapper } from "./components/LoadingWrapper";
import { headers } from "next/headers";
import { StyledRegistry } from "@kairo/theme";

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  preload: true,
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kairo Dashboard",
  description: "Operational Intelligence for Financial Institutions",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" className={`${satoshi.variable} ${dmSans.variable}`}>
      <body>
        {nonce && (
          <Script id="sc-csp-nonce" nonce={nonce} strategy="beforeInteractive">
            {`window.__webpack_nonce__ = ${JSON.stringify(nonce)};`}
          </Script>
        )}
        <StyledRegistry nonce={nonce}>
          <Theme>
            <LoadingWrapper>{children}</LoadingWrapper>
          </Theme>
        </StyledRegistry>
      </body>
    </html>
  );
}
