// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007BFF', // Primary color
    },
    secondary: {
      main: '#FFC107', // Secondary color
    },
    background: {
      default: '#f4f4f4', // Light background for the app
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  // You can also adjust breakpoints, spacing, etc.
});

export default theme;
