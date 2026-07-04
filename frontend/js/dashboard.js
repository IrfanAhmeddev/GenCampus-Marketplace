// =========================================
// GenCampus Marketplace
// Seller Dashboard
// =========================================

console.log("Dashboard Loaded");

// =========================================
// Mock Products
// =========================================

let products = [

{
id:1,
title:"Engineering Physics Book",
price:450,
status:"Available",
image:"https://via.placeholder.com/80"
},

{
id:2,
title:"Dell Laptop",
price:25000,
status:"Sold",
image:"https://via.placeholder.com/80"
},

{
id:3,
title:"Scientific Calculator",
price:900,
status:"Available",
image:"https://via.placeholder.com/80"
},

{
id:4,
title:"Office Chair",
price:1800,
status:"Available",
image:"https://via.placeholder.com/80"
}

];

// =========================================
// Mock Requests
// =========================================

const requests = [

{
product:"Engineering Physics Book",
student:"Arun Kumar",
status:"Pending"
},

{
product:"Dell Laptop",
student:"Karthik",
status:"Accepted"
},

{
product:"Calculator",
student:"Rahul",
status:"Rejected"
}

];

// =========================================
// Mock Purchases
// =========================================

const purchases = [

{
product:"Java Programming Book",
price:500
},

{
product:"Study Table",
price:2500
}

];

// =========================================
// Render Dashboard
// =========================================

function renderDashboard(list = products){

const table = document.getElementById("dashboardTable");

table.innerHTML = "";

list.forEach(product=>{

table.innerHTML += `

<tr>

<td>
<img src="${product.image}">
</td>

<td>${product.title}</td>

<td>${formatCurrency(product.price)}</td>

<td>

<span class="gc-status ${product.status.toLowerCase()}">

${product.status}

</span>

</td>

<td>

<div class="gc-action-group">

<button
class="gc-btn gc-btn-secondary gc-btn-small"
onclick="editProduct(${product.id})">

Edit

</button>

<button
class="gc-btn gc-btn-success gc-btn-small"
onclick="toggleStatus(${product.id})">

${product.status==="Available"
? "Mark Sold"
: "Mark Available"}

</button>

<button
class="gc-btn gc-btn-danger gc-btn-small"
onclick="deleteProduct(${product.id})">

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
// Statistics
// =========================================

function updateStatistics(){

document.getElementById("totalProducts").textContent =
products.length;

document.getElementById("availableProducts").textContent =
products.filter(p=>p.status==="Available").length;

document.getElementById("soldProducts").textContent =
products.filter(p=>p.status==="Sold").length;

}

// =========================================
// Search
// =========================================

const searchInput = document.getElementById("searchInput");

if(searchInput){

searchInput.addEventListener("keyup",()=>{

const keyword = searchInput.value.toLowerCase();

const filtered = products.filter(product=>{

return (

product.title.toLowerCase().includes(keyword)

||

product.status.toLowerCase().includes(keyword)

);

});

renderDashboard(filtered);

});

}

// =========================================
// Drawer Elements
// =========================================

const drawer =
document.getElementById("sideDrawer");

const overlay =
document.getElementById("overlay");

const drawerTitle =
document.getElementById("drawerTitle");

const drawerContent =
document.getElementById("drawerContent");

// =========================================
// Open Drawer
// =========================================

function openDrawer(title,data,type){

drawerTitle.textContent = title;

drawerContent.innerHTML = "";

data.forEach(item=>{

if(type==="request"){

drawerContent.innerHTML += `

<div class="gc-drawer-item">

<h4>${item.product}</h4>

<p>Requested by: ${item.student}</p>

<span class="gc-drawer-status ${item.status.toLowerCase()}">

${item.status}

</span>

</div>

`;

}

else{

drawerContent.innerHTML += `

<div class="gc-drawer-item">

<h4>${item.product}</h4>

<p>${formatCurrency(item.price)}</p>

</div>

`;

}

});

drawer.classList.add("active");

overlay.classList.add("active");

}

// =========================================
// Close Drawer
// =========================================

function closeDrawer(){

drawer.classList.remove("active");

overlay.classList.remove("active");

}

// =========================================
// Requests Button
// =========================================

document
.getElementById("requestBtn")
.addEventListener("click",()=>{

openDrawer(

"My Requests",

requests,

"request"

);

});

// =========================================
// Purchases Button
// =========================================

document
.getElementById("purchaseBtn")
.addEventListener("click",()=>{

openDrawer(

"My Purchases",

purchases,

"purchase"

);

});

// =========================================
// Close Events
// =========================================

document
.getElementById("closeDrawer")
.addEventListener("click",closeDrawer);

overlay.addEventListener("click",closeDrawer);

document.addEventListener("keydown",e=>{

if(e.key==="Escape"){

closeDrawer();

}

});

// =========================================
// Edit
// =========================================

function editProduct(id){

window.location.href=`edit-product.html?id=${id}`;

}

// =========================================
// Delete
// =========================================

function deleteProduct(id){

if(!confirm("Delete this product?")) return;

products =
products.filter(product=>product.id!==id);

renderDashboard();

}

// =========================================
// Toggle Status
// =========================================

function toggleStatus(id){

const product =
products.find(product=>product.id===id);

if(!product) return;

product.status =

product.status==="Available"

?

"Sold"

:

"Available";

renderDashboard();

}

// =========================================
// Notification Badges
// =========================================

document.querySelector("#requestBtn .gc-badge")
.textContent = requests.length;

document.querySelector("#purchaseBtn .gc-badge")
.textContent = purchases.length;

// =========================================
// Initialize
// =========================================

renderDashboard();