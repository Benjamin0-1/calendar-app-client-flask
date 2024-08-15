import React, { useState } from "react";
import { Typography, Container, Grid, CircularProgress, Box, Button, 
    TextField } from '@mui/material';

import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const email = 'fernandodaniele71@gmail.com'; // hardcoded for now, will be passed from the previous page.

const API_URL = import.meta.env.VITE_API_URL;

function ResetPassword() {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!otp || !newPassword || !confirmNewPassword) {
            toast.error("Please fill out all fields");
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error("Passwords do not match");
            setIsLoading(false);
            return;
        };

        try {
            
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    otp,
                    newPassword,
                    confirmNewPassword,
                    email
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Password updated successfully.");
                setTimeout(() => {
                    navigate('/login')
                }, 2000);
                return;
            } else {
                toast.error(data.error);
                return;
            };
 

        } catch (error) {
            toast.error("An error occurred while updating the password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>Update Password</Typography>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={6}>
                    <form onSubmit={handleUpdatePassword}>
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
    