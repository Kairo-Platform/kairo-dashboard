import { z } from "zod";

export const loginWithEmailAndPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type LoginWithEmailAndPasswordValues = z.infer<
  typeof loginWithEmailAndPasswordSchema
>;

export type LoginWithEmailAndPasswordFieldErrors = Partial<
  Record<keyof LoginWithEmailAndPasswordValues, string>
>;

export function validateLoginWithEmailAndPassword(
  values: LoginWithEmailAndPasswordValues,
):
  | { success: true; data: LoginWithEmailAndPasswordValues }
  | { success: false; errors: LoginWithEmailAndPasswordFieldErrors } {
  const result = loginWithEmailAndPasswordSchema.safeParse(values);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: LoginWithEmailAndPasswordFieldErrors = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (
      (field === "email" || field === "password") &&
      errors[field] === undefined
    ) {
      errors[field] = issue.message;
    }
  }

  return { success: false, errors };
}
