// =========================================
// GenCampus Marketplace
// API Configuration
// =========================================

// Change this when backend is deployed
const API_BASE_URL = "http://localhost:5000/api/v1";

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

async function apiRequest(endpoint, options = {}) {

    const token = localStorage.getItem("token");

    const config = {

        headers: {
            "Content-Type": "application/json",
            ...(token && {
                Authorization: `Bearer ${token}`
            })
        },

        ...options

    };

    try {

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            config
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message || "Something went wrong.");

        }

        return data;

    } catch (error) {

        console.error("API Error:", error);

        throw error;

    }

}