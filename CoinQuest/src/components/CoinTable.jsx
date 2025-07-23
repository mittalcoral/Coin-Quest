import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Paper,
  LinearProgress,
  Button,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useEffect, useState } from "react";
import axios from "axios";
import { CoinList } from "../config/api.js";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { useAuth } from "../AuthContext";
import { numberWithCommas } from "../utils/format";


export default function CoinTable() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { currency, symbol } = CryptoState();
  const navigate = useNavigate();
  const { token, watchlist, setWatchlist, api } = useAuth();

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, [currency]);

  const handleSearch = () =>
    coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );

  //  Add to Watchlist
  const addToWatchlist = async (coinId) => {
    if (!token) {
      alert("Please login first!");
      return;
    }
    try {
      const { data } = await api.post("/watchlist/add", { coinId });
      setWatchlist(data); 
    } catch (error) {
      console.error("Error adding to watchlist:", error.response?.data || error.message);
    }
  };

  //  Remove from Watchlist
  const removeFromWatchlist = async (coinId) => {
    if (!token) {
      alert("Please login first!");
      return;
    }
    try {
      const { data } = await api.post("/watchlist/remove", { coinId });
      setWatchlist(data);
    } catch (error) {
      console.error("Error removing from watchlist:", error.response?.data || error.message);
    }
  };

  return (
    <Container sx={{ textAlign: "center" }}>
      <Typography
        variant="h4"
        sx={{ margin: 3, fontFamily: "Montserrat", color: "lime" }}
      >
        Cryptocurrency Prices by Market Cap
      </Typography>

      <TextField
        label="Search for a Cryptocurrency..."
        variant="outlined"
        fullWidth
        sx={{
          marginBottom: 3,
          input: { color: "lime" },
          label: { color: "lime" },
          fieldset: { borderColor: "lime" },
        }}
        onChange={(e) => setSearch(e.target.value)}
      />

      <TableContainer component={Paper} sx={{ backgroundColor: "#1a1a1a" }}>
        {loading ? (
          <LinearProgress sx={{ backgroundColor: "limegreen" }} />
        ) : (
          <Table>
            <TableHead sx={{ backgroundColor: "limegreen" }}>
              <TableRow>
                {["Coin", "Price", "24h Change", "Market Cap", "Action"].map(
                  (head) => (
                    <TableCell
                      key={head}
                      align={head === "Coin" ? "left" : "right"}
                      sx={{
                        color: "black",
                        fontWeight: 700,
                        fontFamily: "Montserrat",
                      }}
                    >
                      {head}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {handleSearch()
                .slice((page - 1) * 10, (page - 1) * 10 + 10)
                .map((row) => {
                  const profit = row.price_change_percentage_24h > 0;
                  return (
                    <TableRow
                      key={row.name}
                      sx={{
                        backgroundColor: "#111",
                        "&:hover": { backgroundColor: "#222" },
                        fontFamily: "Montserrat",
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ display: "flex", gap: 2, alignItems: "center" }}
                        onClick={() => navigate(`/coins/${row.id}`)}
                      >
                        <img
                          src={row?.image}
                          alt={row.name}
                          height="50"
                          style={{ marginBottom: 10 }}
                        />
                        <Box display="flex" flexDirection="column">
                          <span
                            style={{
                              textTransform: "uppercase",
                              fontSize: 22,
                              color: "lime",
                            }}
                          >
                            {row.symbol}
                          </span>
                          <span style={{ color: "darkgrey" }}>{row.name}</span>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ color: "lime" }}>
                        {symbol} {numberWithCommas(row.current_price.toFixed(2))}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: profit ? "limegreen" : "red",
                          fontWeight: 500,
                        }}
                      >
                        {profit && "+"}
                        {row.price_change_percentage_24h.toFixed(2)}%
                      </TableCell>
                      <TableCell align="right" sx={{ color: "lime" }}>
                        {symbol}{" "}
                        {numberWithCommas(row.market_cap.toString().slice(0, -6))}M
                      </TableCell>
                      <TableCell align="right">
                        {watchlist.includes(row.id) ? (
                          <Button
                            variant="contained"
                            onClick={() => removeFromWatchlist(row.id)}
                            sx={{
                              backgroundColor: "red",
                              color: "white",
                              fontWeight: "bold",
                              "&:hover": { backgroundColor: "#cc0000" },
                              paddingX: 2,
                              paddingY: 1,
                              borderRadius: "8px",
                              fontSize: "14px",
                              textTransform: "none",
                            }}
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => addToWatchlist(row.id)}
                            sx={{
                              backgroundColor: "limegreen",
                              color: "black",
                              fontWeight: "bold",
                              "&:hover": { backgroundColor: "#32cd32" },
                              paddingX: 2,
                              paddingY: 1,
                              borderRadius: "8px",
                              fontSize: "14px",
                              textTransform: "none",
                            }}
                          >
                            + Watchlist
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Pagination
        count={(handleSearch()?.length / 10).toFixed(0)}
        sx={{
          padding: 3,
          display: "flex",
          justifyContent: "center",
          "& .MuiPaginationItem-root": {
            color: "lime",
          },
        }}
        onChange={(_, value) => {
          setPage(value);
          window.scrollTo({ top: 450, behavior: "smooth" });
        }}
      />
    </Container>
  );
}
