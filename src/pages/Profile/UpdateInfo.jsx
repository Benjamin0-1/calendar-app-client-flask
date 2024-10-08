import React, { useState } from "react";
import { Typography, Container, Grid, Box, TextField, Button, CircularProgress, Paper } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
import withAuth from "../../utils/ifNotLoggedIn";

const API_URL = import.meta.env.VITE_API_URL;

function UpdateInfo() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    
    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/auth/update-profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("User info updated successfully");
                return
            };

            if (data.emailNotConfirmed) {
                toast.error("Email not confirmed");
                // this must redirect to emailnotconfirmed page.
                return;
            };

            if (data.error) {
                toast.error(data.error);
                return
            };

        } catch (err) {
            toast.error("Failed to update user info");
            console.log(`Error updating user info: ${err}`);
        } finally {
            setIsLoading(false);
        };
    };

    // must be responsive.
    return (
        <div style={{ minHeight: '100vh', padding: '20px' }}>
            <Container maxWidth="sm">
                <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Update Profile
                    </Typography>
                    <form onSubmit={handleUpdateInfo}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="First Name"
                                    variant="outlined"
                                    fullWidth
                                    name="firstName"
                                    value={userData.firstName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Last Name"
                                    variant="outlined"
                                    fullWidth
                                    name="lastName"
                                    value={userData.lastName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: 'center' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <CircularProgress size={24} /> : "Update"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
            <ToastContainer autoClose={3000} />
        </div>
    );
}

export default withAuth(UpdateInfo);
