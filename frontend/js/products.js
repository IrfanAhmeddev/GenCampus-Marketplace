// =========================================
// GenCampus Marketplace
// Product Module
// =========================================

console.log("Products Module Loaded");

// ------------------------------
// DOM references
// ------------------------------
const productsGrid = document.getElementById("productsGrid");
const emptyState = document.getElementById("emptyState");
const resultsCount = document.getElementById("resultsCount");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const sortFilter = document.getElementById("sortFilter");
const clearFiltersBtn = document.getElementById("clearFilters");
const emptyStateClearBtn = document.getElementById("emptyStateClear");

// ------------------------------
// Sample data
// (In production this would come from api.js / your backend)
// ------------------------------
let products = [];

// Keep a mutable set of liked product IDs, persisted locally.
const WISHLIST_KEY = "gc-wishlist";
let wishlist = new Set(JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]"));

function saveWishlist() {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(Array.from(wishlist)));
}


// =========================================
// Load Products from Backend
// =========================================

async function loadProducts() {
  try {

    renderSkeletons(4);

    const response = await apiRequest(API_ENDPOINTS.products);

    products = response.data.map(product => ({

      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: null,
      category: product.category,

      // Backend sends "available" / "sold"
      status: product.status,

      condition: "good",

      rating: 5,
      reviewCount: 0,

      seller: "Campus Seller",

      postedDaysAgo: 0,

      image: product.image_url ||
        "https://via.placeholder.com/400x300?text=No+Image"

    }));

    applyFilters();

  } catch (error) {

    console.error("Error loading products:", error);

    productsGrid.innerHTML = `
      <div class="error">
        Failed to load products.
      </div>
    `;

  }
}
// ------------------------------
// Helpers
// ------------------------------
function starString(rating) {
  const full = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return full + empty;
}

