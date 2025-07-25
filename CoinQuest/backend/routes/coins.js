import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  const { currency = "usd" } = req.query;

  try {
    const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: currency,
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
        sparkline: false,
      },
    });

    res.json(data);
  } catch (error) {
    console.error("Error fetching coins:", error.message);
    res.status(500).json({ message: "Failed to fetch coins" });
  }
});


router.get("/trending", async (req, res) => {
  try {
    const { data } = await axios.get("https://api.coingecko.com/api/v3/search/trending");
    res.json(data.coins);
  } catch (error) {
    console.error("Error fetching trending coins:", error.message);
    res.status(500).json({ message: "Failed to fetch trending coins" });
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
    res.json(data);
  } catch (error) {
    console.error("Error fetching coin details:", error.message);
    res.status(500).json({ message: "Failed to fetch coin details" });
  }
});

export default router;
