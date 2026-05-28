import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

// Verify JWT token and attach user info to request
export const verifyToken: RequestHandler = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  // If no token, reject with 401
  if (authHeader == null) {
    res.sendStatus(401);
    return;
  }

  // Token format: "Bearer eyJhbGci..."
  const token = authHeader.split(" ")[1];

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      role: string;
    };

    // Attach user info to request for use in actions
    req.user = decoded;

    // Continue to next middleware or action
    next();
  } catch {
    // Token is invalid or expired
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
