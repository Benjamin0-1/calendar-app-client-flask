import React, { useState, useEffect } from "react";
import { Typography, Container, Grid, Box, CircularProgress, TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Use navigate for navigation
import GoogleIcon from '@mui/icons-material/Google'; // Add Google icon
import AppleIcon from '@mui/icons-material/Apple'; // Add Apple icon
import { GitHub } from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL; // server url: http://127.0.0.1:5000
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI; // http://localhost:5173/auth/google/callback

function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({ email: "", password: "" });
    const navigate = useNavigate(); 

    // this will run once the URL changes and capture the authorization code.
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get('code');
        const state = queryParams.get('state');
    
        if (code && state) {
            const storedState = localStorage.getItem('oauth_state');
    
            if (state === storedState) {
                fetch(`${API_URL}/auth/google/callback?code=${code}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.access_token || data.refresh_token) {
                        localStorage.setItem('accessToken', data.access_token);
                        localStorage.setItem('refreshToken', data.refresh_token);
                        const currentTime = new Date().getTime();
                        const accessTokenExpiresInMs = parseInt(data.access_token_expires_in) * 60 * 1000;
                        const refreshTokenExpiresInMs = parseInt(data.refresh_token_expires_in) * 24 * 60 * 60 * 1000;
                        localStorage.setItem('accessTokenExpiration', currentTime + accessTokenExpiresInMs);
                        localStorage.setItem('refreshTokenExpiration', currentTime + refreshTokenExpiresInMs);
    
                        navigate('/profile');
                    } else {
                        console.error('Failed to authenticate with Google.');
                        navigate('/login');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    navigate('/login');
                });
            } else {
                console.error('State parameter mismatch or missing code.');
                navigate('/failedlogin');
            }
        }
    }, [navigate]);
    
    
    
    

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
                // this will allow FetchWithAuth to work properly along with the HOC withAuth.
    
                localStorage.setItem("accessToken", data.access_token);
                localStorage.setItem("refreshToken", data.refresh_token);
                localStorage.setItem("accessTokenExpiration", currentTime + accessTokenExpiresInMs);
                localStorage.setItem("refreshTokenExpiration", currentTime + refreshTokenExpiresInMs);
    
                toast.success("Logged in successfully");
                navigate("/profile"); // Use navigate to redirect
                return;
            }

            if (data.missingData) {
                setError("Missing data");
                return;
            }

            if (data.userNotFound) {
                setError("User not found");
                return;
            }

            if (data.lockedOut) {
                setError(`Too many failed attempts, try again in 5 minutes: ${data.remainingLockoutTime}`);
                return;
            }

            if (data.invalidCredentials) {
                setError("Invalid credentials");
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
        try {
            const response = await fetch(`${API_URL}/auth/google/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ redirect_uri: GOOGLE_REDIRECT_URI }),
            });

            const data = await response.json();
            

            if (data.authorization_url && data.state) {
                // Store state in localStorage for comparison during callback
                localStorage.setItem('oauth_state', data.state);

                // Redirect to Google for authentication
                window.location.href = data.authorization_url;
            } else {
                console.error('Failed to get authorization URL');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };
      
    
    
    

    return (
        <Container>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <form onSubmit={handleLogin}>
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                value={userData.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                required
                            />
                        </Box>
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Password"
                                value={userData.password}
                                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                required
                            />
                        </Box>
                        <Box mb={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} /> : "Login"}
                            </Button>
                        </Box>
                    </form>
                </Grid>
                <Grid item xs={12}>
                    {error && <Typography variant="h6" color="error">{error}</Typography>}
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        fullWidth
                        style={{ marginBottom: "10px" }}
                        onClick={handleGoogleLogin}
                    >
                        Login with Google
                    </Button>

                    <Button
                    variant="outlined"
                    startIcon={<GitHub />}
                    fullWidth
                    onClick={() => toast.info("GitHub login not implemented yet.")}>
                    Login with GitHub
                    </Button>

                   
                </Grid>
            </Grid>
            <ToastContainer
                autoClose={1500}
            />
        </Container>
    );
    
}

export default Login;
