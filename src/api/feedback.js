import { api } from "./client";

export const feedbackApi = {
  submit: (payload) => api.post("/feedback", payload).then((r) => r.data.data),
  getPromptStatus: () => api.get("/feedback/prompt-status").then((r) => r.data.data),
};
