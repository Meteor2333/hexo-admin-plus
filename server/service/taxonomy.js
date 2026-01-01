"use strict";

module.exports = class TaxonomyService {
    constructor(hexo, type) {
        if (type !== "Tag" && type !== "Category") {
            throw new TypeError("Model type should be Tag or Category.");
        }
        this.hexo = hexo;
        this.model = this.hexo.model(type);
    }

    getTaxonomies(name, limit = 10) {
        return this.model.filter(taxonomy =>
            !name || taxonomy.name.includes(name),
        ).limit(limit);
    }
};
