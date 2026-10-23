import { useEffect, useState } from "react";
import { CircularProgress, Box, Button, TextField, Stack } from '@mui/material';
import { toast } from 'react-toastify';
import LockResetIcon from '@mui/icons-material/LockReset';
import AuthCard from '../../components/AuthCard';
import PasswordField from '../../components/PasswordField';
import { useNavigate, useLocation } from 'react-router';

const API_URL = import.meta.env.VITE_API_URL;

// what this component does is that it will grab the email and otp from the query string, sent by the server.
// this provides a much smoother user experience, as the user doesn't have to enter the email and otp again, only the new password and confirm new password.

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const query = useQuery();
    const email = query.get('email');
    const otp = query.get('otp');

    useEffect(() => {
        if (!email || !otp) {
            navigate('/login');
        }
    }, [email, otp, navigate]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (newPassword !== confirmNewPassword) {
            toast.error("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp, newPassword, confirmNewPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Password reset successfully.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                toast.error(data.error || "Something went wrong.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthCard
            icon={<LockResetIcon />}
            title="Set a new password"
            subtitle={email ? `Choose a new password for ${email}.` : "Choose a new password for your account."}
        >
            <Box component="form" onSubmit={handleResetPassword}>
                <Stack spacing={2.5}>
                    <TextField
                        label="OTP"
                        type="text"
                        variant="outlined"
                        fullWidth
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <PasswordField
                        label="New Password"
                        autoComplete="new-password"
                        variant="outlined"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <PasswordField
                        label="Confirm New Password"
                        autoComplete="new-password"
                        variant="outlined"
                        fullWidth
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Update Password"}
                    </Button>
                </Stack>
            </Box>
        </AuthCard>
    );
}

export default ResetPassword;
