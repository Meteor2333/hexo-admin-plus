<template>
  <article-editor
    :article-api="pageApi"
    :article-id="route.params.pageId"
  />
</template>

<script setup>
import {useRoute} from "vue-router";
import articleEditor from "@/components/ArticleEditorComponent.vue";
import pageApi from "@/service/page";
const route = useRoute();
</script>
