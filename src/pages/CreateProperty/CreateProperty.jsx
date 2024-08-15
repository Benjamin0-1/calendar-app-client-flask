import React, {useState, useEffect} from "react";
import { Typography, Container, Grid, CircularProgress, Box, Button, 
    TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchWithAuth from "../../utils/FetchWithAuthentication";

const API_URL = import.meta.env.VITE_API_URL;

function CreateProperty() {
    const [propertyName, setPropertyName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [error, setError] = useState(null);   

    const handleCreateProperty = async () => {
        setIsLoading(true);
        try {

            const response = await FetchWithAuth(`${API_URL}/bookings/create-property`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    propertyName
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Property created successfully.");
                return
            };

            if (data.error) {
                toast.error(data.error);
                return;
            };

            if (data.emailNotConfirmed) {
                toast.error("Email not confirmed");
                return;
            };
            
        } catch (err) {
            toast.error("An error occurred while creating the property.");
            console.error(err);
            return;       
        } finally {
            setIsLoading(false);
        };
    };


    // this function will fetch the details of the property as the user types in the property name.
    const fetchDetails = async (propertyName) => {};

    const handleChange = (e) => {
        setPropertyName(e.target.value);
        //etchDetails(e.target.value);
    };

    // JSX here, must be responsive for mobile.

    return (
        <Container maxWidth="sm">
            <ToastContainer />
            <Typography variant="h4" component="h1" gutterBottom>
                Create New Property
            </Typography>
            
            <Box
                sx={{
                    marginBottom: 3,
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: '#'
                }}
            >
                <TextField
                    fullWidth
                    label="Property Name"
                    variant="outlined"
                    value={propertyName}
                    onChange={handleChange}
                    margin="normal"
                    error={!!error}
                    helperText={error}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateProperty}
                    disabled={isLoading}
                    fullWidth
                >
                    {isLoading ? <CircularProgress size={24} /> : "Create Property"}
                </Button>
            </Box>

            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                aria-labelledby="error-dialog-title"
            >
                <DialogTitle id="error-dialog-title">Error</DialogTitle>
                <DialogContent>
                    <Typography>{error}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );


};

export default CreateProperty;