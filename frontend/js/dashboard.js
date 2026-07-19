// =========================================
// GenCampus Marketplace
// Seller Dashboard (Backend-Driven)
// =========================================

console.log("Dashboard Loaded");

// =========================================
// State
// =========================================
let products = [];
let isLoading = false;

// =========================================
// DOM Elements
// =========================================
const dashboardTable   = document.getElementById("dashboardTable");
const tableWrapper      = document.getElementById("tableWrapper");       // wraps <table>, hidden on empty state
const emptyState        = document.getElementById("emptyState");        // "No Products Found" block
const loadingSpinner     = document.getElementById("dashboardLoading");  // spinner shown while fetching
const errorBanner        = document.getElementById("errorBanner");       // friendly error message container
const searchInput        = document.getElementById("searchInput");

// =========================================
// Error / Status UI Helpers
// (Replaces alert() with inline friendly messages)
// =========================================
function showError(message) {
    if (!errorBanner) {
        console.error(message);
        return;
    }
    errorBanner.textContent = message;
    errorBanner.classList.add("active");

    clearTimeout(showError._timeout);
    showError._timeout = setTimeout(() => {
        errorBanner.classList.remove("active");
    }, 4000);
}

function clearError() {
    if (errorBanner) errorBanner.classList.remove("active");
}

function setLoading(state) {
    isLoading = state;

    if (loadingSpinner) {
        loadingSpinner.style.display = state ? "flex" : "none";
    }

    // Disable all action buttons while a request is in-flight
    document.querySelectorAll("button").forEach(btn => {
        btn.disabled = state;
    });
}

// =========================================
// Load Products (Backend)
// =========================================
async function loadMyProducts() {
    setLoading(true);
    clearError();

    try {
        const response = await apiRequest("/products/my-products");
        products = response.data || [];
        renderDashboard(products);
    } catch (error) {
        console.error(error);
        products = [];
        renderDashboard(products);
        showError("Failed to load products");
    } finally {
        setLoading(false);
    }
}

// =========================================
// Load Notification Count (Backend)
// -----------------------------------------
// STEP 5: Requests API now exists, so the
// requestBtn badge can populate on load.
// Purchases still has no backend endpoint yet.
// =========================================
async function loadNotificationCount(){

    try{

        const res = await apiRequest("/requests");

        document.querySelector("#requestBtn .gc-badge")
            .textContent = res.count;

    }

    catch{

        document.querySelector("#requestBtn .gc-badge")
            .textContent = 0;

    }

}

// =========================================
// Load Purchase Count (Backend)
// =========================================
async function loadPurchaseCount(){

    try{

        const res = await apiRequest("/requests/my-purchases");

        document.querySelector("#purchaseBtn .gc-badge")
            .textContent = res.count;

    }

    catch{

        document.querySelector("#purchaseBtn .gc-badge")
            .textContent = 0;

    }

}

// =========================================
// Image Helper
// -----------------------------------------
// STEP 1 & 7: via.placeholder.com is unreliable
// (and blob: URLs die after refresh since they're
// only valid for the current browser session).
// Always fall back to a local placeholder asset
// instead of an external service.
// =========================================
function resolveImageUrl(url) {
    if (!url || url.startsWith("blob:")) {
        return "../assets/images/no-image.png";
    }
    return url;
}

