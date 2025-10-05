import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth-guard";
import {
  PaginationInput,
  SearchQueryInput,
  UpdateUserInput,
  UserIdParam,
} from "../schemas/user.schema";
import { UserService } from "../services/user.service";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paginationInput = req.query as unknown as PaginationInput;

    const result = await UserService.getAllUsers(paginationInput);

    res.json({
      success: true,
      data: {
        users: result.data,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const searchQuery = req.query as unknown as SearchQueryInput;
    const paginationInput = req.query as unknown as PaginationInput;

    const result = await UserService.searchUsers(searchQuery, paginationInput);

    res.json({
      success: true,
      data: {
        users: result.data,
        query: result.query,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as UserIdParam;

    const user = await UserService.getUserById(id);

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserService.getCurrentUser(req.user?.id);

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as UserIdParam;
    const updateData = req.body as UpdateUserInput;
    const requestUserId = req.user?.id;

    const updatedUser = await UserService.updateUser(
      id,
      requestUserId,
      updateData
    );

    res.json({
      success: true,
      message: "User updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as UserIdParam;
    const requestUserId = req.user?.id;

    await UserService.deleteUser(id, requestUserId);

    res.json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await UserService.getUserStats();

    res.json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
};
