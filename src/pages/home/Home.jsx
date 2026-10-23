import { useState, useEffect } from "react";
import { Typography, Container, Grid, Box, Button, Card, CardActionArea, Avatar, Alert } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { toast } from 'react-toastify';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
import { useNavigate } from 'react-router';
import AddIcon from '@mui/icons-material/Add';
import ApartmentIcon from '@mui/icons-material/ApartmentOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import LoadingState from '../../components/LoadingState';

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
    const [responseData, setResponseData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize navigate
    const [createPropertyButtonVisible, setCreatePropertyButtonVisible] = useState(false);


    
    useEffect(() => {
        const refreshTokenExpiration = localStorage.getItem('refreshTokenExpiration');

        if (!refreshTokenExpiration || isTokenExpired(refreshTokenExpiration)) {
            navigate("/login");
        }
    }, [navigate]);

    // put this function inside of /utils
    const isTokenExpired = (expiration) => {
    const currentTime = Date.now();
    const expirationTime = new Date(expiration).getTime();
    return currentTime > expirationTime;
};


const handleFetch = async () => {
    setIsLoading(true);
    try {
        const response = await FetchWithAuth(`${API_URL}/bookings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.status === 404) {
            setCreatePropertyButtonVisible(true);
            return;
        };

        if (response.ok) {
        
            const properties = Object.keys(data).map(propertyName => ({
                id: data[propertyName].id,
                propertyName,
            }));

            setResponseData(properties);

            setCreatePropertyButtonVisible(properties.length === 0);
        } else {
            if (data.emailNotConfirmed) {
                toast.error("Email not confirmed");
                navigate("/emailnotconfirmed");
                return;
            }
            if (data.error) {
                setError(data.error);
                return;
            }
        }
    } catch (error) {
        console.error(`Error fetching properties: ${error}`);
        toast.error("Error fetching properties");
        setError("Error fetching properties");
    } finally {
        setIsLoading(false);
    }
};



    useEffect(() => {
        handleFetch();
    }, []);

    return (
        <Container maxWidth="lg">
            <PageHeader
                eyebrow="Dashboard"
                title="Your properties"
                subtitle={
                    isLoading
                        ? "Loading your properties…"
                        : `${responseData.length} ${responseData.length === 1 ? 'property' : 'properties'} · select one to manage its bookings`
                }
                actions={
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/create-property')}>
                        Create Property
                    </Button>
                }
            />

            {isLoading ? (
                <LoadingState label="Loading properties" />
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : responseData.length > 0 ? (
                <Grid container spacing={2.5}>
                    {responseData.map(({ id, propertyName }) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        transform: 'translateY(-2px)',
                                        boxShadow: (theme) => `0 12px 24px -12px ${alpha(theme.palette.primary.main, 0.4)}`,
                                    },
                                    '&:hover .arrow': { transform: 'translateX(4px)', color: 'primary.main' },
                                }}
                            >
                                <CardActionArea
                                    onClick={() => navigate(`/property-details/${id}`)}
                                    sx={{ height: '100%', p: 2.5, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-start' }}
                                >
                                    <Avatar
                                        variant="rounded"
                                        sx={(theme) => ({
                                            width: 48,
                                            height: 48,
                                            borderRadius: 3,
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: 'primary.main',
                                        })}
                                    >
                                        <ApartmentIcon />
                                    </Avatar>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography variant="h6" noWrap title={propertyName}>
                                            {propertyName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            View bookings
                                        </Typography>
                                    </Box>
                                    <ArrowForwardIcon
                                        className="arrow"
                                        fontSize="small"
                                        sx={{ color: 'text.secondary', transition: 'transform 0.2s ease, color 0.2s ease' }}
                                    />
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <EmptyState
                    icon={<ApartmentIcon fontSize="large" />}
                    title="No properties yet"
                    description="Create your first property to start tracking its bookings."
                    action={
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/create-property')}>
                            Create Property
                        </Button>
                    }
                />
            )}
        </Container>
    );

};


export default Home;
