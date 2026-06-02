import express from "express";

const router = express.Router();

import { isAdmin, verifyToken } from "./middlewares/authMiddleware";
import { validate } from "./middlewares/validateMiddleware";

// Auth routes (public)
import authActions from "./modules/auth/authActions";

router.post(
  "/api/auth/login",
  validate([
    { field: "email", required: true, type: "string", isEmail: true },
    { field: "password", required: true, type: "string", minLength: 6 },
  ]),
  authActions.login,
);

// Device routes
import deviceActions from "./modules/device/deviceActions";

router.get("/api/devices", verifyToken, deviceActions.browse);
router.get("/api/devices/my", verifyToken, deviceActions.readByUser);
router.get("/api/devices/:id", verifyToken, deviceActions.read);

router.post(
  "/api/devices",
  verifyToken,
  isAdmin,
  validate([
    {
      field: "brand",
      required: true,
      type: "string",
      minLength: 1,
      maxLength: 100,
    },
    {
      field: "type",
      required: true,
      type: "string",
      allowedValues: ["laptop", "desktop", "tablet"],
    },
    { field: "received_at", required: true, type: "string" },
    { field: "model", type: "string", maxLength: 100 },
    { field: "serial_number", type: "string", maxLength: 100 },
    { field: "donor", type: "string", maxLength: 150 },
  ]),
  deviceActions.add,
);

router.put(
  "/api/devices/:id/status",
  verifyToken,
  validate([
    {
      field: "status",
      required: true,
      type: "string",
      allowedValues: [
        "to_sort",
        "diagnosing",
        "repairing",
        "quality_check",
        "ready",
        "attributed",
        "unusable",
      ],
    },
  ]),
  deviceActions.editStatus,
);

router.put("/api/devices/:id/notes", verifyToken, deviceActions.editNotes);
router.delete("/api/devices/:id", verifyToken, isAdmin, deviceActions.destroy);

// User routes (admin only)
import userActions from "./modules/user/userActions";

router.get("/api/users", verifyToken, isAdmin, userActions.browse);
router.get("/api/users/:id", verifyToken, isAdmin, userActions.read);

router.post(
  "/api/users",
  verifyToken,
  isAdmin,
  validate([
    {
      field: "firstname",
      required: true,
      type: "string",
      minLength: 1,
      maxLength: 100,
    },
    {
      field: "lastname",
      required: true,
      type: "string",
      minLength: 1,
      maxLength: 100,
    },
    { field: "email", required: true, type: "string", isEmail: true },
    { field: "password", required: true, type: "string", minLength: 8 },
  ]),
  userActions.add,
);

router.put(
  "/api/users/:id/status",
  verifyToken,
  isAdmin,
  userActions.editStatus,
);

// Beneficiary routes (admin only)
import beneficiaryActions from "./modules/beneficiary/beneficiaryActions";

router.get(
  "/api/beneficiaries",
  verifyToken,
  isAdmin,
  beneficiaryActions.browse,
);
router.get(
  "/api/beneficiaries/:id",
  verifyToken,
  isAdmin,
  beneficiaryActions.read,
);

router.post(
  "/api/beneficiaries",
  verifyToken,
  isAdmin,
  validate([
    {
      field: "name",
      required: true,
      type: "string",
      minLength: 1,
      maxLength: 150,
    },
    { field: "firstname", type: "string", maxLength: 100 },
    {
      field: "structure_type",
      required: true,
      type: "string",
      allowedValues: ["family", "school", "association", "other"],
    },
    { field: "contact", type: "string", maxLength: 150 },
    { field: "address", type: "string", maxLength: 255 },
  ]),
  beneficiaryActions.add,
);

// Attribution routes (admin only)
import attributionActions from "./modules/attribution/attributionActions";

router.get(
  "/api/attributions",
  verifyToken,
  isAdmin,
  attributionActions.browse,
);
router.get(
  "/api/attributions/:id",
  verifyToken,
  isAdmin,
  attributionActions.read,
);

router.post(
  "/api/attributions",
  verifyToken,
  isAdmin,
  validate([
    { field: "device_id", required: true, type: "number" },
    { field: "beneficiary_id", required: true, type: "number" },
    {
      field: "cession_type",
      required: true,
      type: "string",
      allowedValues: ["donation", "cession"],
    },
    { field: "price", type: "number" },
  ]),
  attributionActions.add,
);

export default router;
