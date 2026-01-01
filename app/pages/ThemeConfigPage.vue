<template>
  <config-editor
    :update-api="configApi.updateThemeConfig"
    :get-api="configApi.getThemeConfig"
  />
</template>

<script setup>
import ConfigEditor from "@/components/ConfigEditorComponent.vue";
import configApi from "@/service/config";
</script>
