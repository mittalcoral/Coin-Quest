import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CryptoProvider } from "./CryptoContext";
import { AuthProvider } from "./AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <CryptoProvider>
        <App />
      </CryptoProvider>
    </AuthProvider>
  </React.StrictMode>
);
