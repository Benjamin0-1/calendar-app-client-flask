import React, { useState, useEffect } from "react";
import { Typography, Container, Grid, CircularProgress, Box, Button, 
    Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';  
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
import { useParams, Link, useNavigate } from 'react-router-dom';
import CreateProperty from "../CreateProperty/CreateProperty"; // sub component
import BookDate from "../BookDate/BookDate"; // sub component
import DatePicker from "react-datepicker"; // need to adjust its size to make it bigger.
import "react-datepicker/dist/react-datepicker.css";


const API_URL = import.meta.env.VITE_API_URL;

function Detail() {
    const { id } = useParams();
    const [responseData, setResponseData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [createPropertyDialogOpen, setCreatePropertyDialogOpen] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false); // BookDate
    const [dateToBeUpdated, setDateToBeUpdated] = useState(null);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        customerName: "",
        date: null,
    });
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);




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

                if (data.emailNotConfirmed) { 
                    navigate('/emailnotconfirmed')
                }

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

    // update a booking.
    const handleUpdate = async () => {
        setIsLoading(true);

        try {
           
            const newDate = form.date ? new Date(form.date).toISOString().split('T')[0] : null;

            const response = await FetchWithAuth(`${API_URL}/bookings`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    propertyId: id,
                    currentDate: dateToBeUpdated, 
                    customerName: form.customerName,
                    newDate: newDate, 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setOpenUpdateDialog(false);
                console.log('Booking updated successfully');
                
                setResponseData((prevState) => ({
                    ...prevState,
                    bookedDates: prevState.bookedDates.map((booking) => {
                        if (booking.id === bookingDetails.id) {
                            return {
                                ...booking,
                                customerName: form.customerName,
                                date: newDate,
                                // phone number in the future.
                            };
                        }
                        return booking;
                    }),
                }));
            } else if (data.error) {
                toast.error(data.error);
            }
        } catch (error) {
            console.log(`Error updating booking: ${error}`);
            toast.error("Error updating booking");
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };


    const openUpdateDialogUpdate = (booking) => {
        setBookingDetails(booking);
        setDateToBeUpdated(booking.date); 
        setForm({
            customerName: booking.customerName,
            date: new Date(booking.date), 
        });
        setOpenUpdateDialog(true);
    };
    
    
    const closeUpdateDialog = () => {
        setOpenUpdateDialog(false);
        setBookingDetails(null);
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


    // this component will be updated to include pagination, filter from asc and desc, and also search by customer name.
    // all of these filters are dynamic and use the same server route.
    // the url state will be dynamically updated based on the user's interaction with the filters.
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
                                    backgroundColor: '#',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                    },
                                }}
                            >
                                <Typography variant="body1" component="p" sx={{ fontWeight: 'bold' }}>
                                    Customer: {booking.customerName}
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
    
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => openUpdateDialogUpdate(booking)}
                                    sx={{ mt: 2, ml: 2 }}
                                >
                                    Update Booking
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
    
            {/* Delete Booking Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={closeDialog}
                aria-labelledby="confirm-delete-dialog"
            >
                <DialogTitle id="confirm-delete-dialog">Confirm Deletion</DialogTitle>
                <DialogContent sx={{ minWidth: '600px' }}>
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
    



            {/* Update Booking Dialog */}
            <Dialog
                open={openUpdateDialog}
                onClose={closeUpdateDialog}
                aria-labelledby="confirm-update-dialog"
            >
                <DialogTitle id="confirm-update-dialog">Confirm Update</DialogTitle>
                <DialogContent sx={{ minWidth: '600px' }}>
                    <Typography>
                        Are you sure you want to update this booking?
                    </Typography>
                    <TextField
                        label="Customer Name"
                        name="customerName"
                        value={form.customerName}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Date"
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeUpdateDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdate}
                        sx={{ mt: 2 }}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>





    
            {/* Create Property Dialog */}
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
    
            {/* Create Booking Dialog */}
            <BookDate
                open={openCreateDialog}
                onClose={handleCloseCreateDialog}
                propertyId={id}
            />
        </Container>
    );
    
    




};

export default Detail;
