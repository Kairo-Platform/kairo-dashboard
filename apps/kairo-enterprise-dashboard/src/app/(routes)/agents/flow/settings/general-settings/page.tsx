"use client";

import { FlowGeneralSettings } from "@/app/components/agents/flow";
import { DashboardLayout } from "@/app/components/dashboard";
import { URL } from "@/lib/constants";
import { useRouter } from "next/navigation";

export default function FlowGeneralSettingsPage() {
  const router = useRouter();

  const breadcrumbs = [
    {
      title: "Agents",
      onClick: () => router.push(URL.AGENTS_URL),
    },
    {
      title: "Flow",
      onClick: () => router.push(URL.AGENTS_FLOW_URL),
    },
    {
      title: "Settings",
      onClick: () => router.push(URL.AGENTS_FLOW_SETTINGS_URL),
    },
    {
      title: "General settings",
    },
  ];

  return (
    <DashboardLayout
      pageTitle="General settings"
      subTitle="Setup, AI behaviour, Guardrails"
      breadcrumbs={breadcrumbs}
    >
      <FlowGeneralSettings />
    </DashboardLayout>
  );
}