// =========================================
// Render Dashboard
// =========================================
function renderDashboard(list = products) {
    dashboardTable.innerHTML = "";

    if (!list || list.length === 0) {
        if (tableWrapper) tableWrapper.style.display = "none";
        if (emptyState) emptyState.style.display = "flex";
        updateStatistics();
        return;
    }

    if (tableWrapper) tableWrapper.style.display = "";
    if (emptyState) emptyState.style.display = "none";

    list.forEach(product => {
        dashboardTable.innerHTML += `
            <tr>
                <td>
                    <img src="${resolveImageUrl(product.image_url)}" width="80"
                         onerror="this.onerror=null;this.src='../assets/images/no-image.png';">
                </td>

                <td>${product.title}</td>

                <td>${formatCurrency(product.price)}</td>

                <td>
                    <span class="gc-status ${product.status}">
                        ${product.status === "available" ? "Available" : "Sold"}
                    </span>
                </td>

                <td>
                    <div class="gc-action-group">
                        <button
                            class="gc-btn gc-btn-secondary gc-btn-small"
                            onclick="editProduct('${product.id}')">
                            Edit
                        </button>

                        <button
                            class="gc-btn gc-btn-success gc-btn-small"
                            onclick="toggleStatus('${product.id}')">
                            ${product.status === "available" ? "Mark Sold" : "Mark Available"}
                        </button>

                        <button
                            class="gc-btn gc-btn-danger gc-btn-small"
                            onclick="deleteProduct('${product.id}')">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    updateStatistics();
}

// =========================================
// Statistics (Derived from loaded backend products)
// =========================================
function updateStatistics() {
    document.getElementById("totalProducts").textContent = products.length;

    document.getElementById("availableProducts").textContent =
        products.filter(p => p.status === "available").length;

    document.getElementById("soldProducts").textContent =
        products.filter(p => p.status === "sold").length;
}

// =========================================
// Search (Client-side filter of already-loaded products only)
// =========================================
if (searchInput) {
    searchInput.addEventListener("keyup", () => {
        const keyword = searchInput.value.toLowerCase();

        const filtered = products.filter(product =>
            product.title.toLowerCase().includes(keyword) ||
            product.status.toLowerCase().includes(keyword)
        );

        renderDashboard(filtered);
    });
}

// =========================================
// Drawer Elements
// -----------------------------------------
// Still declared because closeDrawer/overlay
// listeners below reference them. They will be
// unused in practice until the Requests/Purchases
// buttons are re-enabled in Step 2/3.
// =========================================
const drawer        = document.getElementById("sideDrawer");
const overlay        = document.getElementById("overlay");
const drawerTitle     = document.getElementById("drawerTitle");
const drawerContent   = document.getElementById("drawerContent");

// =========================================
// STEP 8: Mock-data drawer renderer removed.
// Re-add this only once GET /requests/my-requests
// and GET /purchases/my-purchases are real backend
// endpoints, so this always renders live data.
// =========================================
// function renderDrawerItems(data, type) {
//     drawerContent.innerHTML = "";
//
//     if (!data || data.length === 0) {
//         drawerContent.innerHTML = `<p class="gc-drawer-empty">Nothing to show yet.</p>`;
//         return;
//     }
//
//     data.forEach(item => {
//         if (type === "request") {
//             drawerContent.innerHTML += `
//                 <div class="gc-drawer-item">
//                     <h4>${item.product}</h4>
//                     <p>Requested by: ${item.student}</p>
//                     <span class="gc-drawer-status ${item.status.toLowerCase()}">
//                         ${item.status}
//                     </span>
//                 </div>
//             `;
//         } else {
//             drawerContent.innerHTML += `
//                 <div class="gc-drawer-item">
//                     <h4>${item.product}</h4>
//                     <p>${formatCurrency(item.price)}</p>
//                 </div>
//             `;
//         }
//     });
// }

async function acceptRequest(id){

    await apiRequest(`/requests/${id}/accept`,{

        method:"PATCH"

    });

    document.getElementById("requestBtn").click();

    loadMyProducts();

}

async function rejectRequest(id){

    await apiRequest(`/requests/${id}/reject`,{

        method:"PATCH"

    });

    document.getElementById("requestBtn").click();

}

function openDrawer(title) {
    drawerTitle.textContent = title;
    drawer.classList.add("active");
    overlay.classList.add("active");
}

function closeDrawer() {
    drawer.classList.remove("active");
    overlay.classList.remove("active");
}

// =========================================
// Requests Button
// =========================================
document.getElementById("requestBtn").addEventListener("click", async () => {

    openDrawer("Product Requests");

    drawerContent.innerHTML =
        "<p>Loading requests...</p>";

    try {

        const response = await apiRequest("/requests");

        renderRequests(response.data);

        document.querySelector("#requestBtn .gc-badge")
            .textContent = response.count;

    } catch (err) {

        drawerContent.innerHTML =
            "<p>Unable to load requests.</p>";

    }

});

function renderRequests(requests) {

    drawerContent.innerHTML = "";

    if (!requests.length) {

        drawerContent.innerHTML = `
            <p>No requests found.</p>
        `;

        return;
    }

    requests.forEach(request => {

        drawerContent.innerHTML += `

        <div class="gc-drawer-item">

            <img
                src="${resolveImageUrl(request.product.image_url)}"
                width="80">

            <h4>${request.product.title}</h4>

            <p>₹${request.product.price}</p>

            <p>
                Buyer:
                <strong>${request.buyer.full_name}</strong>
            </p>

            <p>${request.buyer.email}</p>

            <span class="gc-status ${request.status}">
                ${request.status}
            </span>

            <div class="gc-action-group">

                <button
                    class="gc-btn gc-btn-success gc-btn-small"
                    onclick="acceptRequest('${request.id}')">

                    Accept

                </button>

                <button
                    class="gc-btn gc-btn-danger gc-btn-small"
                    onclick="rejectRequest('${request.id}')">

                    Reject

                </button>

            </div>

        </div>

        <hr>

        `;

    });

}

// =========================================
// Purchases Button
// =========================================
document.getElementById("purchaseBtn").addEventListener("click", async () => {

    openDrawer("My Purchases");

    drawerContent.innerHTML =
        "<p>Loading purchases...</p>";

    try {

        const response = await apiRequest("/requests/my-purchases");

        renderPurchases(response.data);

        document.querySelector("#purchaseBtn .gc-badge")
            .textContent = response.count;

    } catch (err) {

        drawerContent.innerHTML =
            "<p>Unable to load purchases.</p>";

    }

});

function renderPurchases(purchases) {

    drawerContent.innerHTML = "";

    if (!purchases.length) {

        drawerContent.innerHTML = `
            <p>No purchases found.</p>
        `;

        return;
    }

    purchases.forEach(purchase => {

        drawerContent.innerHTML += `

        <div class="gc-drawer-item">

            <img
                src="${resolveImageUrl(purchase.product.image_url)}"
                width="80">

            <h4>${purchase.product.title}</h4>

            <p>₹${purchase.product.price}</p>

            <p>
                Seller:
                <strong>${purchase.seller.full_name}</strong>
            </p>

            <p>${purchase.seller.email}</p>

            <span class="gc-status ${purchase.status}">
                ${purchase.status}
            </span>

        </div>

        <hr>

        `;

    });

}

// =========================================
// Close Events
// =========================================
document.getElementById("closeDrawer").addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);

document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        closeDrawer();
    }
});

// =========================================
// Edit
// -----------------------------------------
// STEP 6: edit-product.html now exists, so
// navigate to it directly with the product id.
// =========================================
function editProduct(id) {
    window.location.href = `edit-product.html?id=${id}`;
}

// =========================================
// Delete (Backend-driven, permanent)
// =========================================
async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    setLoading(true);
    clearError();

    try {
        await apiRequest(`/products/${id}`, { method: "DELETE" });
        await loadMyProducts();
    } catch (error) {
        console.error(error);
        showError("Unable to delete product");
    } finally {
        setLoading(false);
    }
}

// =========================================
// Toggle Status (Backend-driven)
// =========================================
async function toggleStatus(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newStatus = product.status === "available" ? "sold" : "available";

    setLoading(true);
    clearError();

    try {
        await apiRequest(`/products/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status: newStatus })
        });
        await loadMyProducts();
    } catch (error) {
        console.error(error);
        showError("Status update failed");
    } finally {
        setLoading(false);
    }
}

// =========================================
// Initialize
// =========================================
loadMyProducts();
loadNotificationCount();
loadPurchaseCount();