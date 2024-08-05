import React from "react";
import { Container, Typography, Button, Box, Paper, useMediaQuery } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import EmailIcon from '@mui/icons-material/Email';
import { useTheme } from '@mui/material/styles';

const API_URL = import.meta.env.VITE_API_URL;

// this needs further improvement, it should be able to resend the confirmation email.
// I will check the backend later.


// if the user sees this page then it means he is authenticated and his email is not confirmed.
// therebofore, I could implement a button to resend the confirmation email automatically.
function EmailNotConfirmed() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleResendConfirmation = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/resend-confirmation-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message || "Confirmation email resent successfully.");
            } else {
                toast.error(result.error || "Failed to resend confirmation email.");
            }
        } catch (err) {
            toast.error("Failed to resend confirmation email.");
            console.log(`Error resending confirmation email: ${err}`);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: isMobile ? '10px' : '20px' }}>
            <Container maxWidth="sm">
                <Paper elevation={6} style={{ padding: isMobile ? '20px' : '30px', textAlign: 'center' }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <EmailIcon color="primary" style={{ fontSize: 60, marginBottom: 20 }} />
                        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
                            Email Not Confirmed
                        </Typography>
                        <Typography variant="body1" color="textSecondary" paragraph>
                            Your email address has not been confirmed yet. Please check your inbox for a confirmation email.
                        </Typography>
                        <Box mt={3} mb={2} width="100%">
                            <Button variant="contained" color="primary" onClick={handleResendConfirmation} fullWidth={isMobile}>
                                Resend Confirmation Email
                            </Button>
                        </Box>
                        <Button variant="outlined" color="secondary" onClick={() => navigate('/')} fullWidth={isMobile}>
                            Go to Home
                        </Button>
                    </Box>
                </Paper>
            </Container>
            <ToastContainer autoClose={3000} />
        </div>
    );
}

export default EmailNotConfirmed;
