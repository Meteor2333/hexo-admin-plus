<template>
  <config-editor :api="configApi" />
</template>

<script setup>
import ConfigEditor from "@/components/ConfigEditorComponent.vue";
import configApi from "@/service/config";
</script>
