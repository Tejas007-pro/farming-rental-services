import React from "react";
import { Paper, ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLang = i18n.language?.startsWith("mr") ? "mr" : "en";

  const handleChange = (_, newLang) => {
    if (newLang) {
      i18n.changeLanguage(newLang);
      localStorage.setItem("i18nextLng", newLang);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        p: "4px",
        borderRadius: "999px",
        bgcolor: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.2)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 1,
          color: "#fff",
        }}
      >
        <TranslateIcon sx={{ fontSize: 18 }} />
      </Box>

      <ToggleButtonGroup
        value={currentLang}
        exclusive
        onChange={handleChange}
        sx={{
          "& .MuiToggleButton-root": {
            border: "none",
            px: 2,
            py: 0.6,
            borderRadius: "999px !important",
            textTransform: "none",
            fontWeight: 600,
            color: "rgba(255,255,255,0.8)",
          },
          "& .Mui-selected": {
            bgcolor: "#fff !important",
            color: "#2E7D32 !important",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          },
        }}
      >
        <ToggleButton value="en">English</ToggleButton>
        <ToggleButton value="mr">मराठी</ToggleButton>
      </ToggleButtonGroup>
    </Paper>
  );
};

export default LanguageSwitcher;