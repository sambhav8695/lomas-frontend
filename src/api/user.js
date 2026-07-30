import { api } from "./client";

export const userApi = {
  getProfile: () => api.get("/users/me").then((r) => r.data.data),
  updateProfile: (payload) => api.patch("/users/me", payload).then((r) => r.data.data),
  changePassword: (payload) => api.post("/users/me/change-password", payload).then((r) => r.data.data),
  deactivateAccount: () => api.post("/users/me/deactivate").then((r) => r.data.data),
  deleteAccount: () => api.delete("/users/me").then((r) => r.data.data),
};
