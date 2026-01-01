<template>
  <article-editor
    :article-api="postApi"
    @save="handleSave"
  />
</template>

<script setup>
import articleEditor from "@/components/ArticleEditorComponent.vue";
import postApi from "@/service/post";
import router from "@/router";

function handleSave(data) {
    router.replace({"name":"EditPost", "params":{"postId": data._id}});
}
</script>
