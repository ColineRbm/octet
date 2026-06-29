import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

// Verify JWT token and attach user info to request
export const verifyToken: RequestHandler = (req, res, next) => {
  const token = req.cookies?.token;

  if (token == null) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      role: string;
    };

    req.user = decoded;

    next();
  } catch {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
};

// Verify user has admin role
export const isAdmin: RequestHandler = (req, res, next) => {
  if (req.user?.role !== "admin") {
    res.sendStatus(StatusCodes.FORBIDDEN);
    return;
  }
  next();
};
