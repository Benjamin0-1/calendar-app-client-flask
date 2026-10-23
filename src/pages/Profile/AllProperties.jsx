import { useEffect, useState } from "react";
import { Typography, Container, Grid, Button, Card, CardContent, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ApartmentIcon from '@mui/icons-material/ApartmentOutlined';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import LoadingState from '../../components/LoadingState';

function AllProperties() {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetchProperties = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/bookings', {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {
                setProperties(data);
            } else {
                setError("Failed to fetch properties");
            }
        } catch (err) {
            console.log(`Error fetching properties: ${err}`);
            setError("Failed to fetch properties");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <PageHeader
                title="All Properties"
                actions={
                    <Button variant="contained" startIcon={<RefreshIcon />} onClick={handleFetchProperties} disabled={isLoading}>
                        Fetch Properties
                    </Button>
                }
            />

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {isLoading ? (
                <LoadingState />
            ) : properties.length > 0 ? (
                <Grid container spacing={2.5}>
                    {properties.map((property) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={property.id}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>{property.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{property.description}</Typography>
                                    <Typography variant="subtitle1" color="primary" sx={{ mt: 1.5, fontWeight: 700 }}>
                                        {property.price}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <EmptyState
                    icon={<ApartmentIcon fontSize="large" />}
                    title="Nothing loaded yet"
                    description="Fetch your properties to see them here."
                />
            )}
        </Container>
    )
};

export default AllProperties;
