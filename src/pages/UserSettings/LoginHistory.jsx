import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Box, CircularProgress, Card, CardContent } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
//import withAuth from "../../utils/ifNotLoggedIn";
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function LoginHistory() {
    const [serverData, setServerData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const handleFetchLoginHistory = async () => {
        setIsLoading(true);

        try {
            const response = await FetchWithAuth(`${API_URL}/auth/login-history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                setServerData(data);
            } else if (data.length === 0) {
                toast.error("No login history found");
            } else if (data.emailNotConfirmed) {
                toast.error("Email not confirmed");
                navigate("/emailnotconfirmed");
            } else if (data.error) {
                toast.error(data.error);
            }
        } catch (err) {
            toast.error(`Error fetching login history: ${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleFetchLoginHistory();
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Login History
            </Typography>
            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {serverData.length > 0 ? (
                        serverData.map((record, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">Login Record {index + 1}</Typography>
                                        <Typography variant="body2">IP Address: {record.ip_address}</Typography>
                                        <Typography variant="body2">Login Time: {new Date(record.login_time).toLocaleString()}</Typography>
                                        <Typography variant="body2">Logout Time: {record.logout_time ? new Date(record.logout_time).toLocaleString() : "Not yet logged out"}</Typography>
                                        <Typography variant="body2">User Agent: {record.user_agent}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body1">No login history available.</Typography>
                    )}
                </Grid>
            )}
            <ToastContainer autoClose={3000} />
        </Container>
    );
}

//export default withAuth(LoginHistory);
export default LoginHistory;