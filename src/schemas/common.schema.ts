import { z } from "zod";

// ==================== COMMON SCHEMAS ====================

/**
 * Generic ID Schema (for params)
 */
export const idParamSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

/**
 * Boolean Query Schema (converts string to boolean)
 */
export const booleanQuerySchema = z
  .string()
  .optional()
  .transform((val) => val === "true");

// ==================== GROUPED EXPORT ====================

export const commonSchemas = {
  id: idParamSchema,
  booleanQuery: booleanQuerySchema,
};

// ==================== TYPE EXPORTS ====================

export type IdParam = z.infer<typeof idParamSchema>;
