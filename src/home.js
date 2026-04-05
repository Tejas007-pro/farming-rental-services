import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { translateText } from "./translate"; // Import translation function
import Testimonials from "./Testimonials";
import SpecialOffers from "./SpecialOffers";
import Footer from "./Footer";
import { Agriculture, AttachMoney, Speed } from "@mui/icons-material";

const Home = () => {
  const { t, i18n } = useTranslation();
  const [translatedTexts, setTranslatedTexts] = useState({});

  // List of texts to translate
  const textsToTranslate = {
    welcome: "Welcome to Farming Rental Service",
    description: "Rent high-quality farming equipment easily, affordably, and efficiently.",
    exploreEquipment: "Explore Equipment",
    whyChooseUs: "Why Choose Us",
    affordablePrices: "Affordable Prices",
    affordableDescription: "Rent equipment at budget-friendly rates.",
    wideVariety: "Wide Variety",
    wideVarietyDescription: "Choose from tractors, plows, harvesters, and more.",
    fastBooking: "Fast Booking",
    fastBookingDescription: "Easy and quick rental process with instant confirmation."
  };

  // Function to fetch translations when language changes
  useEffect(() => {
    const translateAll = async () => {
      let newTranslations = {};
      for (const key in textsToTranslate) {
        newTranslations[key] = await translateText(textsToTranslate[key], i18n.language);
      }
      setTranslatedTexts(newTranslations);
    };

    translateAll();
  }, [i18n.language]);

  const features = [
    {
      title: translatedTexts.affordablePrices || t("Affordable Prices"),
      description: translatedTexts.affordableDescription || t("Rent equipment at budget-friendly rates."),
      icon: <AttachMoney fontSize="large" sx={{ color: "#2E7D32" }} />,
    },
    {
      title: translatedTexts.wideVariety || t("Wide Variety"),
      description: translatedTexts.wideVarietyDescription || t("Choose from tractors, plows, harvesters, and more."),
      icon: <Agriculture fontSize="large" sx={{ color: "#1565C0" }} />,
    },
    {
      title: translatedTexts.fastBooking || t("Fast Booking"),
      description: translatedTexts.fastBookingDescription || t("Easy and quick rental process with instant confirmation."),
      icon: <Speed fontSize="large" sx={{ color: "#D84315" }} />,
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="90vh"
          p={4}
          mt={8}
          sx={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "black",
            textAlign: "center",
            borderRadius: 3,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
            maxWidth: "90%",
            margin: "auto",
            backgroundColor: "#ffffff",
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {translatedTexts.welcome || t("Welcome to Farming Rental Service")}
          </Typography>
          <Typography variant="h6" gutterBottom maxWidth="600px">
            {translatedTexts.description || t("Rent high-quality farming equipment easily, affordably, and efficiently.")}
          </Typography>
          <Button
            component={Link}
            to="/equipment"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 3 }}
          >
            {translatedTexts.exploreEquipment || t("Explore Equipment")}
          </Button>
        </Box>
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Box textAlign="center" mt={10} mb={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {translatedTexts.whyChooseUs || t("Why Choose Us")}
          </Typography>
        </Box>

        <Grid container spacing={5} justifyContent="center" sx={{ px: 5 }}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    p: 5,
                    textAlign: "center",
                    bgcolor: "#ffffff",
                    borderRadius: 4,
                    boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
                    minHeight: "180px",
                  }}
                >
                  {feature.icon}
                  <Typography variant="h6" fontWeight="bold" mt={2}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "black", mt: 1 }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Special Offers Section */}
      <Box sx={{ backgroundColor: "#f2f2f2", py: 5 }}>
        <SpecialOffers />
      </Box>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Footer Section */}
      <Footer />
    </>
  );
};

export default Home;
