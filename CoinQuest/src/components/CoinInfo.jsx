import axios from "axios";
import { useEffect, useState } from "react";
import { HistoricalChart } from "../config/api.js";
import {
  CircularProgress,
  Box,
  useTheme,
} from "@mui/material";
import SelectButton from "./SelectButton";
import { chartDays } from "../config/data";
import { CryptoState } from "../CryptoContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);
const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState([]);
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();
  const [loading, setLoading] = useState(true);

  const theme = useTheme();

  const fetchHistoricData = async () => {
    setLoading(true);
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setHistoricData(data.prices);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistoricData();
  }, [days]);

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "75%" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: { xs: 0, md: 3 },
        px: { xs: 2, md: 5 },
        pb: 5,
      }}
    >
      {loading ? (
        <CircularProgress
          sx={{ color: "limegreen", mt: 4 }}
          size={250}
          thickness={1}
        />
      ) : (
        <>
          <Line
            data={{
              labels: historicData.map((point) => {
                let date = new Date(point[0]);
                let time =
                  date.getHours() > 12
                    ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                    : `${date.getHours()}:${date.getMinutes()} AM`;
                return days === 1 ? time : date.toLocaleDateString();
              }),
              datasets: [
                {
                  data: historicData.map((point) => point[1]),
                  label: `Price (Past ${days} Days) in ${currency}`,
                  borderColor: "limegreen",
                  borderWidth: 2,
                  pointRadius: 0,
                },
              ],
            }}
            options={{
              responsive: true,
              elements: {
                line: {
                  tension: 0.25,
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "lime",
                  },
                },
              },
              scales: {
                x: {
                  ticks: { color: "lime" },
                  grid: { color: "#333" },
                },
                y: {
                  ticks: { color: "lime" },
                  grid: { color: "#333" },
                },
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              mt: 3,
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            {chartDays.map((day) => (
              <SelectButton
                key={day.value}
                onClick={() => setDays(day.value)}
                selected={day.value === days}
              >
                {day.label}
              </SelectButton>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default CoinInfo;
