import { useState, useEffect } from "react";
import { Typography, Container, Box, Card, Avatar, Button, Divider, Alert, Stack } from '@mui/material';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/EditOutlined';
import KeyIcon from '@mui/icons-material/KeyOutlined';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
import PageHeader from '../../components/PageHeader';
import LoadingState from '../../components/LoadingState';
import { useNavigate } from "react-router";
//import withAuth from "../../utils/ifNotLoggedIn";

const API_URL = import.meta.env.VITE_API_URL;

function Profile() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            toast.error("You need to be logged in to view this page");
            navigate("/login"); // Redirect to login page if not logged in
            return;
        }

        const handleFetchUserProfile = async () => {
            setIsLoading(true);
            try {
                const response = await FetchWithAuth(`${API_URL}/auth/user-profile`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    credentials: 'include'
                });

                const data = await response.json();

                if (data.emailNotConfirmed) {
                    navigate('/emailnotconfirmed');
                    return
                }
                
                if (response.ok) {
                    setUserData(data);
                } else {
                    setError(data.error || "Error fetching user profile");
                }
            } catch (err) {
                console.error(`Error fetching user profile: ${err}`);
                setError("Error fetching user profile");
            } finally {
                setIsLoading(false);
            }
        };

        handleFetchUserProfile();
    }, [navigate]);

    return (
        <Container maxWidth="md">
            <PageHeader eyebrow="Account" title="Profile" subtitle="Your personal details and sign-in settings." />

            {isLoading && <LoadingState label="Loading profile" />}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {userData && (
                <Card>
                    <Box
                        sx={(theme) => ({
                            height: 96,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        })}
                    />
                    <Box sx={{ px: { xs: 3, sm: 4 }, pb: 3 }}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            sx={{ alignItems: 'flex-start', mt: -5 }}
                        >
                            <Avatar
                                sx={{
                                    width: 88,
                                    height: 88,
                                    fontSize: '2rem',
                                    fontWeight: 700,
                                    bgcolor: 'background.paper',
                                    color: 'primary.main',
                                    border: 4,
                                    borderColor: 'background.paper',
                                    boxShadow: 2,
                                }}
                            >
                                {`${userData.firstName?.[0] ?? ''}${userData.lastName?.[0] ?? ''}`.toUpperCase()}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0, pt: { sm: 6 } }}>
                                <Typography variant="h5" noWrap>
                                    {userData.firstName} {userData.lastName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    {userData.email}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Divider />

                    <Box component="dl" sx={{ m: 0, px: { xs: 3, sm: 4 } }}>
                        {[
                            ['First name', userData.firstName],
                            ['Last name', userData.lastName],
                            ['Email', userData.email],
                        ].map(([label, value], index) => (
                            <Box
                                key={label}
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: '180px 1fr' },
                                    gap: { xs: 0.25, sm: 2 },
                                    py: 2,
                                    borderTop: index === 0 ? 0 : 1,
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography component="dt" variant="body2" color="text.secondary">
                                    {label}
                                </Typography>
                                <Typography component="dd" variant="body1" sx={{ m: 0, fontWeight: 500, wordBreak: 'break-word' }}>
                                    {value}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <Divider />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ p: { xs: 3, sm: 4 }, py: { sm: 2.5 } }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={() => navigate('/profile/update-info')}
                        >
                            Update Info
                        </Button>
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<KeyIcon />}
                            onClick={() => navigate('/profile/change-password')}
                            sx={{ borderColor: 'divider' }}
                        >
                            Change Password
                        </Button>
                    </Stack>
                </Card>
            )}
        </Container>
    );
}
//export default withAuth(Profile);
export default Profile;
