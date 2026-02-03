const MediaQuery = {
    insertMedia: `
        INSERT INTO media (title, description, url, author_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `,

    /* ===========================
       POSITIVE MEDIA (user liked)
    ============================ */
    positiveMedia: `
        SELECT
            m.id,
            m.title,
            m.url,
            m.created_at,

            u.id   AS author_id,
            u.name AS author_name,

            COUNT(r2.id) FILTER (WHERE r2.value = 1)::INT  AS positive_count,
            COUNT(r2.id) FILTER (WHERE r2.value = -1)::INT AS negative_count,
            COUNT(r2.id)::INT                              AS total_ratings,
            COALESCE(SUM(r2.value), 0)::INT                AS rating_score,

            COALESCE(ur.value, 0)                          AS user_rating
        FROM media m
        JOIN users u ON u.id = m.author_id
        LEFT JOIN ratings r2
               ON r2.media_id = m.id
        LEFT JOIN ratings ur
               ON ur.media_id = m.id
              AND ur.user_id = $1
        LEFT JOIN hidden_media hm
               ON hm.media_id = m.id
              AND hm.user_id = $1
        WHERE EXISTS (
            SELECT 1
            FROM ratings r
            WHERE r.media_id = m.id
              AND r.user_id = $1
              AND r.value = 1
        ) AND hm.media_id IS NULL
        GROUP BY m.id, u.id, ur.value
        ORDER BY
            CASE 
                WHEN $2 = 'highestRated' THEN 0
                ELSE 1
            END,
            CASE 
                WHEN $2 = 'highestRated' THEN COALESCE(SUM(r2.value), 0) 
                ELSE 0
            END DESC,
            CASE 
                WHEN $2 = 'mostRecent' THEN 0
                ELSE 1
            END,
            CASE 
                WHEN $2 = 'mostRecent' THEN COALESCE(MAX(r2.created_at), m.created_at)
                ELSE m.created_at
            END DESC
        LIMIT $3 OFFSET $4;
    `,

    /* ===========================
       NEGATIVE MEDIA (user disliked)
    ============================ */
    negativeMedia: `
        SELECT
            m.id,
            m.title,
            m.url,
            m.created_at,

            u.id   AS author_id,
            u.name AS author_name,

            COUNT(r2.id) FILTER (WHERE r2.value = 1)::INT  AS positive_count,
            COUNT(r2.id) FILTER (WHERE r2.value = -1)::INT AS negative_count,
            COUNT(r2.id)::INT                              AS total_ratings,
            COALESCE(SUM(r2.value), 0)::INT                AS rating_score,

            COALESCE(ur.value, 0)                          AS user_rating
        FROM media m
        JOIN users u ON u.id = m.author_id
        LEFT JOIN ratings r2
               ON r2.media_id = m.id
        LEFT JOIN ratings ur
               ON ur.media_id = m.id
              AND ur.user_id = $1
        LEFT JOIN hidden_media hm
               ON hm.media_id = m.id
              AND hm.user_id = $1
        WHERE EXISTS (
            SELECT 1
            FROM ratings r
            WHERE r.media_id = m.id
              AND r.user_id = $1
              AND r.value = -1
        ) AND hm.media_id IS NULL
        GROUP BY m.id, u.id, ur.value
        ORDER BY
            CASE 
                WHEN $2 = 'highestRated' THEN 0
                ELSE 1
            END,
            CASE 
                WHEN $2 = 'highestRated' THEN COALESCE(SUM(r2.value), 0) 
                ELSE 0
            END DESC,
            CASE 
                WHEN $2 = 'mostRecent' THEN 0
                ELSE 1
            END,
            CASE 
                WHEN $2 = 'mostRecent' THEN COALESCE(MAX(r2.created_at), m.created_at)
                ELSE m.created_at
            END DESC
        LIMIT $3 OFFSET $4;
    `,

    /* ===========================
       HIDDEN MEDIA
    ============================ */
    hiddenMedia: `
        SELECT
            m.id,
            m.title,
            m.url,
            m.created_at,

            u.id   AS author_id,
            u.name AS author_name,

            COUNT(r2.id) FILTER (WHERE r2.value = 1)::INT  AS positive_count,
            COUNT(r2.id) FILTER (WHERE r2.value = -1)::INT AS negative_count,
            COUNT(r2.id)::INT                              AS total_ratings,
            COALESCE(SUM(r2.value), 0)::INT                AS rating_score,

            COALESCE(ur.value, 0)                          AS user_rating,
            MAX(h.created_at)                              AS hidden_at
        FROM hidden_media h
        JOIN media m ON m.id = h.media_id
        JOIN users u ON u.id = m.author_id
        LEFT JOIN ratings r2
               ON r2.media_id = m.id
        LEFT JOIN ratings ur
               ON ur.media_id = m.id
              AND ur.user_id = $1
        WHERE h.user_id = $1
        GROUP BY m.id, u.id, ur.value
        ORDER BY
            CASE 
                WHEN $2 = 'highestRated' THEN 0
                ELSE 1
            END,
            CASE 
                WHEN $2 = 'highestRated' THEN COALESCE(SUM(r2.value), 0) 
                ELSE 0
            END DESC,
            CASE 
                WHEN $2 = 'mostRecent' THEN 0
                ELSE 1
            END,
            CASE 
                WHEN $2 = 'mostRecent' THEN COALESCE(MAX(r2.created_at), MAX(h.created_at))
                ELSE MAX(h.created_at)
            END DESC
        LIMIT $3 OFFSET $4;
    `,

    /* ===========================
       LATEST MEDIA
    ============================ */
    latestMedia: `
        SELECT
            m.id,
            m.title,
            m.url,
            m.created_at,

            u.id   AS author_id,
            u.name AS author_name,

            COUNT(r.id) FILTER (WHERE r.value = 1)::INT  AS positive_count,
            COUNT(r.id) FILTER (WHERE r.value = -1)::INT AS negative_count,
            COUNT(r.id)::INT                             AS total_ratings,
            COALESCE(SUM(r.value), 0)::INT               AS rating_score,

            COALESCE(ur.value, 0)                         AS user_rating
        FROM media m
        JOIN users u ON u.id = m.author_id
        LEFT JOIN ratings r
               ON r.media_id = m.id
        LEFT JOIN ratings ur
               ON ur.media_id = m.id
              AND ur.user_id = $1
        LEFT JOIN hidden_media hm
               ON hm.media_id = m.id
              AND hm.user_id = $1
        WHERE hm.media_id IS NULL
        GROUP BY m.id, u.id, ur.value
        ORDER BY m.created_at DESC
        LIMIT $2 OFFSET $3;
    `,

    /* ===========================
       COUNTS
    ============================ */
    countMedia: `
        SELECT COUNT(*)::INT AS total
        FROM media;
    `,

    countPositiveMedia: `
        SELECT COUNT(DISTINCT m.id)::INT AS total
        FROM media m
        JOIN users u ON u.id = m.author_id
        LEFT JOIN ratings r2 ON r2.media_id = m.id
        LEFT JOIN ratings ur ON ur.media_id = m.id AND ur.user_id = $1
        LEFT JOIN hidden_media hm ON hm.media_id = m.id AND hm.user_id = $1
        WHERE EXISTS (
            SELECT 1
            FROM ratings r
            WHERE r.media_id = m.id
              AND r.user_id = $1
              AND r.value = 1
        ) AND hm.media_id IS NULL
    `,

    countNegativeMedia: `
        SELECT COUNT(DISTINCT m.id)::INT AS total
        FROM media m
        JOIN users u ON u.id = m.author_id
        LEFT JOIN ratings r2 ON r2.media_id = m.id
        LEFT JOIN ratings ur ON ur.media_id = m.id AND ur.user_id = $1
        LEFT JOIN hidden_media hm ON hm.media_id = m.id AND hm.user_id = $1
        WHERE EXISTS (
            SELECT 1
            FROM ratings r
            WHERE r.media_id = m.id
              AND r.user_id = $1
              AND r.value = -1
        ) AND hm.media_id IS NULL
    `,

    countHiddenMedia: `
        SELECT COUNT(DISTINCT m.id)::INT AS total
        FROM hidden_media h
        JOIN media m ON m.id = h.media_id
        JOIN users u ON u.id = m.author_id
        LEFT JOIN ratings r2 ON r2.media_id = m.id
        LEFT JOIN ratings ur ON ur.media_id = m.id AND ur.user_id = $1
        WHERE h.user_id = $1
    `,

    /* ===========================
       USER PUBLISHED MEDIA
    ============================ */
    getUserPublishedMedia: `
        SELECT
            m.id,
            m.title,
            m.url,
            m.created_at,

            u.id   AS author_id,
            u.name AS author_name,

            COUNT(r.id) FILTER (WHERE r.value = 1)::INT  AS positive_count,
            COUNT(r.id) FILTER (WHERE r.value = -1)::INT AS negative_count,
            COUNT(r.id)::INT                             AS total_ratings,
            COALESCE(SUM(r.value), 0)::INT               AS rating_score,

            COALESCE(ur.value, 0)                          AS user_rating
        FROM media m
        JOIN users u ON u.id = m.author_id
        LEFT JOIN ratings r ON r.media_id = m.id
        LEFT JOIN ratings ur 
               ON ur.media_id = m.id
              AND ur.user_id = $1
        WHERE m.author_id = $1
        GROUP BY m.id, u.id, ur.value
        ORDER BY m.created_at DESC
        LIMIT $2 OFFSET $3;
    `,

    countUserPublishedMedia: `
        SELECT COUNT(*)::INT AS total
        FROM media
        WHERE author_id = $1;
    `,

    addHiddenMedia: `
        INSERT INTO hidden_media (user_id, media_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, media_id) DO NOTHING
        RETURNING *;
    `,

    removeHiddenMedia: `
        DELETE FROM hidden_media
        WHERE user_id = $1 AND media_id = $2
        RETURNING *;
    `,

    checkHiddenMedia: `
        SELECT * FROM hidden_media
        WHERE user_id = $1 AND media_id = $2
        LIMIT 1;
    `,

    /* ===========================
       GET MEDIA BY ID (with full stats)
    ============================ */
    getMediaById: `
        SELECT
            m.id,
            m.title,
            m.url,
            m.created_at,

            u.id   AS author_id,
            u.name AS author_name,

            COUNT(r.id) FILTER (WHERE r.value = 1)::INT  AS positive_count,
            COUNT(r.id) FILTER (WHERE r.value = -1)::INT AS negative_count,
            COUNT(r.id)::INT                             AS total_ratings,
            COALESCE(SUM(r.value), 0)::INT               AS rating_score,

            COALESCE(ur.value, 0)                        AS user_rating,
            hm.user_id IS NOT NULL                        AS is_hidden
        FROM media m
        JOIN users u ON u.id = m.author_id
        LEFT JOIN ratings r
               ON r.media_id = m.id
        LEFT JOIN ratings ur
               ON ur.media_id = m.id
              AND ur.user_id = $1
        LEFT JOIN hidden_media hm
               ON hm.media_id = m.id
              AND hm.user_id = $1
        WHERE m.id = $2
        GROUP BY m.id, u.id, ur.value, hm.user_id;
    `,
};

export default MediaQuery;
