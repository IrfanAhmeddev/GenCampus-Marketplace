// =========================================
// GenCampus Navbar
// =========================================

console.log("Navbar Loaded");

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("token");

        alert("Logged out successfully.");

        window.location.href = "login.html";

    });

}