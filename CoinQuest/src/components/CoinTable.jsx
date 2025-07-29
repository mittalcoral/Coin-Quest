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
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { useAuth } from "../AuthContext";
import { numberWithCommas } from "../utils/format";

export default function CoinTable() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { symbol } = CryptoState();
  const navigate = useNavigate();
  const { token, watchlist, socket } = useAuth();

  useEffect(() => {
    if (!socket) return;

    socket.on("coinData", (data) => {
      console.log(" Received coinData for Table");
      setCoins(data);
      setLoading(false);
    });

    return () => socket.off("coinData");
  }, [socket]);

  const handleSearch = () =>
    coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <Container sx={{ textAlign: "center" }}>
      <Typography variant="h4" sx={{ margin: 3, fontFamily: "Montserrat", color: "lime" }}>
        Live Cryptocurrency Prices by Market Cap
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
                {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                  <TableCell
                    key={head}
                    align={head === "Coin" ? "left" : "right"}
                    sx={{ color: "black", fontWeight: 700, fontFamily: "Montserrat" }}
                  >
                    {head}
                  </TableCell>
                ))}
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
                        sx={{ display: "flex", gap: 2, alignItems: "center", cursor: "pointer" }}
                        onClick={() => navigate(`/coins/${row.id}`)}
                      >
                        <img src={row?.image} alt={row.name} height="50" style={{ marginBottom: 10 }} />
                        <Box display="flex" flexDirection="column">
                          <span style={{ textTransform: "uppercase", fontSize: 22, color: "lime" }}>
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
                        {symbol} {numberWithCommas(row.market_cap.toString().slice(0, -6))}M
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
