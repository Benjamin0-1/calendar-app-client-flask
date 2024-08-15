import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Container, Grid, Box, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

function RequestPasswordReset() { 
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [tooManyRequests, setTooManyRequests] = useState(false);
    const [countdown, setCountdown] = useState(0);


    // this is not a secure way to handle the cooldown since the user could just remove it from their local storage, but it's a for demonstration only (for now).
    useEffect(() => {
        const storedTooManyRequests = localStorage.getItem("tooManyRequests");
        if (storedTooManyRequests) {

            const { cooldownEnd } = JSON.parse(storedTooManyRequests); // what this does is it extracts the cooldownEnd from the storedTooManyRequests.

            if (cooldownEnd > Date.now()) {

                setTooManyRequests(true); // if it's true, then we need to know when to stop.
                setCountdown(Math.ceil((cooldownEnd - Date.now()) / 1000));
                // after setting tooManyRequests to true if the cooldown if smaller than the current date, we need to start the countdown
                const intervalId = setInterval(() => {
                    setCountdown((prevCountdown) => { 

                        // if the countdonwn is done then it gets cleared.
                        if (prevCountdown <= 1) {
                            clearInterval(intervalId);
                            setTooManyRequests(false);
                            localStorage.removeItem("tooManyRequests");
                            return 0;
                        }

                        return prevCountdown - 1;
                    });
                }, 1000); // will check every second.
            }
        }
        return () => clearInterval(); // this will clear the interval when the component is unmounted. 
    }, []);

    const handleRequestPasswordReset = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            toast.error("Please enter your email");
            return;
        }
        if (!emailRegex.test(email)) {
            toast.error("Invalid email");
            return;
        }
        if (tooManyRequests) {
            toast.error(`Please wait ${countdown} seconds before requesting again`);
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/request-password-reset`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Password reset link sent to your email");
                const cooldownEnd = Date.now() + 60000; // 1 minute cooldown
                setTooManyRequests(true);
                setCountdown(60);
                localStorage.setItem("tooManyRequests", JSON.stringify({ cooldownEnd }));
            } else {
                if (data.error) {
                    toast.error(data.error);
                } else if (data.emailNotFound) {
                    toast.error("Email not found");
                }
            }
        } catch (err) {
            toast.error("An error occurred while requesting password reset");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Request Password Reset
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={isLoading || tooManyRequests}
                            onClick={handleRequestPasswordReset}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                `Request Reset ${tooManyRequests ? `(${countdown}s)` : ""}`
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <ToastContainer autoClose={1500} />
        </Container>
    );
};

export default RequestPasswordReset;
