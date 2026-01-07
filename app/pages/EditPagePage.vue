<template>
  <article-editor
    :api="pageApi"
    :article="route.params.pageId"
  />
</template>

<script setup>
import { useRoute } from "vue-router";
import articleEditor from "@/components/ArticleEditorComponent.vue";
import pageApi from "@/service/page";
const route = useRoute();
</script>
