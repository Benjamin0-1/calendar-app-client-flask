import React, { useState, useEffect } from "react";
import { Container, Typography, Grid, Box, CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function DeletedDate() {
    const [deletedDates, setDeletedDates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false); // State to control 'delete all' dialog visibility
    const [showDeleteDialog, setShowDeleteDialog] = useState(false); // State to control 'delete specific' dialog visibility
    const [dateIdToDelete, setDateIdToDelete] = useState(null); // State to hold the ID of the date to delete
    const navigate = useNavigate();

    const handleFetchDeletedDates = async () => {
        setIsLoading(true);

        try {
            const response = await FetchWithAuth(`${API_URL}/bookings/view-deleted-bookings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text(); // Read the error response
                console.error('Server error:', errorText);
                throw new Error('Failed to fetch deleted dates');
            }

            const data = await response.json();

            if (response.status === 404) {
                return;
            }

            console.log('Fetched data:', data); // Log the entire data object

            if (data.deletedBookings) {
                setDeletedDates(data.deletedBookings);
            } else if (data.emailNotConfirmed) {
                toast.error("Email not confirmed");
                navigate("/emailnotconfirmed");
            } else if (data.error) {
                toast.error(data.error);
            }

        } catch (err) {
            toast.error('Error fetching deleted dates');
            console.log(`Error fetching deleted dates: ${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleFetchDeletedDates();
    }, []);

    const handleDeleteAllDeletedDates = async () => {
        setIsLoading(true);
        setShowDeleteAllDialog(false); // Close dialog after confirmation

        try {
            const response = await FetchWithAuth(`${API_URL}/bookings/delete-all-deleted-bookings`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("All deleted dates deleted successfully", {
                    autoClose: 3000 // Duration in milliseconds (half of the default 5000ms)
                });
                setDeletedDates([]);
            } else if (data.error) {
                toast.error(data.error, {
                    autoClose: 3000 // Duration in milliseconds (half of the default 5000ms)
                });
            }

        } catch (error) {
            toast.error('Error deleting all deleted dates', {
                autoClose: 3000 // Duration in milliseconds (half of the default 5000ms)
            });
            console.log(`Error deleting all deleted dates: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteBookingById = async () => {
        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/bookings/delete-deleted-booking/${dateIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Deleted date deleted successfully", {
                    autoClose: 3000 // Duration in milliseconds (half of the default 5000ms)
                });
                setDeletedDates(deletedDates.filter((date) => date.id !== dateIdToDelete)); // Remove the deleted date from the list
                setDateIdToDelete(null);
                setShowDeleteDialog(false); // Close dialog after confirmation
            } else if (data.error) {
                toast.error(data.error, {
                    autoClose: 3000 // Duration in milliseconds (half of the default 5000ms)
                });
            }

        } catch (error) {
            toast.error('Error deleting deleted date', {
                autoClose: 3000 // Duration in milliseconds (half of the default 5000ms)
            });
            console.log(`Error deleting deleted date: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const openDeleteDialog = (id) => {
        setDateIdToDelete(id);
        setShowDeleteDialog(true);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Deleted Dates: {deletedDates.length}
            </Typography>
            {/* Conditionally render the button based on deletedDates length */}
            {deletedDates.length > 0 && (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setShowDeleteAllDialog(true)}
                    style={{ marginBottom: '20px' }}
                >
                    Delete All Deleted Dates
                </Button>
            )}
            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                    <CircularProgress />
                </Box>
            ) : deletedDates.length === 0 ? (
                <Typography variant="h1" align="center" color="textSecondary">
                    No deleted dates found
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {deletedDates.map((date) => (
                        <Grid item xs={12} sm={6} md={4} key={date.id}>
                            <Box
                                sx={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <Typography variant="h6">Customer: {date.customerName}</Typography>
                                <Typography color="textSecondary">Date: {date.date}</Typography>
                                <Typography variant="body2">Property: {date.propertyName}</Typography>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => openDeleteDialog(date.id)}
                                    style={{ marginTop: '10px' }}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}
            <Dialog
                open={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">Delete Booking</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this booking? This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteBookingById} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={showDeleteAllDialog}
                onClose={() => setShowDeleteAllDialog(false)}
                aria-labelledby="delete-all-dialog-title"
            >
                <DialogTitle id="delete-all-dialog-title">Delete All Deleted Dates</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete all deleted dates? This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteAllDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteAllDeletedDates} color="secondary">
                        Delete All
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer
                position="top-right"
                autoClose={3000} // Set default autoClose duration for all toasts
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </Container>
    );
}

export default DeletedDate;
