import React, { useState, useEffect } from 'react';
import './App.css';
import { useThemeToggle } from './ThemeContext';
import { Button, Typography, Container } from '@mui/material';
import Signup from './pages/Signup/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SideBar } from './components/SideBar';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Profile from './pages/Profile/Profile';
import Login from './pages/Login/Login';
import Home from './pages/home/Home';
import AllProperties from './pages/Profile/AllProperties';
import UpdateInfo from './pages/Profile/UpdateInfo';
import UpdatePassword from './pages/Profile/UpdatePassword';
import EmailNotConfirmed from './pages/EmailNotConfirmed/EmailNotConfirmed';
import LoginHistory from './pages/UserSettings/LoginHistory';
import Settings from './pages/UserSettings/Settings';
import DeletedDate from './pages/UserSettings/DeletedDates';
import Detail from './pages/Detail/Detail';
import CreateProperty from './pages/CreateProperty/CreateProperty';
import LogOutButton from './components/LogOutButton';
import BookDate from './pages/BookDate/BookDate';
import EmailConfirmed from './pages/EmailConfirmed/EmailConfirmed';
import RequestPasswordReset from './pages/RequestPasswordReset/RequestPasswordReset';
import ResetPassword from './pages/ResetPassword/ResetPassword';

function App() {
  const [theme, setTheme] = useState('light'); // 'light' or 'dark', light by default.
  const toggleTheme = useThemeToggle();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // temporary solution to dynamically render the login button.
  // ideal solution is using the context API.
  useEffect(() => {
    const checkLoginStatus = () => {
      const refreshToken = localStorage.getItem('refreshToken');
      const refreshTokenExpiration = localStorage.getItem('refreshTokenExpiration');
      
      if (refreshToken && refreshTokenExpiration && Date.now() < parseInt(refreshTokenExpiration)) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    
    checkLoginStatus(); 
  }, []);


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
          {isLoggedIn && <LogOutButton />} 
        </div>
        <div style={{ position: 'absolute', top: 0, left: 10 }}>
          <SideBar />
        </div>

        <Routes>
          <Route path="/home" element={< Home/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/update-info" element={<UpdateInfo />} />
          <Route path="/properties" element={<AllProperties />} />
          <Route path="/emailnotconfirmed" element={<EmailNotConfirmed />} />
          <Route path="/profile/change-password" element={<UpdatePassword />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/login-history" element={<LoginHistory />} />
          <Route path="/settings/view-deleted-bookings" element={<DeletedDate />} />
          <Route path="/property-details/:id" element={<Detail />} />
          <Route path="/create-property" element={<CreateProperty />} />
          <Route path="/failedlogin" element={<h1>Failed Login</h1>} />
          <Route path='/email-confirmed' element={<EmailConfirmed />} />
          <Route path="/request-password-reset" element={<RequestPasswordReset />} />
          <Route path='/reset-password' element={< ResetPassword />} />
    
          <Route path="*" element={<Login />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
