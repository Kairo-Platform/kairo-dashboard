import { bffRequest } from "@/lib/bff/client";

export const xApiUser = {
  me: () => bffRequest("/api/user", "me", { method: "GET" }),
};

export const user = xApiUser;
