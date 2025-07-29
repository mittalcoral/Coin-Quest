import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/HomePage";
import CoinPage from "./Pages/CoinPage";
import Register from "./Pages/Register";
import Header from "./components/Header";
import "./App.css";
import Login from "./Pages/Login";
import Watchlist from "./Pages/Watchlist";

function App() {
  const appStyles = {
    backgroundColor: "#0e1111",
    color: "#ffffff",
    minHeight: "100vh",
  };

  return (
    <BrowserRouter>
      <div style={appStyles}>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/coins/:id" element={<CoinPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
