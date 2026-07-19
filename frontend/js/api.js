// =========================================
// GenCampus Marketplace
// API Configuration
// =========================================

// Change this when backend is deployed
const API_BASE_URL = "https://gencampus-backend.onrender.com/api/v1";

// =========================================
// API Endpoints
// =========================================

const API_ENDPOINTS = {
    // Authentication
    signup: "/auth/signup",
    login: "/auth/login",
    profile: "/auth/me",

    // Products
    products: "/products"
};

// =========================================
// Generic API Request Function
// =========================================
// =========================================
// Generic API Request Function
// =========================================

async function apiRequest(endpoint, options = {}) {

    const token = localStorage.getItem("token");

    const headers = {};

    // Add token if available
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    // Only add JSON header if body is NOT FormData
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const config = {
        ...options,
        headers: {
            ...headers,
            ...(options.headers || {})
        }
    };

    try {

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            config
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.message ||
                "Something went wrong."
            );
        }

        return data;

    } catch (error) {

        console.error("API Error:", error);
        throw error;

    }
}