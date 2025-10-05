import { z } from "zod";

// ==================== USER SCHEMAS ====================

/**
 * Get User By ID Schema (for params)
 */
export const userIdParamSchema = z.object({
  id: z.string(),
});

/**
 * Pagination Schema (for query params)
 */
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, "Page must be greater than 0"),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100"),
  sortBy: z.string().optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

/**
 * Search Query Schema
 */
export const searchQuerySchema = z.object({
  q: z
    .string({ message: "Search query is required" })
    .min(1, "Search query must not be empty")
    .max(100, "Search query must not exceed 100 characters")
    .trim(),
});

/**
 * Update User Schema
 */
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim()
    .optional(),
  email: z
    .string()
    .email("Invalid email format")
    .toLowerCase()
    .trim()
    .optional(),
});

// ==================== GROUPED EXPORT ====================

export const userSchemas = {
  userId: userIdParamSchema,
  pagination: paginationSchema,
  search: searchQuerySchema,
  update: updateUserSchema,
};

// ==================== TYPE EXPORTS ====================

export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
