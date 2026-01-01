<template>
  <el-container id="app">
    <el-header class="page-header">
      <el-menu
        mode="horizontal"
        :ellipsis="false"
        router
        :default-active="route.path"
      >
        <el-text
          size="large"
          class="title"
          style="
            text-shadow:
              0 0 5px rgba(255, 255, 255, 0.6),
              0 0 10px rgba(255, 255, 255, 0.5),
              0 0 15px rgba(255, 255, 255, 0.4),
              0 0 20px rgba(255, 255, 255, 0.3);
          "
        >
          Hexo Admin
        </el-text>
        <el-menu-item :index="routes.PostList.path">
          Posts
        </el-menu-item>
        <el-menu-item :index="routes.PageList.path">
          Pages
        </el-menu-item>
        <el-menu-item :index="routes.Config.path">
          Config
        </el-menu-item>
        <el-menu-item :index="routes.ThemeConfig.path">
          ThemeConfig
        </el-menu-item>
        <div class="flex-grow" />
        <div class="back-button">
          <el-button
            tag="a"
            href="../"
            plain
          >
            Back to home
          </el-button>
        </div>
      </el-menu>
    </el-header>
    <el-main>
      <!-- todo:支持多用户 -->
      <el-dialog
        v-model="dialogLoginVisible"
        title="Login"
        width="30%"
        align-center
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
      >
        <el-form
          ref="formRef"
          label-width="auto"
          :model="loginForm"
          @keydown.enter="handelLogin"
        >
          <el-form-item
            required
            label="Name"
            prop="username"
          >
            <el-input
              v-model="loginForm.username"
              placeholder="Enter your name"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            required 
            label="Password"
            prop="password"
          >
            <el-input
              v-model="loginForm.password"
              placeholder="Enter your password"
              autocomplete="off"
              type="password"
              show-password
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button
            type="primary"
            @click="handelLogin"
          >
            Confirm
          </el-button>
        </template>
      </el-dialog>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, reactive } from "vue";
import { dialogLoginVisible } from "./service/_request";
import { useRoute, useRouter } from "vue-router";
import authApi from "@/service/auth";

const route = useRoute();
const routes = {};
const router = useRouter();
router.getRoutes().forEach(r => {
    if (r.name) routes[r.name] = r;
});

const formRef = ref(null);
const loginForm = reactive({
    "username": "",
    "password": "",
});

async function handelLogin() {
    try {
        await formRef.value.validate();
    } catch (e) {
        return;
    }

    const { code } = await authApi.login(loginForm);
    if (!code) {
        dialogLoginVisible.value = false;
        router.go(0);
    }
}
</script>

<style>
  * { box-sizing: border-box; }
  html, body, #app, .page, .page-body { width: 100%; height: 100%; margin: 0; padding: 0; }
  .page > .page-body { overflow: hidden; }
  .page-footer { padding: 10px 20px; height: auto; }
  .flex-grow { flex-grow: 1; }
  a { text-decoration: none; }

  .title { margin: 15px 15px; cursor: default; user-select: none; }
  .back-button { display: flex; align-items: center; margin-right: 15px; }
  .el-header { padding: 0; height: 48px; }
  .el-main { height: 100%; --el-main-padding: 0; }
  .el-menu--horizontal { --el-menu-horizontal-height: 48px; }
</style>
