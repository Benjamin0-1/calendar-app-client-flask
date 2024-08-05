import React, {useState, useEffect} from "react";
import {Typography, Container, Grid, Box, CircularProgress} from '@mui/material';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
//import withAuth from "../../utils/ifNotLoggedIn";

const API_URL = import.meta.env.VITE_API_URL;
const accessToken = localStorage.getItem('accessToken');

function Home() {
    const [userData, setUserData] = useState([]);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // will bring properties and bookings.
    const handleFetch = async () => {
        setIsLoading(true);
        try {

            const response = await fetch('http://127.0.0.1:5000/bookings',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );
            
            const data = await response.json();
            
            if (response.ok) {
                setData(data);
                return
            };

            toast.error("Error fetching properties");
            return;
            
        } catch (error) {
            console.error(`Error fetching properties: ${error}`);
            toast.error("Error fetching properties");
        }
    };

    useEffect(() => {
        handleFetch();
    }, []);

    return (
        <div>
            <Container>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Welcome to the Home Page
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        {isLoading ? (
                            <CircularProgress />
                        ) : error ? (
                            <Typography variant="h6" color="error" align="center">
                                {error}
                            </Typography>
                        ) : (
                            Object.keys(data).length > 0 ? (
                                Object.entries(data).map(([propertyName, { bookings, id }]) => (
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
            <ToastContainer />
        </div>
    );
}

export default Home;