import React from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button } from "@mui/material";
import { motion } from "framer-motion";

const offers = [
  {
    title: "Spring Discount - 20% Off!",
    description: "Get 20% off on all tractor rentals this season.",
    image: "/images/offer.webp",
  },
  {
    title: "Harvest Season Deal",
    description: "Book any harvester for 3 days and get 1 day free!",
    image: "/images/offer1.webp",
  },
];

const SpecialOffers = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Box
        sx={{
          py: 6,
          px: 4,
          bgcolor: "#f9f9f9", // Dark theme background
          textAlign: "center",
          color: "black",
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Special Offers
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {offers.map((offer, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    maxWidth: 380,
                    boxShadow: 6,
                    borderRadius: 3,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={offer.image}
                    alt={offer.title}
                    sx={{ filter: "brightness(0.9)" }} // Improved contrast
                  />
                  <CardContent sx={{ bgcolor: "#fff", minHeight: 140 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {offer.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#333" }}>
                      {offer.description}
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      sx={{
                        mt: 2,
                        fontWeight: "bold",
                        textTransform: "none",
                        transition: "0.3s",
                        "&:hover": {
                          backgroundColor: "#1b5e20",
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      Grab This Deal
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </motion.div>
  );
};

export default SpecialOffers;
