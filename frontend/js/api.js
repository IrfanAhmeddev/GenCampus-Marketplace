// =========================================
// GenCampus Marketplace
// API Configuration
// =========================================

// Change this when backend is deployed
const API_BASE_URL = "http://localhost:5000/api/v1";

// Authentication Endpoints
const API_ENDPOINTS = {
    signup: `${API_BASE_URL}/auth/signup`,
    login: `${API_BASE_URL}/auth/login`,
    profile: `${API_BASE_URL}/auth/me`
};