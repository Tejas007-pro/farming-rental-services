// Home.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Container,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Testimonials from "./Testimonials";
import SpecialOffers from "./SpecialOffers";
import Footer from "./Footer";
import {
  Agriculture,
  AttachMoney,
  Speed,
  CheckCircle,
  Star,
  People,
  Inventory,
  TrendingUp,
  ArrowForward,
  LocalShipping,
  Support,
  Security,
  Phone,
} from "@mui/icons-material";

// ==================== ANIMATION VARIANTS ====================
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7 },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7 },
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// ==================== STATS DATA ====================
const stats = [
  {
    icon: <People sx={{ fontSize: 32, color: "#fff" }} />,
    value: "10,000+",
    label: "Happy Farmers",
    bg: "linear-gradient(135deg, #2E7D32, #4CAF50)",
  },
  {
    icon: <Inventory sx={{ fontSize: 32, color: "#fff" }} />,
    value: "500+",
    label: "Equipment Listed",
    bg: "linear-gradient(135deg, #1565C0, #42A5F5)",
  },
  {
    icon: <Agriculture sx={{ fontSize: 32, color: "#fff" }} />,
    value: "50+",
    label: "Districts Covered",
    bg: "linear-gradient(135deg, #E65100, #FF9800)",
  },
  {
    icon: <Star sx={{ fontSize: 32, color: "#fff" }} />,
    value: "4.8★",
    label: "Average Rating",
    bg: "linear-gradient(135deg, #6A1B9A, #AB47BC)",
  },
];

// ==================== FEATURES DATA ====================
const features = [
  {
    icon: <AttachMoney sx={{ fontSize: 40, color: "#2E7D32" }} />,
    title: "Affordable Prices",
    description:
      "Rent premium farming equipment at budget-friendly rates. No hidden charges, transparent pricing for every farmer.",
    color: "#2E7D32",
    bg: "#E8F5E9",
  },
  {
    icon: <Agriculture sx={{ fontSize: 40, color: "#1565C0" }} />,
    title: "Wide Variety",
    description:
      "Choose from tractors, plows, harvesters, sprayers, and 10+ categories of modern farming equipment.",
    color: "#1565C0",
    bg: "#E3F2FD",
  },
  {
    icon: <Speed sx={{ fontSize: 40, color: "#D84315" }} />,
    title: "Fast Booking",
    description:
      "Easy and quick rental process with instant confirmation. Book in minutes, not hours.",
    color: "#D84315",
    bg: "#FBE9E7",
  },
  {
    icon: <LocalShipping sx={{ fontSize: 40, color: "#6A1B9A" }} />,
    title: "Delivery Available",
    description:
      "Equipment delivered right to your farm. Available in select locations across the region.",
    color: "#6A1B9A",
    bg: "#F3E5F5",
  },
  {
    icon: <Support sx={{ fontSize: 40, color: "#00838F" }} />,
    title: "24/7 Support",
    description:
      "Our team is available round the clock to help you with any queries or equipment issues.",
    color: "#00838F",
    bg: "#E0F7FA",
  },
  {
    icon: <Security sx={{ fontSize: 40, color: "#F57F17" }} />,
    title: "Verified Owners",
    description:
      "All equipment owners are verified and trusted. Rent with complete confidence and safety.",
    color: "#F57F17",
    bg: "#FFFDE7",
  },
];

// ==================== HOW IT WORKS DATA ====================
const steps = [
  {
    step: "01",
    title: "Browse Equipment",
    description: "Search and filter from hundreds of farming equipment listings near you.",
    color: "#2E7D32",
  },
  {
    step: "02",
    title: "Choose & Book",
    description: "Select your equipment, choose rental dates, and confirm your booking instantly.",
    color: "#1565C0",
  },
  {
    step: "03",
    title: "Pay Securely",
    description: "Make secure payments online. Multiple payment options available.",
    color: "#E65100",
  },
  {
    step: "04",
    title: "Start Farming",
    description: "Receive equipment and start your work. Return when done. Simple!",
    color: "#6A1B9A",
  },
];

// ==================== CATEGORIES DATA ====================
const categories = [
  { name: "Tractors", icon: "🚜", count: "120+" },
  { name: "Harvesters", icon: "🌾", count: "45+" },
  { name: "Sprayers", icon: "💨", count: "80+" },
  { name: "Tillers", icon: "⚙️", count: "60+" },
  { name: "Irrigation", icon: "💧", count: "90+" },
  { name: "Seeders", icon: "🌱", count: "35+" },
];

