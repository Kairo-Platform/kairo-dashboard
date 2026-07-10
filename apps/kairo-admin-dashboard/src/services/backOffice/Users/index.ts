import { backOfficeBff } from "@/lib/bff/client";

export const users = {
  getAuthUser: async () => {
    return backOfficeBff.request("users/me", { method: "GET" });
  },
};

export const UsersService = users;
