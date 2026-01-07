"use strict";

const { "http":{ Router, methods } } = require("director");
const AuthService = require("./service/auth");
const ArticleService = require("./service/article");
const TaxonomyService = require("./service/taxonomy");
const ConfigService = require("./service/config");
const authController = require("./controller/auth");
const articleController = require("./controller/article");
const taxonomyController = require("./controller/taxonomy");
const configController = require("./controller/config");

const router = new Router();
router.configure({ "async": true, "recurse": false, "strict": false });

// rewite methods for async controller
methods.forEach((m) => {
    const _method = router[m];
    router[m] = function (path, asyncHandler) {
        _method.call(router, path, async function (...args) {
            const params = args.slice(0, -1);
            const nextFn = args[args.length - 1];
            try {
                await asyncHandler.apply(this, params);
            } catch (e) {
                nextFn(e);
            }
        });
    };
});

module.exports = function (hexo) {
    router.attach(function () {
        this.hexo = hexo;
        this.service = {
            "auth": new AuthService(hexo),
            "post": new ArticleService(hexo, "Post"),
            "page": new ArticleService(hexo, "Page"),
            "category": new TaxonomyService(hexo, "Category"),
            "tag": new TaxonomyService(hexo, "Tag"),
            "config": new ConfigService(hexo),
        };
    });

    router.post("/auth", authController.authenticate);

    router.param("arttype", /(post|page)/);
    router.get("/:arttype", articleController.getArticles);
    router.get("/:arttype/:id", articleController.getData);
    router.post("/:arttype", articleController.create);
    router.put("/:arttype/:id", articleController.update);
    router.delete("/:arttype/:id", articleController.delete);
    router.post("/:arttype/:id/publish", articleController.publish);
    router.post("/:arttype/:id/unpublish", articleController.unpublish);

    router.param("taxonomytype", /(tag|category)/);
    router.get("/:taxonomytype", taxonomyController.getTaxonomies);

    router.get("/config", configController.getConfig);
    router.post("/config", configController.updateConfig);
    router.get("/themeconfig", configController.getThemeConfig);
    router.post("/themeconfig", configController.updateThemeConfig);

    return router.dispatch.bind(router);
};
