// =========================================
// GenCampus Marketplace
// Sell Product Module
// =========================================

console.log("Sell Product Loaded");

const MAX_IMAGES = 5;

// ------------------------------
// DOM references
// ------------------------------
const sellForm = document.getElementById("sellForm");
const formFeedback = document.getElementById("formFeedback");
const publishBtn = document.getElementById("publishBtn");

const dropzone = document.getElementById("dropzone");
const imageInput = document.getElementById("productImage");
const imageGrid = document.getElementById("imageGrid");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const categorySelect = document.getElementById("category");
const locationInput = document.getElementById("location");
const priceInput = document.getElementById("price");
const originalPriceInput = document.getElementById("originalPrice");
const conditionChips = document.querySelectorAll("#conditionChips .gc-chip");
const conditionSelect = document.getElementById("condition");

// Preview elements
const previewPlaceholder = document.getElementById("previewPlaceholder");
const previewImage = document.getElementById("previewImage");
const previewCategory = document.getElementById("previewCategory");
const previewCondition = document.getElementById("previewCondition");
const previewTitle = document.getElementById("previewTitle");
const previewLocation = document.getElementById("previewLocation");
const previewPrice = document.getElementById("previewPrice");
const previewOriginalPrice = document.getElementById("previewOriginalPrice");
const previewDiscount = document.getElementById("previewDiscount");

// ------------------------------
// State
// ------------------------------
let images = []; // { id, file, url }
let imageIdCounter = 0;
let selectedCondition = "";

// ==================================================
// Image upload — click, drag & drop, thumbnails
// ==================================================

function addFiles(fileList) {
  const incoming = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
  const room = MAX_IMAGES - images.length;

  if (room <= 0) {
    setFieldError("images", `You can upload up to ${MAX_IMAGES} photos.`);
    return;
  }

  incoming.slice(0, room).forEach((file) => {
    images.push({ id: imageIdCounter++, file, url: URL.createObjectURL(file) });
  });

  if (incoming.length > room) {
    setFieldError("images", `Only ${MAX_IMAGES} photos allowed — extra files were skipped.`);
  } else {
    clearFieldError("images");
  }

  renderImageGrid();
  syncPreview();
}

function removeImage(id) {
  images = images.filter((img) => img.id !== id);
  renderImageGrid();
  syncPreview();
}

function renderImageGrid() {
  imageGrid.innerHTML = images
    .map(
      (img, index) => `
      <div class="gc-image-thumb">
        <img src="${img.url}" alt="Product photo ${index + 1}">
        ${index === 0 ? '<span class="gc-cover-tag">Cover</span>' : ""}
        <button type="button" class="gc-remove-thumb" data-id="${img.id}" aria-label="Remove photo ${index + 1}">✕</button>
      </div>
    `
    )
    .join("");
}

dropzone.addEventListener("click", () => imageInput.click());
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    imageInput.click();
  }
});

imageInput.addEventListener("change", (e) => addFiles(e.target.files));

["dragenter", "dragover"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add("is-dragover");
  })
);

["dragleave", "drop"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove("is-dragover");
  })
);

dropzone.addEventListener("drop", (e) => {
  if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
});

imageGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".gc-remove-thumb");
  if (!btn) return;
  removeImage(Number(btn.dataset.id));
});

// ==================================================
// Condition chips (kept in sync with hidden #condition select)
// ==================================================

conditionChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    selectedCondition = chip.dataset.value;
    conditionSelect.value = selectedCondition;
    conditionChips.forEach((c) => c.setAttribute("aria-checked", String(c === chip)));
    clearFieldError("condition");
    syncPreview();
  });
});

// ==================================================
// Character counters
// ==================================================

function bindCharCount(input, countEl, max) {
  input.addEventListener("input", () => {
    countEl.textContent = `${input.value.length}/${max}`;
  });
}

bindCharCount(titleInput, document.getElementById("count-title"), 80);
bindCharCount(descriptionInput, document.getElementById("count-description"), 500);

// ==================================================
// Live preview
// ==================================================

