<template>
  <el-container
    class="page"
    @keydown.ctrl.s.prevent.stop="handleSave"
    @keydown.meta.s.prevent.stop="handleSave"
  >
    <el-main class="page-body">
      <v-md-editor
        v-model="content"
        height="100%"
        :disabled-menus="[]"
        :include-level="[1, 2, 3, 4]"
        :codemirror-config="{ theme: 'material-darker' }"
        @upload-image="handleUploadImage"
        @save="handleSave"
      />
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";

import vMdEditor from "@kangc/v-md-editor/lib/codemirror-editor";
import "@kangc/v-md-editor/lib/style/codemirror-editor.css";

import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";

// highlightjs
import hljs from "highlight.js";
// codemirror
import Codemirror from "codemirror";
// mode
import "codemirror/mode/clike/clike.js";
import "codemirror/mode/css/css";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/python/python";
import "codemirror/mode/shell/shell";
import "codemirror/mode/sql/sql";
import "codemirror/mode/xml/xml";
import "codemirror/mode/yaml/yaml";
// edit
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/matchbrackets";
// placeholder
import "codemirror/addon/display/placeholder";
// active-line
import "codemirror/addon/selection/active-line";
// scrollbar
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/addon/scroll/simplescrollbars.css";
// style
import "codemirror/lib/codemirror.css";
// theme
import "codemirror/theme/material-darker.css";

vMdEditor.Codemirror = Codemirror;
vMdEditor.use(githubTheme, {
    "Hljs": hljs,
});

const emit = defineEmits(["save"]);
const props = defineProps(["articleId", "articleApi"]);
const api = props.articleApi;

const meta = ref("");
const content = ref("");
onMounted(async () => {
    if (props.articleId) {
        const { data } = await api.raw(props.articleId);
        meta.value = data.meta;
        content.value = data.content;
    } else {
        meta.value = "title: \"untitled\"\ncategories: \"uncategorized\"\ntags:\n  - \"tag1\"\n  - \"tag2\"\n  - \"tag3\"\n";
        content.value = "# Hello World\n\n**This is your article. Edit it as you like!**\n";
    }
});

async function handleSave() {
    ElMessage.primary("Saving...");
    const info = { "meta": meta.value, "content": content.value };
    if (props.articleId) {
        const { code } = await api.update(props.articleId, info);
        if (!code) {
            ElMessage.success("Updated successfully!");
        }
    } else {
        const { code, data } = await api.create(info);
        if (!code) {
            ElMessage.success("Created successfully!");
            emit("save", data);
        }
    }
}

async function handleUploadImage(_event, insertImage, files) {
    void _event;
    void insertImage;
    void files;
    //todo: 实现
    // const url = await api.uploadImage(files[0]);
    // insertImage({url: url});
}
</script>

<style scoped>
  .page-footer { text-align: right; }
  :deep(.v-md-editor) { background-color: var(--el-bg-color); }
  .v-md-editor :deep(.v-md-editor__toolbar) { background-color: var(--el-bg-color-overlay); }
  .v-md-editor :deep(.v-md-editor__main) { background-color: #212121; }
  .v-md-editor :deep(.v-md-editor__editor-wrapper) { border-right-color: var(--el-border-color); }
  .v-md-editor :deep(.v-md-editor__menu) { background-color: var(--el-bg-color-overlay); border: 1px solid var(--el-border-color); }
  .v-md-editor :deep(.v-md-editor__menu-item) { color: var(--el-text-color-primary); }
  .v-md-editor :deep(.v-md-editor__menu-item:hover) { background-color: var(--el-fill-color); }
  .v-md-editor :deep(.v-md-editor__toolbar-item) { color: var(--el-text-color-secondary); }
  .v-md-editor :deep(.v-md-editor__toolbar-item--active) { background-color: #494949; }
  .v-md-editor :deep(.v-md-editor__toolbar-item:hover, .v-md-editor__toolbar-item--active:hover) { background-color: #373737; }
  .v-md-editor :deep(.cm-comment) { color: #ce9178 !important; }
  .v-md-editor :deep(.cm-comment.cm-variable-2:not(.cm-url)) { color: #ce9178 !important; }
  .v-md-editor :deep(.cm-link) { color: unset !important; }
  .v-md-editor :deep(.cm-link.cm-variable-2:not(.cm-url)) { color: unset !important; }
  .v-md-editor :deep(.cm-quote) { color: unset!important; }
  .v-md-editor :deep(.cm-quote.cm-variable-2:not(.cm-url)) { color: unset !important; }
  .v-md-editor :deep(.cm-variable-2:not(.cm-url)) { color: unset !important; }
  .v-md-editor :deep(.CodeMirror) { color: unset !important; }
  .v-md-editor :deep(.CodeMirror-selected) { background-color: rgba(97, 97, 97, 0.5) !important; }
</style>
