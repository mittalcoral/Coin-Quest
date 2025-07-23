import {
  Box,
  Typography,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api.js";
import { numberWithCommas } from "../utils/format";
import { CryptoState } from "../CryptoContext";

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const { currency, symbol } = CryptoState();
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };

  useEffect(() => {
    fetchCoin();
 
  }, []);

  if (!coin)
    return (
      <LinearProgress
        sx={{ backgroundColor: "limegreen" }}
      />
    );

  return (
    <Box
      display="flex"
      flexDirection={isSmallScreen ? "column" : "row"}
      sx={{ backgroundColor: "#000", color: "lime", minHeight: "100vh" }}
    >
      <Box
        width={isSmallScreen ? "100%" : "30%"}
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={3}
        borderRight={isSmallScreen ? 0 : "2px solid grey"}
        p={2}
      >
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography variant="h3" fontWeight="bold" mb={2} fontFamily="Montserrat">
          {coin?.name}
        </Typography>
        <Typography
          variant="subtitle1"
          fontFamily="Montserrat"
          textAlign="justify"
          dangerouslySetInnerHTML={{
            __html: coin?.description.en.split(". ")[0],
          }}
          sx={{ paddingX: 2 }}
        />
        <Box
          alignSelf="start"
          width="100%"
          mt={3}
          display="flex"
          flexDirection={isSmallScreen ? "column" : "row"}
          justifyContent="space-around"
          flexWrap="wrap"
        >
          <Box mb={2}>
            <Typography variant="h5" fontWeight="bold">
              Rank:
            </Typography>
            <Typography variant="h5" fontFamily="Montserrat">
              {numberWithCommas(coin?.market_cap_rank)}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="h5" fontWeight="bold">
              Current Price:
            </Typography>
            <Typography variant="h5" fontFamily="Montserrat">
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="h5" fontWeight="bold">
              Market Cap:
            </Typography>
            <Typography variant="h5" fontFamily="Montserrat">
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M
            </Typography>
          </Box>
        </Box>
      </Box>
      <CoinInfo coin={coin} />
    </Box>
  );
};

export default CoinPage;
