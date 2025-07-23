import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../AuthContext";
import { CryptoState } from "../CryptoContext";
import { numberWithCommas } from "../utils/format";


export default function Watchlist() {
  const { token, watchlist, setWatchlist, api } = useAuth();
  const { currency, symbol } = CryptoState();
  const navigate = useNavigate();

  const [coinsData, setCoinsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if user not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  //  Fetch coin details when watchlist changes
  useEffect(() => {
    const fetchCoins = async () => {
      if (watchlist.length > 0) {
        try {
          setLoading(true);
          const { data } = await axios.get(
            `https://api.coingecko.com/api/v3/coins/markets`,
            {
              params: {
                vs_currency: currency,
                ids: watchlist.join(","),
              },
            }
          );
          setCoinsData(data);
        } catch (error) {
          console.error("Error fetching coins:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setCoinsData([]);
        setLoading(false);
      }
    };
    fetchCoins();
  }, [watchlist, currency]);

  
  const removeFromWatchlist = async (coinId) => {
  try {
    const { data } = await api.post("/watchlist/remove", { coinId });
    if (Array.isArray(data)) {
      setWatchlist(data);
    } else {
      setWatchlist((prev) => prev.filter((id) => id !== coinId));
    }
  } catch (error) {
    console.error("Error removing coin:", error.response?.data || error.message);
  }
};


  return (
    <Container sx={{ textAlign: "center", paddingY: 4 }}>
      <Typography
        variant="h4"
        sx={{ color: "lime", fontFamily: "Montserrat", marginBottom: 3 }}
      >
        Your Watchlist
      </Typography>

      {coinsData.length === 0 ? (
        <Typography sx={{ color: "gray" }}>Your watchlist is empty.</Typography>
      ) : (
        <Table component={Paper} sx={{ backgroundColor: "#111" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "limegreen" }}>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>Coin</TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }} align="right">
                Price
              </TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }} align="right">
                24h Change
              </TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }} align="right">
                Market Cap
              </TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }} align="right">
                Remove
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coinsData.map((coin) => {
              const profit = coin.price_change_percentage_24h >= 0;
              return (
                <TableRow key={coin.id} hover>
                  <TableCell sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <img src={coin.image} alt={coin.name} height="40" />
                    <Box>
                      <span style={{ color: "lime", fontWeight: "bold" }}>
                        {coin.symbol.toUpperCase()}
                      </span>
                      <span style={{ color: "gray", marginLeft: 8 }}>{coin.name}</span>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "lime" }} align="right">
                    {symbol} {numberWithCommas(coin.current_price.toFixed(2))}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: profit ? "limegreen" : "red", fontWeight: 500 }}
                  >
                    {profit && "+"}
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </TableCell>
                  <TableCell sx={{ color: "lime" }} align="right">
                    {symbol} {numberWithCommas(coin.market_cap.toString().slice(0, -6))}M
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      sx={{ color: "red" }}
                      onClick={() => removeFromWatchlist(coin.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Container>
  );
}
