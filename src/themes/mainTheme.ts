import { createTheme } from '@mui/material/styles';

const mainTheme = createTheme({
  palette: {
    primary: {
      main: '#10213f',
      light: '#273f6c',
      dark: '#030813',
    },
    secondary: {
      main: '#3a103f',
      light: '#64276c',
      dark: '#110313',
    },
    background: {
      default: '#181f2c',
      paper: '#3a4459',
    },
    text: {
      primary: '#f2f2f2',
      secondary: '#c7cbd2',
    },
    error: { main: '#3a1515' },
    warning: { main: '#3a2315' },
    info: { main: '#152b3a' },
    success: { main: '#153a1d' },
    divider: '#3a4459',
  },
  typography: {
    fontFamily: '"Sora", sans-serif',
    h1: { fontFamily: '"Playfair Display", serif' },
    h2: { fontFamily: '"Playfair Display", serif' },
    h3: { fontFamily: '"Playfair Display", serif' },
    h4: { fontFamily: '"Playfair Display", serif' },
    h5: { fontFamily: '"Playfair Display", serif' },
    h6: { fontFamily: '"Playfair Display", serif' },

    subtitle1: { fontFamily: '"Playfair Display", serif' },
    subtitle2: { fontFamily: '"Playfair Display", serif' },

    body1: { fontFamily: '"Sora", sans-serif' },
    body2: { fontFamily: '"Sora", sans-serif' },

    button: { fontFamily: '"Sora", sans-serif' },
    caption: { fontFamily: '"Sora", sans-serif' },
    overline: { fontFamily: '"Sora", sans-serif'},
  },
});


export default mainTheme;