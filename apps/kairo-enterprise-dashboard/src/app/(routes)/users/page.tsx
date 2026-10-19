"use client";

import { Suspense, useEffect, useMemo } from "react";
import { UsersTable } from "@/app/components/users";
import { DashboardLayout } from "@/app/components/dashboard";
import { Button, ButtonClass } from "@/app/components/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { URL } from "@/lib/constants";
import { usersStore, fetchUsers } from "@/app/store/users";
import { useEntity } from "simpler-state";
import { getOrgId } from "@/lib/auth/client";
import { metricValue } from "@/services/Analytics/mappers";
import { parseConversationNumber } from "@/services/Flow/conversations";
import { DashboardAnalyticsCardGrid } from "@/app/components/dashbaord-analytics";
import { Icon } from "@iconify/react";

export default function UsersPage() {
  const router = useRouter();
  const params = useSearchParams();
  const page = parseConversationNumber(params.get("page"), 1);
  const limit = parseConversationNumber(params.get("limit"), 10);
  const search = params.get("search") || undefined;
  const startDate = params.get("startDate") || undefined;
  const endDate = params.get("endDate") || undefined;
  const filters = useMemo(
    () => ({ page, limit, search, startDate, endDate }),
    [page, limit, search, startDate, endDate],
  );
  const usersState = useEntity(usersStore);
  useEffect(() => {
    void fetchUsers(filters).catch(() => {});
  }, [filters]);
  const currentUsers =
    usersState.queryKey === JSON.stringify(filters) &&
    usersState.orgId === getOrgId();
  const users = {
    data: currentUsers ? usersState.users : null,
    loading: !currentUsers || usersState.fetchingUsers,
  };
  const stats = users.data?.analytics;
  const cards = [
    {
      title: "Active users",
      // percentage: stats?.percentageChanges?.activeUsers,
      value: metricValue(stats?.activeUsers),
      icon: "iconoir:user",
    },
    {
      title: "Inactive users",
      // percentage: stats?.percentageChanges?.inactiveUsers,
      value: metricValue(stats?.inactiveUsers),
      icon: "iconoir:user",
    },
    {
      title: "Suspended users",
      // percentage: stats?.percentageChanges?.suspendedUsers,
      value: metricValue(stats?.suspendedUsers),
      icon: "iconoir:user",
    },
  ];
  return (
    <DashboardLayout
      pageTitle="Users"
      subTitle="Manage all businesses, their activity and performance."
      appendElementToHeading={
        <Button
          classes={[ButtonClass.GRADIENT, ButtonClass.WITH_ICON]}
          style={{ height: "2.5rem" }}
          onClick={() => {}}
        >
          <Icon icon="mingcute:ai-fill" width={20} height={20} />
          Ask AI
        </Button>
      }
    >
      <div style={{ marginBottom: "1rem" }}>
        <DashboardAnalyticsCardGrid
          cards={cards}
          columns={3}
          showPercentage={false}
        />
      </div>
      <Suspense fallback={null}>
        <UsersTable
          onViewConversation={(userId) =>
            router.push(
              URL.USERS_CONVERSATION_DETAILS_URL.replace(
                ":userId",
                encodeURIComponent(userId),
              ),
            )
          }
          users={(users.data?.items ?? []).map((user) => ({
            id: user.id,
            user: user.displayName || user.channelUserId,
            status: user.status.toLowerCase(),
            dateAdded: user.createdAt,
          }))}
          loading={users.loading}
          page={users.data?.page ?? page}
          limit={users.data?.limit ?? limit}
          totalCount={users.data?.totalCount ?? 0}
        />
      </Suspense>
    </DashboardLayout>
  );
}
