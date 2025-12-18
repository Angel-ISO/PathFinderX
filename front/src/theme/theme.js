import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', 

    primary: {
      main: '#23ED66',          
      light: '#5EFF90',         
      dark: '#00BA38',          
      contrastText: '#01132B',  
    },

    secondary: {
      main: '#A7AEB7',          
      light: '#D3D8DD',        
      dark: '#7B828B',         
      contrastText: '#03132B',  
    },

    background: {
      default: '#020617',       
      paper: '#01132B',         
    },

    text: {
      primary: '#A7AEB7',       
      secondary: '#636D7A',     
    },

    error: {
      main: '#d32f2f',         
    },

    warning: {
      main: '#f57c00',
    },

    info: {
      main: '#1976d2',
    },

    success: {
      main: '#23ED66',          
    },
  },

  typography: {
    fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif`,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    button: {
      textTransform: 'none',
    },
  },
});

export default theme;
