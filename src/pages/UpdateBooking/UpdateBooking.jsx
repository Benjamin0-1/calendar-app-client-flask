import React, { useState, useEffect } from "react";
import { CircularProgress, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FetchWithAuth from "../../utils/FetchWithAuthentication";

const API_URL = import.meta.env.VITE_API_URL;

// this component will be used inside of the Detail component.
function UpdateBooking({open, onClose, propertyId, dateToBeUpdated}) {
    const [form, setForm] = useState({
        customerName: "",
        date: null,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        setIsLoading(true);

        try {

            const response = await FetchWithAuth(`${API_URL}/bookings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerName: form.customerName,
                    date: form.date ? form.date.toISOString().split('T')[0] : "", // YY-MM-DD.
                }),
            });
           
            const data = await response.json();
            
            if (response.ok) {
                toast.success(data.message);
                onClose();
                console.log('Booking updated successfully')
            };

            if (data.error) {
                toast.error(data.error);
                return
            };
            
        } catch (error) {
            console.log(`error updating booking: ${error}`);
            
        } finally {
            setIsLoading(false);
        };
    };


    // responsive JSX here.
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Update Booking</DialogTitle>
            <DialogContent>
                <form>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="customerName"
                        name="customerName"
                        label="Customer Name"
                        type="text"
                        fullWidth
                        value={form.customerName}
                        onChange={handleInputChange}
                    />
                    <DatePicker
                        selected={form.date}
                        onChange={(date) => setForm((prevForm) => ({
                            ...prevForm,
                            date: date,
                        }))}
                        dateFormat="yyyy-MM-dd"
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleUpdate} color="primary" disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : "Update"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateBooking;
