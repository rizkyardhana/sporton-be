import { Router } from "express";
import { signin, initiateAdmin, getProfile } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middlwares";

const router = Router();

router.post("/signin", signin);
router.post("/initiate-admin-user", initiateAdmin);

// Protected route - requires authentication
router.get("/profile", authenticate, getProfile);

export default router;
