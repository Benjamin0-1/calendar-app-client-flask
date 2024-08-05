import React, { useEffect, useState } from "react";
import { Typography, Container, Grid, Box, CircularProgress, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllProperties() {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetchProperties = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/bookings', {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {
                setProperties(data);
            } else {
                setError("Failed to fetch properties");
            }
        } catch (err) {
            console.log(`Error fetching properties: ${err}`);
            setError("Failed to fetch properties");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Container>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center" gutterBottom>
                            All Properties
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box>
                            <Typography variant="h6" align="center" gutterBottom>
                                {isLoading && <CircularProgress />}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box>
                            <Typography variant="h6" align="center" gutterBottom>
                                {error && <p>{error}</p>}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box>
                            <Typography variant="h6" align="center" gutterBottom>
                                {properties.map((property) => (
                                    <div key={property.id}>
                                        <h2>{property.name}</h2>
                                        <p>{property.description}</p>
                                        <p>{property.price}</p>
                                    </div>
                                ))}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box>
                            <Button variant="contained" onClick={handleFetchProperties}>
                                Fetch Properties
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
};

export default AllProperties;
