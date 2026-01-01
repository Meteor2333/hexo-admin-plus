<template>
  <config-editor
    :update-api="configApi.updateConfig"
    :get-api="configApi.getConfig"
  />
</template>

<script setup>
import ConfigEditor from "@/components/ConfigEditorComponent.vue";
import configApi from "@/service/config";
</script>
