import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
        "path": "/",
        "redirect": { "name": "PostList" },
    },
    {
        "path": "/post/new",
        "name": "AddPost",
        "component": () => import("./pages/AddPostPage.vue"),
    },
    {
        "path": "/post/:postId",
        "name": "EditPost",
        "component": () => import("./pages/EditPostPage.vue"),
        "props": true,
    },
    {
        "path": "/post",
        "name": "PostList",
        "component": () => import("./pages/PostsPage.vue"),
    },
    {
        "path": "/page/new",
        "name": "AddPage",
        "component": () => import("./pages/AddPagePage.vue"),
    },
    {
        "path": "/page/:pageId",
        "name": "EditPage",
        "component": () => import("./pages/EditPagePage.vue"),
        "props": true,
    },
    {
        "path": "/page",
        "name": "PageList",
        "component": () => import("./pages/PagesPage.vue"),
    },
    {
        "path": "/config",
        "name": "Config",
        "component": () => import("./pages/ConfigPage.vue"),
    },
    {
        "path": "/themeconfig",
        "name": "ThemeConfig",
        "component": () => import("./pages/ThemeConfigPage.vue"),
    },
    {
        "path": "/:pathMatch(.*)*",
        "redirect": "/",
    },
];

const router = createRouter({ "history": createWebHashHistory(), routes });
export default router;
