import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
        // Add any other common headers here
    },
});

// Set default headers for all requests
apiClient.interceptors.request.use(
    (config) => {
        const token =
            typeof window !== "undefined" ? localStorage.getItem("token") : null
        if (token) {
            if (!config.headers) {
                config.headers = {} as import("axios").AxiosRequestHeaders;
            }
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Set specific headers for POST requests
apiClient.defaults.headers.post['Accept'] = 'application/json';

export default apiClient;
