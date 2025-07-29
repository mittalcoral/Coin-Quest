import {
  AppBar,
  Container,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { useAuth } from "../AuthContext";

function Header() {
  const { currency, setCurrency } = CryptoState();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "transparent",
        backdropFilter: "blur(6px)",
        boxShadow: "0px 1px 4px limegreen",
      }}
    >
      <Container>
        <Toolbar>
          {/* Logo */}
          <Typography
            variant="h6"
            onClick={() => navigate("/")}
            sx={{
              flex: 1,
              color: "limegreen",
              fontFamily: "Montserrat",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Coin Quest
          </Typography>

          {/* Currency Selector */}
          <Select
            variant="outlined"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            sx={{
              width: 100,
              height: 40,
              marginRight: 2,
              color: "lime",
              borderColor: "lime",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "limegreen",
              },
              "& .MuiSvgIcon-root": {
                color: "limegreen",
              },
            }}
          >
            <MenuItem value={"USD"}>USD</MenuItem>
            <MenuItem value={"INR"}>INR</MenuItem>
          </Select>

          {/* Auth Buttons */}
          <Box>
            {!user ? (
              <>
                <Button
                  variant="outlined"
                  sx={{
                    color: "limegreen",
                    borderColor: "limegreen",
                    marginRight: 1,
                    "&:hover": { backgroundColor: "limegreen", color: "black" },
                  }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "limegreen",
                    color: "black",
                    "&:hover": { backgroundColor: "#32cd32" },
                  }}
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  sx={{
                    color: "limegreen",
                    borderColor: "limegreen",
                    marginRight: 1,
                    "&:hover": { backgroundColor: "limegreen", color: "black" },
                  }}
                  onClick={() => navigate("/watchlist")}
                >
                  Watchlist
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "red",
                    color: "white",
                    "&:hover": { backgroundColor: "#ff4d4d" },
                  }}
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
