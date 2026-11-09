// Add a type only when its browser UI, BFF validator and backend handler are ready.
export type HostedFormType = "onboarding";

export function createSecureFormService<T extends { type: HostedFormType }>(
  type: T["type"],
) {
  async function request<R>(
    action: string,
    method: string,
    body?: unknown,
  ): Promise<R> {
    const response = await fetch(`/api/secure-forms/${type}/${action}`, {
      method,
      credentials: "same-origin",
      cache: "no-store",
      headers: { "Content-Type": "application/json", "X-Kairo-Form": "1" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Unable to continue. Please try again.");
    return result as R;
  }

  return {
    exchange: (token: string) =>
      request<{ ok: boolean }>("exchange", "POST", { token }),
    session: () => request<T>("session", "GET"),
    submit: (body: unknown) => request<T>("session", "POST", body),
    close: () => request<{ ok: boolean }>("session", "DELETE"),
  };
}
