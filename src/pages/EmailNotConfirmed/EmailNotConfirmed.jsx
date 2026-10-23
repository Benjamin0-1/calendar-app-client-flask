import { useState } from "react";
import { Button, Box, Stack, TextField, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router";
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import AuthCard from '../../components/AuthCard';

const API_URL = import.meta.env.VITE_API_URL;

function EmailNotConfirmed() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleResendConfirmation = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/resend-email-confirmation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message || "Confirmation email resent successfully.");
            } else {
                toast.error(result.error || "Failed to resend confirmation email.");
            }
        } catch (err) {
            toast.error("Failed to resend confirmation email.");
            console.log(`Error resending confirmation email: ${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthCard
            icon={<MarkEmailUnreadIcon />}
            iconColor="warning"
            title="Confirm your email"
            subtitle="Your email address hasn't been confirmed yet. Check your inbox for the confirmation link, or request a new one below."
        >
            <Box
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleResendConfirmation();
                }}
            >
                <Stack spacing={2}>
                    <TextField
                        label="Email"
                        type="email"
                        autoComplete="email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button type="submit" variant="contained" color="primary" size="large" fullWidth disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Resend confirmation email"}
                    </Button>
                    <Button variant="text" color="inherit" onClick={() => navigate('/login')} fullWidth sx={{ color: 'text.secondary' }}>
                        Back to log in
                    </Button>
                </Stack>
            </Box>
        </AuthCard>
    );
}

export default EmailNotConfirmed;
