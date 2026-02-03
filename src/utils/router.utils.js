export const registerRouters = (app, routers) => {
    routers.forEach(({ router, prefix }) => {
        if (prefix) router.prefix(prefix);
        app.use(router.routes());
        app.use(router.allowedMethods({ throw: false }));
    });
};
