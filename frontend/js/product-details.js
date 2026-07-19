// =========================================
// GenCampus Marketplace
// Product Details
// =========================================
const params = new URLSearchParams(window.location.search);

const productId = params.get("id");
console.log("Product Details Loaded");

async function loadProduct(){

    try{

        const response =
        await apiRequest(`/products/${productId}`);

        const product = response.data;
        document.getElementById("productTitle").textContent =
product.title;

document.getElementById("productPrice").textContent =
formatCurrency(product.price);

document.getElementById("productCategory").textContent =
product.category;

document.getElementById("productCondition").textContent =
product.condition;

document.getElementById("productDescription").textContent =
product.description;

document.getElementById("productImage").src =
product.image_url ||
"../assets/images/no-image.png";

const badge =
document.getElementById("productStatus");

badge.textContent =
product.status;

badge.className =
product.status === "available"

? "gc-badge gc-badge-success"

: "gc-badge gc-badge-danger";

document.getElementById("sellerName").textContent =
"Campus Seller";

document.getElementById("sellerDepartment").textContent =
"GenCampus";

    }

    catch(error){

        console.error(error);

    }

}

// Request Button
document
.querySelector(".gc-request-btn")
.addEventListener("click", requestProduct);
async function requestProduct() {

    console.log("Product ID:", productId);
    console.log("Token:", localStorage.getItem("token"));

    try {

        const response = await apiRequest("/requests", {

            method: "POST",

            body: JSON.stringify({

                product_id: productId

            })

        });

        console.log(response);

        alert(response.message);

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
if(productId){

    loadProduct();

}