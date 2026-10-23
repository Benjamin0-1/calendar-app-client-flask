import { useState, useEffect } from "react";
import { Container, Typography, Grid, Button, Card, CardContent, CardActions, Chip, Stack,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
import { useNavigate } from 'react-router';
import DeleteForeverIcon from '@mui/icons-material/DeleteForeverOutlined';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweepOutlined';
import ApartmentIcon from '@mui/icons-material/ApartmentOutlined';
import EventIcon from '@mui/icons-material/EventOutlined';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import LoadingState from '../../components/LoadingState';
import { parseBookingDate } from '../../utils/dates';

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
        <Container maxWidth="lg">
            <PageHeader
                backTo="/settings"
                backLabel="Settings"
                title="Deleted bookings"
                subtitle={`${deletedDates.length} deleted ${deletedDates.length === 1 ? 'booking' : 'bookings'}. Removing them here deletes them permanently.`}
                actions={
                    deletedDates.length > 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteSweepIcon />}
                            onClick={() => setShowDeleteAllDialog(true)}
                        >
                            Delete All Deleted Dates
                        </Button>
                    )
                }
            />
            {isLoading ? (
                <LoadingState label="Loading deleted bookings" />
            ) : deletedDates.length === 0 ? (
                <EmptyState
                    icon={<DeleteSweepIcon fontSize="large" />}
                    title="No deleted dates found"
                    description="Bookings you delete from a property will show up here."
                />
            ) : (
                <Grid container spacing={2.5}>
                    {deletedDates.map((date) => {
                        const parsedDate = parseBookingDate(date.date);

                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={date.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flex: 1 }}>
                                        <Typography variant="h6" noWrap title={date.customerName}>
                                            {date.customerName}
                                        </Typography>
                                        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mt: 1, color: 'text.secondary' }}>
                                            <EventIcon sx={{ fontSize: 18 }} />
                                            <Typography variant="body2">
                                                {parsedDate ? format(parsedDate, 'EEE, MMM d, yyyy') : date.date}
                                            </Typography>
                                        </Stack>
                                        <Chip
                                            size="small"
                                            variant="outlined"
                                            icon={<ApartmentIcon />}
                                            label={date.propertyName}
                                            sx={{ mt: 1.5, maxWidth: '100%' }}
                                        />
                                    </CardContent>
                                    <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<DeleteForeverIcon fontSize="small" />}
                                            onClick={() => openDeleteDialog(date.id)}
                                        >
                                            Delete permanently
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
            <Dialog
                open={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                aria-labelledby="delete-dialog-title"
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle id="delete-dialog-title">Delete booking permanently?</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this booking? This action cannot be undone.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteDialog(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteBookingById} variant="contained" color="error" disabled={isLoading}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={showDeleteAllDialog}
                onClose={() => setShowDeleteAllDialog(false)}
                aria-labelledby="delete-all-dialog-title"
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle id="delete-all-dialog-title">Delete all deleted bookings?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        All {deletedDates.length} deleted bookings will be removed permanently. This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteAllDialog(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteAllDeletedDates} variant="contained" color="error">
                        Delete All
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default DeletedDate;
