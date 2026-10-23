import { useState, useEffect } from "react";
import { CircularProgress, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { toast } from 'react-toastify';
import FetchWithAuth from "../../utils/FetchWithAuthentication";

const API_URL = import.meta.env.VITE_API_URL;

// this component will be used inside of the Detail component.
function UpdateBooking({open, onClose, propertyId, dateToBeUpdated}) {
    const [form, setForm] = useState({
        customerName: "",
        date: "", // yyyy-MM-dd, the format <input type="date"> produces.
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
                    date: form.date, // already yyyy-MM-dd.
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
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Update booking</DialogTitle>
            <DialogContent>
                <form>
                    <TextField
                        autoFocus
                        margin="normal"
                        id="customerName"
                        name="customerName"
                        label="Customer Name"
                        type="text"
                        fullWidth
                        value={form.customerName}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="normal"
                        id="date"
                        name="date"
                        label="Date"
                        type="date"
                        fullWidth
                        value={form.date}
                        onChange={handleInputChange}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleUpdate} variant="contained" color="primary" disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Update"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateBooking;
