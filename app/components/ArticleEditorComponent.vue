<template>
  <el-container
    class="page"
    @keydown.ctrl.s.prevent.stop="saveDialogVisible = true"
    @keydown.meta.s.prevent.stop="saveDialogVisible = true"
  >
    <el-main class="page-body">
      <el-dialog
        v-model="advancedDialogVisible"
        title="Advanced Mode"
        align-center
      >
        <VueCodemirror
          v-model:value="meta"
          :options="{
            lineNumbers: true,
            mode: 'yaml',
            theme: 'material-darker',
            lineWrapping: true,
            tabSize: 2,
            indentUnit: 2,
            autofocus: true,
            scrollbarStyle: 'overlay'
          }"
        />
        <template #footer>
          <el-button
            type="primary"
            @click="handleParse"
          >
            Confirm
          </el-button>
        </template>
      </el-dialog>
      <el-dialog
        v-model="saveDialogVisible"
        title="Save"
        width="25%"
        align-center
      >
        <el-form
          ref="formRef"
          label-width="auto"
          :model="metaForm"
        >
          <el-form-item
            required
            label="Title"
            prop="title"
          >
            <el-input v-model="metaForm.title" />
          </el-form-item>
          <el-form-item
            label="Categories"
            prop="categories"
          >
            <el-input-tag v-model="metaForm.categories" />
          </el-form-item>
          <el-form-item
            label="Tags"
            prop="tags"
          >
            <el-input-tag v-model="metaForm.tags" />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleStringify">
              Advanced
            </el-button>
            <el-button
              class="kepp-right"
              type="primary"
              @click="handleSave"
            >
              Submit
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <v-md-editor
        v-model="content"
        height="100%"
        :disabled-menus="[]"
        :include-level="[1, 2, 3, 4]"
        :codemirror-config="{ theme: 'material-darker' }"
        @upload-image="handleUploadImage"
        @save="saveDialogVisible = true"
      />
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import YAML from "js-yaml";

import VueCodemirror from "codemirror-editor-vue3";
import vMdEditor from "@kangc/v-md-editor/lib/codemirror-editor";

import "@kangc/v-md-editor/lib/style/codemirror-editor.css";
import "@kangc/v-md-editor/lib/theme/style/github.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import enUS from "@kangc/v-md-editor/lib/lang/en-US";

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
vMdEditor.lang.use("en-US", enUS);
vMdEditor.use(githubTheme, {
    "Hljs": hljs,
});

const emit = defineEmits(["create"]);
const props = defineProps(["article", "api"]);
const api = props.api;

const formRef = ref(null);
const metaForm = reactive({});
const saveDialogVisible = ref(false);
const advancedDialogVisible = ref(false);

const meta = ref("");
const content = ref("");
onMounted(async () => {
    if (props.article) {
        const { data } = await api.getData(props.article);
        meta.value = data.meta;
        Object.assign(metaForm, YAML.load(meta.value) || {});
        content.value = data.content;
    } else {
        metaForm.title = "";
        metaForm.categories = [];
        metaForm.tags = [];
        content.value = "# Hello World\n\n**This is your article. Edit it as you like!**\n";
    }
});

function handleStringify() {
    advancedDialogVisible.value = true;
    meta.value = YAML.dump(metaForm);
}

function handleParse() {
    advancedDialogVisible.value = false;
    const form = YAML.load(meta.value) || {};
    Object.keys(metaForm).forEach(key => delete metaForm[key]);
    Object.assign(metaForm, form);
}

async function handleSave() {
    try {
        await formRef.value.validate();
    } catch (e) {
        return;
    }

    ElMessage.primary("Saving...");
    if (!meta.value) meta.value = YAML.dump(metaForm);
    const info = { "meta": meta.value, "content": content.value };
    if (props.article) {
        const { code } = await api.update(props.article, info);
        if (!code) {
            saveDialogVisible.value = false;
            ElMessage.success("Updated successfully!");
        }
    } else {
        const { code, data } = await api.create(info);
        if (!code) {
            saveDialogVisible.value = false;
            ElMessage.success("Created successfully!");
            emit("create", data);
        }
    }
}

async function handleUploadImage(_event, insertImage, files) {
    void _event;
    void insertImage;
    void files;
    // todo: 实现
    // const { data } = await api.uploadImage(files[0]);
    // insertImage({ url: data.url });
}
</script>

<style scoped>
  .page-footer { text-align: right; }
  .kepp-right { margin-left: auto; }
  .codemirror-container { height: 300px !important; }
  .space { display: flex; align-items: center; gap: 0px 8px; width: 100%; }

  .v-md-editor { background-color: var(--el-bg-color); }
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
