import { Avatar, Box, Card, CardContent, Container, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

// Centered card used by login, signup, password and email-confirmation pages.
function AuthCard({ icon, iconColor = 'primary', title, subtitle, children, footer, maxWidth = 'xs' }) {
    return (
        <Container maxWidth={maxWidth} sx={{ display: 'flex', alignItems: 'center', minHeight: { sm: '70vh' } }}>
            <Card sx={{ width: '100%', boxShadow: '0 12px 40px -12px rgba(15, 23, 42, 0.15)' }}>
                <CardContent sx={{ p: { xs: 3, sm: 4.5 }, '&:last-child': { pb: { xs: 3, sm: 4.5 } } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 3.5 }}>
                        {icon && (
                            <Avatar
                                sx={(theme) => ({
                                    width: 56,
                                    height: 56,
                                    mb: 2,
                                    bgcolor: alpha(theme.palette[iconColor].main, 0.12),
                                    color: `${iconColor}.main`,
                                })}
                            >
                                {icon}
                            </Avatar>
                        )}
                        <Typography variant="h5" component="h1">
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 360 }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    {children}
                    {footer && (
                        <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
                            {footer}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}

export default AuthCard;
