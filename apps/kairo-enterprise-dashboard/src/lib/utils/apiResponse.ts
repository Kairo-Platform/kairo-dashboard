import type { ApiLike } from "@/types/api";

export const hasApiError = (response: unknown): boolean => {
  const res = response as ApiLike<unknown>;
  return Boolean(res?.errCode) || Boolean(res?.statusCode && res.statusCode !== 200);
};

export const unwrapApiData = <T>(response: unknown): T => {
  const res = response as ApiLike<T>;
  return res?.body?.data ?? res?.data ?? (response as T);
};
