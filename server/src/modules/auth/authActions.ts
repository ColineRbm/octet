import argon2 from "argon2";
import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import logRepository from "../log/logRepository";
import authRepository from "./authRepository";

// POST /api/auth/login
const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authRepository.findByEmail(email);

    if (user == null) {
      await logRepository.create("login_failed", null, {
        email,
        reason: "user_not_found",
      });
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    }

    const isPasswordValid = await argon2.verify(user.password_hash, password);

    if (!isPasswordValid) {
      await logRepository.create("login_failed", user.id, {
        email,
        reason: "wrong_password",
      });
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    await logRepository.create("login_success", user.id, { email });

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

// POST /api/auth/logout
const logout: RequestHandler = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.sendStatus(StatusCodes.NO_CONTENT);
};

export default { login, logout };
