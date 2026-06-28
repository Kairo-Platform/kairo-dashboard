import { getAuthToken } from "@/app/lib/utils";

export const users = {
  getAuthUser: async () => {
    const response = await fetch("/api/user-service-back-office/users/me", {
      method: "GET",
      headers: {
        "x-gat": getAuthToken() || "",
      },
    });

    return await response.json();
  },
};

export const UsersService = users;
