import { client } from "../../cores/config/postgresql.config.js";
import transformMediaList from "../../utils/transformMedia.utils.js";
import RatingQuery from "./rating.query.js";
import UserService from "@/features/users/user.service.js";
import MediaService from "@/features/media/media.service.js";

const RatingService = {
    getUserRating: async ({ userId, mediaId }) => {
        const result = await client.queryObject({
            text: RatingQuery.getUserRating,
            args: [userId, mediaId],
        });
        return result.rows[0]?.value ?? 0;
    },

    /**
     * Core Rating Function - Handle user rating actions (like/dislike/unrate/switch)
     *
     * This is the central function for all rating operations in the application.
     * It handles four main scenarios:
     * 1. LIKE: User rates media positively for the first time
     * 2. DISLIKE: User rates media negatively for the first time
     * 3. UNRATE: User removes their existing rating (clicks same rating again)
     * 4. SWITCH: User changes from like to dislike or vice versa
     *
     * Key Features:
     * - Self-rating allowed: Users can rate their own media
     * - Points calculation: Only other-ratings affect author's points
     * - Real-time updates: Media stats and user points updated immediately
     *
     * @param {Object} params - Rating parameters
     * @param {number} params.userId - ID of user performing the rating
     * @param {number} params.mediaId - ID of media being rated
     * @param {number} params.value - Rating value (1 for like, -1 for dislike)
     * @returns {Object} Rating result with action details and updated media info
     */
    rateMedia: async ({ userId, mediaId, value }) => {
        // Get media information to identify the author
        const mediaResult = await client.queryObject({
            text: RatingQuery.getMediaAuthorId,
            args: [mediaId],
        });

        const authorId = mediaResult.rows[0]?.author_id;
        if (!authorId) {
            throw new Error("Media not found");
        }

        // Check if this is a self-rating (user rating their own media)
        const isSelfRate = Number(authorId) === Number(userId);

        // Get user's current rating on this media (0 if no rating exists)
        const prevValue = await RatingService.getUserRating({
            userId,
            mediaId,
        });

        let action;
        let currentValue;

        // Scenario 1: UNRATE - User clicks the same rating again
        if (prevValue === value) {
            // Remove the existing rating
            await RatingService.unrateMedia({ userId, mediaId });
            action = "UNRATE";
            currentValue = 0;
        }
        // Scenario 2: NEW RATING or SWITCH - User rates or changes rating
        else {
            // Update or insert the rating in database
            await client.queryObject({
                text: RatingQuery.rateMedia,
                args: [userId, mediaId, value],
            });

            if (prevValue === 0) {
                // New rating (user hasn't rated this media before)
                action = value === 1 ? "LIKE" : "DISLIKE";
            } else {
                // Switching from one rating to another (like ↔ dislike)
                action = "SWITCH";
            }

            currentValue = value;
        }

        // Update author's points based on others' ratings only
        // Self-ratings are excluded from points calculation in SQL query
        // If author is rating their own media, points won't change; skip extra query
        if (!isSelfRate) {
            await UserService.recalculateAndUpdateUserPoint(Number(authorId));
        }

        // Get updated media information with all current statistics
        // This returns the media with updated positive/negative counts, etc.
        const updatedMedia = await MediaService.getMediaById({
            userId,
            mediaId,
        });

        return {
            action, // Action performed (LIKE/DISLIKE/UNRATE/SWITCH)
            previousValue: prevValue, // User's previous rating (0 if none)
            currentValue, // User's new rating (0 if unrate)
            media: updatedMedia, // Complete updated media object with stats
        };
    },

    unrateMedia: async ({ userId, mediaId, skipPointUpdate = false }) => {
        // Get media author before deleting rating
        const mediaResult = await client.queryObject({
            text: RatingQuery.getMediaAuthorId,
            args: [mediaId],
        });

        const authorId = mediaResult.rows[0]?.author_id;
        if (!authorId) {
            throw new Error("Media not found");
        }

        // Delete the rating
        const result = await client.queryObject({
            text: RatingQuery.unrateMedia,
            args: [userId, mediaId],
        });

        // Update author's points if not self-rating and not skipping update
        if (!skipPointUpdate && Number(authorId) !== Number(userId)) {
            await UserService.recalculateAndUpdateUserPoint(Number(authorId));
        }

        return result.rows[0];
    },

    sortHighestRatedMedia: async ({ userId, page = 1, limit = 10 }) => {
        const offset = (page - 1) * limit;

        const result = await client.queryObject({
            text: RatingQuery.sortHighestRated,
            args: [userId, limit, offset],
        });

        const totalResult = await client.queryObject({
            text: RatingQuery.countMediaForPagination,
        });

        return {
            currentPage: page,
            limit,
            totalPage: Math.ceil(totalResult.rows[0].total / limit),
            media: transformMediaList(result.rows),
        };
    },

    sortMostRecentMedia: async ({ userId, page = 1, limit = 10 }) => {
        const offset = (page - 1) * limit;

        const result = await client.queryObject({
            text: RatingQuery.sortMostRecent,
            args: [userId, limit, offset],
        });

        const countResult = await client.queryObject({
            text: RatingQuery.countMediaForPagination,
        });

        const total = Number(countResult.rows[0].total);
        const totalPage = Math.ceil(total / limit);

        const transformedMedia = transformMediaList(result.rows);

        return {
            currentPage: page,
            limit: limit,
            totalPage: totalPage,
            media: transformedMedia,
        };
    },
};

export default RatingService;
