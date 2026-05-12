import api from "./axios.js";

export const getTasks = async (page = 1, limit = 10) => {
  const { data } = await api.get(`/tasks?page=${page}&limit=${limit}`);
  return data;
};

export const createTask = async (payload) => {
  const { data } = await api.post("/tasks", payload);
  return data;
};

export const updateTask = async (taskId, payload) => {
  const { data } = await api.put(`/tasks/${taskId}`, payload);
  return data;
};

export const updateTaskStatus = async (taskId, status) => {
  const { data } = await api.patch(`/tasks/${taskId}/status`, { status });
  return data;
};

export const deleteTask = async (taskId) => {
  const { data } = await api.delete(`/tasks/${taskId}`);
  return data;
};
