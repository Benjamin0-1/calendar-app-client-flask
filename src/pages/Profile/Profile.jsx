import React, { useState, useEffect } from "react";
import { Typography, Container, Grid, Box, CircularProgress, Paper } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
import { Navigate } from "react-router-dom";
import withAuth from "../../utils/ifNotLoggedIn";

const API_URL = import.meta.env.VITE_API_URL;

function Profile() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            toast.error("You need to be logged in to view this page");
            return;
        }

        const handleFetchUserProfile = async () => {
            setIsLoading(true);
            try {
                const response = await FetchWithAuth(`${API_URL}/auth/user-profile`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    credentials: 'include'
                });

                const data = await response.json();
                
                if (response.ok) {
                    setUserData(data);
                    console.log(`response was OK: ${data}`);
                    
                    return;
                }

            } catch (err) {
                console.error(`Error fetching user profile: ${err}`);
                setError("Error fetching user profile");
            } finally {
                setIsLoading(false);
            }
        };

        handleFetchUserProfile();
    }, []); 

    return (
        <div style={{ minHeight: '100vh', padding: '20px' }}>
            <Container maxWidth="md">
                <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Profile
                    </Typography>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item xs={12}>
                            {isLoading && <CircularProgress style={{ display: 'block', margin: 'auto' }} />}
                            {error && <Typography variant="h6" color="error" align="center">{error}</Typography>}
                            {userData && (
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Typography variant="h6" gutterBottom>First Name: {userData.firstName}</Typography>
                                    <Typography variant="h6" gutterBottom>Last Name: {userData.lastName}</Typography>
                                    <Typography variant="h6" gutterBottom>Email: {userData.email}</Typography>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
            <ToastContainer autoClose={3000} />
            <button>Update info</button>
            <button onClick={(e) => (window.location.href='/home')}>Change password</button>
        </div>
    );
}

export default withAuth(Profile);
//export default Profile;
