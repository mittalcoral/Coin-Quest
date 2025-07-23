import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};


// Get Watchlist
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.watchlist || []); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Add to Watchlist
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { coinId } = req.body;
    if (!coinId) return res.status(400).json({ message: "coinId is required" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.watchlist.includes(coinId)) {
      user.watchlist.push(coinId);
      await user.save();
    }
    res.json(user.watchlist); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// Remove from Watchlist
router.post("/remove", authMiddleware, async (req, res) => {
  try {
    const { coinId } = req.body;

    if (!coinId) {
      return res.status(400).json({ message: "coinId is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.watchlist = user.watchlist.filter((id) => id !== coinId);
    await user.save();

    res.json(user.watchlist); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
