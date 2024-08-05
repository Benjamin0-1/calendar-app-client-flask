import React, { useState } from "react";
import { Typography, Container, Grid, Box, TextField, Button, CircularProgress, Paper } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
import { useNavigate } from "react-router-dom";
import withAuth from "../../utils/ifNotLoggedIn";

const API_URL = import.meta.env.VITE_API_URL;

function UpdatePassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/auth/update-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Password updated successfully");
                return;
            };

            if (data.emailNotConfirmed) {
                toast.error("Email not confirmed");
                navigate("/emailnotconfirmed");
                return;
            };

            if (data.error) {
                toast.error(data.error);
                return;
            };

        } catch (err) {
            toast.error("Failed to update password");
            console.log(`Error updating password: ${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '20px' }}>
            <Container maxWidth="sm">
                <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Update Password
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Current Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="New Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Confirm New Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    name="confirmNewPassword"
                                    value={formData.confirmNewPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: 'center' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <CircularProgress size={24} /> : "Update Password"}
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

export default withAuth(UpdatePassword);
