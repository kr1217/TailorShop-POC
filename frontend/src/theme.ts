'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50', // Midnight Blue (Primary Brand Color)
      dark: '#1a252f',
    },
    secondary: {
      main: '#C29B0B', // Tailor's Gold (Accent Color)
    },
    background: {
      default: '#F5F5DC', // Cream / Off-White (Latha Fabric feel)
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50', // Slate Navy for high contrast
      secondary: '#607D8B',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, "Helvetica", Arial, sans-serif',
    h2: { fontWeight: 800, fontSize: '2rem', color: '#2C3E50' },
    h4: { fontWeight: 700, color: '#2C3E50' },
    h6: { fontWeight: 600, color: '#2C3E50' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'uppercase',
          fontWeight: 700,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&.MuiButton-containedSecondary': {
            color: '#2C3E50', // Dark text on gold button
            backgroundColor: '#C29B0B',
            '&:hover': {
              backgroundColor: '#C29B0B',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          color: '#607D8B',
          '&.Mui-selected': {
            color: '#2C3E50',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            // Apply monospace font to measurement inputs if they have a specific class or we can target numbers
            '&[type="number"], &[placeholder*="."]': {
              fontFamily: '"Roboto Mono", monospace',
            },
          },
        },
      },
    },
  },
});

export default theme;
