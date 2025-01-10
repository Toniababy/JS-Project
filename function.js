import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { colRef } from "./script.js";
import { auth } from "./script.js"; // Assuming 'auth' is your Firebase auth instance

let cart = [];
const cartItem = document.getElementById("cartItem");
const productsContainer = document.getElementById("pro-container");
const cartAmount = document.getElementById('cartAmount');
let totalPriceElement = document.getElementById("totalPrice");

function getCartKey() {
    const user = auth.currentUser;
    return user ? `cart_${user.uid}` : null;
}

function loadCartFromLocalStorage() {
    const cartKey = getCartKey();
    if (!cartKey) return;

    const savedCart = JSON.parse(localStorage.getItem(cartKey));
    if (savedCart) {
        cart = savedCart;
        updateCartUI();
        displayCart();
    }
}

function saveCartToLocalStorage() {
    const cartKey = getCartKey();
    if (!cartKey) return;

    localStorage.setItem(cartKey, JSON.stringify(cart));
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

    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
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

async function loadCart() {
    const user = auth.currentUser;
    if (!user) {
        console.log("No user logged in.");
        return;
    }
    const userId = user.uid;
    
    // First check in localStorage
    const localStorageCart = localStorage.getItem(`cart_${userId}`);
    if (localStorageCart) {
        cart = JSON.parse(localStorageCart);
        updateCartUI();
        displayCart();
    } else {
        // If no cart in localStorage, fetch from Firebase
        const firebaseCart = await fetchCartFromFirebase(userId);
        cart = firebaseCart;
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));  // Store fetched cart to localStorage
        updateCartUI();
        displayCart();
    }
}

function addToCart(product) {
    const existingProduct = cart.find((item) => item.name === product.name);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    saveCartToLocalStorage();
    // saveCartToFirebase(auth.currentUser.uid, cart);  // Update Firebase as well
    displayCart();
}

function delElement(productName) {
    const productIndex = cart.findIndex((item) => item.name === productName);
    if (productIndex !== -1) {
        const product = cart[productIndex];
        if (product.quantity > 1) {
            product.quantity--;
        } else {
            cart.splice(productIndex, 1);
        }
    }

    updateCartUI();
    saveCartToLocalStorage();
    // saveCartToFirebase(auth.currentUser.uid, cart);  // Update Firebase
    displayCart();
}

function displayCart() {
    cartItem.innerHTML = "";  // Clear cart items

    cart.forEach((item) => {
        cartItem.innerHTML += `
        <div class="cart-item">
            <div class="row-img">
                <img class="rowimg" src="${item.image}" alt=""/>
            </div>
            <p>${item.name}</p>
            <h4 class="totalPrice">₦ ${item.price}.00</h4>
            <p>Quantity: ${item.quantity}</p>
            <i class='fa-solid fa-trash del-cart-btn' data-name="${item.name}"></i>
        </div>
        `;
    });

    // Add Proceed to Checkout button
    cartItem.innerHTML += `
      <button id="checkoutBtn" class="checkout-btn">Proceed to Checkout</button>
    `;

    const deleteButtons = document.querySelectorAll(".del-cart-btn");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const productName = button.getAttribute("data-name");
            delElement(productName);
        });
    });

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            proceedToCheckout();
        });
    }
}

function updateCartUI() {
    let totalPrice = 0;
    let totalQuantity = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        totalQuantity += item.quantity;
    });

    cartAmount.textContent = totalQuantity;
    totalPriceElement.textContent = `Total: ₦ ${totalPrice}.00`;
}

function proceedToCheckout() {
    localStorage.setItem("cartData", JSON.stringify(cart));
    window.location.href = "checkout.html"; // Redirect to checkout page
}

// Listen to changes in auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user);
        loadCart();  // Load cart when user is authenticated
    } else {
        console.log("No user logged in.");
        // Optionally, handle scenarios when the user is logged out
    }
});

// Call this to fetch products
fetchProducts();