// ==================== MAIN COMPONENT ====================
const Home = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Box sx={{ backgroundColor: "#F5F5F0", minHeight: "100vh" }}>

        {/* ==================== HERO SECTION ==================== */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 40%, #00897B 100%)",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            pt: 8,
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%),
                               radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
              pointerEvents: "none",
            }}
          />

          <Container maxWidth="xl">
            <Grid container spacing={6} alignItems="center">

              {/* Left Content */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -80 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9 }}
                >
                  {/* Badge */}
                  <Chip
                    label="🌾 India's #1 Farm Equipment Rental"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.15)",
                      color: "#fff",
                      fontWeight: 600,
                      mb: 3,
                      fontSize: "0.85rem",
                      px: 1,
                      backdropFilter: "blur(10px)",
                    }}
                  />

                  <Typography
                    variant="h2"
                    fontWeight={800}
                    sx={{
                      color: "#fff",
                      lineHeight: 1.2,
                      mb: 3,
                      fontSize: { xs: "2.2rem", md: "3.2rem" },
                    }}
                  >
                    {t("Welcome to") || "Rent Farm Equipment"}
                    <Box
                      component="span"
                      sx={{
                        display: "block",
                        background: "linear-gradient(90deg, #A5D6A7, #80CBC4)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {t("Farming Rental Service") || "Easily & Affordably"}
                    </Box>
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      color: "rgba(255,255,255,0.85)",
                      mb: 4,
                      lineHeight: 1.7,
                      fontWeight: 400,
                      maxWidth: 500,
                    }}
                  >
                    {t("Rent high-quality farming equipment easily, affordably, and efficiently.") ||
                      "Connect with verified equipment owners near you. Book tractors, harvesters, sprayers and more at the best prices."}
                  </Typography>

                  {/* CTA Buttons */}
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      component={Link}
                      to="/equipment"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      sx={{
                        bgcolor: "#fff",
                        color: "#2E7D32",
                        fontWeight: 700,
                        px: 4,
                        py: 1.5,
                        borderRadius: "12px",
                        textTransform: "none",
                        fontSize: "1rem",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                        "&:hover": {
                          bgcolor: "#F1F8E9",
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {t("Explore Equipment") || "Explore Equipment"}
                    </Button>

                    <Button
                      component={Link}
                      to="/add-equipment"
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: "rgba(255,255,255,0.6)",
                        color: "#fff",
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: "12px",
                        textTransform: "none",
                        fontSize: "1rem",
                        "&:hover": {
                          borderColor: "#fff",
                          bgcolor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      List Equipment
                    </Button>
                  </Box>

                  {/* Trust Badges */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      mt: 5,
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      "✅ Verified Owners",
                      "✅ Secure Payments",
                      "✅ Free Support",
                    ].map((badge) => (
                      <Typography
                        key={badge}
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}
                      >
                        {badge}
                      </Typography>
                    ))}
                  </Box>
                </motion.div>
              </Grid>

              {/* Right Content - Stats Cards */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                >
                  <Grid container spacing={2}>
                    {stats.map((stat, index) => (
                      <Grid item xs={6} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                        >
                          <Paper
                            sx={{
                              p: 3,
                              borderRadius: "20px",
                              background: "rgba(255,255,255,0.1)",
                              backdropFilter: "blur(20px)",
                              border: "1px solid rgba(255,255,255,0.2)",
                              textAlign: "center",
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-4px)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: 56,
                                height: 56,
                                borderRadius: "14px",
                                background: stat.bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 2,
                              }}
                            >
                              {stat.icon}
                            </Box>
                            <Typography
                              variant="h4"
                              fontWeight={800}
                              sx={{ color: "#fff", lineHeight: 1 }}
                            >
                              {stat.value}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5 }}
                            >
                              {stat.label}
                            </Typography>
                          </Paper>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              </Grid>

            </Grid>
          </Container>
        </Box>

        {/* ==================== CATEGORIES SECTION ==================== */}
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Box textAlign="center" mb={6}>
              <Chip
                label="Browse by Category"
                sx={{
                  bgcolor: "#E8F5E9",
                  color: "#2E7D32",
                  fontWeight: 600,
                  mb: 2,
                }}
              />
              <Typography variant="h4" fontWeight={700} color="#1E293B">
                Find Equipment by Category
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                mt={1}
                maxWidth={500}
                mx="auto"
              >
                Browse through our wide collection of farming equipment
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {categories.map((cat, index) => (
                <Grid item xs={6} sm={4} md={2} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Paper
                      component={Link}
                      to={`/equipment?category=${cat.name.toLowerCase()}`}
                      sx={{
                        p: 3,
                        textAlign: "center",
                        borderRadius: "16px",
                        border: "1px solid #E2E8F0",
                        cursor: "pointer",
                        textDecoration: "none",
                        display: "block",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 8px 24px rgba(46,125,50,0.15)",
                          transform: "translateY(-4px)",
                          borderColor: "#2E7D32",
                        },
                      }}
                    >
                      <Typography variant="h3" mb={1}>
                        {cat.icon}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        color="#1E293B"
                      >
                        {cat.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {cat.count} available
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>

        {/* ==================== FEATURES SECTION ==================== */}
        <Box sx={{ bgcolor: "#fff", py: 8 }}>
          <Container maxWidth="xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Box textAlign="center" mb={6}>
                <Chip
                  label="Why Choose Us"
                  sx={{
                    bgcolor: "#E8F5E9",
                    color: "#2E7D32",
                    fontWeight: 600,
                    mb: 2,
                  }}
                />
                <Typography variant="h4" fontWeight={700} color="#1E293B">
                  {t("Why Choose Us") || "Why Farmers Love Us"}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  mt={1}
                  maxWidth={500}
                  mx="auto"
                >
                  We make farming equipment rental simple, safe and affordable
                </Typography>
              </Box>

              <Grid container spacing={4}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          p: 1,
                          height: "100%",
                          borderRadius: "20px",
                          border: "1px solid #E2E8F0",
                          boxShadow: "none",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
                            transform: "translateY(-6px)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: "16px",
                              bgcolor: feature.bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 2,
                            }}
                          >
                            {feature.icon}
                          </Box>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            color="#1E293B"
                            mb={1}
                          >
                            {t(feature.title) || feature.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            lineHeight={1.7}
                          >
                            {t(feature.description) || feature.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>
        </Box>

        {/* ==================== HOW IT WORKS SECTION ==================== */}
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Box textAlign="center" mb={6}>
              <Chip
                label="Simple Process"
                sx={{
                  bgcolor: "#E3F2FD",
                  color: "#1565C0",
                  fontWeight: 600,
                  mb: 2,
                }}
              />
              <Typography variant="h4" fontWeight={700} color="#1E293B">
                How It Works
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                mt={1}
              >
                Get your equipment in 4 simple steps
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {steps.map((step, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <Box textAlign="center" sx={{ position: "relative" }}>
                      {/* Connector Line */}
                      {index < steps.length - 1 && (
                        <Box
                          sx={{
                            display: { xs: "none", md: "block" },
                            position: "absolute",
                            top: 32,
                            left: "60%",
                            width: "80%",
                            height: "2px",
                            background:
                              "linear-gradient(90deg, #E2E8F0, transparent)",
                            zIndex: 0,
                          }}
                        />
                      )}

                      {/* Step Number */}
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${step.color}, ${step.color}99)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 3,
                          position: "relative",
                          zIndex: 1,
                          boxShadow: `0 8px 24px ${step.color}40`,
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={800}
                          sx={{ color: "#fff" }}
                        >
                          {step.step}
                        </Typography>
                      </Box>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="#1E293B"
                        mb={1}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        lineHeight={1.7}
                        maxWidth={220}
                        mx="auto"
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>

        {/* ==================== CTA BANNER ==================== */}
        <Box sx={{ py: 6, px: 2 }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Paper
                sx={{
                  background:
                    "linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #00897B 100%)",
                  borderRadius: "24px",
                  p: { xs: 4, md: 6 },
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Background decoration */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.05)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -60,
                    left: -20,
                    width: 240,
                    height: 240,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.05)",
                  }}
                />

                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{ color: "#fff", mb: 2, position: "relative" }}
                >
                  🚜 Have Equipment to Rent Out?
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255,255,255,0.85)",
                    mb: 4,
                    fontWeight: 400,
                    maxWidth: 500,
                    mx: "auto",
                    position: "relative",
                  }}
                >
                  List your farming equipment and start earning money today!
                  Join thousands of equipment owners.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                    flexWrap: "wrap",
                    position: "relative",
                  }}
                >
                  <Button
                    component={Link}
                    to="/add-equipment"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      bgcolor: "#fff",
                      color: "#2E7D32",
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontSize: "1rem",
                      "&:hover": {
                        bgcolor: "#F1F8E9",
                      },
                    }}
                  >
                    List Your Equipment
                  </Button>
                  <Button
                    component={Link}
                    to="/equipment"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: "rgba(255,255,255,0.6)",
                      color: "#fff",
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: "12px",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#fff",
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Browse Equipment
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Container>
        </Box>

        {/* ==================== SPECIAL OFFERS ==================== */}
        <Box sx={{ backgroundColor: "#F5F5F0", py: 5 }}>
          <SpecialOffers />
        </Box>

        {/* ==================== TESTIMONIALS ==================== */}
        <Testimonials />

        {/* ==================== CONTACT STRIP ==================== */}
        <Box
          sx={{
            bgcolor: "#1E293B",
            py: 3,
            px: 2,
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Phone sx={{ color: "#4CAF50", fontSize: 20 }} />
              <Typography variant="body1" sx={{ color: "#fff", fontWeight: 500 }}>
                Need Help? Call us:
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#4CAF50", fontWeight: 700 }}
              >
                +91 98765 43210
              </Typography>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ bgcolor: "rgba(255,255,255,0.2)", mx: 1 }}
              />
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                Mon - Sat, 9 AM - 6 PM
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* ==================== FOOTER ==================== */}
      <Footer />
    </>
  );
};

export default Home;