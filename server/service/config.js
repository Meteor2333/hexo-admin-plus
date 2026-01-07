"use strict";

const { join, dirname } = require("path");
const { exists, readFile, writeFile } = require("hexo-fs");

const hexoPath = dirname(require.resolve("hexo")); 
const loadConfig = require(join(hexoPath, "load_config"));
const loadThemeConfig = require(join(hexoPath, "load_theme_config"));

module.exports = class ConfigService {
    constructor(hexo, type) {
        this.hexo = hexo;
        this.model = this.hexo.model(type);
    }

    async getConfig() {
        const path = this.hexo.config_path;
        if (await exists(path)) {
            return readFile(path);
        }
    }

    async updateConfig(data) {
        const path = this.hexo.config_path;
        await writeFile(path, data);

        await loadConfig(this.hexo);
        await this.hexo.load();
    }

    async getThemeConfig() {
        let path = join(this.hexo.base_dir,
            `_config.${this.hexo.config.theme}.yml`);
        if (!await exists(path)) {
            path = join(this.hexo.base_dir, `./themes/${this.hexo.config.theme}/_config.yml`);
        }
        return readFile(path);
    }

    async updateThemeConfig(data) {
        let path = join(this.hexo.base_dir,
            `_config.${this.hexo.config.theme}.yml`);
        if (!await exists(path)) {
            path = join(this.hexo.base_dir, `./themes/${this.hexo.config.theme}/_config.yml`);
        }
        await writeFile(path, data);

        // hexo/lib/hexo/load_theme_config.js
        const config = this.hexo.render.render({ "path": this.hexo.config_path });
        this.hexo.config.theme_config = config.theme_config;
        await loadThemeConfig(this.hexo);
        await this.hexo.load();
    }
};
