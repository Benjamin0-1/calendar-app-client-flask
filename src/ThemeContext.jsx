import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';

const ThemeToggleContext = createContext();

export const useThemeToggle = () => useContext(ThemeToggleContext);




export const ThemeToggleProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // it blinks for a second when the page is loaded, will fix this later.
  useEffect(() => {
    const currentTheme = window.localStorage.getItem('theme') || 'light';
    setDarkMode(currentTheme === 'dark');
  });

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

  return (
    <ThemeToggleContext.Provider value={toggleTheme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
};
