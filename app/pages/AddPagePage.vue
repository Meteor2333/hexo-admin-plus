<template>
  <article-editor
    :article-api="pageApi"
    @save="handleSave"
  />
</template>

<script setup>
import articleEditor from "@/components/ArticleEditorComponent.vue";
import pageApi from "@/service/page";
import router from "@/router";

function handleSave(data) {
    router.replace({ "name":"EditPage", "params":{ "pageId": data._id } });
}
</script>
