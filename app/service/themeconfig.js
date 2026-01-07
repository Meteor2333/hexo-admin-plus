import request from "@/request";

export default {
    getConfig() {
        return request.get("themeconfig");
    },
    
    updateConfig(config) {
        return request.post("themeconfig", { config });
    },
};