import { Router } from "oak";
import { validateBody } from "@/middlewares/base.middleware.js";
import authenticateToken from "@/middlewares/auth.middleware.js";
import {
    createMediaSchema,
    toggleHideMediaSchema,
} from "./media.validation.js";
import MediaController from "./media.controller.js";

const router = new Router();

router.get(
    "/latest", 
    authenticateToken, 
    MediaController.getListLatestMedia
);

router.get(
    "/positive",
    authenticateToken,
    MediaController.getListPositiveMedia,
);

router.get(
    "/negative",
    authenticateToken,
    MediaController.getListNegativeMedia,
);

router.get(
    "/hidden", 
    authenticateToken, 
    MediaController.getListHiddenMedia
);

router.post(
    "/create-media",
    authenticateToken,
    validateBody(createMediaSchema),
    MediaController.createMedia,
);

// Hide/Unhide media endpoints
router.post(
    "/hide", 
    authenticateToken, 
    MediaController.hideMedia
);

router.post(
    "/unhide", 
    authenticateToken, 
    MediaController.unhideMedia
);

router.post(
    "/toggle-hide",
    authenticateToken,
    validateBody(toggleHideMediaSchema),
    MediaController.toggleHideMedia,
);

export default router;
