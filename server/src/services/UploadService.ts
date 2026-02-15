import type Hexo from 'hexo';

import { basename, extname, join } from 'node:path';
import { writeFile } from 'hexo-fs';
import { UploadedFile } from 'express-fileupload';

export default class UploadService {
  constructor(
    private readonly hexo: Hexo,
  ) {
  }

  async upload(file: UploadedFile) {
    const filename = file.name;
    const base = basename(filename), ext = extname(filename);
    const finalname = `${base}+${Date.now().toString(36)}${ext}`.replaceAll('_', '');
    const path = `assets/${finalname}`;
    await writeFile(join(this.hexo.source_dir, path), file.data);
    return encodeURI('/' + path);
  }
};
