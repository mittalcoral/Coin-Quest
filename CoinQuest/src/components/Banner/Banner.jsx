import { Container, Typography, Box } from "@mui/material";
import Carousel from "./Carousel";

function Banner() {
  return (
    <Box
      sx={{
        backgroundImage: "url(/banner2.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        padding: "40px 0",
      }}
    >
      <Container
        sx={{
          height: 400,
          display: "flex",
          flexDirection: "column",
          paddingTop : 10,
          justifyContent: "space-around",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "40%",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              marginBottom: 2,
              fontFamily: "Montserrat",
              color: "black",
              
            }}
          >
            Coin Quest
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: "black",
              textTransform: "capitalize",
              fontFamily: "Montserrat",
            }}
          >
            Get all the info regarding your favorite cryptocurrency
          </Typography>
        </Box>

        <Box
          sx={{
            height: "50%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Carousel />
        </Box>
      </Container>
    </Box>
  );
}

export default Banner;


