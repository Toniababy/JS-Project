import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { colRef } from "./script.js";

let cart = [];
const cartItem = document.getElementById("cartItem");
const productsContainer = document.getElementById("pro-container");
const cartAmount = document.getElementById('cartAmount')
let totalPriceElement = document.getElementById("totalPrice")



function loadCartFromLocalStorage() {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      cart = savedCart;
      updateCartUI();
      displayCart();
    }
  }

function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

async function fetchProducts() {
    const products = [];
    const querySnapshot = await getDocs(colRef);
    querySnapshot.forEach((doc) => {
        products.push(doc.data());
    });

    displayProducts(products);
}

function displayProducts(products) {
    productsContainer.innerHTML = ""; // Clear existing products

    products.forEach((product) => {
        productsContainer.innerHTML += `
        <div class="box">
            <div class="img-box">
                <img src="${product.image}" alt="" class="images">
            </div>
            <div class="bottom">
                <h4 style="color: black;">${product.name}</h4>
                <h4>₦ ${product.price}.00</h4>
                <i class='fa-solid fa-cart-shopping add-to-cart-btn' 
                   data-name="${product.name}" 
                   style='color: #D09C8E; border: 1px solid #cce7d0; background-color:rgb(142, 141, 143); '>
                </i>
            </div>
        </div>
        `;
    });

    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn"); // Select all "Add to Cart" buttons
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const productName = button.getAttribute("data-name");
            const product = products.find((item) => item.name === productName);
            if (product) {
                addToCart(product);
            }
        });
    });
}

function addToCart(product) {
    const existingProduct = cart.find((item) => item.name === product.name);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    console.log(`${product.name} added to cart`);
    updateCartUI()
    saveCartToLocalStorage();
    displayCart();
}

function delElement(productName) {
    const productIndex = cart.findIndex((item) => item.name === productName);

    if (productIndex !== -1) {
        cart.splice(productIndex, 1);
        console.log(`${productName} removed from cart`);
    } else {
        console.log(`${productName} not found in cart`);
    }
    updateCartUI()
    saveCartToLocalStorage()
    displayCart();
}

function displayCart() {
    cartItem.innerHTML = ""; 

    cart.forEach((item) => {
        
        cartItem.innerHTML += `
        <div class="cart-item">
            <div class="row-img">
                <img class="rowimg" src="${item.image}" alt="">
            </div>
            <p>${item.name}</p>
            <h4 class="totalPrice">₦ ${item.price}.00</h4>
            <p>Quantity: ${item.quantity}</p>
            <i class='fa-solid fa-trash del-cart-btn' 
               data-name="${item.name}">
            </i>
        </div>
        `;
    });

   
    const deleteButtons = document.querySelectorAll(".del-cart-btn"); // Select all delete buttons
    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const productName = button.getAttribute("data-name");
            delElement(productName);
        });
    });
}



  function updateCartUI() {
    let totalPrice = 0; // Initialize total price
    let totalQuantity = 0; // Initialize total quantity
  
    // Loop through each item in the cart
    cart.forEach(item => {
      totalPrice += item.price * item.quantity; // Add item's total price
      totalQuantity += item.quantity; // Add item's quantity
    });
  
    // Update the UI elements
    cartAmount.textContent = totalQuantity; // Set cart count
    totalPriceElement.textContent = `Total: ₦ ${totalPrice}.00`; // Set total price
  }

  loadCartFromLocalStorage();
fetchProducts();
