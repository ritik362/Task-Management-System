import api from "./axios.js";

export const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await api.post(`/auth/reset-password/${token}`, { password });
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put("/auth/me", payload);
  return data;
};

export const changePassword = async (payload) => {
  const { data } = await api.patch("/auth/change-password", payload);
  return data;
};

export const updateAvatar = async (formData) => {
  const { data } = await api.patch("/auth/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return data;
};
