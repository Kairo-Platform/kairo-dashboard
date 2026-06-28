"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { URL } from "./lib/constants";
import { isLoggedIn } from "./lib/utils";
import { useEntity } from "simpler-state";
import { auth } from "./store/auth";
import AuthUtils from "./lib/utils/AuthUtils";
import { USER_TYPE } from "./lib/shared-constants";

export default function Home() {
  const router = useRouter();
  const { isAdminStaff } = useEntity(auth);

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace(URL.DASHBOARD_URL);
      return;
    }

    AuthUtils.getUserType() === USER_TYPE.STAFF || isAdminStaff
      ? router.push(URL.ADMIN_STAFF_LOGIN_URL)
      : router.replace(URL.LOGIN_URL);
  }, [isLoggedIn(), router]);

  return null;
}
