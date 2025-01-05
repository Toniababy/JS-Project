const copyright = document.getElementById("copyrigt");
copyright.innerHTML = `&copy; ${new Date().getFullYear()} Eye Belief. All rights reserved.`;

const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');


if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
        // console.log('hello');
        
    })
}
if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
        
    })
}



// cart/shop Functionality







import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyBkCMqPUCJYpgJBeEAvsve67gvPq99d4yc",
  authDomain: "javascript-project--e-commerce.firebaseapp.com",
  projectId: "javascript-project--e-commerce",
  storageBucket: "javascript-project--e-commerce.firebasestorage.app",
  messagingSenderId: "478342137748",
  appId: "1:478342137748:web:bfeef9164cbc7b752cf181",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const colRef = collection(db, "Cart Section");
export const userRef = collection(db, "users");
export const auth = getAuth(app);


import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
// import { auth } from "./script.js"; // Ensure auth is correctly imported

document.addEventListener("DOMContentLoaded", () => {
  const signInOption = document.getElementById("signInOption");
  const signOutOption = document.getElementById("signOutOption");

  if (signInOption && signOutOption) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        signInOption.style.display = "none"; // Hide "Sign In"
        // nav.classList.signInOption.remove('active');
        signOutOption.style.display = "block"; // Show "Sign Out"

        // Add sign-out functionality
        signOutOption.addEventListener("click", async () => {
          try {
            await signOut(auth);
            alert("You have signed out successfully.");
            window.location.reload();
          } catch (error) {
            console.error("Error signing out:", error);
          }
        });
      } else {
        signInOption.style.display = "block"; // Show "Sign In"
        signOutOption.style.display = "none"; // Hide "Sign Out"
      }
    });
  } else {
    console.error("SignInOption or SignOutOption element not found in the DOM.");
  }
});





// Producst Array
// let productListHTML = document.getElementById = ('product-container')









