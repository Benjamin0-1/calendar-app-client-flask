import LogOutIcon from '@mui/icons-material/Logout';
import React from 'react';
import { useNavigate } from 'react-router-dom';
// this is a logout button which will be rendered as an icon in the header.
// when clicked, it will remove all tokens and redirect the user to the login page.

// this button must be conditionally rendered.
// I could use the context API to conditionally render this button based on the user's authentication status.
function LogOutButton() {
    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessTokenExpiration');
        localStorage.removeItem('refreshTokenExpiration');
        navigate('/login');
    };

    return (
        <LogOutIcon onClick={handleLogOut} style={{ cursor: 'pointer' }} />
    );

};

export default LogOutButton;
