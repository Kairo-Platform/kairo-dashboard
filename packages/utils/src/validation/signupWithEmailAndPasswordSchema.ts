import { z } from "zod";

export const signupWithEmailAndPasswordSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    orgName: z.string().min(1, "Organization name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupWithEmailAndPasswordValues = z.infer<
  typeof signupWithEmailAndPasswordSchema
>;

export type SignupWithEmailAndPasswordFieldErrors = Partial<
  Record<keyof SignupWithEmailAndPasswordValues, string>
>;

export function validateSignupWithEmailAndPassword(
  values: SignupWithEmailAndPasswordValues,
):
  | { success: true; data: SignupWithEmailAndPasswordValues }
  | { success: false; errors: SignupWithEmailAndPasswordFieldErrors } {
  const result = signupWithEmailAndPasswordSchema.safeParse(values);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: SignupWithEmailAndPasswordFieldErrors = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (
      (field === "name" ||
        field === "orgName" ||
        field === "email" ||
        field === "password" ||
        field === "confirmPassword") &&
      errors[field] === undefined
    ) {
      errors[field] = issue.message;
    }
  }

  return { success: false, errors };
}
