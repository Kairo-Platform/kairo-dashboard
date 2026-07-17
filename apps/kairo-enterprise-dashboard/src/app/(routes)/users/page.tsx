"use client";

import { Suspense } from "react";
import { UsersTable } from "@/app/components/users";
import { DashboardLayout } from "@/app/components/dashboard";
import { Button, ButtonClass } from "@/app/components/ui";
import { Icon } from "@iconify/react";

export default function UsersPage() {
  return (
    <DashboardLayout
      pageTitle="Users"
      subTitle="Manage all businesses, their activity and performance."
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
        <UsersTable
          users={[
            {
              id: "1",
              user: "Ada Okonkwo",
              status: "active",
              dateAdded: "2026-07-01",
            },
            {
              id: "2",
              user: "James Ade",
              status: "pending",
              dateAdded: "2026-07-10",
            },
            {
              id: "3",
              user: "Chioma Bello",
              status: "inactive",
              dateAdded: "2026-06-18",
            },
          ]}
          loading={false}
          page={1}
          limit={10}
          totalCount={3}
        />
      </Suspense>
    </DashboardLayout>
  );
}
