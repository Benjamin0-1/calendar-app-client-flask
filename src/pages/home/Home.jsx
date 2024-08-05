import React, { useState, useEffect } from "react";
import { Typography, Container, Grid, Box, CircularProgress, Card, CardContent } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
import withAuth from "../../utils/ifNotLoggedIn";

const API_URL = import.meta.env.VITE_API_URL;

// will need a new route to click on a property and see the bookings for that property.
// needs a detail page for each property, using react params.

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
                    'Content-Type': 'application/json'
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
        <div style={{ minHeight: '100vh', padding: '20px' }}>
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
                                <Grid container spacing={2}>
                                    {Object.entries(responseData).map(([propertyName, { bookings, id }]) => (
                                        <Grid item xs={12} sm={6} md={4} key={id}>
                                            <Card
                                                style={{
                                                    padding: 16,
                                                    marginBottom: 16,
                                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                                    borderRadius: 12,
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                                    backgroundColor: '',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)',
                                                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                                                        cursor: 'pointer',
                                                    },
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography variant="h5" style={{ marginBottom: 8 }}>
                                                        {propertyName}
                                                    </Typography>
                                                    {bookings.length > 0 ? (
                                                        bookings.map((booking, index) => (
                                                            <Box key={index} marginBottom={1} style={{ borderBottom: '1px solid #ddd', paddingBottom: 8 }}>
                                                                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                                                                    Customer: {booking.customerName}
                                                                </Typography>
                                                                <Typography variant="body2" style={{ color: '#666' }}>
                                                                    Date: {booking.date}
                                                                </Typography>
                                                            </Box>
                                                        ))
                                                    ) : (
                                                        <Typography variant="body2" style={{ color: '#888' }}>No bookings for this property.</Typography>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography variant="h6" align="center">
                                    No properties found.
                                </Typography>
                            )
                        )}
                    </Grid>
                </Grid>
            </Container>
            <ToastContainer autoClose={1500} /> {/* Reduced autoClose duration */}
        </div>
    );
};

export default withAuth(Home);
