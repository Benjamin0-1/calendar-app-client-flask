const API_URL = process.env.REACT_APP_URL

const refreshToken = localStorage.getItem('refreshToken');

async function refreshAccessToken() {
    try {

        if (!refreshToken) {
            throw new Error('No refresh token found');
        } // if no refreshToken then user will simply have to re login.

        const response = await fetch(`${API_URL}/access-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken })
        });

        if (!response.ok) {
            throw new Error('Failed to refresh access token');
        }

        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
    } catch (error) {
        console.error('Error refreshing access token:', error);
    }
}



async function FetchWithAuth(url ,options) {
    let accessToken = localStorage.getItem('accessToken');

    try {
        const tokenExpiration = localStorage.getItem('accessTokenExpiration');
        const currentTime = new Date().getTime();

        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`,
            }
        });

        if (response.status === 401) {

            await refreshAccessToken();

            accessToken = localStorage.getItem('accessToken');
            return FetchWithAuth(url, options); 
        }

        return response;
    } catch (error) {
        console.error('Error fetching with authentication:', error);
        throw new Error('Failed to fetch with authentication');
    }
}

export default FetchWithAuth;