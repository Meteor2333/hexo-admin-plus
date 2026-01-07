import request from "@/request";

export default {
    list({ page, title, category, tag }) {
        const params = { page, title, category, tag };
        return request.get("page", { params });
    },

    getData(id) {
        return request.get(`page/${id}`);
    },

    update(id, post) {
        return request.put(`page/${id}`, post);
    },

    create(post) {
        return request.post("page", post);
    },
    
    remove(id) {
        return request.delete(`page/${id}`);
    },
};