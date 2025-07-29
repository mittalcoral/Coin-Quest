import express from "express";
import axios from "axios";

const router = express.Router();

const cache = {
  coins: { data: null, timestamp: 0 },
  trending: { data: null, timestamp: 0 },
  coinDetails: {}, 
};

const CACHE_DURATION = 60000; 

//  Get all coins
router.get("/", async (req, res) => {
  const { currency = "usd" } = req.query;
  const now = Date.now();

  if (cache.coins.data && now - cache.coins.timestamp < CACHE_DURATION) {
    console.log("Serving coins from cache");
    return res.json(cache.coins.data);
  }

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

    // Update cache
    cache.coins = { data, timestamp: now };

    console.log("Fetched coins from CoinGecko");
    res.json(data);
  } catch (error) {
    console.error("Error fetching coins:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: "Failed to fetch coins",
      details: error.response?.data?.error || error.message,
    });
  }
});

//  Get trending coins
router.get("/trending", async (req, res) => {
  const now = Date.now();

  if (cache.trending.data && now - cache.trending.timestamp < CACHE_DURATION) {
    console.log("Serving trending coins from cache");
    return res.json(cache.trending.data);
  }

  try {
    const { data } = await axios.get("https://api.coingecko.com/api/v3/search/trending");

    // Update cache
    cache.trending = { data: data.coins, timestamp: now };

    console.log("Fetched trending coins from CoinGecko");
    res.json(data.coins);
  } catch (error) {
    console.error("Error fetching trending coins:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: "Failed to fetch trending coins",
      details: error.response?.data?.error || error.message,
    });
  }
});

//  Get coin details by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const now = Date.now();

  if (cache.coinDetails[id] && now - cache.coinDetails[id].timestamp < CACHE_DURATION) {
    console.log(`Serving ${id} details from cache`);
    return res.json(cache.coinDetails[id].data);
  }

  try {
    const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);

    // Update cache
    cache.coinDetails[id] = { data, timestamp: now };

    console.log(`Fetched ${id} details from CoinGecko`);
    res.json(data);
  } catch (error) {
    console.error("Error fetching coin details:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: "Failed to fetch coin details",
      details: error.response?.data?.error || error.message,
    });
  }
});

export default router;
