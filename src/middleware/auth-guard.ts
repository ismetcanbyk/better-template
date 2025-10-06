import { Request, Response, NextFunction } from "express";
import { unauthorized } from "./error-handler";
import { auth } from "../auth";

export interface AuthenticatedRequest extends Request {
  user?: typeof auth.$Infer.Session.user | null;
  session?: typeof auth.$Infer.Session.session | null;
}

export const authGuard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      throw unauthorized("Authentication required");
    }

    // User bilgilerini request'e ekle
    req.user = session.user;
    req.session = session.session;

    next();
  } catch (error) {
    next(error);
  }
};

// Opsiyonel auth - session varsa ekle, yoksa devam et
export const optionalAuth = async (
  req: AuthenticatedRequest,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (session) {
      req.user = session.user;
      req.session = session.session;
    }

    next();
  } catch (error) {
    // Hata olsa bile devam et
    next();
  }
};

// Email doğrulama kontrolü
export const requireEmailVerified = (
  req: AuthenticatedRequest,
  next: NextFunction
) => {
  if (!req.user) {
    return next(unauthorized("Authentication required"));
  }

  if (!req.user.emailVerified) {
    return next(unauthorized("Email verification required"));
  }

  next();
};
