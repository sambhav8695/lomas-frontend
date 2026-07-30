import { api } from "./client";

export const chatApi = {
  createChat: (title) => api.post("/chats", title ? { title } : {}).then((r) => r.data.data),
  listChats: (page = 0, size = 20) =>
    api.get("/chats", { params: { page, size } }).then((r) => r.data.data),
  renameChat: (chatId, title) => api.patch(`/chats/${chatId}`, { title }).then((r) => r.data.data),
  deleteChat: (chatId) => api.delete(`/chats/${chatId}`).then((r) => r.data.data),
  getHistory: (chatId, page = 0, size = 50) =>
    api.get(`/chats/${chatId}/messages`, { params: { page, size } }).then((r) => r.data.data),
  sendMessage: (chatId, message) =>
    api.post(`/chats/${chatId}/messages`, { message }).then((r) => r.data.data),
};
