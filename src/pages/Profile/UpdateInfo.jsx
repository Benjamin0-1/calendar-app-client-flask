import React, { useState, useEffect } from "react";
import { Typography, Container, Grid, Box, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchWithAuth from "../../utils/FetchWithAuthentication";

function UpdateInfo() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
    });

    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/profile`, {}, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

        } catch (err) {
            setError("Failed to update user info");
            console.log(`Error updating user info: ${err}`);
        } finally {
            setIsLoading(false);
        };
    };

    return <div>

    </div>


};

export default UpdateInfo;
