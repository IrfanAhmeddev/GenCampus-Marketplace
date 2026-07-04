// =========================================
// GenCampus Marketplace
// Authentication Module
// Phase 1 - Frontend Validation
// =========================================

// ================================
// Show Feedback
// ================================
function showFeedback(message, type = "error") {
    const feedback = document.getElementById("auth-feedback");

    if (!feedback) return;

    feedback.textContent = message;
    feedback.className = `gc-feedback gc-feedback-${type}`;
    feedback.style.display = "block";
}

// ================================
// Clear Feedback
// ================================
function clearFeedback() {
    const feedback = document.getElementById("auth-feedback");

    if (!feedback) return;

    feedback.textContent = "";
    feedback.className = "gc-feedback";
    feedback.style.display = "none";
}

// ================================
// Email Validation
// ================================
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ================================
// Phone Validation
// ================================
function validatePhone(phone) {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
}

// ================================
// Password Validation
// ================================
function validatePassword(password) {
    return password.length >= 8;
}

// ================================
// Register
// ================================
async function handleRegister(event) {

    event.preventDefault();

    clearFeedback();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!fullName || !email || !phone || !password || !confirmPassword) {
        showFeedback("Please fill in all fields.");
        return;
    }

    if (!validateEmail(email)) {
        showFeedback("Please enter a valid email address.");
        return;
    }

    if (!validatePhone(phone)) {
        showFeedback("Phone number must be exactly 10 digits.");
        return;
    }

    if (!validatePassword(password)) {
        showFeedback("Password must be at least 8 characters.");
        return;
    }

    if (password !== confirmPassword) {
        showFeedback("Passwords do not match.");
        return;
    }

    showFeedback("Validation Successful ✅", "success");

    console.log("Registration Data");

    console.table({
        fullName,
        email,
        phone,
        password
    });

}

// ================================
// Login
// ================================
async function handleLogin(event) {

    event.preventDefault();

    clearFeedback();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showFeedback("Please fill in all fields.");
        return;
    }

    if (!validateEmail(email)) {
        showFeedback("Invalid email address.");
        return;
    }

    if (!validatePassword(password)) {
        showFeedback("Password must be at least 8 characters.");
        return;
    }

    showFeedback("Validation Successful ✅", "success");

    console.table({
        email,
        password
    });

}

// ================================
// Protect Route
// ================================
function protectRoute() {

    const token = localStorage.getItem("token");

    if (!token) {

        console.log("User not logged in.");

    }

}

// ================================
// Logout
// ================================
function logout() {

    localStorage.removeItem("token");

    window.location.href = "login.html";

}

// ================================
// Event Listeners
// ================================
document.addEventListener("DOMContentLoaded", () => {

    console.log("GenCampus Authentication Loaded Successfully");

    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    if (signupForm) {
        signupForm.addEventListener("submit", handleRegister);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

});