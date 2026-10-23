import { useState } from "react";
import { Container, Grid, Box, Button, CircularProgress, Card, CardContent } from '@mui/material';
import { toast } from 'react-toastify';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
import PageHeader from '../../components/PageHeader';
import PasswordField from '../../components/PasswordField';
import { useNavigate } from "react-router";
import withAuth from "../../utils/ifNotLoggedIn";

const API_URL = import.meta.env.VITE_API_URL;

function UpdatePassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/auth/update-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Password updated successfully");
                return;
            };

            if (data.emailNotConfirmed) {
                toast.error("Email not confirmed");
                navigate("/emailnotconfirmed");
                return;
            };

            if (data.error) {
                toast.error(data.error);
                return;
            };

        } catch (err) {
            toast.error("Failed to update password");
            console.log(`Error updating password: ${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <PageHeader
                backTo="/profile"
                backLabel="Profile"
                title="Change password"
                subtitle="Enter your current password, then choose a new one."
            />
            <Card>
                <CardContent sx={{ p: { xs: 3, sm: 4 }, '&:last-child': { pb: { xs: 3, sm: 4 } } }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2.5}>
                            <Grid size={12}>
                                <PasswordField
                                    label="Current Password"
                                    autoComplete="current-password"
                                    variant="outlined"
                                    fullWidth
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid size={12}>
                                <PasswordField
                                    label="New Password"
                                    autoComplete="new-password"
                                    variant="outlined"
                                    fullWidth
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid size={12}>
                                <PasswordField
                                    label="Confirm New Password"
                                    autoComplete="new-password"
                                    variant="outlined"
                                    fullWidth
                                    name="confirmNewPassword"
                                    value={formData.confirmNewPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid size={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={isLoading}
                                        sx={{ minWidth: 170 }}
                                    >
                                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Update Password"}
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

export default withAuth(UpdatePassword);
