"use client";

import { Suspense } from "react";
import { StaffTable } from "@/app/components/staff";
import { DashboardLayout } from "@/app/components/dashboard";
import { URL } from "@/lib/constants";
import { useRouter } from "next/navigation";

const dummyStaff = [
  {
    id: "1",
    firstName: "Tolu",
    lastName: "Adeyemi",
    email: "tolu.adeyemi@kairo.demo",
    role: "Admin",
    status: "ACTIVE",
    dateAdded: "2026-06-12",
  },
  {
    id: "2",
    firstName: "Ngozi",
    lastName: "Okeke",
    email: "ngozi.okeke@kairo.demo",
    role: "Operations",
    status: "INVITED",
    dateAdded: "2026-07-02",
  },
  {
    id: "3",
    firstName: "Ibrahim",
    lastName: "Sani",
    email: "ibrahim.sani@kairo.demo",
    role: "Support",
    status: "ACTIVE",
    dateAdded: "2026-07-08",
  },
];

export default function StaffPage() {
  const router = useRouter();

  const breadcrumbs = [
    {
      title: "Dashboard",
      onClick: () => router.push(URL.DASHBOARD_URL),
    },
    {
      title: "Staff",
    },
  ];

  return (
    <DashboardLayout
      pageTitle="Staff"
      subTitle="Manage all staffs, their activity and performance."
      breadcrumbs={breadcrumbs}
    >
      <Suspense fallback={null}>
        <StaffTable
          staffList={dummyStaff}
          loading={false}
          pageNumber={1}
          limit={10}
          totalCount={dummyStaff.length}
          onInvite={() => undefined}
          onResendInvite={() => undefined}
        />
      </Suspense>
    </DashboardLayout>
  );
}
