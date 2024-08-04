import React, { useState, useEffect } from 'react';
import './App.css';
import { useThemeToggle } from './ThemeContext';
import { Button, Typography, Container } from '@mui/material';
import Signup from './pages/Signup/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SideBar } from './components/SideBar';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';

function App() {
  const [theme, setTheme] = useState('light'); // 'light' or 'dark', light by default.
  const toggleTheme = useThemeToggle();

  useEffect(() => {
    // Detect the current theme and set it
    const currentTheme = window.localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    window.localStorage.setItem('theme', newTheme);
    toggleTheme();
  };

  return (
    <Router>
      <Container>
        <div style={{ position: 'absolute', top: 0, right: 10 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleToggleTheme}
            startIcon={theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Button>
        </div>
        <div style={{ position: 'absolute', top: 0, left: 10 }}>
          <SideBar />
        </div>

        <Routes>
          <Route path="/home" element={<h1>home</h1>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<h1>Not found</h1>} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
