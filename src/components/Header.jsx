import { useState } from 'react';
import { AppBar, Box, Button, Container, IconButton, Stack, Toolbar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import ProfileIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import HelpIcon from '@mui/icons-material/HelpOutlineOutlined';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import LoginIcon from '@mui/icons-material/Login';
import SignupIcon from '@mui/icons-material/PersonAddAlt';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Link, useLocation } from 'react-router';
import { useThemeToggle } from '../ThemeContext';
import { SideBar } from './SideBar';
import LogOutButton from './LogOutButton';
import Brand from './Brand';

const loggedInItems = [
    { label: 'Home', to: '/home', icon: <HomeIcon /> },
    { label: 'Profile', to: '/profile', icon: <ProfileIcon /> },
    { label: 'Settings', to: '/settings', icon: <SettingsIcon /> },
    { label: 'FAQ', to: '/faq', icon: <HelpIcon /> },
];

const loggedOutItems = [
    { label: 'About', to: '/about', icon: <InfoIcon /> },
    { label: 'FAQ', to: '/faq', icon: <HelpIcon /> },
    { label: 'Login', to: '/login', icon: <LoginIcon /> },
    { label: 'Sign up', to: '/signup', icon: <SignupIcon /> },
];

// Pages that live under "Home" in the navigation even though their URL doesn't start with /home.
const homeSubPaths = ['/property-details', '/create-property'];

const hasActiveSession = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const refreshTokenExpiration = localStorage.getItem('refreshTokenExpiration');
    return Boolean(refreshToken && refreshTokenExpiration && Date.now() < parseInt(refreshTokenExpiration));
};

function Header() {
    const { mode, toggleTheme } = useThemeToggle();
    const { pathname } = useLocation(); // re-renders on navigation, so the login state below stays current.
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isLoggedIn = hasActiveSession();
    const items = isLoggedIn ? loggedInItems : loggedOutItems;

    const isActive = (to) =>
        pathname === to ||
        pathname.startsWith(`${to}/`) ||
        (to === '/home' && homeSubPaths.some((path) => pathname.startsWith(path)));

    return (
        <AppBar position="sticky">
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ gap: 1, minHeight: { xs: 60, sm: 68 } }}>
                    <IconButton
                        edge="start"
                        aria-label="Open menu"
                        onClick={() => setIsDrawerOpen(true)}
                        sx={{ display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Brand to={isLoggedIn ? '/home' : '/'} />

                    <Stack direction="row" spacing={0.5} sx={{ ml: 4, display: { xs: 'none', md: 'flex' } }}>
                        {(isLoggedIn ? loggedInItems : loggedOutItems.slice(0, 2)).map(({ label, to }) => (
                            <Button
                                key={to}
                                component={Link} nativeButton={false}
                                to={to}
                                color="inherit"
                                sx={{
                                    color: isActive(to) ? 'primary.main' : 'text.secondary',
                                    bgcolor: isActive(to) ? 'action.selected' : 'transparent',
                                    '&:hover': { color: 'text.primary' },
                                }}
                            >
                                {label}
                            </Button>
                        ))}
                    </Stack>

                    <Box sx={{ flexGrow: 1 }} />

                    <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
                        <IconButton onClick={toggleTheme} aria-label="Toggle color theme" color="inherit">
                            {mode === 'light' ? <Brightness4Icon fontSize="small" /> : <Brightness7Icon fontSize="small" />}
                        </IconButton>
                    </Tooltip>

                    {isLoggedIn ? (
                        <LogOutButton />
                    ) : (
                        <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', sm: 'flex' }, ml: 1 }}>
                            <Button component={Link} nativeButton={false} to="/login" color="inherit">
                                Log in
                            </Button>
                            <Button component={Link} nativeButton={false} to="/signup" variant="contained">
                                Sign up
                            </Button>
                        </Stack>
                    )}
                </Toolbar>
            </Container>

            <SideBar open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} items={items} isActive={isActive} />
        </AppBar>
    );
}

export default Header;
