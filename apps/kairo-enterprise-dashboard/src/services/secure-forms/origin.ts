export type SecureFormOrigin = {
  channel: string;
  displayName: string;
  returnUrl?: string;
};

// The backend supplies this context from the verified session, never query parameters.
export function formConversation(origin?: SecureFormOrigin) {
  return origin?.displayName
    ? `your Kairo conversation on ${origin.displayName}`
    : "your Kairo conversation";
}

export function formReturnLink(origin?: SecureFormOrigin) {
  if (!origin?.returnUrl || !origin.displayName) return null;
  try {
    const url = new URL(origin.returnUrl);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return { href: url.toString(), label: `Return to ${origin.displayName}` };
  } catch {
    return null;
  }
}
