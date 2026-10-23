import { Container, Typography, Box, Card, CardActionArea, Avatar, Grid, Switch, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Link } from 'react-router';
import HistoryIcon from '@mui/icons-material/History';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweepOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useThemeToggle } from '../../ThemeContext';
import PageHeader from '../../components/PageHeader';

const sections = [
    {
        to: '/settings/login-history',
        title: 'Login history',
        description: 'See when and where your account was accessed.',
        icon: <HistoryIcon />,
        color: 'primary',
    },
    {
        to: '/settings/view-deleted-bookings',
        title: 'Deleted bookings',
        description: 'Review bookings you removed, or clear them for good.',
        icon: <DeleteSweepIcon />,
        color: 'secondary',
    },
];

const SettingsIcon = ({ color, children }) => (
    <Avatar
        variant="rounded"
        sx={(theme) => ({
            width: 44,
            height: 44,
            borderRadius: 2.5,
            bgcolor: alpha(theme.palette[color].main, 0.12),
            color: `${color}.main`,
        })}
    >
        {children}
    </Avatar>
);

// this page will be a little mini dashboard for the user settings.
// it will have buttons to go to /login-history,
function Settings() {
    const { mode, toggleTheme } = useThemeToggle();

    return (
        <Container maxWidth="md">
            <PageHeader eyebrow="Account" title="Settings" subtitle="Manage your account activity and preferences." />

            <Grid container spacing={2.5}>
                {sections.map(({ to, title, description, icon, color }) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={to}>
                        <Card sx={{ height: '100%', transition: 'border-color 0.2s ease', '&:hover': { borderColor: `${color}.main` } }}>
                            <CardActionArea component={Link} nativeButton={false} to={to} sx={{ height: '100%', p: 2.5, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <SettingsIcon color={color}>{icon}</SettingsIcon>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6">{title}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {description}
                                    </Typography>
                                </Box>
                                <ChevronRightIcon sx={{ color: 'text.secondary', alignSelf: 'center' }} />
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}

                <Grid size={12}>
                    <Typography variant="overline" color="text.secondary" component="h2" sx={{ display: 'block', mt: 2, mb: 1 }}>
                        Preferences
                    </Typography>
                    <Card>
                        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', p: 2.5 }}>
                            <SettingsIcon color="primary"><DarkModeIcon /></SettingsIcon>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" component="label" htmlFor="dark-mode-switch">Dark mode</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Easier on the eyes in low light. Saved on this device.
                                </Typography>
                            </Box>
                            <Switch id="dark-mode-switch" checked={mode === 'dark'} onChange={toggleTheme} />
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}



export default Settings;
