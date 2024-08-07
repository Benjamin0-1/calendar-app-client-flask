import React, {useState, useEffect} from "react";
import { Typography, Container, Grid, CircularProgress, Box, Button, 
    TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchWithAuth from "../../utils/FetchWithAuthentication";

const API_URL = import.meta.env.VITE_API_URL;

function BookDate({open, onClose}) {
    const [form, setForm] = useState({
        propertyId: "",
        customerName: "",
        date: "", // date format: "YYYY-MM-DD"
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    
    const handleBookDate = async () => {
        setIsLoading(true);

        const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateFormatRegex.test(form.date)) { 
            toast.error("Invalid date format. Please use YYYY-MM-DD.");
            setIsLoading(false);
            return;
        };

        try {
            const response = await FetchWithAuth(`${API_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Booking successful.");
                setForm({ propertyId: "", customerName: "", date: "" }); 
                return;
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
            toast.error("An error occurred while booking the date.");
            console.error(err);
            return;       
        } finally {
            setIsLoading(false);
        };
    };

    // this function will fetch the details of the property as the user types in the property name.
    // it will basically say if the booking is occpied or not as soon 
    // as the user enters the date.
    const handleBookingDetails = async (propertyName) => {};

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Book Date</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Property ID"
                            name="propertyId"
                            value={form.propertyId}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Customer Name"
                            name="customerName"
                            value={form.customerName}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Date"
                            name="date"
                            type="date"
                            value={form.date}
                            onChange={handleInputChange}
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>
                {isLoading && <Box display="flex" justifyContent="center" mt={2}><CircularProgress /></Box>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleBookDate}
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                >
                    Book Date
                </Button>
            </DialogActions>
            <ToastContainer />
        </Dialog>
    );

};

export default BookDate;
