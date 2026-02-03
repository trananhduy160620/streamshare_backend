import { client } from "@/cores/config/postgresql.config.js";
import MediaQuery from "./media.query.js";
import transformMediaList, {
    transformMedia,
} from "@/utils/transformMedia.utils.js";

const SortType = Object.freeze({
    highestRated: "highestRated", // Sort by Highest Rated
    mostRecent: "mostRecent", // Sort by Most Recent (nearest rating)
    latest: "latest", // Sort by ordering (created_at)
    default: "latest", // Default is latest
});

const MediaService = {
    createMedia: async ({ title, description, url, authorId }) => {
        const result = await client.queryObject({
            text: MediaQuery.insertMedia,
            args: [title, description, url, authorId],
        });

        return result.rows[0];
    },

    getListLatestMedia: async ({ userId = null, page = 1, limit = 10 }) => {
        const offset = (page - 1) * limit;

        const result = await client.queryObject({
            text: MediaQuery.latestMedia,
            args: [userId, limit, offset],
        });

        const countResult = await client.queryObject({
            text: MediaQuery.countMedia,
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

    getPositiveMedia: async ({
        userId,
        page = 1,
        limit = 10,
        sortType = SortType.default,
    }) => {
        const offset = (page - 1) * limit;

        const result = await client.queryObject({
            text: MediaQuery.positiveMedia,
            args: [userId, sortType, limit, offset],
        });

        const countResult = await client.queryObject({
            text: MediaQuery.countPositiveMedia,
            args: [userId],
        });
        const total = Number(countResult.rows[0].total);
        const totalPage = Math.ceil(total / limit);

        const transformedMedia = transformMediaList(result.rows);

        return {
            currentPage: page,
            limit,
            totalPage,
            media: transformedMedia,
        };
    },

    getNegativeMedia: async ({
        userId,
        page = 1,
        limit = 10,
        sortType = SortType.default,
    }) => {
        const offset = (page - 1) * limit;

        const result = await client.queryObject({
            text: MediaQuery.negativeMedia,
            args: [userId, sortType, limit, offset],
        });

        const countResult = await client.queryObject({
            text: MediaQuery.countNegativeMedia,
            args: [userId],
        });

        const total = Number(countResult.rows[0].total);
        const totalPage = Math.ceil(total / limit);

        const transformedMedia = transformMediaList(result.rows);

        return {
            currentPage: page,
            limit,
            totalPage,
            media: transformedMedia,
        };
    },

    getHiddenMedia: async ({
        userId,
        page = 1,
        limit = 10,
        sortType = SortType.default,
    }) => {
        const offset = (page - 1) * limit;

        const result = await client.queryObject({
            text: MediaQuery.hiddenMedia,
            args: [userId, sortType, limit, offset],
        });

        const countResult = await client.queryObject({
            text: MediaQuery.countHiddenMedia,
            args: [userId],
        });

        const total = Number(countResult.rows[0].total);
        const totalPage = Math.ceil(total / limit);

        const transformedMedia = transformMediaList(result.rows);

        return {
            currentPage: page,
            limit,
            totalPage,
            media: transformedMedia,
        };
    },

    getUserPublishedMedia: async ({ userId, page = 1, limit = 10 }) => {
        const offset = (page - 1) * limit;

        const result = await client.queryObject({
            text: MediaQuery.getUserPublishedMedia,
            args: [userId, limit, offset],
        });

        const countResult = await client.queryObject({
            text: MediaQuery.countUserPublishedMedia,
            args: [userId],
        });

        const total = Number(countResult.rows[0].total);
        const totalPage = Math.ceil(total / limit);

        const transformedMedia = transformMediaList(result.rows);

        return {
            currentPage: page,
            limit,
            totalPage,
            media: transformedMedia,
        };
    },

    getMediaById: async ({ userId, mediaId }) => {
        const result = await client.queryObject({
            text: MediaQuery.getMediaById,
            args: [userId, mediaId],
        });

        if (result.rows.length === 0) {
            throw new Error("Media not found");
        }

        return transformMedia(result.rows[0]);
    },

    hideMedia: async ({ userId, mediaId }) => {
        // Check if media exists
        const mediaResult = await client.queryObject({
            text: MediaQuery.getMediaById,
            args: [userId, mediaId],
        });

        if (mediaResult.rows.length === 0) {
            throw new Error("Media not found");
        }

        // Add to hidden media
        const result = await client.queryObject({
            text: MediaQuery.addHiddenMedia,
            args: [userId, mediaId],
        });

        return result.rows[0];
    },

    unhideMedia: async ({ userId, mediaId }) => {
        // Remove from hidden media
        const result = await client.queryObject({
            text: MediaQuery.removeHiddenMedia,
            args: [userId, mediaId],
        });

        return result.rows[0];
    },

    toggleHideMedia: async ({ userId, mediaId }) => {
        // Check if media is currently hidden
        const checkResult = await client.queryObject({
            text: MediaQuery.checkHiddenMedia,
            args: [userId, mediaId],
        });

        const isHidden = checkResult.rows.length > 0;

        if (isHidden) {
            // Unhide the media
            const result = await MediaService.unhideMedia({ userId, mediaId });
            return {
                action: "UNHIDE",
                hidden: false,
                media: result,
            };
        } else {
            // Hide the media
            const result = await MediaService.hideMedia({ userId, mediaId });
            return {
                action: "HIDE",
                hidden: true,
                media: result,
            };
        }
    },
};

export default MediaService;
