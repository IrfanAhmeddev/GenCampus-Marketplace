// =========================================
// GenCampus Marketplace
// Utility Functions
// =========================================

// ================================
// Format Currency
// ================================
function formatCurrency(amount) {
    return `₹${Number(amount).toLocaleString("en-IN")}`;
}

// ================================
// Format Date
// ================================
function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN");
}

// ================================
// Show Element
// ================================
function showElement(element) {
    if (element) {
        element.style.display = "block";
    }
}

// ================================
// Hide Element
// ================================
function hideElement(element) {
    if (element) {
        element.style.display = "none";
    }
}

// ================================
// Loading Button
// ================================
function setButtonLoading(button, isLoading, text = "Submit") {

    if (!button) return;

    if (isLoading) {
        button.disabled = true;
        button.textContent = "Loading...";
    } else {
        button.disabled = false;
        button.textContent = text;
    }

}

// ================================
// Get Token
// ================================
function getToken() {
    return localStorage.getItem("token");
}

// ================================
// Save Token
// ================================
function saveToken(token) {
    localStorage.setItem("token", token);
}

// ================================
// Remove Token
// ================================
function removeToken() {
    localStorage.removeItem("token");
}

// ================================
// Logout
// ================================
function logout() {

    removeToken();

    window.location.href = "../pages/login.html";

}