// =========================================
// GenCampus Marketplace
// Edit Product Page (Backend-Driven)
// =========================================

const params    = new URLSearchParams(window.location.search);
const productId = params.get("id");

const form            = document.getElementById("editProductForm");
const productIdInput   = document.getElementById("productId");
const imagePreview     = document.getElementById("imagePreview");
const productImageInput = document.getElementById("productImage");
const titleInput       = document.getElementById("title");
const categorySelect    = document.getElementById("category");
const priceInput       = document.getElementById("price");
const conditionSelect   = document.getElementById("condition");
const descriptionInput  = document.getElementById("description");
const locationInput     = document.getElementById("location");
const submitBtn         = form.querySelector("button[type='submit']");

// Newly selected image file, if the seller picks a replacement
// (preview only for now — not yet sent to the backend, see STEP 8)
let selectedImageFile = null;

// =========================================
// Loading / Error UI
// (No #editLoading / #errorBanner exist in the markup yet,
//  so we create lightweight ones and insert them above the form.
//  Feel free to replace with your own styled elements later.)
// =========================================
const statusBanner = document.createElement("div");
statusBanner.id = "editStatusBanner";
statusBanner.className = "gc-form-group";
statusBanner.style.display = "none";
form.parentNode.insertBefore(statusBanner, form);

function showStatus(message, type = "error") {
    statusBanner.textContent = message;
    statusBanner.style.display = "block";
    statusBanner.style.color = type === "error" ? "#c0392b" : "#2d6a4f";
}

function clearStatus() {
    statusBanner.style.display = "none";
    statusBanner.textContent = "";
}

function setFormDisabled(disabled) {
    Array.from(form.elements).forEach(el => (el.disabled = disabled));
}

// =========================================
// Helpers
// =========================================
function resolveImageUrl(url) {
    if (!url || url.startsWith("blob:")) {
        return "../assets/images/no-image.png";
    }
    return url;
}

// Matches a backend value like "like_new" or "Like New" to the right <option>
function setSelectValue(selectEl, rawValue) {
    if (!rawValue) return;

    const normalized = String(rawValue).toLowerCase().replace(/_/g, " ").trim();

    const match = Array.from(selectEl.options).find(opt =>
        opt.value.toLowerCase() === String(rawValue).toLowerCase() ||
        opt.textContent.toLowerCase().trim() === normalized
    );

    if (match) {
        selectEl.value = match.value;
    }
}

// =========================================
// Load Product
// =========================================
async function loadProduct() {
    if (!productId) {
        showStatus("No product specified.");
        setFormDisabled(true);
        return;
    }

    setFormDisabled(true);

    try {
        const response = await apiRequest(`/products/${productId}`);
        const product = response.data;

        productIdInput.value = product.id;
        titleInput.value = product.title || "";
        priceInput.value = product.price ?? "";
        descriptionInput.value = product.description || "";
        locationInput.value = product.location || "";
        imagePreview.src = resolveImageUrl(product.image_url);

        setSelectValue(categorySelect, product.category);
        setSelectValue(conditionSelect, product.condition);

        setFormDisabled(false);
    } catch (error) {
        console.error(error);
        showStatus("Failed to load product details.");
        setFormDisabled(true);
    }
}

// =========================================
// Preview a newly selected replacement image
// =========================================
productImageInput.addEventListener("change", () => {
    const file = productImageInput.files[0];
    if (!file) return;

    selectedImageFile = file;

    const reader = new FileReader();
    reader.onload = e => {
        imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

// =========================================
// Save Product
// =========================================
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearStatus();
    setFormDisabled(true);
    submitBtn.textContent = "Updating...";

    const updatedFields = {
        title: titleInput.value.trim(),
        category: categorySelect.value,
        price: Number(priceInput.value),
        condition: conditionSelect.value,
        description: descriptionInput.value.trim(),
        location: locationInput.value.trim()
    };

    try {
        await apiRequest(`/products/${productId}`, {
            method: "PUT",
            body: JSON.stringify(updatedFields)
        });

        window.location.href = "dashboard.html";
    } catch (error) {
        console.error(error);
        showStatus("Failed to update product.");
        setFormDisabled(false);
        submitBtn.textContent = "Update Product";
    }
});

// =========================================
// Initialize
// =========================================
loadProduct();