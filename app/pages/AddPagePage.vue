<template>
  <article-editor
    :api="pageApi"
    @create="handleCreate"
  />
</template>

<script setup>
import articleEditor from "@/components/ArticleEditorComponent.vue";
import pageApi from "@/service/page";
import router from "@/router";

function handleCreate(data) {
    router.replace({ "name":"EditPage", "params":{ "pageId": data.id } });
}
</script>
