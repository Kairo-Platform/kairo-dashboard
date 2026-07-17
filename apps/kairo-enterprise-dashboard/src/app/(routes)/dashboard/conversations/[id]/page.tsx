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
      title: "Dashboard",
      onClick: () => router.push(URL.DASHBOARD_URL),
    },
    {
      title: "Conversations",
      onClick: () => router.push(URL.DASHBOARD_CONVERSATIONS_URL),
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