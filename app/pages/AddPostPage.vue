<template>
  <article-editor
    :api="postApi"
    @create="handleCreate"
  />
</template>

<script setup>
import articleEditor from "@/components/ArticleEditorComponent.vue";
import postApi from "@/service/post";
import router from "@/router";

function handleCreate(data) {
    router.replace({ "name":"EditPost", "params":{ "postId": data.id } });
}
</script>
