// this is simply a success page after the user has confirmed their email.
// they will be redirected here from the server if the email confirmation was successful.
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import AuthCard from '../../components/AuthCard';

function EmailConfirmed() {
    const navigate = useNavigate();

    return (
        <AuthCard
            icon={<CheckCircleIcon />}
            iconColor="success"
            title="Email confirmed"
            subtitle="Your email address has been confirmed successfully. You're all set to log in."
        >
            <Button variant="contained" color="primary" size="large" onClick={() => navigate('/login')} fullWidth>
                Continue to log in
            </Button>
        </AuthCard>
    );
};

export default EmailConfirmed;
