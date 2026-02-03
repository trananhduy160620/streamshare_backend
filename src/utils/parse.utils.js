export const parseFormBody = (body) => {
    const obj = {};
    for (const [key, value] of body.entries()) {
        obj[key] = value;
    }
    return obj;
};
