// =========================================
// GenCampus Marketplace
// Edit Product Module
// =========================================

console.log("Edit Product Module Loaded");

// =========================================
// Mock Product Data
// (Later replace with GET /api/products/:id)
// =========================================

const product = {

    id: 101,

    title: "Engineering Physics Textbook",

    category: "Books",

    price: 450,

    condition: "Good",

    description: "Engineering Physics textbook for first year students. Well maintained with minimal markings.",

    location: "Hostel Block A",

    image: "https://via.placeholder.com/300x220"

};

// =========================================
// Load Product
// =========================================

function loadProduct() {

    document.getElementById("productId").value = product.id;

    document.getElementById("title").value = product.title;

    document.getElementById("category").value = product.category;

    document.getElementById("price").value = product.price;

    document.getElementById("condition").value = product.condition;

    document.getElementById("description").value = product.description;

    document.getElementById("location").value = product.location;

    document.getElementById("imagePreview").src = product.image;

}

// =========================================
// Image Preview
// =========================================

const imageInput = document.getElementById("productImage");

if(imageInput){

imageInput.addEventListener("change",function(){

const file=this.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=function(e){

document.getElementById("imagePreview").src=e.target.result;

}

reader.readAsDataURL(file);

});

}

// =========================================
// Update Product
// =========================================

function updateProduct(event){

event.preventDefault();

const updatedProduct={

id:document.getElementById("productId").value,

title:document.getElementById("title").value.trim(),

category:document.getElementById("category").value,

price:Number(document.getElementById("price").value),

condition:document.getElementById("condition").value,

description:document.getElementById("description").value.trim(),

location:document.getElementById("location").value.trim()

};

// Validation

if(updatedProduct.title===""){

alert("Product title is required.");

return;

}

if(updatedProduct.price<=0){

alert("Please enter a valid price.");

return;

}

console.log("Updated Product");

console.table(updatedProduct);

// Future API

/*
await fetch(`/api/products/${updatedProduct.id}`,{

method:"PUT",

headers:{

"Content-Type":"application/json",

Authorization:`Bearer ${localStorage.getItem("token")}`

},

body:JSON.stringify(updatedProduct)

});
*/

alert("Product updated successfully!");

window.location.href="dashboard.html";

}

// =========================================
// Event Listeners
// =========================================

document
.getElementById("editProductForm")
.addEventListener("submit",updateProduct);

// =========================================
// Initialize
// =========================================

loadProduct();