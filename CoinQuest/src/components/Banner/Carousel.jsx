import axios from "axios";
import { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { Link } from "react-router-dom";
import { TrendingCoins } from "../../config/api";
import { CryptoState } from "../../CryptoContext";
import { numberWithCommas } from "../../utils/format";
import { Typography } from "@mui/material";

const Carousel = () => {
  const [trending, setTrending] = useState([]);
  const { currency, symbol } = CryptoState();

  const fetchTrendingCoins = async () => {
    const { data } = await axios.get(TrendingCoins(currency));
    setTrending(data);
  };

  useEffect(() => {
    fetchTrendingCoins();
  }, [currency]);

  const items = trending.map((coin) => {
    const profit = coin?.price_change_percentage_24h >= 0;

    return (
      <Link
        to={`/coins/${coin.id}`}
        key={coin.id}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          color: "white",
          margin: "10px",
        }}
      >
        <img
          src={coin?.image}
          alt={coin.name}
          height="50"
          style={{ marginBottom: 10 }}
        />
        <Typography variant="body2" style={{ fontWeight: 500 }}>
          {coin?.symbol.toUpperCase()} &nbsp;
          <span style={{ color: profit ? "limegreen" : "red" }}>
            {profit && "+"}
            {coin?.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </Typography>
        <Typography variant="body1" style={{ fontWeight: 600 }}>
          {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </Typography>
      </Link>
    );
  });

  const responsive = {
    0: { items: 2 },
    512: { items: 4 },
    1024: { items: 6 },
  };

  return (
    <AliceCarousel
      mouseTracking
      infinite
      autoPlayInterval={1000}
      animationDuration={2000}
      disableDotsControls
      disableButtonsControls
      responsive={responsive}
      items={items}
      autoPlay
    />
  );
};

export default Carousel;