function syncPreview() {
  // Image
  if (images.length > 0) {
    previewImage.src = images[0].url;
    previewImage.hidden = false;
    previewPlaceholder.hidden = true;
  } else {
    previewImage.hidden = true;
    previewPlaceholder.hidden = false;
  }

  // Category badge
  if (categorySelect.value) {
    previewCategory.textContent = categorySelect.value;
    previewCategory.hidden = false;
  } else {
    previewCategory.hidden = true;
  }

  // Condition badge
  if (selectedCondition) {
    previewCondition.textContent = selectedCondition;
    previewCondition.hidden = false;
  } else {
    previewCondition.hidden = true;
  }

  // Title
  previewTitle.textContent = titleInput.value.trim() || "Your product title";

  // Location
  if (locationInput.value.trim()) {
    previewLocation.textContent = `📍 ${locationInput.value.trim()}`;
    previewLocation.hidden = false;
  } else {
    previewLocation.hidden = true;
  }

  // Price / original price / discount
  const price = Number(priceInput.value);
  const originalPrice = Number(originalPriceInput.value);

  previewPrice.textContent = price > 0 ? `₹${price.toLocaleString("en-IN")}` : "₹0";

  if (originalPrice > 0 && price > 0 && originalPrice > price) {
    previewOriginalPrice.textContent = `₹${originalPrice.toLocaleString("en-IN")}`;
    previewOriginalPrice.hidden = false;
    const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
    previewDiscount.textContent = `${pct}% off`;
    previewDiscount.hidden = false;
  } else {
    previewOriginalPrice.hidden = true;
    previewDiscount.hidden = true;
  }
}

[titleInput, categorySelect, locationInput, priceInput, originalPriceInput].forEach((el) =>
  el.addEventListener("input", syncPreview)
);
categorySelect.addEventListener("change", syncPreview);

// ==================================================
// Inline validation (replaces alert())
// ==================================================

function setFieldError(field, message) {
  const errorEl = document.getElementById(`err-${field}`);
  if (errorEl) errorEl.textContent = message;

  const inputEl = document.getElementById(field);
  if (inputEl) inputEl.classList.add("is-invalid");
}

function clearFieldError(field) {
  const errorEl = document.getElementById(`err-${field}`);
  if (errorEl) errorEl.textContent = "";

  const inputEl = document.getElementById(field);
  if (inputEl) inputEl.classList.remove("is-invalid");
}

function clearAllErrors() {
  ["images", "title", "description", "category", "location", "price", "condition"].forEach(clearFieldError);
}

function showFormFeedback(message, type) {
  formFeedback.textContent = message;
  formFeedback.className = `gc-form-feedback is-${type}`;
  formFeedback.hidden = false;
  formFeedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideFormFeedback() {
  formFeedback.hidden = true;
}

function validateForm() {
  clearAllErrors();
  let firstInvalid = null;
  const fail = (field, message, focusTarget) => {
    setFieldError(field, message);
    if (!firstInvalid) firstInvalid = focusTarget || document.getElementById(field);
  };

  if (images.length === 0) fail("images", "Add at least one photo.", dropzone);

  const title = titleInput.value.trim();
  if (!title) fail("title", "Please enter a product title.", titleInput);

  const description = descriptionInput.value.trim();
  if (!description) fail("description", "Please enter a description.", descriptionInput);

  if (!categorySelect.value) fail("category", "Please select a category.", categorySelect);

  const location = locationInput.value.trim();
  if (!location) fail("location", "Please add a pickup location.", locationInput);

  const price = priceInput.value;
  if (price === "" || Number(price) <= 0) fail("price", "Please enter a valid price.", priceInput);

  if (!selectedCondition) fail("condition", "Please choose a condition.", conditionChips[0]);

  return firstInvalid;
}

// ==================================================
// Submit
// ==================================================

sellForm.addEventListener("submit", handleSellProduct);

function handleSellProduct(event) {
  event.preventDefault();
  hideFormFeedback();

  const firstInvalid = validateForm();
  if (firstInvalid) {
    showFormFeedback("Please fix the highlighted fields before publishing.", "error");
    firstInvalid.focus({ preventScroll: true });
    firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const product = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    category: categorySelect.value,
    price: Number(priceInput.value),
    originalPrice: originalPriceInput.value ? Number(originalPriceInput.value) : null,
    condition: selectedCondition,
    location: locationInput.value.trim(),
    images: images.map((img) => img.file.name)
  };

  console.log(product);

  // Backend integration:
  // await apiRequest(API_ENDPOINTS.products, { method: "POST", body: product });

  publishBtn.classList.add("is-loading");
  publishBtn.disabled = true;

  setTimeout(() => {
    publishBtn.classList.remove("is-loading");
    publishBtn.disabled = false;
    showFormFeedback("Listing published! Buyers on your campus can now see it.", "success");
    resetForm();
  }, 900);
}

function resetForm() {
  sellForm.reset();

  images.forEach((img) => URL.revokeObjectURL(img.url));
  images = [];
  renderImageGrid();

  selectedCondition = "";
  conditionChips.forEach((c) => c.setAttribute("aria-checked", "false"));

  document.getElementById("count-title").textContent = "0/80";
  document.getElementById("count-description").textContent = "0/500";

  clearAllErrors();
  syncPreview();
}

// Initial paint
syncPreview();