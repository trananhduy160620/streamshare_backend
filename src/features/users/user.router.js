import { Router } from "oak";
import { validateBody } from "@/middlewares/base.middleware.js";
import authenticateToken from "@/middlewares/auth.middleware.js";
import { registerSchema } from "./user.validation.js";
import UserController from "./user.controller.js";

const router = new Router();

router.post("/register", validateBody(registerSchema), UserController.register);
router.post("/login", UserController.login);
router.get("/display-name", authenticateToken, UserController.getDisplayName);
router.get("/score-summary", authenticateToken, UserController.getScoreSummary);
router.get("/hidden-count", authenticateToken, UserController.getHiddenCount);

export default router;
