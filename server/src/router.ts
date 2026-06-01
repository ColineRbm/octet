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

/* ************************************************************************* */

export default router;
