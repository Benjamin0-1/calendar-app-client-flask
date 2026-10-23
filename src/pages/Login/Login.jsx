import { useState, useEffect } from "react";
import { Typography, Box, CircularProgress, TextField, Button, Alert, Divider, Stack, Link as MuiLink } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router';
import { auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '../../firebase.config';
import GoogleIcon from '@mui/icons-material/Google';
import LockIcon from '@mui/icons-material/LockOutlined';
import AuthCard from '../../components/AuthCard';
import PasswordField from '../../components/PasswordField';

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const refreshTokenExpiration = localStorage.getItem('refreshTokenExpiration'); 

        if (refreshTokenExpiration && !isTokenExpired(refreshTokenExpiration)) {
            navigate("/profile");
        }
    }, [navigate]);

    // put this function inside of /utils
    const isTokenExpired = (expiration) => {
        const currentTime = Date.now();
        const expirationTime = new Date(expiration).getTime();
        return currentTime > expirationTime;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData), 
            });

            const data = await response.json();

            if (response.ok) {
                const currentTime = new Date().getTime();
                const accessTokenExpiresInMs = parseInt(data.access_token_expires_in) * 60 * 1000; // accessToken is in minutes.
                const refreshTokenExpiresInMs = parseInt(data.refresh_token_expires_in) * 24 * 60 * 60 * 1000; // while refreshToken is in days.
    
    
                localStorage.setItem("accessToken", data.access_token);
                localStorage.setItem("refreshToken", data.refresh_token);
                localStorage.setItem("accessTokenExpiration", currentTime + accessTokenExpiresInMs);
                localStorage.setItem("refreshTokenExpiration", currentTime + refreshTokenExpiresInMs);
    
                toast.success("Logged in successfully");
                navigate("/profile"); 
                return;
            }

            if (data.emailNotConfirmed) { 
                navigate("/emailnotconfirmed");
                return;
            }

            if (data.error) {
                setError(data.error);
                toast.error(data.error);
                return;
            }

            if (data.missingData) {
                setError("Missing data");
                toast.error("Missing data");
                return;
            }

            if (data.userNotFound) {
                setError("User not found");
                toast.error("User not found");
                return;
            }

            if (data.lockedOut) {
                setError(`Too many failed attempts, try again in 5 minutes: ${data.remainingLockoutTime}`);
                toast.error(`Too many failed attempts, try again in 5 minutes: ${data.remainingLockoutTime}`);
                return;
            }

            if (data.invalidCredentials) {
                setError("Invalid credentials");
                toast.error("Invalid credentials");
                return;
            }

        } catch (error) {
            console.error(`Error logging in: ${error}`);
            setError("Error logging in");  
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
    
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
    
            // Get the Google ID token and user info
            const token = await user.getIdToken();
            const email = user.email;
            const uid = user.uid;   // this gets passed to provider_uuid in the backend. user_id is handled differently.
    
            // Send the Google token, email, and user ID to your server
            const response = await fetch(`${API_URL}/auth/google-login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ googleToken: token, email: email, userId: uid }), 
            });
    
            const data = await response.json();
    
            if (response.ok) {
                const currentTime = new Date().getTime();
                const accessTokenExpiresInMs = parseInt(data.access_token_expires_in) * 60 * 1000;
                const refreshTokenExpiresInMs = parseInt(data.refresh_token_expires_in) * 24 * 60 * 60 * 1000;
    
                localStorage.setItem("accessToken", data.access_token);
                localStorage.setItem("refreshToken", data.refresh_token);
                localStorage.setItem("accessTokenExpiration", currentTime + accessTokenExpiresInMs);
                localStorage.setItem("refreshTokenExpiration", currentTime + refreshTokenExpiresInMs);
    
                toast.success("Logged in with Google successfully");
                navigate("/profile");
            } else {
                setError(data.error || "Error logging in with Google");
            }
        } catch (error) {
            console.error("Error logging in with Google:", error.message);
            setError("Error logging in with Google: " + error.message);
        }
    };
    
    
    
    return (
        <AuthCard
            icon={<LockIcon />}
            title="Welcome back"
            subtitle="Log in to manage your properties and bookings."
            footer={
                <Typography variant="body2" color="text.secondary">
                    Don&apos;t have an account?{' '}
                    <MuiLink component={Link} to="/signup" underline="hover" sx={{ fontWeight: 600 }}>
                        Create one
                    </MuiLink>
                </Typography>
            }
        >
            {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

            <Button
                variant="outlined"
                color="inherit"
                size="large"
                startIcon={<GoogleIcon />}
                fullWidth
                onClick={handleGoogleLogin}
                sx={{ borderColor: 'divider' }}
            >
                Continue with Google
            </Button>

            <Divider sx={{ my: 3, typography: 'caption', color: 'text.secondary' }}>or log in with email</Divider>

            <Box component="form" onSubmit={handleLogin}>
                <Stack spacing={2.5}>
                    <TextField
                        fullWidth
                        type="email"
                        label="Email"
                        autoComplete="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        required
                    />
                    <Box>
                        <PasswordField
                            fullWidth
                            label="Password"
                            autoComplete="current-password"
                            value={userData.password}
                            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                            required
                        />
                        <Box sx={{ textAlign: 'right', mt: 1 }}>
                            <MuiLink component={Link} to="/request-password-reset" variant="body2" underline="hover" sx={{ fontWeight: 500 }}>
                                Forgot password?
                            </MuiLink>
                        </Box>
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Log in"}
                    </Button>
                </Stack>
            </Box>
        </AuthCard>
    );
    
};

export default Login;
