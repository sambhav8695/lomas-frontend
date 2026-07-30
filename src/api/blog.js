import { api } from "./client";

export const blogApi = {
  list: (page = 0, size = 12) => api.get("/blogs", { params: { page, size } }).then((r) => r.data.data),
  search: (q, page = 0, size = 12) =>
    api.get("/blogs/search", { params: { q, page, size } }).then((r) => r.data.data),
  getBySlug: (slug) => api.get(`/blogs/${slug}`).then((r) => r.data.data),
};
