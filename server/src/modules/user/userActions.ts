import type { RequestHandler } from "express";
import argon2 from "argon2";

import userRepository from "./userRepository";

// Browse - GET /api/users
const browse: RequestHandler = async (req, res, next) => {
  try {
    const users = await userRepository.readAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Read - GET /api/users/:id
const read: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const user = await userRepository.read(userId);

    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
};

// Add - POST /api/users
const add: RequestHandler = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Hash the password before storing it
    const password_hash = await argon2.hash(password);

    const insertId = await userRepository.create({
      firstname,
      lastname,
      email,
      password_hash,
    });

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

// Edit - PUT /api/users/:id/status
const editStatus: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const { is_active } = req.body;

    const affectedRows = await userRepository.updateActiveStatus(
      userId,
      is_active,
    );

    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, editStatus };
