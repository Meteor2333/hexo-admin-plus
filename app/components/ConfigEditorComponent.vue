<template>
  <el-container
    class="page"
    @keydown.ctrl.s.prevent.stop="handleSave"
    @keydown.meta.s.prevent.stop="handleSave"
  >
    <el-main class="page-body">
      <Codemirror
        v-model:value="configData"
        :options="{
          lineNumbers: true,
          mode: 'yaml',
          theme: 'monokai',
          lineWrapping: true,
          tabSize: 2,
          indentUnit: 2,
          autofocus: true,
          scrollbarStyle: 'overlay'
        }"
      />
    </el-main>
    <el-footer class="page-footer">
      <el-button
        type="primary"
        @click="handleSave"
      >
        Save (Ctrl+S)
      </el-button>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";

import Codemirror from "codemirror-editor-vue3";
import "codemirror/mode/yaml/yaml";
import "codemirror/theme/monokai.css";
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/addon/scroll/simplescrollbars.css";

const emit = defineEmits(["save"]);
const props = defineProps(["api"]);
const api = props.api;

const configData = ref("");
onMounted(async () => {
    const { data } = await api.getConfig();
    if (data) {
        configData.value = data.config;
    }
});

async function handleSave() {
    ElMessage.primary("Saving...");
    const { code } = await api.updateConfig(configData.value);
    if (!code) {
        ElMessage.success("Updated successfully!");
        emit("save", configData.value);
    }
}
</script>

<style scoped>
  .page-footer { text-align: right; }
  :deep(.CodeMirror) { background-color: #2a2a2a !important; }
</style>
