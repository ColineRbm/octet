import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Auth routes (public - no token required)
import authActions from "./modules/auth/authActions";

router.post("/api/auth/login", authActions.login);

/* ************************************************************************* */

// Protected routes (token required)
import { isAdmin, verifyToken } from "./middlewares/authMiddleware";

// Device routes
import deviceActions from "./modules/device/deviceActions";

router.get("/api/devices", verifyToken, deviceActions.browse);
router.get("/api/devices/:id", verifyToken, deviceActions.read);
router.post("/api/devices", verifyToken, isAdmin, deviceActions.add);
router.put("/api/devices/:id/status", verifyToken, deviceActions.editStatus);
router.delete("/api/devices/:id", verifyToken, isAdmin, deviceActions.destroy);

// User routes (admin only)
import userActions from "./modules/user/userActions";

router.get("/api/users", verifyToken, isAdmin, userActions.browse);
router.get("/api/users/:id", verifyToken, isAdmin, userActions.read);
router.post("/api/users", verifyToken, isAdmin, userActions.add);
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
router.post("/api/beneficiaries", verifyToken, isAdmin, beneficiaryActions.add);

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
router.post("/api/attributions", verifyToken, isAdmin, attributionActions.add);

/* ************************************************************************* */

export default router;
