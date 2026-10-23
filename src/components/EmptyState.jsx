import { Avatar, Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

function EmptyState({ icon, title, description, action }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                px: 3,
                py: { xs: 6, md: 8 },
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 4,
            }}
        >
            {icon && (
                <Avatar
                    sx={(theme) => ({
                        width: 64,
                        height: 64,
                        mb: 2.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                    })}
                >
                    {icon}
                </Avatar>
            )}
            <Typography variant="h6" component="h2">
                {title}
            </Typography>
            {description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 420 }}>
                    {description}
                </Typography>
            )}
            {action && <Box sx={{ mt: 3 }}>{action}</Box>}
        </Box>
    );
}

export default EmptyState;
