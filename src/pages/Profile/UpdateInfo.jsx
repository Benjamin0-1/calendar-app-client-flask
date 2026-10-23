import { useState } from "react";
import { Container, Grid, Box, TextField, Button, CircularProgress, Card, CardContent } from '@mui/material';
import { toast } from 'react-toastify';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
import PageHeader from '../../components/PageHeader';
import withAuth from "../../utils/ifNotLoggedIn";

const API_URL = import.meta.env.VITE_API_URL;

function UpdateInfo() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    
    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/auth/update-profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("User info updated successfully");
                return
            };

            if (data.emailNotConfirmed) {
                toast.error("Email not confirmed");
                // this must redirect to emailnotconfirmed page.
                return;
            };

            if (data.error) {
                toast.error(data.error);
                return
            };

        } catch (err) {
            toast.error("Failed to update user info");
            console.log(`Error updating user info: ${err}`);
        } finally {
            setIsLoading(false);
        };
    };

    return (
        <Container maxWidth="sm">
            <PageHeader
                backTo="/profile"
                backLabel="Profile"
                title="Update profile"
                subtitle="Change the name shown on your account."
            />
            <Card>
                <CardContent sx={{ p: { xs: 3, sm: 4 }, '&:last-child': { pb: { xs: 3, sm: 4 } } }}>
                    <form onSubmit={handleUpdateInfo}>
                        <Grid container spacing={2.5}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="First Name"
                                    variant="outlined"
                                    fullWidth
                                    autoComplete="given-name"
                                    name="firstName"
                                    value={userData.firstName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Last Name"
                                    variant="outlined"
                                    fullWidth
                                    autoComplete="family-name"
                                    name="lastName"
                                    value={userData.lastName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={isLoading}
                                        sx={{ minWidth: 140 }}
                                    >
                                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save changes"}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
}

export default withAuth(UpdateInfo);
