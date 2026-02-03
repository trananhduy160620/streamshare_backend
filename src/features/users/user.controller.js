import { StatusCodes } from "http-status-codes";
import { logger } from "@/utils/logger.utils.js";
import { genAccessToken } from "@/utils/jwt.utils.js";
import { sendError, sendSuccess } from "@/utils/response.utils.js";
import { comparePassword, hashPassword } from "@/utils/brcypt.utils.js";
import UserService from "./user.service.js";

const UserController = {
    register: async (ctx) => {
        try {
            const hashedPassword = await hashPassword(ctx.state.body.password);
            const payload = {
                name: ctx.state.body.displayName,
                username: ctx.state.body.username,
                password: hashedPassword,
            };
            const res = await UserService.createUser(payload);
            return sendSuccess(
                ctx,
                "Your account is registered successfully. Please login with your new account.",
                res,
            );
        } catch (error) {
            logger.error(`[UserController] [register] ${error}.`);
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },

    login: async (ctx) => {
        try {
            const payload = {
                username: ctx.state.body.username,
                password: ctx.state.body.password,
            };

            const existUser = await UserService.findUserByUsername(
                payload.username,
            );
            if (!existUser) {
                return sendError(
                    ctx,
                    "Username is not correct. Please try again.",
                );
            }

            const validPassword = await comparePassword(
                payload.password,
                existUser.password,
            );
            if (!validPassword) {
                return sendError(
                    ctx,
                    "Password is not correct. Please try again.",
                );
            }

            const accessToken = await genAccessToken({
                payload: { userId: existUser.id },
            });

            return sendSuccess(ctx, `Welcome ${existUser.name}!`, {
                accessToken,
                displayName: existUser.name,
            });
        } catch (error) {
            logger.error(`[UserController] [login] ${error}.`);
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },

    getDisplayName: async (ctx) => {
        try {
            const payload = {
                userId: ctx.state.user.userId,
            };

            const existUser = await UserService.getDisplayName(payload.userId);

            return sendSuccess(ctx, `Welcome ${existUser.name}!`, {
                displayName: existUser.name,
            });
        } catch (error) {
            logger.error(`[UserController] [getDisplayName] ${error}.`);
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },

    getScoreSummary: async (ctx) => {
        try {
            const userId = Number(ctx.state.user.userId);
            const summary = await UserService.getUserScoreSummary(userId);

            return sendSuccess(ctx, "Get score summary successfully", {
                positive: Number(summary.positive ?? 0),
                negative: Number(summary.negative ?? 0),
                points: Number(summary.points ?? 0),
                selfPositive: Number(summary.self_positive ?? 0),
                selfNegative: Number(summary.self_negative ?? 0),
                totalMediaCount: Number(summary.total_media_count ?? 0),
                totalRatings: Number(summary.total_ratings ?? 0),
            });
        } catch (error) {
            logger.error(`[UserController] [getScoreSummary] ${error}.`);
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },

    getHiddenCount: async (ctx) => {
        try {
            const userId = Number(ctx.state.user.userId);
            const hiddenCount = await UserService.getUserHiddenCount(userId);

            return sendSuccess(ctx, "Get hidden count successfully", {
                hidden_count: Number(hiddenCount),
            });
        } catch (error) {
            logger.error(`[UserController] [getHiddenCount] ${error}.`);
            return sendError(
                ctx,
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    },
};

export default UserController;
