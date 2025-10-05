import { Router } from "express";
import {
  getAllUsers,
  searchUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  deleteUser,
  getUserStats,
} from "../controllers/user.controller";
import { authGuard } from "../middleware/auth-guard";
import { validate } from "../middleware/validate-request";
import { userSchemas } from "../schemas/user.schema";

const router = Router();

// ==================== PUBLIC ROUTES ====================
// None - all user routes require authentication

// ==================== PROTECTED ROUTES ====================
router.use(authGuard); // All routes below require authentication

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get("/stats", getUserStats);

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", getCurrentUser);

/**
 * @route   GET /api/users/search
 * @desc    Search users
 * @access  Private
 * @query   q (required) - Search query
 * @query   page, limit, sortBy, sortOrder (optional) - Pagination
 */
router.get(
  "/search",
  validate({
    query: userSchemas.search.and(userSchemas.pagination),
  }),
  searchUsers
);

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination
 * @access  Private
 * @query   page, limit, sortBy, sortOrder (optional)
 */
router.get(
  "/",
  validate({
    query: userSchemas.pagination,
  }),
  getAllUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 * @param   id - User ID
 */
router.get(
  "/:id",
  validate({
    params: userSchemas.userId,
  }),
  getUserById
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user profile
 * @access  Private (own profile only)
 * @param   id - User ID
 * @body    name, email (optional)
 */
router.put(
  "/:id",
  validate({
    params: userSchemas.userId,
    body: userSchemas.update,
  }),
  updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user account
 * @access  Private (own account only)
 * @param   id - User ID
 */
router.delete(
  "/:id",
  validate({
    params: userSchemas.userId,
  }),
  deleteUser
);

export default router;
