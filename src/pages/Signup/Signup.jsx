import React, { useState } from "react";
import { TextField, Button, Typography, Container, Grid, Box } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function Signup() {
    const [data, setData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !data.firstName || !data.lastName || !data.password || !data.confirmPassword) { 
            toast.error("Please fill out all fields", { autoClose: 2000 }); // Show error with custom duration
            setIsLoading(false);
            return;
        };

        if (data.email && !emailRegex.test(data.email)) { 
            toast.error("Invalid email", { autoClose: 2000 });
            setIsLoading(false);
            return;
        }

        if (data.password !== data.confirmPassword) { 
            toast.error("Passwords do not match", { autoClose: 2000 });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: data.password
                }),
            });

            if (response.ok) {
                toast.success("User signed up successfully", { autoClose: 2000 });
                setTimeout(() => {
                    navigate("/login");
                }
                , 2000);
                return;
            }

            const responseData = await response.json();

            if (responseData.missingData) {
                toast.error("Please fill out all fields", { autoClose: 2000 });
                return;
            }

            if (responseData.invalidEmail) {
                toast.error("Invalid email", { autoClose: 2000 });
                return;
            }

            if (responseData.userAlreadyExists) {
                toast.error("User already exists", { autoClose: 2000 });
                return;
            }

            if (responseData.error) {
                toast.error(responseData.error, { autoClose: 2000 });
                return;
            }

        } catch (err) {
            console.log(`Error during signup: ${err}`);
            toast.error("Failed to sign up", { autoClose: 2000 });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Sign Up</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                value={data.firstName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="lname"
                                value={data.lastName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={data.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={data.password}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                value={data.confirmPassword}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
                    </Button>
                </Box>
            </Box>
            <ToastContainer /> 
        </Container>
    );
}

export default Signup;
