import React from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar, Rating } from "@mui/material";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Rahul Sharma",
    review: "Excellent service! The equipment was in top-notch condition and made my work much easier.",
    rating: 5,
    image: "/images/user1.jpg",
  },
  {
    name: "Priya Patel",
    review: "Affordable rental prices and easy booking process. Highly recommend this service!",
    rating: 4.5,
    image: "/images/user2.jpg",
  },
  {
    name: "Amit Verma",
    review: "Fast and reliable service. The equipment worked perfectly for my farm operations.",
    rating: 4,
    image: "/images/user3.jpg",
  },
];

const Testimonials = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Box sx={{ py: 6, px: 4, bgcolor: "#f5f5f5", textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Customer Reviews
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {reviews.map((review, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    boxShadow: 4,
                    borderRadius: 3,
                    p: 3,
                    textAlign: "center",
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "scale(1.03)",
                    },
                  }}
                >
                  <CardContent>
                    <Avatar
                      src={review.image}
                      alt={review.name}
                      sx={{ width: 70, height: 70, mx: "auto", mb: 2 }}
                    />
                    <Typography variant="h6" fontWeight="bold">
                      {review.name}
                    </Typography>
                    <Rating value={review.rating} precision={0.5} readOnly sx={{ my: 1 }} />
                    <Typography variant="body2" sx={{ color: "#444" }}>
                      "{review.review}"
                    </Typography>
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

export default Testimonials;
