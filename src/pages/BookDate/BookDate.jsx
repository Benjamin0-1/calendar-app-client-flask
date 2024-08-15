import React, { useState, useEffect } from "react";
import { CircularProgress, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchWithAuth from "../../utils/FetchWithAuthentication";

const API_URL = import.meta.env.VITE_API_URL;

function BookDate({ open, onClose, propertyId }) {
    const [form, setForm] = useState({
        propertyId: "",
        customerName: "",
        date: "", // Initialize as an empty string for HTML date input
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (propertyId) {
            setForm((prevForm) => ({
                ...prevForm,
                propertyId: propertyId,
            }));
        }
    }, [propertyId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleDateChange = (event) => {
        setForm((prevForm) => ({
            ...prevForm,
            date: event.target.value, // Get the date value directly from the event
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await FetchWithAuth(`${API_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    propertyId: form.propertyId,
                    customerName: form.customerName,
                    date: form.date, // Use the date string directly
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Booking created successfully');
                onClose();
                window.location.reload();
            } else {
                toast.error(data.error || "Failed to create booking.");
            }
        } catch (error) {
            toast.error("An error occurred while creating the booking.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="book-date-dialog"
            maxWidth="md" // Increase the maxWidth to "md" for a bigger dialog
            fullWidth
        >
            <DialogTitle id="book-date-dialog">Book a Date</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        id="propertyId"
                        name="propertyId"
                        label="Property ID"
                        value={form.propertyId}
                        onChange={handleInputChange}
                        disabled // Disable the input field as it's passed from parent automatically.
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        id="customerName"
                        name="customerName"
                        label="Customer Name"
                        value={form.customerName}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        id="date"
                        name="date"
                        label="Date"
                        type="date"
                        value={form.date}
                        onChange={handleDateChange}
                        InputLabelProps={{ shrink: true }} // Ensure the label shrinks for date input
                    />
                    <DialogActions>
                        <Button onClick={onClose} color="primary">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Book'}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default BookDate;
