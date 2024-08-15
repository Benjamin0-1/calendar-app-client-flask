// this is simply a success page after the user has confirmed their email.
// they will be redirected here from the server if the email confirmation was successful.
import React from 'react';
import { Container, Typography, Button, Box, Paper, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';

function EmailConfirmed() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: isMobile ? '10px' : '20px' }}>
            <Container maxWidth="sm">
                <Paper elevation={6} style={{ padding: isMobile ? '20px' : '30px', textAlign: 'center' }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <EmailIcon color="primary" style={{ fontSize: 60, marginBottom: 20 }} />
                        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
                            Email Confirmed
                        </Typography>
                        <Typography variant="body1" color="textSecondary" paragraph>
                            Your email address has been confirmed successfully.
                        </Typography>
                        <Box mt={3} mb={2} width="100%">
                            <Button variant="contained" color="primary" onClick={() => navigate('/login')} fullWidth={isMobile}>
                                Login
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </div>
    );
 };

    export default EmailConfirmed;
    