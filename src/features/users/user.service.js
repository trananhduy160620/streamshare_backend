import { client } from "@/cores/config/postgresql.config.js";
import { UserQuery } from "./user.query.js";

const UserService = {
    createUser: async ({ name, username, password }) => {
        const result = await client.queryObject({
            text: UserQuery.insertUser,
            args: [name, username, password],
        });

        return result.rowCount > 0;
    },

    findUserByUsername: async (username) => {
        const result = await client.queryObject({
            text: UserQuery.findUserByUsername,
            args: [username.trim().toLowerCase()],
        });
        return result.rows[0];
    },

    getDisplayName: async (id) => {
        const result = await client.queryObject({
            text: UserQuery.findUserById,
            args: [id],
        });
        return result.rows[0];
    },

    /**
     * Core Points Calculation Function - Calculate user's points
     *
     * This function implements the core scoring algorithm for the application:
     * - Points are calculated from OTHER-RATINGS ONLY (ratings from other users)
     * - Self-ratings are explicitly excluded from points calculation
     * - Each positive rating = +10 points, negative rating = -10 points
     * - Formula: (Other Positive Count - Other Negative Count) × 10
     *
     * Business Logic:
     * - Users can self-rate their own media (appears in their lists)
     * - But self-ratings don't contribute to their points score
     * - Only ratings from OTHER users affect the author's points
     *
     * @param {number} userId - ID of user whose points need to be recalculated
     * @returns {number} Updated user points value
     */
    calculateUserPoint: async (id) => {
        const result = await client.queryObject({
            text: UserQuery.calculateUserPoint,
            args: [id],
        });
        return result.rows[0].points;
    },

    /**
     * Core Points Calculation Function - Calculate and update user's points
     *
     * This function implements the core scoring algorithm for the application:
     * - Points are calculated from OTHER-RATINGS ONLY (ratings from other users)
     * - Self-ratings are explicitly excluded from points calculation
     * - Each positive rating = +10 points, negative rating = -10 points
     * - Formula: (Other Positive Count - Other Negative Count) × 10
     *
     * Business Logic:
     * - Users can self-rate their own media (appears in their lists)
     * - But self-ratings don't contribute to their points score
     * - Only ratings from OTHER users affect the author's points
     *
     * @param {number} userId - ID of user whose points need to be recalculated
     * @returns {Object} Updated user information with new points value
     */
    recalculateAndUpdateUserPoint: async (userId) => {
        // Calculate user's points based on other users' ratings only
        // SQL query excludes self-ratings with: WHERE r.user_id <> m.author_id
        const result = await client.queryObject({
            text: UserQuery.calculateUserPoint,
            args: [userId],
        });

        const newPoints = result.rows[0]?.points ?? 0;

        // Update user's points in the database
        await client.queryObject({
            text: UserQuery.updateScore,
            args: [newPoints, userId],
        });

        return newPoints;
    },

    getUserScoreSummary: async (id) => {
        const result = await client.queryObject({
            text: UserQuery.getUserScoreSummary,
            args: [id],
        });

        return (
            result.rows[0] ?? {
                positive: 0,
                negative: 0,
                points: 0,
                self_positive: 0,
                self_negative: 0,
                total_media_count: 0,
                total_ratings: 0,
            }
        );
    },

    getUserHiddenCount: async (id) => {
        const result = await client.queryObject({
            text: UserQuery.getUserHiddenCount,
            args: [id],
        });

        return result.rows[0]?.hidden_count ?? 0;
    },
};

export default UserService;
