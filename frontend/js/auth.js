// =========================================
// GenCampus Marketplace
// Authentication Module
// Backend Integrated
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
// Validation Helpers
// ================================
function validateEmail(email) {

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);

}

function validatePhone(phone) {

    return /^[0-9]{10}$/.test(phone);

}

function validatePassword(password) {

    return password.length >= 8;

}

// =========================================
// Register
// =========================================
async function handleRegister(event) {

    event.preventDefault();

    clearFeedback();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validation

    if (!fullName || !email || !phone || !password || !confirmPassword) {

        showFeedback("Please fill in all fields.");
        return;

    }

    if (!validateEmail(email)) {

        showFeedback("Please enter a valid email.");
        return;

    }

    if (!validatePhone(phone)) {

        showFeedback("Phone number must contain 10 digits.");
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

    try {

        const response = await apiRequest(API_ENDPOINTS.signup, {

            method: "POST",

            body: JSON.stringify({

                email,
                password,
                full_name: fullName,
                college_name: "SRM Institute of Science and Technology"

            })

        });

        showFeedback(response.message, "success");

        setTimeout(() => {

            window.location.href = "login.html";

        }, 1500);

    }

    catch (error) {

        showFeedback(error.message);

    }

}

// =========================================
// Login
// =========================================
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

        showFeedback("Invalid email.");
        return;

    }

    if (!validatePassword(password)) {

        showFeedback("Password must be at least 8 characters.");
        return;

    }

    try {

      const response = await apiRequest(API_ENDPOINTS.login, {
    method: "POST",
    body: JSON.stringify({
        email,
        password
    })
});

console.log(response);

localStorage.setItem("token", response.token);
localStorage.setItem("user", JSON.stringify(response.user));

        showFeedback("Login Successful!", "success");

        setTimeout(() => {

            window.location.href = "products.html";

        }, 1000);

    }

    catch (error) {

        showFeedback(error.message);

    }

}

// =========================================
// Get Current User
// =========================================
async function getCurrentUser() {

    try {

        const response = await apiRequest(API_ENDPOINTS.profile);

        return response.user;

    }

    catch (error) {

        console.error(error);

        logout();

    }

}

// =========================================
// Protect Routes
// =========================================
function protectRoute() {

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href = "login.html";

    }

}

// =========================================
// Logout
// =========================================
function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "login.html";

}

// =========================================
// Event Listeners
// =========================================
document.addEventListener("DOMContentLoaded", () => {

    console.log("GenCampus Authentication Loaded");

    const signupForm = document.getElementById("signupForm");

    const loginForm = document.getElementById("loginForm");

    if (signupForm) {

        signupForm.addEventListener("submit", handleRegister);

    }

    if (loginForm) {

        loginForm.addEventListener("submit", handleLogin);

    }

});