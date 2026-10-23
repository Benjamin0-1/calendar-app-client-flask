import { Box, Container, Typography } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { useThemeToggle } from './ThemeContext';
import Signup from './pages/Signup/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import ErrorIcon from '@mui/icons-material/ErrorOutlineOutlined';
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
import BookDate from './pages/BookDate/BookDate';
import EmailConfirmed from './pages/EmailConfirmed/EmailConfirmed';
import RequestPasswordReset from './pages/RequestPasswordReset/RequestPasswordReset';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import FAQ from './pages/FAQ/FAQ';
import About from './pages/About/About';

function App() {
  const { mode } = useThemeToggle();

  return (
    <Router>
      <Header />

      <Box component="main" sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
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
          <Route
            path="/failedlogin"
            element={
              <Container maxWidth="sm">
                <EmptyState icon={<ErrorIcon />} title="Failed Login" description="We couldn't sign you in. Please try again." />
              </Container>
            }
          />
          <Route path='/email-confirmed' element={<EmailConfirmed />} />
          <Route path="/request-password-reset" element={<RequestPasswordReset />} />
          <Route path='/reset-password' element={< ResetPassword />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<About />} />

          <Route path="*" element={<Login />} />
        </Routes>
      </Box>

      <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', py: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Multi-Property Booking System
          </Typography>
        </Container>
      </Box>

      <ToastContainer position="top-right" autoClose={3000} newestOnTop theme={mode} />
    </Router>
  );
}

export default App;
