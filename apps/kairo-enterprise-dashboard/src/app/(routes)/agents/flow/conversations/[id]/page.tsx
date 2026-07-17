"use client";

import { ConversationDetails } from "@/app/components/conversations";
import { DashboardLayout } from "@/app/components/dashboard";
import { URL } from "@/lib/constants";
import { useParams, useRouter } from "next/navigation";

export default function ConversationPage() {
  const router = useRouter();
  const { id } = useParams();

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
      title: "Details",
    },
  ]
  return (
    <DashboardLayout pageTitle="" breadcrumbs={breadcrumbs}>
      <ConversationDetails id={String(id)} />
    </DashboardLayout>
  )
}