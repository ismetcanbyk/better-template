import { userSelectFields } from "@/types/user-select-type";
import { prisma } from "../../prisma/client";
import {
  notFound,
  forbidden,
  conflict,
  badRequest,
} from "../middleware/error-handler";
import {
  PaginationInput,
  SearchQueryInput,
  UpdateUserInput,
} from "../schemas/user.schema";
import type { Prisma } from "generated/prisma";

export class UserService {
  static async getAllUsers(paginationInput: PaginationInput) {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = paginationInput;

    const skip = (page - 1) * limit;
    const take = limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: userSelectFields,
      }),
      prisma.user.count(),
    ]);

    const totalPages = Math.ceil(total / take);

    return {
      data: users,
      pagination: {
        total,
        page,
        limit: take,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  static async searchUsers(
    searchQuery: SearchQueryInput,
    paginationInput: PaginationInput
  ) {
    const { q } = searchQuery;
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = paginationInput;

    const skip = (page - 1) * limit;
    const take = limit;

    const whereClause = {
      OR: [
        { email: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
      ],
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause as Prisma.UserWhereInput,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: userSelectFields,
      }),
      prisma.user.count({ where: whereClause as Prisma.UserWhereInput }),
    ]);

    const totalPages = Math.ceil(total / take);

    return {
      data: users,
      query: q,
      pagination: {
        total,
        page,
        limit: take,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...userSelectFields,
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    if (!user) {
      throw notFound("User not found");
    }

    return user;
  }

  static async getCurrentUser(userId: string) {
    if (!userId) {
      throw badRequest("User ID not found in session");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...userSelectFields,
        _count: {
          select: {
            sessions: true,
            accounts: true,
          },
        },
      },
    });

    if (!user) {
      throw notFound("User not found");
    }

    return user;
  }

  static async updateUser(
    userId: string,
    requestUserId: string,
    updateData: UpdateUserInput
  ) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw notFound("User not found");
    }

    if (requestUserId !== userId) {
      throw forbidden("You can only update your own profile");
    }

    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: updateData.email },
      });

      if (emailExists) {
        throw conflict("Email already in use");
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      select: userSelectFields,
    });

    return updatedUser;
  }

  static async deleteUser(userId: string, requestUserId: string) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw notFound("User not found");
    }

    if (requestUserId !== userId) {
      throw forbidden("You can only delete your own account");
    }

    await prisma.user.delete({
      where: { id: userId },
    });
  }

  static async getUserStats() {
    const [totalUsers, verifiedUsers, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { emailVerified: true } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    return {
      total: totalUsers,
      verified: verifiedUsers,
      unverified: totalUsers - verifiedUsers,
      recentlyJoined: recentUsers,
    };
  }

  static async userExists(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    return !!user;
  }

  static async emailExists(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    return !!user;
  }
}
