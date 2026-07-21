"use client";

import { FlowSettingsHub } from "@/app/components/agents/flow";
import { DashboardLayout } from "@/app/components/dashboard";
import { URL } from "@/lib/constants";
import { useRouter } from "next/navigation";

const SETTINGS_CARDS = [
  {
    id: "general",
    title: "General settings",
    description: "Setup, AI behaviour, Guardrails",
    icon: "solar:settings-outline",
    href: URL.AGENTS_FLOW_GENERAL_SETTINGS_URL,
  },
  {
    id: "conversations",
    title: "Conversations settings",
    description: "Messaging setup, Automation",
    icon: "solar:settings-outline",
    href: URL.AGENTS_FLOW_CONVERSATIONS_SETTINGS_URL,
  },
];

export default function FlowSettingsPage() {
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
    },
  ];

  return (
    <DashboardLayout pageTitle="Settings" breadcrumbs={breadcrumbs}>
      <FlowSettingsHub cards={SETTINGS_CARDS} />
    </DashboardLayout>
  );
}
