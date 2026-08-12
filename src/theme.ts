import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    secondary: {
      main: '#ffffff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          '& .MuiAutocomplete-root .MuiInputBase-input': {
            color: '#ffffff',
          },
          '& .MuiAutocomplete-root .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiAutocomplete-root .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
          '& .MuiAutocomplete-root .MuiSvgIcon-root': {
            color: '#ffffff',
          },
        },
      },
    },
  },
});

export default theme;
