import type { SecureSession } from "./schema";
import { createSecureFormService } from "..";

// Identity details and PINs stay in component memory, never in an application store.
export const secureOnboardingService =
  createSecureFormService<SecureSession>("onboarding");
