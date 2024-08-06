import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FetchWithAuth from "./FetchWithAuthentication";


// this function works along the FetchWithAuthentication one.
// together, they are able to provide a seamless experience for the user.
// they cover all scenarios, from the user not being logged in, to the access token expiring, to the refresh token expiring.
// only when absolutely necessary, the user is redirected to the login page.

// Higher-order component to check if the user is logged in
export default function withAuth(Component) {
    return function WrappedComponent(props) {
        const [isAuthenticated, setIsAuthenticated] = useState(null); // `null` means checking
        const navigate = useNavigate();

        useEffect(() => {
            const checkAuthentication = async () => {
                const accessToken = localStorage.getItem('accessToken');
                const refreshToken = localStorage.getItem('refreshToken');
                const accessTokenExpiration = localStorage.getItem('accessTokenExpiration');
                const refreshTokenExpiration = localStorage.getItem('refreshTokenExpiration');
                const currentTime = new Date().getTime();

                if (!accessToken || !refreshToken) {
                    // No tokens, redirect to login
                    setIsAuthenticated(false);
                    navigate("/login");
                    return;
                }

                if (currentTime > refreshTokenExpiration) {
                    // Refresh token expired, redirect to login
                    localStorage.removeItem('accessToken'); // Remove tokens
                    setIsAuthenticated(false);
                    navigate("/login");
                    return;
                }

                if (currentTime < accessTokenExpiration) {
                    // Access token is still valid
                    setIsAuthenticated(true);
                } else {
                    // Access token expired, refresh it
                    try {
                        await refreshAccessToken();
                        setIsAuthenticated(true);
                    } catch (error) {
                        setIsAuthenticated(false);
                        navigate("/login");
                    }
                }
            };

            checkAuthentication();
        }, [navigate]);

        if (isAuthenticated === null) {
            return <div>Loading...</div>; // or any loading component you prefer
        }

        return isAuthenticated ? <Component {...props} /> : null;
    };
};

// instead of using this to keep the user from accesssing a page,
// I can now simply check the refreshToken expiracy inside of the components to be protected.

/**useEffect(() => {
        const refreshTokenExpiration = localStorage.getItem('refreshTokenExpiration');

        if (!refreshTokenExpiration || isTokenExpired(refreshTokenExpiration)) {
            // Refresh token is invalid or expired, redirect to login
            navigate("/login");
        }
    }, [navigate]);

    const isTokenExpired = (expiration) => {
    const currentTime = Date.now();
    const expirationTime = new Date(expiration).getTime();
    return currentTime > expirationTime;
};

// NO need to convert to days, because that's already done at login time, and when it is refreshed.

 */