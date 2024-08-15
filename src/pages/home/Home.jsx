import React, { useState, useEffect } from "react";
import { Typography, Container, Grid, Box, CircularProgress, Link as MuiLink } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
import { useNavigate } from 'react-router-dom';
import CreateProperty from "../CreateProperty/CreateProperty";

const API_URL = import.meta.env.VITE_API_URL;

// will need a new route to click on a property and see the bookings for that property.
// needs a detail page for each property, using react params.

function Home() {
    const [responseData, setResponseData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize navigate
    const [createPropertyButtonVisible, setCreatePropertyButtonVisible] = useState(false);


    
    useEffect(() => {
        const refreshTokenExpiration = localStorage.getItem('refreshTokenExpiration');

        if (!refreshTokenExpiration || isTokenExpired(refreshTokenExpiration)) {
            // If the refresh token is invalid or expired, redirect to login
            navigate("/login");
        }
    }, [navigate]);

    // put this function inside of /utils
    const isTokenExpired = (expiration) => {
    const currentTime = Date.now();
    const expirationTime = new Date(expiration).getTime();
    return currentTime > expirationTime;
};


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

        if (response.status === 404) {
            setCreatePropertyButtonVisible(true);
            return
        };

        if (response.ok) {
            if (data.length === 0) {
                setCreatePropertyButtonVisible(true);
            } else {
                setResponseData(data);
                setCreatePropertyButtonVisible(false); 
            }
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
                            Your Properties: {responseData.length}
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
                            <>
                                {responseData.length > 0 ? (
                                    <Grid container spacing={2}>
                                        {responseData.map(({ id, propertyName }) => (
                                            <Grid item xs={12} sm={6} md={4} key={id}>
                                                <Box
                                                    sx={{
                                                        padding: 2,
                                                        borderRadius: 8,
                                                        border: '1px solid #ddd',
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.02)',
                                                            boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
                                                        }
                                                    }}
                                                >
                                                    <MuiLink 
                                                        component="button" 
                                                        variant="body1" 
                                                        onClick={() => navigate(`/property-details/${id}`)}
                                                        sx={{
                                                            display: 'block',
                                                            textDecoration: 'none',
                                                            color: 'inherit'
                                                        }}
                                                    >
                                                        <Typography variant="h6" gutterBottom>
                                                            {propertyName}
                                                        </Typography>
                                                    </MuiLink>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Typography variant="h6" align="center">
                                        No properties found.
                                    </Typography>
                                )}
                                {createPropertyButtonVisible && (
                                    <Box display="flex" justifyContent="center" mt={2}>
                                        <button onClick={() => navigate('/create-property')}>
                                            Create Property
                                        </button>
                                    </Box>
                                )}
                            </>
                        )}
                    </Grid>
                </Grid>
            </Container>
            <ToastContainer autoClose={1500} /> 
        </div>
    );

};


export default Home;