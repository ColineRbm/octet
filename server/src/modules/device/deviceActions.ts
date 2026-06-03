import type { RequestHandler } from "express";

import deviceRepository from "./deviceRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const devices = await deviceRepository.readAll();
    res.json(devices);
  } catch (err) {
    next(err);
  }
};

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

const editStatus: RequestHandler = async (req, res, next) => {
  try {
    const deviceId = Number(req.params.id);
    const { status, assigned_to_user_id } = req.body;
    const userId = req.user?.id as number;

    const affectedRows = await deviceRepository.updateStatus(
      deviceId,
      status,
      assigned_to_user_id ?? null,
    );

    if (affectedRows === 0) {
      res.sendStatus(404);
      return;
    }

    // Trace l'action bénévole
    const tracedActions = [
      "diagnosing",
      "repairing",
      "quality_check",
      "unusable",
      "ready",
    ];
    if (tracedActions.includes(status)) {
      await deviceRepository.createAction(deviceId, userId, status);
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const deviceId = Number(req.params.id);

    const device = await deviceRepository.read(deviceId);
    if (!device) {
      res.sendStatus(404);
      return;
    }

    if (device.status !== "to_sort") {
      res.status(409).json({
        error:
          "Seuls les appareils en statut 'À trier' peuvent être supprimés.",
      });
      return;
    }

    await deviceRepository.delete(deviceId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const readByUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id as number;
    const devices = await deviceRepository.readByUser(userId);
    res.json(devices);
  } catch (err) {
    next(err);
  }
};

const readActionsByUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id as number;
    const actions = await deviceRepository.readActionsByUser(userId);
    res.json(actions);
  } catch (err) {
    next(err);
  }
};

const editNotes: RequestHandler = async (req, res, next) => {
  try {
    const deviceId = Number(req.params.id);
    const { notes } = req.body;

    const affectedRows = await deviceRepository.updateNotes(deviceId, notes);

    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

export default {
  browse,
  read,
  add,
  editStatus,
  editNotes,
  readByUser,
  readActionsByUser,
  destroy,
};
