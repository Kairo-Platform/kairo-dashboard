import React from "react";

const logoMap: Record<string, string | React.ReactNode> = {
  airtel: "/transaction-models/airtel-logo.svg",
  "9mobile": "/transaction-models/9-mobile-logo.svg",
  mtn: "/transaction-models/mtn-logo.svg",
  glo: "/transaction-models/glo-logo.svg",
  "master-card": "/transaction-models/master-card-logo.svg",
  "visa-card": "/transaction-models/visa-card-logo.svg",
  "verve-card": "/transaction-models/verve-card-logo.svg",
  smile: "/transaction-models/smile-logo.svg",
  spectranet: "/transaction-models/spectranet-logo.svg",
};

export default function getTransactionModelLogo(
  name?: string
): React.ReactNode | null {
  const svc = String(name || "").trim();
  if (!svc) return null;

  const lower = svc.toLowerCase();

  // exact match
  if (logoMap[svc as keyof typeof logoMap]) {
    const v = logoMap[svc as keyof typeof logoMap];
    return typeof v === "string" ? (
      <img src={v} alt={`${svc} logo`} width={32} height={32} />
    ) : (
      v
    );
  }

  // case-insensitive match
  const ci = Object.keys(logoMap).find((k) => k.toLowerCase() === lower);
  if (ci) {
    const v = logoMap[ci as keyof typeof logoMap];
    return typeof v === "string" ? (
      <img src={v} alt={`${name} logo`} width={32} height={32} />
    ) : (
      v
    );
  }

  // substring/contains match
  const found = Object.keys(logoMap).find(
    (k) => lower.includes(k) || k.includes(lower)
  );
  if (found) {
    const v = logoMap[found as keyof typeof logoMap];
    return typeof v === "string" ? (
      <img src={v} alt={`${name} logo`} width={32} height={32} />
    ) : (
      v
    );
  }

  return null;
}
