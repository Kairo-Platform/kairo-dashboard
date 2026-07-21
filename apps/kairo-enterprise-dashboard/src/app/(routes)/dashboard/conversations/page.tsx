"use client";

import { Suspense } from "react";
import { ConversationsTable } from "@/app/components/conversations";
import { DashboardLayout } from "@/app/components/dashboard";
import { URL } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { AskKairoAI } from "@/app/components/ask-kairo";

export default function ConversationsPage() {
  const router = useRouter();

  const breadcrumbs = [
    {
      title: "Dashboard",
      onClick: () => router.push(URL.DASHBOARD_URL),
    },
    {
      title: "Conversations",
    },
  ];

  return (
    <DashboardLayout
      pageTitle="Conversations"
      breadcrumbs={breadcrumbs}
      appendElementToHeading={<AskKairoAI />}
    >
      <Suspense fallback={null}>
        <ConversationsTable
          conversations={[
            {
              id: "1",
              user: "Chinedu Okafor",
              message: "What is my current balance?",
              channel: "Whatsapp",
              status: "open",
              createdAt: new Date(),
            },
            {
              id: "2",
              user: "James Miller",
              message: "Send ₦20,000 to my GTB account",
              channel: "Phone",
              status: "resolved",
              createdAt: new Date(),
            },
          ]}
          loading={false}
          onRefresh={() => { }}
          onViewConversation={(id) => router.push(URL.DASHBOARD_CONVERSATION_DETAILS_URL.replace(":id", id))}
          page={1}
          limit={10}
          totalCount={10}
        />
      </Suspense>
    </DashboardLayout>
  );
}
