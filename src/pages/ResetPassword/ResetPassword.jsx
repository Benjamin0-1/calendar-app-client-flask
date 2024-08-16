import React, { useEffect, useState } from "react";
import { Typography, Container, Grid, CircularProgress, Box, Button, TextField } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

// what this component does is that it will grab the email and otp from the query string, sent by the server.
// this provides a much smoother user experience, as the user doesn't have to enter the email and otp again, only the new password and confirm new password.

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const query = useQuery();
    const email = query.get('email');
    const otp = query.get('otp');

    useEffect(() => {
        if (!email || !otp) {
            navigate('/login');
        }
    }, [email, otp, navigate]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (newPassword !== confirmNewPassword) {
            toast.error("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp, newPassword, confirmNewPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Password reset successfully.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                toast.error(data.error || "Something went wrong.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>Update Password</Typography>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={6}>
                    <form onSubmit={handleResetPassword}>
                        <TextField
                            label="OTP"
                            type="text"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <TextField
                            label="New Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <TextField
                            label="Confirm New Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        <Box mt={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} /> : "Update Password"}
                            </Button>
                        </Box>
                    </form>
                </Grid>
            </Grid>
            <ToastContainer autoClose={1500} />
        </Container>
    );
}

export default ResetPassword;
