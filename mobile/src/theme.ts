import { MD3LightTheme, configureFonts } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2C3E50', // Midnight Blue
    secondary: '#C29B0B', // Tailor's Gold
    background: '#F5F5DC', // Cream
    surface: '#FFFFFF',
    text: '#2C3E50',
    onSurfaceVariant: '#607D8B',
    error: '#B00020',
  },
  roundness: 8,
};

export default theme;
