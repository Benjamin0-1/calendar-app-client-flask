import {useState, useEffect} from "react";
import { Typography, Container, CircularProgress, Box, Button, Card, CardContent, Stack,
    TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { toast } from 'react-toastify';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
import PageHeader from '../../components/PageHeader';

const API_URL = import.meta.env.VITE_API_URL;

// `embedded` renders just the form, for use inside another page's dialog.
function CreateProperty({ embedded = false }) {
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

    const form = (
        <Box
            component="form"
            onSubmit={(e) => {
                e.preventDefault();
                handleCreateProperty();
            }}
        >
            <Stack spacing={2.5}>
                <TextField
                    fullWidth
                    autoFocus
                    label="Property Name"
                    placeholder="e.g. Lakeside Hall"
                    variant="outlined"
                    value={propertyName}
                    onChange={handleChange}
                    error={!!error}
                    helperText={error || "Use a name you'll recognise at a glance — you can book dates for it right after."}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isLoading}
                    fullWidth
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Create Property"}
                </Button>
            </Stack>
        </Box>
    );

    if (embedded) {
        return <Box sx={{ pt: 1 }}>{form}</Box>;
    }

    return (
        <Container maxWidth="sm">
            <PageHeader
                backTo="/home"
                backLabel="All properties"
                title="Create a property"
                subtitle="Add a venue or rental you want to track bookings for."
            />

            <Card>
                <CardContent sx={{ p: { xs: 3, sm: 4 }, '&:last-child': { pb: { xs: 3, sm: 4 } } }}>
                    {form}
                </CardContent>
            </Card>

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