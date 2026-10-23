import { useState, useEffect } from "react";
import { Typography, Container, Grid, Box, Button, Card, CardContent, CardActions, Chip, Stack,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
import { useParams, useNavigate } from 'react-router';
import CreateProperty from "../CreateProperty/CreateProperty"; // sub component
import BookDate from "../BookDate/BookDate"; // sub component
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/EventOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlineOutlined';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import LoadingState from '../../components/LoadingState';
import { parseBookingDate, toDateInputValue, isPastDate } from '../../utils/dates';


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
            date: toDateInputValue(booking.date), // the date input only accepts yyyy-MM-dd strings.
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



    if (isLoading && !responseData) {
        return <LoadingState label="Loading property" minHeight="60vh" />;
    }

    if (!responseData) {
        return null;
    }

    const bookingCount = responseData.bookedDates.length;


    // this component will be updated to include pagination, filter from asc and desc, and also search by customer name.
    // all of these filters are dynamic and use the same server route.
    // the url state will be dynamically updated based on the user's interaction with the filters.
    return (
        <Container maxWidth="lg">
            <PageHeader
                backTo="/home"
                backLabel="All properties"
                eyebrow="Property"
                title={responseData.propertyName}
                subtitle={`ID ${responseData.id} · ${bookingCount} ${bookingCount === 1 ? 'booking' : 'bookings'}`}
                actions={
                    <>
                        <Button variant="outlined" color="inherit" startIcon={<AddIcon />} onClick={openCreatePropertyDialog} sx={{ borderColor: 'divider' }}>
                            New Property
                        </Button>
                        <Button variant="contained" startIcon={<EventIcon />} onClick={handleOpenCreateDialog}>
                            Book a Date
                        </Button>
                    </>
                }
            />

            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                Booked dates
            </Typography>

            {bookingCount > 0 ? (
                <Grid container spacing={2.5}>
                    {responseData.bookedDates.map((booking) => {
                        const date = parseBookingDate(booking.date);
                        const isPast = date ? isPastDate(date) : false;

                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={booking.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', opacity: isPast ? 0.75 : 1 }}>
                                    <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flex: 1 }}>
                                        {/* Calendar tile */}
                                        <Box
                                            sx={(theme) => ({
                                                flexShrink: 0,
                                                width: 60,
                                                borderRadius: 2.5,
                                                overflow: 'hidden',
                                                textAlign: 'center',
                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                                            })}
                                        >
                                            <Box sx={{ bgcolor: isPast ? 'text.disabled' : 'primary.main', color: 'primary.contrastText', py: 0.25 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.06em' }}>
                                                    {date ? format(date, 'MMM').toUpperCase() : '—'}
                                                </Typography>
                                            </Box>
                                            <Typography variant="h5" component="div" sx={{ py: 0.5, lineHeight: 1.3 }}>
                                                {date ? format(date, 'd') : '?'}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ minWidth: 0, flex: 1 }}>
                                            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.5 }}>
                                                <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap title={booking.customerName}>
                                                    {booking.customerName}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2" color="text.secondary">
                                                {date ? format(date, 'EEEE, MMMM d, yyyy') : booking.date}
                                            </Typography>
                                            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                                                <Chip
                                                    size="small"
                                                    label={isPast ? 'Past' : 'Upcoming'}
                                                    color={isPast ? 'default' : 'success'}
                                                    variant={isPast ? 'filled' : 'outlined'}
                                                />
                                                <Chip size="small" variant="outlined" label={`#${booking.id}`} />
                                            </Stack>
                                        </Box>
                                    </CardContent>
                                    <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<EditIcon fontSize="small" />}
                                            onClick={() => openUpdateDialogUpdate(booking)}
                                            sx={{ flex: 1 }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<DeleteIcon fontSize="small" />}
                                            onClick={() => openDialog(booking)}
                                            sx={{ flex: 1 }}
                                        >
                                            Delete
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            ) : (
                <EmptyState
                    icon={<EventIcon fontSize="large" />}
                    title="No bookings yet"
                    description="This property doesn't have any booked dates. Add the first one to get started."
                    action={
                        <Button variant="contained" startIcon={<EventIcon />} onClick={handleOpenCreateDialog}>
                            Book a Date
                        </Button>
                    }
                />
            )}

            {/* Delete Booking Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={closeDialog}
                aria-labelledby="confirm-delete-dialog"
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle id="confirm-delete-dialog">Delete booking?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedBooking
                            ? `The booking for ${selectedBooking.customerName} will be removed. You can still find it under Settings → Deleted bookings.`
                            : 'Are you sure you want to delete this booking?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteBooking}
                        disabled={isLoading}
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
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="confirm-update-dialog">Edit booking</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 1 }}>
                        Change the customer or move this booking to another date.
                    </DialogContentText>
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
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeUpdateDialog} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdate}
                        disabled={isLoading}
                    >
                        Save changes
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
                <DialogTitle id="create-property-dialog">New property</DialogTitle>
                <DialogContent>
                    <CreateProperty embedded />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeCreatePropertyDialog} color="inherit">
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
