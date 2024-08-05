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
                    setIsAuthenticated(false);
                    navigate("/login");
                    return;
                }

                // Check access token validity
                if (currentTime > accessTokenExpiration) {
                    // Attempt to refresh the access token
                    try {
                        await refreshAccessToken();
                        const newAccessToken = localStorage.getItem('accessToken');
                        const newAccessTokenExpiration = localStorage.getItem('accessTokenExpiration');

                        if (newAccessToken && newAccessTokenExpiration && currentTime < newAccessTokenExpiration) {
                            setIsAuthenticated(true); // Token refreshed successfully
                            return;
                        }
                    } catch (error) {
                        console.error('Error during token refresh:', error);
                    }

                    // Refresh token failed or expired, redirect to login
                    setIsAuthenticated(false);
                    navigate("/login");
                } else {
                    setIsAuthenticated(true); // Token is still valid
                }
            };

            checkAuthentication();
        }, [navigate]);

        if (isAuthenticated === null) {
            return <div>Loading...</div>; // or any loading component you prefer
        }

        return isAuthenticated ? <Component {...props} /> : null;
    };
}
