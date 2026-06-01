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
/* ************************************************************************* */

export default router;
