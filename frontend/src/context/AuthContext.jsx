import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchCurrentUser,
  login as loginRequest,
  register as registerRequest
} from "../api/authApi.js";
import { AuthContext } from "./authContextValue.js";

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(getStoredUser);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const persistSession = useCallback((authData) => {
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
  }, []);

  const registerUser = useCallback(
    async (payload) => {
      const data = await registerRequest(payload);
      persistSession(data);
      toast.success("Account created successfully");
      return data;
    },
    [persistSession]
  );

  const loginUser = useCallback(
    async (payload) => {
      const data = await loginRequest(payload);
      persistSession(data);
      toast.success("Welcome back");
      return data;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast.success("Logged out");
  }, []);

  const updateUserState = useCallback((updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      return null;
    }

    setIsAuthLoading(true);
    try {
      const data = await fetchCurrentUser();
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch {
      logout();
      return null;
    } finally {
      setIsAuthLoading(false);
    }
  }, [logout]);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      isAuthLoading,
      loginUser,
      logout,
      refreshUser,
      registerUser,
      updateUserState,
      token,
      user
    }),
    [isAuthLoading, loginUser, logout, refreshUser, registerUser, updateUserState, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
