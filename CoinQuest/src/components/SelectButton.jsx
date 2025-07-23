import { Box } from "@mui/material";

const SelectButton = ({ children, selected, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        border: "1px solid limegreen",
        borderRadius: 1,
        px: 2.5,
        py: 1.2,
        fontFamily: "Montserrat",
        cursor: "pointer",
        backgroundColor: selected ? "limegreen" : "transparent",
        color: selected ? "black" : "limegreen",
        fontWeight: selected ? 700 : 500,
        width: "22%",
        textAlign: "center",
        transition: "0.3s",
        "&:hover": {
          backgroundColor: "limegreen",
          color: "black",
        },
      }}
    >
      {children}
    </Box>
  );
};

export default SelectButton;
