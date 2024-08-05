import React, { useState, useEffect } from "react";
import { Typography, Container, Grid, Box, CircularProgress, Paper } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
import withAuth from "../../utils/ifNotLoggedIn";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
    const [responseData, setResponseData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetch = async () => {
        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/bookings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setResponseData(data);
            } else {
                if (data.emailNotConfirmed) {
                    toast.error("Email not confirmed");
                    navigate("/emailnotconfirmed");
                    return;
                }
                if (data.error) {
                    setError(data.error);
                    return;
                }
            }
        } catch (error) {
            console.error(`Error fetching properties: ${error}`);
            toast.error("Error fetching properties");
            setError("Error fetching properties");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleFetch();
    }, []);

    return (
        <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f5f5f5' }}>
            <Container maxWidth="md">
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Welcome to the Home Page
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        {isLoading ? (
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Typography variant="h6" color="error" align="center">
                                {error}
                            </Typography>
                        ) : (
                            Object.keys(responseData).length > 0 ? (
                                Object.entries(responseData).map(([propertyName, { bookings, id }]) => (
                                    <Paper key={id} style={{ padding: 16, marginBottom: 16 }}>
                                        <Typography variant="h5">{propertyName}</Typography>
                                        {bookings.length > 0 ? (
                                            bookings.map((booking, index) => (
                                                <Box key={index} marginBottom={1}>
                                                    <Typography variant="body1">
                                                        Customer: {booking.customerName}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Date: {booking.date}
                                                    </Typography>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="body2">No bookings for this property.</Typography>
                                        )}
                                    </Paper>
                                ))
                            ) : (
                                <Typography variant="h6" align="center">
                                    No properties found.
                                </Typography>
                            )
                        )}
                    </Grid>
                </Grid>
            </Container>
            <ToastContainer autoClose={3000} />
        </div>
    );
}

export default withAuth(Home);
