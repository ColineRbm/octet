import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

// Verify JWT token and attach user info to request
export const verifyToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader == null) {
    res.sendStatus(401);
    return;
  }

  // Token format: "Bearer eyJhbGci..."
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      role: string;
    };

    req.user = decoded;

    next();
  } catch {
    res.sendStatus(401);
  }
};

// Verify user has admin role
export const isAdmin: RequestHandler = (req, res, next) => {
  if (req.user?.role !== "admin") {
    res.sendStatus(403);
    return;
  }
  next();
};
