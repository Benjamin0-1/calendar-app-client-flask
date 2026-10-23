import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingState({ label, minHeight = '40vh' }) {
    return (
        <Box
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, minHeight }}
            role="status"
        >
            <CircularProgress size={36} thickness={4} />
            {label && (
                <Typography variant="body2" color="text.secondary">
                    {label}
                </Typography>
            )}
        </Box>
    );
}

export default LoadingState;
