import { StatusCodes } from "http-status-codes";
import { logger } from "@/utils/logger.utils.js";
import { sendError, sendSuccess } from "@/utils/response.utils.js";
import RatingService from "./rating.service.js";

const RatingController = {
    rateMedia: async (ctx) => {
        try {
            const payload = {
                userId: Number(ctx.state.user.userId),
                mediaId: Number(ctx.state.body.mediaId),
                value: Number(ctx.state.body.value),
            };
            const res = await RatingService.rateMedia(payload);
            return sendSuccess(ctx, "Rate media successfully", res);
        } catch (error) {
            logger.error(`[RatingController] [rateMedia] ${error}.`);
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },

    sortHighestRatedMedia: async (ctx) => {
        try {
            const payload = {
                userId: Number(ctx.state.user.userId),
                page: Number(ctx.request.url.searchParams.get("page") || 1),
                limit: Number(ctx.request.url.searchParams.get("limit") || 10),
            };
            const res = await RatingService.sortHighestRatedMedia(payload);
            return sendSuccess(
                ctx,
                "Sort highest rated media successfully",
                res,
            );
        } catch (error) {
            logger.error(
                `[RatingController] [sortHighestRatedMedia] ${error}.`,
            );
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },

    sortMostRecentMedia: async (ctx) => {
        try {
            const payload = {
                userId: Number(ctx.state.user.userId),
                page: Number(ctx.request.url.searchParams.get("page") || 1),
                limit: Number(ctx.request.url.searchParams.get("limit") || 10),
            };
            const res = await RatingService.sortMostRecentMedia(payload);
            return sendSuccess(ctx, "Sort most recent media successfully", res);
        } catch (error) {
            logger.error(`[RatingController] [sortMostRecentMedia] ${error}.`);
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },
};

export default RatingController;
