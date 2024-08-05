const API_URL = import.meta.env.VITE_API_URL;

const refreshToken = localStorage.getItem('refreshToken');

// Function to convert days to milliseconds
const daysToMilliseconds = (days) => days * 24 * 60 * 60 * 1000;

// Refresh the access token
async function refreshAccessToken() {
    try {
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await fetch(`${API_URL}/auth/access-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken })
        });

        if (!response.ok) {
            throw new Error('Failed to refresh access token');
        }

        const data = await response.json();

        // Save new access token and its expiration time
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('accessTokenExpiration', Date.now() + parseInt(data.access_token_expires_in) * 60 * 1000); // Convert minutes to milliseconds

        // Save refresh token expiration time
        localStorage.setItem('refreshTokenExpiration', Date.now() + daysToMilliseconds(parseInt(data.refresh_token_expires_in)));
    } catch (error) {
        console.error('Error refreshing access token:', error);
        // Handle token refresh errors (e.g., redirect to login if necessary)
    }
}

// Fetch with authentication
async function FetchWithAuth(url, options) {
    let accessToken = localStorage.getItem('accessToken');
    const tokenExpiration = localStorage.getItem('accessTokenExpiration');
    const refreshTokenExpiration = localStorage.getItem('refreshTokenExpiration');
    const currentTime = new Date().getTime();

    try {
        if (!accessToken || currentTime > tokenExpiration) {
            // Check if refresh token is valid and refresh access token if needed
            if (refreshToken && currentTime < refreshTokenExpiration) {
                await refreshAccessToken();
                accessToken = localStorage.getItem('accessToken'); // Update accessToken after refreshing
            } else {
                // Redirect to login if no valid refresh token
                throw new Error('Refresh token is invalid or expired');
            }
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`,
            }
        });

        if (response.status === 401) {
            await refreshAccessToken(); // Try refreshing the token if 401 error occurs
            accessToken = localStorage.getItem('accessToken'); // Update accessToken after refreshing
            return FetchWithAuth(url, options); // Retry the request
        }

        return response;
    } catch (error) {
        console.error('Error fetching with authentication:', error);
        throw new Error('Failed to fetch with authentication');
    }
};

export default FetchWithAuth;
