// =========================================
// GenCampus Marketplace
// Product Module
// =========================================

console.log("Products Module Loaded");

// Product Grid
const productsGrid = document.getElementById("productsGrid");

// Sample Products
const products = [

{
id:1,
title:"Engineering Physics Book",
price:450,
category:"Books",
status:"Available",
image:"../assets/laptop.jpg"
},

{
id:2,
title:"Dell Laptop",
price:25000,
category:"Electronics",
status:"Sold",
image:"https://via.placeholder.com/300x200"
},

{
id:3,
title:"Scientific Calculator",
price:900,
category:"Electronics",
status:"Available",
image:"https://via.placeholder.com/300x200"
},

{
id:4,
title:"Office Chair",
price:1800,
category:"Furniture",
status:"Available",
image:"https://via.placeholder.com/300x200"
}

];

// ================================
// Render Products
// ================================

function renderProducts(data){

productsGrid.innerHTML="";

data.forEach(product=>{

productsGrid.innerHTML+=`

<div class="product-card">

<img src="${product.image}" alt="${product.title}">

<div class="product-info">

<h3>${product.title}</h3>

<p class="price">₹${product.price}</p>

<span class="category">${product.category}</span>

<span class="status ${product.status.toLowerCase()}">
${product.status}
</span>

</div>

</div>

`;

});

}

renderProducts(products);

// ================================
// Search
// ================================

const searchInput=document.getElementById("searchInput");

searchInput.addEventListener("keyup",()=>{

const keyword=searchInput.value.toLowerCase();

const filtered=products.filter(product=>{

return product.title.toLowerCase().includes(keyword);

});

renderProducts(filtered);

});

// ================================
// Category Filter
// ================================

const categoryFilter=document.getElementById("categoryFilter");

categoryFilter.addEventListener("change",()=>{

const category=categoryFilter.value;

if(category===""){

renderProducts(products);

return;

}

const filtered=products.filter(product=>{

return product.category===category;

});

renderProducts(filtered);

});