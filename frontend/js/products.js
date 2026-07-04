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
const products = [
  {
    id: 1,
    title: "Engineering Physics Volume I (Latest Edition)",
    price: 450,
    originalPrice: 700,
    category: "Books",
    status: "Available",
    condition: "good",
    rating: 4,
    reviewCount: 12,
    seller: "Aditi R.",
    postedDaysAgo: 2,
    image: "../assets/laptop.jpg"
  },
  {
    id: 2,
    title: "Dell Inspiron 15 — Core i5, 8GB RAM",
    price: 25000,
    originalPrice: null,
    category: "Electronics",
    status: "Sold",
    condition: "good",
    rating: 5,
    reviewCount: 4,
    seller: "Rohan K.",
    postedDaysAgo: 9,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Scientific Calculator — Casio fx-991ES",
    price: 900,
    originalPrice: 1200,
    category: "Electronics",
    status: "Available",
    condition: "new",
    rating: 5,
    reviewCount: 8,
    seller: "Meera S.",
    postedDaysAgo: 1,
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Study Desk Chair, adjustable height",
    price: 1800,
    originalPrice: null,
    category: "Furniture",
    status: "Available",
    condition: "fair",
    rating: 3,
    reviewCount: 6,
    seller: "Vikram T.",
    postedDaysAgo: 5,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&auto=format&fit=crop"
  }
];

// Keep a mutable set of liked product IDs, persisted locally.
const WISHLIST_KEY = "gc-wishlist";
let wishlist = new Set(JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]"));

function saveWishlist() {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(Array.from(wishlist)));
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
      const isSold = product.status === "Sold";
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
            <button
              class="wishlist-btn ${isLiked ? "is-active" : ""}"
              data-id="${product.id}"
              aria-pressed="${isLiked}"
              aria-label="${isLiked ? "Remove from wishlist" : "Add to wishlist"}">
              <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"></path>
              </svg>
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

            <button class="btn-action" ${isSold ? "disabled" : ""}>
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

  const id = Number(wishlistBtn.dataset.id);
  if (wishlist.has(id)) {
    wishlist.delete(id);
  } else {
    wishlist.add(id);
  }
  saveWishlist();
  applyFilters();
});

// ------------------------------
// Initial load — brief skeleton for perceived performance,
// then render real data.
// ------------------------------
renderSkeletons(4);
setTimeout(applyFilters, 350);