import { Router } from "oak";
import authenticateToken from "@/middlewares/auth.middleware.js";
import RatingController from "./rating.controller.js";
import { validateBody } from "../../middlewares/base.middleware.js";
import { rateSchema } from "./rating.validation.js";

const router = new Router();

router.get(
    "/sort/highest-rated",
    authenticateToken,
    RatingController.sortHighestRatedMedia
);

router.get(
    "/sort/most-recent",
    authenticateToken,
    RatingController.sortMostRecentMedia
);

router.put(
    "/rate-media",
    authenticateToken,
    validateBody(rateSchema),
    RatingController.rateMedia
);

export default router;
