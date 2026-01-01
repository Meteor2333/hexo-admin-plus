<template>
  <article-editor
    :article-api="postApi"
    :article-id="route.params.postId"
  />
</template>

<script setup>
import { useRoute } from "vue-router";
import articleEditor from "@/components/ArticleEditorComponent.vue";
import postApi from "@/service/post";
const route = useRoute();
</script>
