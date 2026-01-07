"use strict";

module.exports = {
    getTaxonomies(type) {
        const name = this.req.query.name?.trim();
        const list = this.service[type].getTaxonomies(name).map(c => c.name);
        this.res.send({ list });
    },
};