function postedLabel(days) {
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function discountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ------------------------------
// Rendering
// ------------------------------
function renderSkeletons(count) {
  productsGrid.hidden = false;
  emptyState.hidden = true;
  productsGrid.innerHTML = Array.from({ length: count })
    .map(
      () => `
      <div class="product-card is-skeleton">
        <div class="image-container skeleton-block"></div>
        <div class="product-info">
          <div class="skeleton-block skeleton-title"></div>
          <div class="skeleton-block skeleton-line"></div>
          <div class="skeleton-block skeleton-price"></div>
          <div class="skeleton-block skeleton-btn"></div>
        </div>
      </div>
    `
    )
    .join("");
}

function renderProducts(data) {
  resultsCount.textContent = `${data.length} item${data.length === 1 ? "" : "s"} found`;

  if (data.length === 0) {
    productsGrid.hidden = true;
    emptyState.hidden = false;
    return;
  }

  productsGrid.hidden = false;
  emptyState.hidden = true;

  productsGrid.innerHTML = data
    .map((product) => {
     const isSold = product.status.toLowerCase() === "sold";
      const discount = discountPercent(product.price, product.originalPrice);
      const isLiked = wishlist.has(product.id);

      return `
        <div class="product-card ${isSold ? "is-sold" : ""}" data-id="${product.id}">
          <div class="image-container">
            <div class="badge-container">
              <span class="category">${product.category}</span>
              <span class="status ${isSold ? "sold" : "available"}">${isSold ? "Sold out" : "Available"}</span>
            </div>
            <img src="${product.image}" alt="${product.title}" loading="lazy">
           // replace the wishlist button markup with:
<button
  class="wishlist-btn ${isLiked ? "is-active" : ""}"
  data-id="${product.id}"
  aria-pressed="${isLiked}"
  aria-label="${isLiked ? "Remove from wishlist" : "Add to wishlist"}">
  <i class='${isLiked ? "bx bxs-heart" : "bx bx-heart"}'></i>
</button>
          </div>

          <div class="product-info">
            <span class="condition-badge ${product.condition}">${product.condition}</span>
            <h3>${product.title}</h3>

            <div class="seller-row">
              <span class="seller-avatar">${initials(product.seller)}</span>
              <span class="seller-name">${product.seller}</span>
              <span class="posted-time">${postedLabel(product.postedDaysAgo)}</span>
            </div>

            <div class="rating-row">
              <span class="stars">${starString(product.rating)}</span>
              <span class="rating-count">(${product.reviewCount})</span>
            </div>

            <div class="price-row">
              <span class="price">₹${product.price.toLocaleString("en-IN")}</span>
              ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice.toLocaleString("en-IN")}</span>` : ""}
              ${discount ? `<span class="discount-tag">${discount}% off</span>` : ""}
            </div>

           <button
    class="btn-action view-details-btn"
    data-id="${product.id}"
    ${isSold ? "disabled" : ""}>

    ${isSold ? "Out of stock" : "View details"}

</button>
          </div>
        </div>
      `;
    })
    .join("");
}

// ------------------------------
// Filtering + sorting (combined — this was the bug in the old version:
// search and category used to overwrite each other's results instead
// of applying together)
// ------------------------------
function getActiveFilters() {
  return {
    keyword: searchInput.value.trim().toLowerCase(),
    category: categoryFilter.value,
    min: minPriceInput.value !== "" ? Number(minPriceInput.value) : null,
    max: maxPriceInput.value !== "" ? Number(maxPriceInput.value) : null,
    sort: sortFilter.value
  };
}

function applyFilters() {
  const { keyword, category, min, max, sort } = getActiveFilters();

  let result = products.filter((product) => {
    const matchesKeyword = !keyword || product.title.toLowerCase().includes(keyword);
    const matchesCategory = !category || product.category === category;
    const matchesMin = min === null || product.price >= min;
    const matchesMax = max === null || product.price <= max;
    return matchesKeyword && matchesCategory && matchesMin && matchesMax;
  });

  switch (sort) {
    case "price-low":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    default: // "newest"
      result.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
  }

  toggleClearButton(keyword, category, min, max);
  renderProducts(result);
}

function toggleClearButton(keyword, category, min, max) {
  const hasActiveFilters = Boolean(keyword || category || min !== null || max !== null);
  clearFiltersBtn.hidden = !hasActiveFilters;
}

function clearAllFilters() {
  searchInput.value = "";
  categoryFilter.value = "";
  minPriceInput.value = "";
  maxPriceInput.value = "";
  sortFilter.value = "newest";
  applyFilters();
}

// ------------------------------
// Event listeners
// ------------------------------
searchInput.addEventListener("input", debounce(applyFilters, 250));
categoryFilter.addEventListener("change", applyFilters);
minPriceInput.addEventListener("input", debounce(applyFilters, 300));
maxPriceInput.addEventListener("input", debounce(applyFilters, 300));
sortFilter.addEventListener("change", applyFilters);
clearFiltersBtn.addEventListener("click", clearAllFilters);
emptyStateClearBtn.addEventListener("click", clearAllFilters);

productsGrid.addEventListener("click", (event) => {
  const wishlistBtn = event.target.closest(".wishlist-btn");
  if (!wishlistBtn) return;

const id = wishlistBtn.dataset.id;
  if (wishlist.has(id)) {
    wishlist.delete(id);
  } else {
    wishlist.add(id);
  }
  saveWishlist();
  applyFilters();
});

productsGrid.addEventListener("click", (event) => {

    const detailsBtn = event.target.closest(".view-details-btn");

    if (!detailsBtn) return;

    const productId = detailsBtn.dataset.id;

    window.location.href =
        `product-details.html?id=${productId}`;

});

// ------------------------------
// Initial load — brief skeleton for perceived performance,
// then render real data.
// ------------------------------
loadProducts();
function starString(rating) {
  let out = '<span class="stars">';
  for (let i = 1; i <= 5; i++) {
    out += `<i class='${i <= rating ? "bx bxs-star" : "bx bx-star"}'></i>`;
  }
  return out + "</span>";
}

