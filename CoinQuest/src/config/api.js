// CoinGecko API base URL
const BASE_URL = "https://api.coingecko.com/api/v3";

/**
 * Get market data for top 100 coins in given currency.
 * @param {string} currency - Currency code (e.g., 'usd', 'inr')
 */
export const CoinList = (currency) =>
  `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

/**
 * Get full data for a single coin by ID.
 * @param {string} id - Coin ID (e.g., 'bitcoin', 'ethereum')
 */
export const SingleCoin = (id) =>
  `${BASE_URL}/coins/${id}`;

/**
 * Get historical market chart data for a coin.
 * @param {string} id - Coin ID
 * @param {number|string} days - Number of days of history (default: 365)
 * @param {string} currency - Currency code
 */
export const HistoricalChart = (id, days = 365, currency) =>
  `${BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

/**
 * Get trending coins (top 10 by price change in 24h).
 * @param {string} currency - Currency code
 */
export const TrendingCoins = (currency) =>
  `${BASE_URL}/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;
