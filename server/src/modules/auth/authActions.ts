import argon2 from "argon2";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import logRepository from "../log/logRepository";
import authRepository from "./authRepository";

// POST /api/auth/login
const login: RequestHandler = async (req, res, next) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Find user by email in database
    const user = await authRepository.findByEmail(email);

    // If user not found, respond with HTTP 401 (Unauthorized)
    if (user == null) {
      await logRepository.create("login_failed", null, {
        email,
        reason: "user_not_found",
      });
      res.sendStatus(401);
      return;
    }

    // Verify password with argon2
    const isPasswordValid = await argon2.verify(user.password_hash, password);

    // If password is wrong, respond with HTTP 401 (Unauthorized)
    if (!isPasswordValid) {
      await logRepository.create("login_failed", user.id, {
        email,
        reason: "wrong_password",
      });
      res.sendStatus(401);
      return;
    }

    // Generate JWT token with user info
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" },
    );

    // Log successful login
    await logRepository.create("login_success", user.id, { email });

    // Respond with token and user info
    res.json({
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default { login };
