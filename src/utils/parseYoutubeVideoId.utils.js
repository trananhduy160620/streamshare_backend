const parseYoutubeVideoId = (url) => {
    try {
        const parsedUrl = new URL(url);

        // case: https://www.youtube.com/watch?v=VIDEO_ID
        const videoId = parsedUrl.searchParams.get("v");
        if (videoId) return videoId;

        // case: https://youtu.be/VIDEO_ID
        if (parsedUrl.hostname === "youtu.be") {
            return parsedUrl.pathname.slice(1);
        }

        // case: https://www.youtube.com/embed/VIDEO_ID
        if (parsedUrl.pathname.startsWith("/embed/")) {
            return parsedUrl.pathname.split("/embed/")[1];
        }

        return null;
    } catch {
        return null;
    }
};

export default parseYoutubeVideoId;
