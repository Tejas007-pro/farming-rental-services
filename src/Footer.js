import React from "react";
import { Box, Grid, Typography, Link, IconButton, Divider } from "@mui/material";
import { Facebook, Twitter, Instagram, YouTube } from "@mui/icons-material";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Box
        component="footer"
        sx={{
          backgroundColor: "#172337",
          color: "#ffffff",
          py: 5,
          px: 4,
          textAlign: "center",
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          {/* Customer Support */}
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Customer Support
            </Typography>
            {["Help Center", "Returns & Refunds", "FAQ", "Contact Us"].map((text, index) => (
              <Link
                key={index}
                href="/"
                color="inherit"
                underline="hover"
                display="block"
                sx={{ transition: "0.3s", "&:hover": { color: "#f0a500" } }}
              >
                {text}
              </Link>
            ))}
          </Grid>

          {/* Company Info */}
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Company
            </Typography>
            {["About Us", "Careers", "Press", "Terms & Conditions"].map((text, index) => (
              <Link
                key={index}
                href="/"
                color="inherit"
                underline="hover"
                display="block"
                sx={{ transition: "0.3s", "&:hover": { color: "#f0a500" } }}
              >
                {text}
              </Link>
            ))}
          </Grid>

          {/* Social Media Links */}
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Follow Us
            </Typography>
            {[
              { icon: <Facebook />, link: "https://facebook.com" },
              { icon: <Twitter />, link: "https://twitter.com" },
              { icon: <Instagram />, link: "https://instagram.com" },
              { icon: <YouTube />, link: "https://youtube.com" },
            ].map((item, index) => (
              <IconButton
                key={index}
                href={item.link}
                target="_blank"
                color="inherit"
                sx={{
                  mx: 0.5,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.2)", color: "#f0a500" },
                }}
              >
                {item.icon}
              </IconButton>
            ))}
          </Grid>

          {/* Mailing Address */}
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Mail Us
            </Typography>
            <Typography variant="body2" sx={{ maxWidth: 200, mx: "auto" }}>
              Farming Rental Service Pvt. Ltd.
              <br />
              123, Green Street, Agro City, IN 400001
              <br />
              Email:{" "}
              <Link href="mailto:fegadetejas007@gmail.com" color="inherit" sx={{ fontWeight: "bold" }}>
                fegadetejas007@gmail.com
              </Link>
            </Typography>
          </Grid>
        </Grid>

        {/* Divider & Copyright */}
        <Divider sx={{ my: 3, bgcolor: "white" }} />
        <Typography variant="body2" align="center">
          © 2025 Farming Rental Service. All rights reserved.
        </Typography>
      </Box>
    </motion.div>
  );
};

export default Footer;
