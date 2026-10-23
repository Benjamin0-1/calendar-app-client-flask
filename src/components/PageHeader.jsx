import { Box, Button, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router';

// Consistent title block for every page: optional back link, eyebrow, title, subtitle and actions on the right.
function PageHeader({ title, subtitle, eyebrow, actions, backTo, backLabel = 'Back' }) {
    return (
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
            {backTo && (
                <Button
                    component={Link} nativeButton={false}
                    to={backTo}
                    size="small"
                    startIcon={<ArrowBackIcon fontSize="small" />}
                    sx={{ mb: 2, ml: -1, color: 'text.secondary' }}
                >
                    {backLabel}
                </Button>
            )}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}
            >
                <Box sx={{ minWidth: 0 }}>
                    {eyebrow && (
                        <Typography variant="overline" color="primary" component="div">
                            {eyebrow}
                        </Typography>
                    )}
                    <Typography variant="h4" component="h1" sx={{ wordBreak: 'break-word' }}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                {actions && (
                    <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0, flexWrap: 'wrap', rowGap: 1.5 }}>
                        {actions}
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}

export default PageHeader;
