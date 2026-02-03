import parseYoutubeVideoId from "./parseYoutubeVideoId.utils.js";

const ImageTypes = Object.freeze({
    default: "default.jpg", // 120x90
    mqdefault: "mqdefault.jpg", // 320x180
    hqdefault: "hqdefault.jpg", // 480x360
    maxresdefault: "maxresdefault.jpg", // 1280x720
});

const isLatestByTime = (createdAt) => {
    const createdTime = new Date(createdAt).getTime();
    const now = Date.now();
    const FOURTEEN_DAYS = 14 * 24 * 60 * 60 * 1000;

    return now - createdTime <= FOURTEEN_DAYS;
};

const transformMedia = (media) => {
    const videoId = parseYoutubeVideoId(media.url);

    return {
        ...media,
        video_id: videoId,
        thumbnail: videoId
            ? `https://img.youtube.com/vi/${videoId}/${ImageTypes.hqdefault}`
            : null,
        is_latest: isLatestByTime(media.created_at),
    };
};

const transformMediaList = (mediaList = []) => {
    return mediaList.map(transformMedia);
};

export default transformMediaList;
export { transformMedia };
