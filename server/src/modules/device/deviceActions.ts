import type { RequestHandler } from "express";

import deviceRepository from "./deviceRepository";

// Browse - GET /api/devices
const browse: RequestHandler = async (req, res, next) => {
  try {
    const devices = await deviceRepository.readAll();
    res.json(devices);
  } catch (err) {
    next(err);
  }
};

// Read - GET /api/devices/:id
const read: RequestHandler = async (req, res, next) => {
  try {
    const deviceId = Number(req.params.id);
    const device = await deviceRepository.read(deviceId);

    if (device == null) {
      res.sendStatus(404);
    } else {
      res.json(device);
    }
  } catch (err) {
    next(err);
  }
};

// Add - POST /api/devices
const add: RequestHandler = async (req, res, next) => {
  try {
    const newDevice = {
      type: req.body.type,
      brand: req.body.brand,
      model: req.body.model ?? null,
      status: req.body.status ?? "to_sort",
      received_at: req.body.received_at,
      serial_number: req.body.serial_number ?? null,
      donor: req.body.donor ?? null,
      general_condition: req.body.general_condition ?? null,
      accessories: req.body.accessories ?? null,
      notes: req.body.notes ?? null,
      added_by_user_id: req.user?.id as number,
      assigned_to_user_id: null,
    };

    const insertId = await deviceRepository.create(newDevice);
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

// Edit - PUT /api/devices/:id/status
const editStatus: RequestHandler = async (req, res, next) => {
  try {
    const deviceId = Number(req.params.id);
    const { status, assigned_to_user_id } = req.body;

    const affectedRows = await deviceRepository.updateStatus(
      deviceId,
      status,
      assigned_to_user_id ?? null,
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

// Destroy - DELETE /api/devices/:id
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const deviceId = Number(req.params.id);
    const affectedRows = await deviceRepository.delete(deviceId);

    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, editStatus, destroy };
