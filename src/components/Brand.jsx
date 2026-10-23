import { Box, Typography } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Link } from 'react-router';

function Brand({ to = '/', onClick }) {
    return (
        <Box
            component={Link}
            to={to}
            onClick={onClick}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.25, color: 'text.primary', textDecoration: 'none' }}
        >
            <Box
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    color: 'primary.contrastText',
                    background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                }}
            >
                <EventAvailableIcon sx={{ fontSize: 19 }} />
            </Box>
            <Typography variant="subtitle1" component="span" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                Multi-Booking
            </Typography>
        </Box>
    );
}

export default Brand;
