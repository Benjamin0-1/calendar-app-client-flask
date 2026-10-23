import { useEffect, useState } from "react";
import { Container, Typography, Box, Card, Avatar, Chip, Stack, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { toast } from 'react-toastify';
import FetchWithAuth from "../../utils/FetchWithAuthentication";
//import withAuth from "../../utils/ifNotLoggedIn";
import { useNavigate } from 'react-router';
import ComputerIcon from '@mui/icons-material/ComputerOutlined';
import PhoneIcon from '@mui/icons-material/PhoneIphoneOutlined';
import HistoryIcon from '@mui/icons-material/History';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import LoadingState from '../../components/LoadingState';

const API_URL = import.meta.env.VITE_API_URL;

// Turns a raw user-agent string into something like "Chrome on macOS".
const describeUserAgent = (userAgent = '') => {
    const browser =
        /Edg\//.test(userAgent) ? 'Edge'
        : /Firefox\//.test(userAgent) ? 'Firefox'
        : /Chrome\//.test(userAgent) ? 'Chrome'
        : /Safari\//.test(userAgent) ? 'Safari'
        : null;
    const os =
        /iPhone|iPad/.test(userAgent) ? 'iOS'
        : /Android/.test(userAgent) ? 'Android'
        : /Windows/.test(userAgent) ? 'Windows'
        : /Mac OS X/.test(userAgent) ? 'macOS'
        : /Linux/.test(userAgent) ? 'Linux'
        : null;

    if (browser && os) return `${browser} on ${os}`;
    return browser || os || 'Unknown device';
};

const isMobileUserAgent = (userAgent = '') => /Mobi|Android|iPhone|iPad/.test(userAgent);

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
        <Container maxWidth="md">
            <PageHeader
                backTo="/settings"
                backLabel="Settings"
                title="Login history"
                subtitle="Recent sign-ins to your account. If something looks unfamiliar, change your password."
            />
            {isLoading ? (
                <LoadingState label="Loading login history" />
            ) : serverData.length > 0 ? (
                <Card>
                    {serverData.map((record, index) => {
                        const isMobile = isMobileUserAgent(record.user_agent);

                        return (
                            <Stack
                                key={index}
                                direction="row"
                                spacing={2}
                                sx={{ alignItems: 'flex-start', p: { xs: 2, sm: 2.5 }, borderTop: index === 0 ? 0 : 1, borderColor: 'divider' }}
                            >
                                <Avatar
                                    variant="rounded"
                                    sx={(theme) => ({
                                        width: 40,
                                        height: 40,
                                        borderRadius: 2.5,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: 'primary.main',
                                    })}
                                >
                                    {isMobile ? <PhoneIcon fontSize="small" /> : <ComputerIcon fontSize="small" />}
                                </Avatar>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {describeUserAgent(record.user_agent)}
                                        </Typography>
                                        {!record.logout_time && <Chip size="small" color="success" variant="outlined" label="Not yet logged out" />}
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        {record.ip_address} · Logged in {new Date(record.login_time).toLocaleString()}
                                    </Typography>
                                    {record.logout_time && (
                                        <Typography variant="body2" color="text.secondary">
                                            Logged out {new Date(record.logout_time).toLocaleString()}
                                        </Typography>
                                    )}
                                    <Tooltip title={record.user_agent || ''} placement="bottom-start">
                                        <Typography variant="caption" color="text.disabled" noWrap component="div" sx={{ mt: 0.5 }}>
                                            {record.user_agent}
                                        </Typography>
                                    </Tooltip>
                                </Box>
                            </Stack>
                        );
                    })}
                </Card>
            ) : (
                <EmptyState icon={<HistoryIcon fontSize="large" />} title="No login history available" />
            )}
        </Container>
    );
}

//export default withAuth(LoginHistory);
export default LoginHistory;