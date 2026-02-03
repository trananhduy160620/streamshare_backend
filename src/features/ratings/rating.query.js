const RatingQuery = {
    getMediaAuthorId: `
        SELECT author_id
        FROM media
        WHERE id = $1
        LIMIT 1;
    `,
    rateMedia: `
        INSERT INTO ratings (user_id, media_id, value)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, media_id)
        DO UPDATE SET
            value = EXCLUDED.value
        RETURNING *;
    `,
    unrateMedia: `
        DELETE FROM ratings
        WHERE user_id = $1 AND media_id = $2
        RETURNING *;
    `,
    sortHighestRated: `
        WITH media_stats AS (
            SELECT
                m.id,
                m.title,
                m.url,
                m.created_at,

                u.id   AS author_id,
                u.name AS author_name,

                COUNT(r.value) FILTER (WHERE r.value = 1)::INT  AS positive_count,
                COUNT(r.value) FILTER (WHERE r.value = -1)::INT AS negative_count,
                COALESCE(SUM(r.value), 0)::INT AS rating_score,

                ur.value AS user_rating,
                hm.user_id IS NOT NULL AS is_hidden

            FROM media m
            JOIN users u ON u.id = m.author_id
            LEFT JOIN ratings r
                ON r.media_id = m.id
            LEFT JOIN ratings ur 
                ON ur.media_id = m.id AND ur.user_id = $1
            LEFT JOIN hidden_media hm
                ON hm.media_id = m.id AND hm.user_id = $1
            GROUP BY m.id, u.id, ur.value, hm.user_id
        )
        SELECT *
        FROM media_stats
        WHERE is_hidden = false
        ORDER BY rating_score DESC, created_at DESC
        LIMIT $2 OFFSET $3;
    `,
    sortMostRecent: `
        WITH media_stats AS (
            SELECT
                m.id,
                m.title,
                m.url,
                m.created_at,

                u.id   AS author_id,
                u.name AS author_name,

                COUNT(r.value) FILTER (WHERE r.value = 1)::INT  AS positive_count,
                COUNT(r.value) FILTER (WHERE r.value = -1)::INT AS negative_count,
                COALESCE(SUM(r.value), 0)::INT AS rating_score,

                ur.value AS user_rating,
                hm.user_id IS NOT NULL AS is_hidden

            FROM media m
            JOIN users u ON u.id = m.author_id
            LEFT JOIN ratings r
                ON r.media_id = m.id
            LEFT JOIN ratings ur 
                ON ur.media_id = m.id AND ur.user_id = $1
            LEFT JOIN hidden_media hm
                ON hm.media_id = m.id AND hm.user_id = $1
            GROUP BY m.id, u.id, ur.value, hm.user_id
        )
        SELECT *
        FROM media_stats
        WHERE is_hidden = false
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3;
    `,
    countMediaForPagination: `
        SELECT COUNT(*)::INT AS total
        FROM media;
    `,
    getUserRating: `
        SELECT value
        FROM ratings
        WHERE user_id = $1
          AND media_id = $2
        LIMIT 1;
    `,
    totalCurrentRatingsMedia: `
        SELECT
            COUNT(r.value) FILTER (WHERE r.value = 1)::INT  AS positive_count,
            COUNT(r.value) FILTER (WHERE r.value = -1)::INT AS negative_count,
            COALESCE(SUM(r.value), 0)::INT AS rating_score
        FROM ratings r
        WHERE r.media_id = $1
    `,
    userPoints: `
        SELECT COALESCE(SUM(r.value),0)::INT AS points
        FROM media m
        LEFT JOIN ratings r ON r.media_id = m.id AND r.user_id != $1
        WHERE m.author_id = $1
    `,
};

export default RatingQuery;
