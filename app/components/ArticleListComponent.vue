<template>
  <el-container
    v-loading="isLoading"
    class="page"
    element-loading-text="loading..."
  >
    <el-header>
      <div class="buttons">
        <el-button
          v-if="articleType==='post'"
          type="primary"
          @click="handleNewPost"
        >
          New Post
        </el-button>
        <el-button
          v-if="articleType==='page'"
          type="primary"
          @click="handleNewPage"
        >
          New Page
        </el-button>
        <el-button-group
          v-if="multipleSelection.length"
          class="options"
        >
          <el-button
            type="success"
            @click="multipleSelection.forEach(item => handlePublish(item._id))"
          >
            Publish
          </el-button>
          <el-button
            type="warning"
            @click="multipleSelection.forEach(item => handleUnpublish(item._id))"
          >
            Unpublish
          </el-button>
          <el-button
            type="danger"
            @click="confirmRemove(() => multipleSelection.forEach(item => handleRemove(item._id)))"
          >
            Remove
          </el-button>
        </el-button-group>
      </div>
      <el-form inline>
        <el-form-item v-if="filter">
          <el-select
            v-model="filterForm.category"
            filterable
            remote
            clearable
            remote-show-suffix
            :remote-method="searchCategoryName"
            placeholder="category"
          >
            <el-option
              v-for="(c,idx) in categoryOptions"
              :key="idx"
              :label="c"
              :value="c"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="filter">
          <el-select
            v-model="filterForm.tag"
            filterable
            remote
            clearable
            remote-show-suffix
            :remote-method="searchTagName"
            placeholder="tags"
          >
            <el-option
              v-for="(t,idx) in tagOptions"
              :key="idx"
              :label="t"
              :value="t"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filterForm.title"
            placeholder="title"
            clearable
          />
        </el-form-item>
      </el-form>
    </el-header>
    <el-main class="page-body">
      <el-table
        stripe
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          fixed
          sortable
          prop="title"
          label="Title"
          width="420"
        >
          <template #default="{ row }">
            <router-link :to="row.to">
              <el-text type="primary">
                {{ row.title }}
              </el-text>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          v-if="articleType==='post'"
          sortable
          prop="categories"
          label="Categories"
        />
        <el-table-column
          v-if="articleType==='post'"
          sortable
          prop="tags"
          label="Tags"
        />
        <el-table-column
          prop="date"
          label="CreateTime"
          sortable
        />
        <el-table-column label="Status">
          <template #default="{ row }">
            <el-text
              v-if="row.isDraft"
              type="warning"
            >
              Draft
            </el-text>
            <el-text
              v-else
              type="success"
            >
              Published
            </el-text>
          </template>
        </el-table-column>
        <el-table-column
          label="Operations"
          width="250"
        >
          <template #default="{ row }">
            <el-button
              v-if="row.isDraft && api.publish"
              plain
              size="small"
              type="success"
              @click="handlePublish(row._id)"
            >
              Publish
            </el-button>
            <el-button
              v-else-if="api.unpublish"
              plain
              size="small"
              type="warning"
              @click="handleUnpublish(row._id)"
            >
              Unpublish
            </el-button>
            <el-button
              plain
              size="small"
              type="danger"
              @click="confirmRemove(() => handleRemove(row._id))"
            >
              Remove
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty
            v-if="!isLoading"
            :image-size="200"
          />
        </template>
      </el-table>
    </el-main>
    <el-footer class="page-footer">
      <el-pagination
        v-model:current-page="currentPage"
        background
        hide-on-single-page
        layout="->, total, prev, pager, next, jumper"
        :page-size="15"
        :total="total"
      />
    </el-footer>
  </el-container>
</template>

<script setup>
import {ref, reactive, onMounted, computed, watch} from "vue";
import {useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";
import dateFormat from "dateformat";

import postApi from "../service/post";
import pageApi from "../service/page";
import taxonomyApi from "../service/taxonomy";

const router = useRouter();
const props = defineProps({
    "articleType": String,
    "filter": {
        "type": Boolean,
        "default": false,
    }});
const api = props.articleType === "post" ? postApi : pageApi;

const multipleSelection = ref([]);

const filterForm = reactive({});
const tagOptions = ref([]);
const categoryOptions = ref([]);

const articleList = ref([]);
const total = ref(0);
const currentPage = ref(1);
const isLoading = ref(true);

const tableData = computed(() =>
    articleList.value.map((p)=> ({
        "_id": p._id,
        "title": p.title,
        "link": p.link,
        "categories": p.categories?.join(", ") || "-",
        "tags": p.tags?.join(", ") || "-",
        "updated": dateFormat(new Date(p.updated), "yyyy-mm-dd hh:MM:ss"),
        "date": dateFormat(new Date(p.date), "yyyy-mm-dd hh:MM:ss"),
        "isDraft": p.isDraft,
        "to": props.articleType === "post" ?
            {"name": "EditPost", "params": {"postId": p._id}}:
            {"name": "EditPage", "params": {"pageId": p._id}},
    })),
);

function handleNewPost() {
    router.push({"name": "AddPost"});
}

function handleNewPage() {
    router.push({"name": "AddPage"});
}

function handleSelectionChange(val) {
    multipleSelection.value = val;
}

async function handlePublish(articleId) {
    const {code, data} = await api.publish(articleId);
    if (code) return;
    ElMessage.success("Published successfully!");
    const p = articleList.value.find(p => p._id === articleId);
    p.isDraft = false;
    p._id = data._id;
    articleList.value = [...articleList.value];
}

async function handleUnpublish(articleId) {
    const {code, data} = await api.unpublish(articleId);
    if (code) return;
    ElMessage.success("Unpublished successfully!");
    const p = articleList.value.find(p => p._id === articleId);
    p.isDraft = true;
    p._id = data._id;
    articleList.value = [...articleList.value];
}

async function handleRemove(articleId) {
    const {code} = await api.remove(articleId);
    if (code) return;
    ElMessage.success("Removed successfully!");
    const pIdx = articleList.value.findIndex(p => p._id === articleId);
    articleList.value.splice(pIdx, 1);
    loadList(currentPage.value);
}

function confirmRemove(callback) {
    ElMessageBox.confirm(
        "Are you sure you want to remove the selected article(s)? This action cannot be undone.",
        "Warning",
        {
            "confirmButtonText": "OK",
            "cancelButtonText": "Cancel",
            "type": "warning",
        },
    ).then(() => {
        callback();
    });
}

async function loadList(page = 1) {
    isLoading.value = true;
    const options = Object.assign({page}, filterForm);
    const {data} = await api.list(options);
    articleList.value = data.list;
    total.value = data.total;
    currentPage.value = page;
    isLoading.value = false;
}
  
async function searchCategoryName() {
    const {data} = await taxonomyApi.getCategoryList();
    if (data) {
        categoryOptions.value = data.list;
    }
}

async function searchTagName(name) {
    const {data} = await taxonomyApi.getTagList(name);
    if (data) {
        tagOptions.value = data.list;
    }
}

watch(filterForm, () => loadList(1));
watch(currentPage, loadList);
onMounted(() => {
    loadList(1);
    if (props.filter) {
        searchCategoryName();
        searchTagName();
    }
});
</script>

<style scoped>
  .buttons { display: inline-block; }
  .options { margin-left: 15px; }
  .el-header { display: flex; height: auto; padding: 10px; }
  .el-form { flex: 1; text-align: right; }
  .el-form-item { margin-bottom: 0; }
  .el-table { height: 100%; }
  .page-footer { text-align: right; }
</style>