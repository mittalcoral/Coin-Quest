import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const safeParse = (value) => {
  try {
    if (value && value !== "undefined") return JSON.parse(value);
    return null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => safeParse(localStorage.getItem("user")));
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [watchlist, setWatchlist] = useState([]);

  // Fetch watchlist on token change
  useEffect(() => {
    if (token) {
      api
        .get("/watchlist")
        .then((res) => {
          setWatchlist(Array.isArray(res.data) ? res.data : []);
        })
        .catch((err) => {
          console.error("Failed to fetch watchlist:", err);
          setWatchlist([]);
        });
    } else {
      setWatchlist([]);
    }
  }, [token]);

  const login = (data) => {
    console.log("login() called with:", data);
    let userData = null;

    if (data.user) {
      userData = data.user;
    } else if (data.token) {
      try {
        userData = jwtDecode(data.token); // Decode JWT payload
      } catch (e) {
        console.error("JWT decode failed:", e);
      }
    }

    setUser(userData);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);

    console.log("User set to:", userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setWatchlist([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, watchlist, setWatchlist, api }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
