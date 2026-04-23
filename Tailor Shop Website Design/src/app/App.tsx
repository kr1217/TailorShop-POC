import { RouterProvider } from 'react-router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { router } from './routes';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50',
    },
    secondary: {
      main: '#D4AF37',
    },
    error: {
      main: '#C0392B',
    },
    background: {
      default: '#F9F9F9',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}