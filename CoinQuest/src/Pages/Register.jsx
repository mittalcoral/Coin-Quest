import { useState } from "react";
import { Box, Button, Container, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Register() {
    const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const navigate = useNavigate();
   const { register } = useAuth();

const handleRegister = async (e) => {
  e.preventDefault();

  const success = await register(name, email, password);
  if (success) {
    alert("Registration successful! Please login.");
    navigate("/login");
  } else {
    alert("Registration failed");
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
          Register
        </Typography>

        <Box component="form" onSubmit={handleRegister} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
            label="Name"
            variant="outlined"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            sx={{
              input: { color: "lime" },
              label: { color: "lime" },
              fieldset: { borderColor: "limegreen" },
            }}
          />

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
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
