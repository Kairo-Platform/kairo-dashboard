import type { Metadata } from "next";
import SecureOnboardingForm from "./SecureOnboardingForm";
import SecureFormUnavailable from "./SecureFormUnavailable";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Secure form | Kairo",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function SecureFormsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string | string[] }>;
}) {
  const { type } = await searchParams;
  if (type === "onboarding") return <SecureOnboardingForm />;
  return <SecureFormUnavailable />;
}
