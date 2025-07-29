import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import axios from "axios";

import authRoutes from "./routes/auth.js";
import watchlistRoutes from "./routes/watchlist.js";
import coinRoutes from "./routes/coins.js";

dotenv.config();
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/coinquest")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err.message));


app.use("/api/coins", coinRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

let latestData = []; 

const fetchAndBroadcastData = async () => {
  try {
    const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: { vs_currency: "usd", order: "market_cap_desc", per_page: 100, page: 1 },
    });

    latestData = data; 
    io.emit("coinData", data); 
    console.log("Broadcasted coin data to all clients");
  } catch (error) {
    console.error("Error fetching coins for WebSocket:", error.message);
  }
};


fetchAndBroadcastData();
setInterval(fetchAndBroadcastData, 60000);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);


  if (latestData.length > 0) {
    socket.emit("coinData", latestData);
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
