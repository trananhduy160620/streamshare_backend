export const UserQuery = {
    insertUser: `INSERT INTO users ("name", "username", "password") VALUES ($1, $2, $3);`,
    findUserById: `SELECT * FROM users WHERE users.id = $1;`,
    findUserByUsername: `SELECT * FROM users WHERE LOWER(TRIM(users.username)) = LOWER($1)`,
    updateScore: `
        UPDATE users
        SET points = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, points;
    `,
    calculateUserPoint: `
        SELECT
            COALESCE(SUM(r.value), 0) * 10 AS points
        FROM media m
        JOIN ratings r ON r.media_id = m.id
        WHERE m.author_id = $1 AND r.user_id <> $1;
    `,
    getUserScoreSummary: `
        SELECT 
            -- User's own ratings (what user liked/disliked)
            (SELECT COUNT(*) FROM ratings WHERE user_id = $1 AND value = 1)::INT AS positive,
            (SELECT COUNT(*) FROM ratings WHERE user_id = $1 AND value = -1)::INT AS negative,
            
            -- User's points from others' ratings on their media
            COALESCE(
                (SELECT SUM(r.value) * 10 
                 FROM media m 
                 JOIN ratings r ON r.media_id = m.id 
                 WHERE m.author_id = $1 AND r.user_id <> $1), 
                0
            )::INT AS points,

            -- User's self-ratings on their own media
            (SELECT COUNT(*) FROM ratings r JOIN media m ON r.media_id = m.id WHERE r.user_id = $1 AND r.value = 1 AND r.user_id = m.author_id)::INT AS self_positive,
            (SELECT COUNT(*) FROM ratings r JOIN media m ON r.media_id = m.id WHERE r.user_id = $1 AND r.value = -1 AND r.user_id = m.author_id)::INT AS self_negative,

            -- User's media count and total ratings
            (SELECT COUNT(*) FROM media WHERE author_id = $1)::INT AS total_media_count,
            (SELECT COUNT(*) FROM ratings WHERE user_id = $1)::INT AS total_ratings;
    `,

    getUserHiddenCount: `
        SELECT COUNT(*)::INT AS hidden_count
        FROM hidden_media
        WHERE user_id = $1;
    `,
};
