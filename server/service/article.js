"use strict";

const path = require("path");
const fs = require("hexo-fs");
const hfm = require("hexo-front-matter");

module.exports = class ArticleService {
    constructor(hexo, type) {
        if (type !== "Post" && type !== "Page") {
            throw new TypeError("Model type should be Post or Page.");
        }
        this.hexo = hexo;
        this.type = type;
        this.model = this.hexo.model(this.type);
    }

    getArticles({ title, category, tag }) {
        return this.model.filter(i =>
            (!title || i.title.includes(title)) &&
                (!category || i.categories.some(c => c.name === category)) &&
                (!tag || i.tags.some(c => c.name === tag)),
        ).sort("date", -1);
    }

    getData(query) {
        const doc = this.findModel(query);
        if (!doc) return null;
        return hfm.split(doc.raw);
    }

    async create({ meta, content }) {
        const compiled = hfm.parse(["---", meta, "---", content].join("\n"));
        if (!compiled.title) throw new Error("Title cannot be empty.");

        compiled.updated = compiled.updated || new Date();
        compiled.author = this.hexo.config.author;
        compiled.layout = this.type.toLowerCase();
        if (this.type === "Post") {
            compiled.categories = compiled.categories || [this.hexo.config.default_category];
        }

        const file = await this.hexo.post.create(compiled);
        await this.hexo.source.process();
        return this.findModel({ "source": this.toRelativePath(file.path) });
    }

    async update(id, { meta, content }) {
        const doc = this.findModel(id);
        if (!doc) throw new Error("The article with ID " + id + " could not be found.");

        const compiled = hfm.parse(["---", meta, "---", content].join("\n"));
        compiled.updated = compiled.updated || new Date();
        compiled.date = compiled.date || new Date(doc.date.valueOf());
        compiled.author = compiled.author || doc.author || this.hexo.config.author;
        if (this.type === "Post") {
            compiled.categories = compiled.categories || [this.hexo.config.default_category];
        }

        await fs.writeFile(doc.full_source, hfm.stringify(compiled));
        await this.hexo.source.process();
        return this.findModel({ "source": this.toRelativePath(doc.full_source) });
    }

    async delete(id) {
        const doc = this.findModel(id);
        if (!doc) throw new Error("The article with ID " + id + " could not be found.");

        if (this.type === "Page") {
            await fs.rmdir(path.dirname(doc.full_source));
        } else if (this.type === "Post") {
            await fs.unlink(doc.full_source);
        }
        await this.hexo.source.process();
    }

    async publish(id) {
        if (this.type !== "Post") return;

        const doc = this.findModel(id);
        if (!doc) throw new Error("The article with ID " + id + " could not be found.");

        const postDir = path.join(this.hexo.source_dir, "_posts");
        const fullSource = path.join(postDir, path.basename(doc.full_source));
        const exists = await fs.exists(postDir);
        if (!exists) await fs.mkdir(postDir);

        await fs.rename(doc.full_source, fullSource);
        await this.hexo.source.process();
        return this.findModel({ "source": this.toRelativePath(fullSource) });
    }

    async unpublish(id) {
        if (this.type !== "Post") return;

        const doc = this.findModel(id);
        if (!doc) throw new Error("The article with ID " + id + " could not be found.");

        const draftDir = path.join(this.hexo.source_dir, "_drafts");
        const fullSource = path.join(draftDir, path.basename(doc.full_source));
        const exists = await fs.exists(draftDir);
        if (!exists) await fs.mkdir(draftDir);

        await fs.rename(doc.full_source, fullSource);
        await this.hexo.source.process();
        return this.findModel({ "source": this.toRelativePath(fullSource) });
    }

    findModel(query) {
        if (typeof (query) === "string") {
            return this.model.findById(query);
        } else {
            return this.model.findOne(query);
        }
    }

    toRelativePath(path) {
        return path.slice(this.hexo.source_dir.length).replace(/\\/g, "/");
    }
};