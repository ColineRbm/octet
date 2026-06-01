import type { RequestHandler } from "express";

import attributionRepository from "./attributionRepository";
import deviceRepository from "../device/deviceRepository";

// Browse - GET /api/attributions
const browse: RequestHandler = async (req, res, next) => {
  try {
    const attributions = await attributionRepository.readAll();
    res.json(attributions);
  } catch (err) {
    next(err);
  }
};

// Read - GET /api/attributions/:id
const read: RequestHandler = async (req, res, next) => {
  try {
    const attributionId = Number(req.params.id);
    const attribution = await attributionRepository.read(attributionId);

    if (attribution == null) {
      res.sendStatus(404);
    } else {
      res.json(attribution);
    }
  } catch (err) {
    next(err);
  }
};

// Add - POST /api/attributions
const add: RequestHandler = async (req, res, next) => {
  try {
    const newAttribution = {
      device_id: req.body.device_id,
      beneficiary_id: req.body.beneficiary_id,
      user_id: req.user?.id as number,
      cession_type: req.body.cession_type ?? "donation",
      price: req.body.price ?? 0,
      notes: req.body.notes ?? null,
    };

    // Create the attribution
    const insertId = await attributionRepository.create(newAttribution);

    // Update device status to "attributed"
    await deviceRepository.updateStatus(
      newAttribution.device_id,
      "attributed",
      null,
    );

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add };
