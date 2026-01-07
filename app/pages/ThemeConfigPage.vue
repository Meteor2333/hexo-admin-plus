<template>
  <config-editor :api="themeConfigApi" />
</template>

<script setup>
import ConfigEditor from "@/components/ConfigEditorComponent.vue";
import themeConfigApi from "@/service/themeconfig";
</script>
