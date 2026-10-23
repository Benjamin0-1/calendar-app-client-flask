import { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme';

const ThemeToggleContext = createContext();

// returns { mode, toggleTheme }
export const useThemeToggle = () => useContext(ThemeToggleContext);

// Reading the saved mode synchronously avoids rendering in light mode first and then flashing to dark.
const getInitialMode = () => (window.localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');

export const ThemeToggleProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode);

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      window.localStorage.setItem('theme', newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeToggleContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
};
