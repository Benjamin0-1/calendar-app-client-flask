const API_URL = import.meta.env.VITE_API_URL;

const refreshToken = localStorage.getItem('refreshToken');


const minutesToMilliseconds = (minutes) => minutes * 60 * 1000; // convert milliseconds to minutes

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
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh access token');
        }

        const data = await response.json();

   
        const { access_token, expires_in } = data;

        const expiresInMilliseconds = minutesToMilliseconds(parseInt(expires_in, 10));

        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('accessTokenExpiration', Date.now() + expiresInMilliseconds); 
    } catch (error) {
        console.error('Error refreshing access token:', error);

    };
};


async function FetchWithAuth(url, options) {
    let accessToken = localStorage.getItem('accessToken');
    const tokenExpiration = parseInt(localStorage.getItem('accessTokenExpiration'), 10);
    const refreshTokenExpiration = parseInt(localStorage.getItem('refreshTokenExpiration'), 10);
    const currentTime = Date.now();

    try {
        // Check if access token is expired
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
            },
        });

        // If response status is 401, try to refresh the token and retry
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
}

export default FetchWithAuth;



// instead of using 2 separate functions, we can combine them into one function that handles both the access token and the refresh token.

/**
 * Can simply use this inside of every component that needs to be protected.
 *     useEffect(() => {
        refreshToken = localStorage.getItem('refreshToken');
        refreshTokenExpiration = localStorage.getItem('refreshTokenExpiration');
        if (!refreshToken {
            navigate("/login");
        }
        if (new Date().getTime() > refreshTokenExpiration) {
            navigate("/login");
        }
    }, [refreshToken, refreshTokenExpiration]);
    // if the refreshToken is invalid or expired, the user will be redirected to the login page.
    // otherwise the access token will be refreshed and the user will be able to access the page.
 */