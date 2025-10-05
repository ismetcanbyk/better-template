import { z } from "zod";

// ==================== BASE SCHEMAS ====================

/**
 * Email validation - stricter rules
 */
export const emailSchema = z
  .string({ message: "Email is required" })
  .min(3, "Email must be at least 3 characters")
  .max(255, "Email must not exceed 255 characters")
  .toLowerCase()
  .trim();

/**
 * Password validation - strong password requirements
 */
export const passwordSchema = z
  .string({ message: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must not exceed 128 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

/**
 * Name validation
 */
export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must not exceed 100 characters")
  .trim()
  .optional();

// ==================== AUTH SCHEMAS ====================

/**
 * Sign Up Schema
 */
export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema,
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

/**
 * Sign In Schema
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});

/**
 * Forgot Password Schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = z
  .object({
    token: z
      .string({ message: "Reset token is required" })
      .min(1, "Reset token is required"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Verify Email Schema
 */
export const verifyEmailSchema = z.object({
  token: z
    .string({ message: "Verification token is required" })
    .min(1, "Verification token is required"),
});

/**
 * Update Profile Schema
 */
export const updateProfileSchema = z.object({
  name: nameSchema,
  email: emailSchema.optional(),
});

/**
 * Change Password Schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ message: "Current password is required" })
      .min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

/**
 * Refresh Token Schema
 */
export const refreshTokenSchema = z.object({
  refreshToken: z
    .string({ message: "Refresh token is required" })
    .min(1, "Refresh token is required"),
});

// ==================== GROUPED EXPORT ====================

export const authSchemas = {
  signUp: signUpSchema,
  signIn: signInSchema,
  forgotPassword: forgotPasswordSchema,
  resetPassword: resetPasswordSchema,
  verifyEmail: verifyEmailSchema,
  updateProfile: updateProfileSchema,
  changePassword: changePasswordSchema,
  refreshToken: refreshTokenSchema,
};

// ==================== TYPE EXPORTS ====================

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
