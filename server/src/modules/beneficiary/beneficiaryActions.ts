import type { RequestHandler } from "express";

import logRepository from "../log/logRepository";
import beneficiaryRepository from "./beneficiaryRepository";

// Browse - GET /api/beneficiaries
const browse: RequestHandler = async (req, res, next) => {
  try {
    const beneficiaries = await beneficiaryRepository.readAll();
    res.json(beneficiaries);
  } catch (err) {
    next(err);
  }
};

// Read - GET /api/beneficiaries/:id
const read: RequestHandler = async (req, res, next) => {
  try {
    const beneficiaryId = Number(req.params.id);
    const beneficiary = await beneficiaryRepository.read(beneficiaryId);

    if (beneficiary == null) {
      res.sendStatus(404);
    } else {
      res.json(beneficiary);
    }
  } catch (err) {
    next(err);
  }
};

// Add - POST /api/beneficiaries
const add: RequestHandler = async (req, res, next) => {
  try {
    const newBeneficiary = {
      name: req.body.name,
      firstname: req.body.firstname ?? null,
      structure_type: req.body.structure_type,
      contact: req.body.contact ?? null,
      address: req.body.address ?? null,
    };

    const insertId = await beneficiaryRepository.create(newBeneficiary);

    await logRepository.create("beneficiary_created", req.user?.id ?? null, {
      beneficiary_id: insertId,
      name: newBeneficiary.name,
      structure_type: newBeneficiary.structure_type,
    });

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add };
