import React from "react";
import { Container, Typography, Button, Box, Paper, useMediaQuery } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Route, Routes } from "react-router-dom";
import EmailIcon from '@mui/icons-material/Email';
import { Link } from 'react-router-dom';

// this page will be a little mini dashboard for the user settings.
// it will have buttons to go to /login-history, 
function Settings() {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Container>
            <Box
                component={Paper}
                elevation={3}
                p={3}
                mt={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
            >
                <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
                    User Settings
                </Typography>

                <Link to="/settings/login-history" style={{ textDecoration: 'none' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EmailIcon />}
                        sx={{ mt: 2, mb: 2, width: isMobile ? "100%" : "auto" }}
                    >
                        View Login History
                    </Button>
                </Link>

                <Link to="/settings/view-deleted-bookings" style={{ textDecoration: 'none' }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 2, mb: 2, width: isMobile ? "100%" : "auto" }}
                    >
                        View Deleted Bookings
                    </Button>
                </Link>
            </Box>

         

            <ToastContainer />
        </Container>
    );
}



export default Settings;
