import { bffRequest } from "@/lib/bff/client";

export const user = {
  me: () => bffRequest("/api/user", "me", { method: "GET" }),
};
