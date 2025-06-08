// login.js

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.querySelector('.container');

// Panel toggling
signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});
signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});

// Signup
document.getElementById('signup-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const firstname = document.getElementById('signup-firstname').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();

  if (firstname && email && password.length >= 6) {
    const user = { firstname, email, password };
    localStorage.setItem('user', JSON.stringify(user));
    alert('Signup successful! Please login.');
    container.classList.remove("right-panel-active");
  } else {
    alert('All fields are required and password must be at least 6 characters.');
  }
});

// Login
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const storedUser = JSON.parse(localStorage.getItem('user'));

  if (storedUser && email === storedUser.email && password === storedUser.password) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loggedInUser', JSON.stringify(storedUser));
    alert(`Welcome, ${storedUser.firstname}!`);
    window.location.href = 'index.html';
  } else {
    alert('Invalid email or password.');
  }
});

// Navbar: Show user info if logged in
document.addEventListener('DOMContentLoaded', () => {
  const accountBtn = document.getElementById('account-btn');
  const userDisplay = document.getElementById('user-name-display');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  if (isLoggedIn && user && accountBtn && userDisplay) {
    accountBtn.style.display = 'inline-block';
    userDisplay.textContent = `Hi, ${user.firstName}`; // ✅ Corrected from `firstname` to `firstName`
  }
});

// Handle "Buy Now" redirect
const pendingBuy = localStorage.getItem('pendingBuyNow');
if (pendingBuy) {
  const item = JSON.parse(pendingBuy);
  localStorage.setItem('buyNowItem', JSON.stringify({ ...item, quantity: 1 }));
  localStorage.removeItem('pendingBuyNow');
  window.location.href = 'billing.html';
}
