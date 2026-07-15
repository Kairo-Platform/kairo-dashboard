"use client";

import { Suspense } from "react";
import { ConversationsTable } from "@/app/components/conversations";
import { DashboardLayout } from "@/app/components/dashboard";
import { Button, ButtonClass } from "@/app/components/ui";
import { URL } from "@/lib/constants";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

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
      appendElementToHeading={
        <Button
          classes={[ButtonClass.GRADIENT, ButtonClass.WITH_ICON]}
          style={{ height: "2.5rem" }}
          onClick={() => { }}
        >
          <Icon icon="mingcute:ai-fill" width={20} height={20} />
          Ask AI
        </Button>
      }
    >
      <Suspense fallback={null}>
        <ConversationsTable
          conversations={[
            {
              id: "1",
              user: "John Doe",
              message: "What's my current wallet balance?",
              channel: "Email",
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
          page={1}
          limit={10}
          totalCount={10}
        />
      </Suspense>
    </DashboardLayout>
  );
}
