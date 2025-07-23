import { useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Box, Button, Container, TextField, Typography, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      console.log("API Response:", data);
      login(data); // ✅ Calls AuthContext login
      alert("Login Successful!");
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert("Login Failed");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#0e1111",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          borderRadius: 3,
          backgroundColor: "#1a1a1a",
          color: "white",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          sx={{ fontFamily: "Montserrat", fontWeight: "bold", color: "limegreen", mb: 3 }}
        >
          Login
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            sx={{
              input: { color: "lime" },
              label: { color: "lime" },
              fieldset: { borderColor: "limegreen" },
            }}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            sx={{
              input: { color: "lime" },
              label: { color: "lime" },
              fieldset: { borderColor: "limegreen" },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "limegreen",
              color: "black",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "green", color: "white" },
            }}
          >
            Login
          </Button>

          <Typography textAlign="center" sx={{ color: "white", mt: 2 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "limegreen", textDecoration: "none", fontWeight: "bold" }}>
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
