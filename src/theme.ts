import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#00A58E',
      dark: '#009580', // hover 時的顏色
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          height: '42px',
          borderRadius: '4px',
          padding: '8px 22px',
          whiteSpace: 'nowrap',
          minWidth: '120px',
          transition: 'all 0.3s',
          '&.Mui-disabled': {
            // disabled 狀態的樣式
            backgroundColor: '#CCCCCC',
            color: '#FFFFFF', // 確保文字顏色為白色
          },
        },
      },
    },
  },
});

export default theme;
