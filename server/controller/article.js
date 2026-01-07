"use strict";

function serializeArticle(article) {
    if (article instanceof Array) return article.map(serializeArticle);
    const retPost = {
        "id": article._id,
        "title": article.title,
        "date": article.date.valueOf(),
        "updated": article.updated.valueOf(),
        "link": article.permalink,
        "isDraft": article.source.includes("_draft"),
    };

    if (article._content) {
        retPost["content"] = article._content;
    }

    if (article.layout === "post") {
        retPost.categories = article.categories.map(t => t.name);
        retPost.tags = article.tags.map(t => t.name);
    }
    return retPost;
}

module.exports = {
    getArticles(type) {
        const page = (+this.req.query.page || 1) - 1;
        const title = this.req.query.title?.trim();
        const category = this.req.query.category?.trim();
        const tag = this.req.query.tag?.trim();
        const pageSize = 15;
        const postList = this.service[type].getArticles({ title, category, tag });
        const total = postList.length;
        const list = postList
            .skip(page * pageSize)
            .limit(pageSize)
            .map(serializeArticle);
        this.res.send({ list, total });
    },
    
    getData(type, id) {
        const article = this.service[type].getData(id);
        if (!article) throw new Error("Article with ID " + id + " was not found.");
        this.res.send({ "meta": article.data, "content": article.content });
    },

    async create(type) {
        const { meta, content } = this.req.body;
        const article = await this.service[type].create({ meta, content });
        this.res.send(serializeArticle(article));
    },

    async update(type, id) {
        const { meta, content } = this.req.body;
        const article = await this.service[type].update(id, { meta, content });
        this.res.send(serializeArticle(article));
    },

    async delete(type, id) {
        await this.service[type].delete(id);
        this.res.send();
    },

    async publish(type, id) {
        const article = await this.service[type].publish(id);
        this.res.send(serializeArticle(article));
    },

    async unpublish(type, id) {
        const article = await this.service[type].unpublish(id);
        this.res.send(serializeArticle(article));
    },
};
