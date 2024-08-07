import React, { useState, useEffect } from "react";
import { Typography, Container, Grid, CircularProgress, Box, Button, 
    Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
import { useParams, Link } from 'react-router-dom';
import CreateProperty from "../CreateProperty/CreateProperty"; // sub component
import BookDate from "../BookDate/BookDate"; // sub component

const API_URL = import.meta.env.VITE_API_URL;

function Detail() {
    const { id } = useParams();
    const [responseData, setResponseData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [createPropertyDialogOpen, setCreatePropertyDialogOpen] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false); // BookDate

    // Fetch the property detail by id
    useEffect(() => {
        const fetchPropertyDetail = async () => {
            setIsLoading(true);
            try {
                const response = await FetchWithAuth(`${API_URL}/bookings/property-details/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setResponseData(data);
                } else {
                    toast.error(data.error || "Failed to fetch property details.");
                }
            } catch (error) {
                toast.error("An error occurred while fetching property details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPropertyDetail();
    }, [id]);

    // Handle booking deletion
    const handleDeleteBooking = async () => {
        if (!selectedBooking) return;
        
        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/bookings`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    propertyId: id,
                    date: selectedBooking.date
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Booking deleted successfully');
                setResponseData((prevState) => ({
                    ...prevState,
                    bookedDates: prevState.bookedDates.filter((booking) => booking.id !== selectedBooking.id)
                }));
                setDialogOpen(false);
                setSelectedBooking(null);
            } else {
                toast.error(data.error || "Failed to delete booking.");
            }
        } catch (err) {
            toast.error('Error deleting booking');
        } finally {
            setIsLoading(false);
        }
    };


   const openDialog = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
};


const closeDialog = () => {
    setDialogOpen(false);
    setSelectedBooking(null);
};

const openCreatePropertyDialog = () => {
    setCreatePropertyDialogOpen(true);
};


const closeCreatePropertyDialog = () => {
    setCreatePropertyDialogOpen(false);
};

const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
};

const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
};

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!responseData) {
        return null;
    }

    return (
        <Container>
            <ToastContainer />
            <Typography variant="h4" component="h1" gutterBottom>
                Property: {responseData.propertyName}
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom>
                Property ID: {responseData.id}
            </Typography>

            <Typography variant="h5" component="h3" gutterBottom>
                Booked Dates:
            </Typography>
            {responseData.bookedDates.length > 0 ? (
                <Grid container spacing={2}>
                    {responseData.bookedDates.map((booking) => (
                        <Grid item xs={12} sm={6} md={4} key={booking.id}>
                            <Box
                                sx={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: 2,
                                    backgroundColor: '#fafafa',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                    }
                                }}
                            >
                                <Typography variant="body1" component="p" sx={{ fontWeight: 'bold' }}>
                                    Customer Name: {booking.customerName}
                                </Typography>
                                <Typography variant="body1" component="p">
                                    Date: {booking.date}
                                </Typography>
                                <Typography variant="body1" component="p">
                                    Booking ID: {booking.id}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => openDialog(booking)}
                                    sx={{ mt: 2 }}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1" component="p">
                    No bookings found for this property.
                </Typography>
            )}

            <Box mt={4}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={openCreatePropertyDialog}
                    sx={{ mt: 2 }}
                >
                    Create Property
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenCreateDialog}
                    sx={{ mt: 2, ml: 2 }}
                >
                    Create Booking
                </Button>
            </Box>

            <Dialog
                open={dialogOpen}
                onClose={closeDialog}
                aria-labelledby="confirm-delete-dialog"
            >
                <DialogTitle id="confirm-delete-dialog">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this booking? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteBooking}
                        sx={{ mt: 2 }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={createPropertyDialogOpen}
                onClose={closeCreatePropertyDialog}
                aria-labelledby="create-property-dialog"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="create-property-dialog">Create Property</DialogTitle>
                <DialogContent>
                    <CreateProperty />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeCreatePropertyDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <BookDate
                open={openCreateDialog}
                onClose={handleCloseCreateDialog}
            />
        </Container>
    );




};

export default Detail;
