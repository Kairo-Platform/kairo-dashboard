"use client";

import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { ConversationDetails } from "@/app/components/conversations";
import { DashboardLayout } from "@/app/components/dashboard";
import { URL } from "@/lib/constants";

export default function UserConversationPage() {
  const router = useRouter();
  const { userId } = useParams<{ userId: string }>();

  const breadcrumbs = [
    {
      title: "Users",
      onClick: () => router.push(URL.USERS_URL),
    },
    {
      title: "Conversation details",
    },
  ];

  return (
    <DashboardLayout pageTitle="" breadcrumbs={breadcrumbs}>
      <Suspense fallback={null}>
        <ConversationDetails userId={userId} backUrl={URL.USERS_URL} />
      </Suspense>
    </DashboardLayout>
  );
}
