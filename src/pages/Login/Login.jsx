import React, { useState } from "react";
import { Typography, Container, Grid, Box, CircularProgress, TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Use navigate for navigation
import GoogleIcon from '@mui/icons-material/Google'; // Add Google icon
import AppleIcon from '@mui/icons-material/Apple'; // Add Apple icon

const API_URL = import.meta.env.VITE_API_URL;


function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({ email: "", password: "" });
    const navigate = useNavigate(); 

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
                        onClick={() => toast.info("Google login not implemented yet.")}
                    >
                        Login with Google
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<AppleIcon />}
                        fullWidth
                        onClick={() => toast.info("Apple login not implemented yet.")}
                    >
                        Login with Apple
                    </Button>
                </Grid>
            </Grid>
            <ToastContainer />
        </Container>
    );
}

export default Login;
