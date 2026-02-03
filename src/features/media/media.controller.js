import { StatusCodes } from "http-status-codes";
import { logger } from "@/utils/logger.utils.js";
import { sendError, sendSuccess } from "@/utils/response.utils.js";
import MediaService from "./media.service.js";

const MediaController = {
    createMedia: async (ctx) => {
        try {
            const payload = {
                title: ctx.state.body.title,
                description: ctx.state.body.description,
                url: ctx.state.body.url,
                authorId: Number(ctx.state.user.userId), // ✅ Use authenticated user ID
            };

            const res = await MediaService.createMedia(payload);

            return sendSuccess(ctx, "Create media successfully", res);
        } catch (error) {
            logger.error(`[MediaController] [createMedia] ${error}.`);
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },

    getListLatestMedia: async (ctx) => {
        try {
            const payload = {
                userId: Number(ctx.state.user.userId),
                page: Number(ctx.request.url.searchParams.get("page") || 1),
                limit: Number(ctx.request.url.searchParams.get("limit") || 10),
            };
            const res = await MediaService.getListLatestMedia(payload);
            return sendSuccess(ctx, "Get list latest media successfully", res);
        } catch (error) {
            logger.error(`[MediaController] [getListLatestMedia] ${error}.`);
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },

    getListPositiveMedia: async (ctx) => {
        try {
            const payload = {
                userId: Number(ctx.state.user?.userId || 0), // Safe fallback
                sortType:
                    ctx.request.url.searchParams.get("sortType") || "latest", // Default to "latest"
                page: Number(ctx.request.url.searchParams.get("page") || 1),
                limit: Number(ctx.request.url.searchParams.get("limit") || 10),
            };
            const res = await MediaService.getPositiveMedia(payload);
            return sendSuccess(
                ctx,
                "Get list positive media successfully",
                res,
            );
        } catch (error) {
            logger.error(`[MediaController] [getListPositiveMedia] ${error}.`);
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },

    getListNegativeMedia: async (ctx) => {
        try {
            const payload = {
                userId: Number(ctx.state.user?.userId || 0), // Safe fallback
                sortType:
                    ctx.request.url.searchParams.get("sortType") || "latest", // Default to "latest"
                page: Number(ctx.request.url.searchParams.get("page") || 1),
                limit: Number(ctx.request.url.searchParams.get("limit") || 10),
            };
            const res = await MediaService.getNegativeMedia(payload);
            return sendSuccess(
                ctx,
                "Get list negative media successfully",
                res,
            );
        } catch (error) {
            logger.error(`[MediaController] [getListNegativeMedia] ${error}.`);
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },

    getListHiddenMedia: async (ctx) => {
        try {
            const payload = {
                userId: Number(ctx.state.user?.userId || 0), // Safe fallback
                sortType:
                    ctx.request.url.searchParams.get("sortType") || "latest", // Default to "latest"
                page: Number(ctx.request.url.searchParams.get("page") || 1),
                limit: Number(ctx.request.url.searchParams.get("limit") || 10),
            };
            const res = await MediaService.getHiddenMedia(payload);
            return sendSuccess(ctx, "Get list hidden media successfully", res);
        } catch (error) {
            logger.error(`[MediaController] [getListHiddenMedia] ${error}.`);
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },

    getUserPublishedMedia: async (ctx) => {
        try {
            const payload = {
                userId: Number(ctx.state.user?.userId || 0),
                page: Number(ctx.request.url.searchParams.get("page") || 1),
                limit: Number(ctx.request.url.searchParams.get("limit") || 10),
            };
            const res = await MediaService.getUserPublishedMedia(payload);
            return sendSuccess(
                ctx,
                "Get user published media successfully",
                res,
            );
        } catch (error) {
            logger.error(`[MediaController] [getUserPublishedMedia] ${error}.`);
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },

    hideMedia: async (ctx) => {
        try {
            const payload = {
                userId: Number(ctx.state.user.userId),
                mediaId: Number(ctx.state.body.mediaId),
            };
            const res = await MediaService.hideMedia(payload);
            return sendSuccess(ctx, "Media hidden successfully", res);
        } catch (error) {
            logger.error(`[MediaController] [hideMedia] ${error}.`);
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },

    unhideMedia: async (ctx) => {
        try {
            const payload = {
                userId: Number(ctx.state.user.userId),
                mediaId: Number(ctx.state.body.mediaId),
            };
            const res = await MediaService.unhideMedia(payload);
            return sendSuccess(ctx, "Media unhidden successfully", res);
        } catch (error) {
            logger.error(`[MediaController] [unhideMedia] ${error}.`);
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },

    toggleHideMedia: async (ctx) => {
        try {
            const payload = {
                userId: Number(ctx.state.user.userId),
                mediaId: Number(ctx.state.body.mediaId),
            };

            // Debug logging
            logger.info(
                `[MediaController] [toggleHideMedia] User: ${payload.userId}, Media: ${payload.mediaId}`,
            );

            const res = await MediaService.toggleHideMedia(payload);

            // Debug response
            logger.info(
                `[MediaController] [toggleHideMedia] Action: ${res.action}, Hidden: ${res.hidden}`,
            );

            return sendSuccess(
                ctx,
                `Media ${res.action.toLowerCase()}d successfully`,
                res,
            );
        } catch (error) {
            logger.error(`[MediaController] [toggleHideMedia] ${error}.`);
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },
};

export default MediaController;
