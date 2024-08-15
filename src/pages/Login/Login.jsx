import React, { useState } from "react";
import { Typography, Container, Grid, Box, CircularProgress, TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '../../firebase.config';
import GoogleIcon from '@mui/icons-material/Google';

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

            if (data.emailNotConfirmed) { 
                window.location.href = 'emailnotconfirmed'
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
    
    
    
    // make sure this is responsive again.
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
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="text"
                        fullWidth
                        onClick={() => {navigate('/request-password-reset')}}
                        style={{ marginBottom: "10px" }}
                    >
                        Forgot Password?
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="text"
                        fullWidth
                        onClick={() => {navigate('/signup')}}
                        style={{ marginBottom: "10px" }}
                    >
                        Don't have an account? Create one
                    </Button>
                </Grid>
            </Grid>
            <ToastContainer autoClose={1500} />
        </Container>
    );
    
};

export default Login;
