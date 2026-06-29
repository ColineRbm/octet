import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import deviceRepository from "../device/deviceRepository";
import logRepository from "../log/logRepository";
import attributionRepository from "./attributionRepository";

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
      res.sendStatus(StatusCodes.NOT_FOUND);
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

    const insertId = await attributionRepository.create(newAttribution);

    await deviceRepository.updateStatus(
      newAttribution.device_id,
      "attributed",
      null,
    );

    await logRepository.create("attribution_created", req.user?.id ?? null, {
      attribution_id: insertId,
      device_id: newAttribution.device_id,
      beneficiary_id: newAttribution.beneficiary_id,
      cession_type: newAttribution.cession_type,
      price: newAttribution.price,
    });

    res.status(StatusCodes.CREATED).json({ insertId });
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add };
