import { ref } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";

axios.defaults.headers["Content-Type"] = "application/json";
const service = axios.create({ "baseURL": "./api", "timeout": 100000 });

service.interceptors.response.use(
    (response) => {
        if (
            response.request.responseType === "blob" ||
            response.request.responseType === "arraybuffer"
        ) {
            return response.data;
        }
        
        const code = response.data.code;
        if (!code) return response.data;
        if (code === 401) {
            dialogLoginVisible.value = true;
            return null;
        }

        ElMessage.warning(response.data.data ?? response.data.msg ?? `Code: ${code}`);
        return response.data;
    }, (error) => {
        ElMessage.error(error.message);
        return Promise.reject(error);
    },
);

export default service;

export const dialogLoginVisible = ref(false);