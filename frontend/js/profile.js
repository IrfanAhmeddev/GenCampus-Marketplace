// =========================================
// GenCampus Marketplace
// Profile Module
// =========================================

console.log("Profile Module Loaded Successfully");

// =========================================
// Mock User Data
// (Replace with API response later)
// =========================================

const user = {
    fullName: "Santhosh",
    email: "santhosh@college.edu",
    phone: "9876543210",
    department: "Computer Science Engineering",
    college: "ABC Engineering College",
    memberSince: "January 2026",
    avatar: "https://via.placeholder.com/180",
    productsListed: 12,
    productsSold: 8,
    requestsReceived: 21,
    activeListings: 4
};

// =========================================
// Load Profile
// =========================================

function loadProfile() {

    document.getElementById("profileAvatar").src = user.avatar;

    document.getElementById("profileName").textContent = user.fullName;

    document.getElementById("profileDepartment").textContent = user.department;

    document.getElementById("fullName").textContent = user.fullName;

    document.getElementById("email").textContent = user.email;

    document.getElementById("phone").textContent = user.phone;

    document.getElementById("department").textContent = user.department;

    document.getElementById("college").textContent = user.college;

    document.getElementById("memberSince").textContent = user.memberSince;

    document.getElementById("productsListed").textContent = user.productsListed;

    document.getElementById("productsSold").textContent = user.productsSold;

    document.getElementById("requestsReceived").textContent = user.requestsReceived;

    document.getElementById("activeListings").textContent = user.activeListings;

}

// =========================================
// Edit Profile
// =========================================

function editProfile() {

    alert("Edit Profile feature will be connected to the backend soon.");

}

// =========================================
// Change Password
// =========================================

function changePassword() {

    alert("Change Password feature coming soon.");

}

// =========================================
// Logout
// =========================================

function logout() {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    localStorage.removeItem("token");

    alert("Logged out successfully.");

    window.location.href = "login.html";

}

// =========================================
// Event Listeners
// =========================================

document
    .getElementById("editProfileBtn")
    .addEventListener("click", editProfile);

document
    .getElementById("changePasswordBtn")
    .addEventListener("click", changePassword);

document
    .getElementById("logoutBtn")
    .addEventListener("click", logout);

// =========================================
// Initialize
// =========================================

loadProfile();