import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [watchlist, setWatchlist] = useState([]);
  const [socket, setSocket] = useState(null);

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const fetchWatchlist = async () => {
    if (!token) return;
    try {
      const { data } = await api.get("/watchlist");
      setWatchlist(data);
    } catch (err) {
      console.error("Failed to fetch watchlist:", err);
      if (err.response?.status === 401) logout();
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.token);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    fetchWatchlist();
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setWatchlist([]);
    localStorage.removeItem("token");
  };

  
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket:", newSocket.id);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (token) fetchWatchlist();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, token, watchlist, login, logout, socket }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
