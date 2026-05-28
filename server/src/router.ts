import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Auth routes
import authActions from "./modules/auth/authActions";

router.post("/api/auth/login", authActions.login);

/* ************************************************************************* */

export default router;
