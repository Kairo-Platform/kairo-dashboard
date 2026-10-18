"use client";

import { Suspense } from "react";
import { ConversationDetails } from "@/app/components/conversations";
import { DashboardLayout } from "@/app/components/dashboard";
import { URL } from "@/lib/constants";
import { useParams, useRouter } from "next/navigation";

export default function ConversationPage() {
  const router = useRouter();
  const { userId } = useParams<{ userId: string }>();

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
      title: "Conversation details",
    },
  ];
  return (
    <DashboardLayout pageTitle="" breadcrumbs={breadcrumbs}>
      <Suspense fallback={null}>
        <ConversationDetails userId={userId} />
      </Suspense>
    </DashboardLayout>
  );
}
