





document.addEventListener("DOMContentLoaded", () => {
  renderCartSummary();
  loadSavedAddresses();

  const form = document.getElementById("address-form");
  form.addEventListener("submit", saveAddress);

  const proceedBtn = document.getElementById("proceed-payment");
  proceedBtn.addEventListener("click", handleProceedToPayment);

  // Hero Section Slider Script
  const slides = document.querySelectorAll('.hero-slider .slide');
  let currentIndex = 0;
  const slideInterval = 5000; // 5 seconds

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  // Initial display
  showSlide(currentIndex);

  // Auto slide
  setInterval(nextSlide, slideInterval);
});

// Render cart summary from checkoutCart
function renderCartSummary() {
  const cart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
  const cartSummary = document.getElementById("cart-summary");
  const totalAmount = document.getElementById("total-amount");

  cartSummary.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartSummary.innerHTML = "<p>No items in cart.</p>";
    totalAmount.textContent = "";
    return;
  }

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <strong>${item.name}</strong> (x${item.quantity})
      </div>
      <div>₹${itemTotal}</div>
    `;
    cartSummary.appendChild(div);
  });

  totalAmount.textContent = `Total Amount: ₹${total}`;
  localStorage.setItem("cartTotal", total); // For use on payment page
}

// Save address to localStorage
function saveAddress(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const pincode = document.getElementById("pincode").value.trim();

  if (!name || !address || !city || !pincode) {
    alert("Please fill out all address fields.");
    return;
  }

  const fullAddress = { name, address, city, pincode };

  let addresses = JSON.parse(localStorage.getItem("savedAddresses")) || [];
  addresses.push(fullAddress);
  localStorage.setItem("savedAddresses", JSON.stringify(addresses));

  loadSavedAddresses();
  document.getElementById("address-form").reset();
}

// Load and display saved addresses
function loadSavedAddresses() {
  const savedAddresses = JSON.parse(localStorage.getItem("savedAddresses")) || [];
  const container = document.getElementById("saved-addresses");
  container.innerHTML = "";

  if (savedAddresses.length === 0) {
    container.innerHTML = "<p>No saved addresses yet.</p>";
    return;
  }

  savedAddresses.forEach((addr, index) => {
    const div = document.createElement("div");
    div.className = "saved-address";
    div.innerHTML = `
      <label>
        <input type="radio" name="selectedAddress" value="${index}" />
        <strong>${addr.name}</strong><br>
        ${addr.address}, ${addr.city} - ${addr.pincode}
      </label>
    `;
    container.appendChild(div);
  });
}

// Proceed to payment only if cart and address are selected
function handleProceedToPayment() {
  const cart = JSON.parse(localStorage.getItem("checkoutCart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty. Please add items before proceeding.");
    return;
  }

  const selectedAddressInput = document.querySelector('input[name="selectedAddress"]:checked');
  if (!selectedAddressInput) {
    alert("Please select a delivery address.");
    return;
  }

  const addresses = JSON.parse(localStorage.getItem("savedAddresses")) || [];
  const selectedAddress = addresses[selectedAddressInput.value];

  localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
  window.location.href = "payment.html";
}


// Show user name if logged in
window.onload = function () {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (user) {
    document.getElementById('login-link').style.display = 'none';
    document.getElementById('user-menu').style.display = 'block';
    document.getElementById('user-firstname').textContent = user.firstName;
  }
};

function logout() {
  localStorage.removeItem('loggedInUser');
  location.reload();
}



// Show user in navbar if logged in
document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = JSON.parse(localStorage.getItem('user'));
  const loginLink = document.getElementById('nav-login');
  const userMenu = document.getElementById('user-menu');
  const userNameDisplay = document.getElementById('user-name');
  const logoutLink = document.getElementById('logout-link');

  if (isLoggedIn && user) {
    loginLink.style.display = 'none';
    userMenu.style.display = 'inline-block';
      userNameDisplay.textContent = `👤${user.firstname}`;
    }

 // Attach logout click handler
  logoutLink.addEventListener('click', function () {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUser'); // just in case
    window.location.href = "index.html"; // or use location.reload();
  });



// Toggle dropdown when user-name is clicked
document.getElementById("user-name").addEventListener("click", function (event) {
  const dropdown = document.getElementById("user-dropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  event.stopPropagation(); // Prevent click from bubbling to document
});

// Hide dropdown on outside click
document.addEventListener("click", function (event) {
  const userMenu = document.getElementById("user-menu");
  const dropdown = document.getElementById("user-dropdown");

  if (!userMenu.contains(event.target)) {
    dropdown.style.display = "none";
  }
});

});


// Cart functionality

function toggleCartPopup() {
  const cartPopup = document.getElementById('cart-popup');
  cartPopup.style.display = cartPopup.style.display === 'none' ? 'block' : 'none';
  renderCartPopup(); // Live update
}

function showLoginPopup() {
  alert("You need to login first to use the cart features.");
  window.location.href = 'login.html';
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countSpan = document.getElementById('cart-count');
  countSpan.textContent = totalItems;
  countSpan.style.display = totalItems > 0 ? 'inline-block' : 'none';
}

function renderCartPopup() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalContainer = document.getElementById('cart-total');

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalContainer.innerHTML = '';
    return;
  }

  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    cartItemsContainer.innerHTML += `
      <div class="cart-item-row">
        <div class="cart-item-details">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">₹${item.price * item.quantity}</span>
        </div>
        <div class="cart-item-quantity-controls">
          <button type="button" class="quantity-btn decrease" onclick="updateQuantity(${index}, -1, event)">−</button>
          <span class="cart-item-quantity">${item.quantity}</span>
          <button type="button" class="quantity-btn increase" onclick="updateQuantity(${index}, 1, event)">+</button>
          <button type="button" class="remove-btn" onclick="removeItem(${index}, event)">Remove</button>
        </div>
      </div>
    `;
  });

  cartTotalContainer.innerHTML = `<strong>Total: ₹${total}</strong>`;
}

// Add removeItem function to handle remove button click
function removeItem(index, event) {
  if (event) event.stopPropagation();

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!cart[index]) return;

  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartPopup();
}


function updateQuantity(index, delta, event) {
  if (event) event.stopPropagation(); // Prevent closing the cart

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (!cart[index]) return;

  cart[index].quantity += delta;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartPopup(); // Keep cart open with updated values
}






function changeQuantity(index, delta) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (!cart[index]) return;

  cart[index].quantity += delta;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1); // Remove item if quantity is zero
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  updateCartCount();
  renderCartPopup();
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;

  container.appendChild(toast);

  // Ensure fade-out starts after display duration
  setTimeout(() => {
    toast.classList.add('fade-out');
  }, 1000); // Display for 1 second before fade out

  // Remove toast after fade-out transition ends
  toast.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'opacity') {
      toast.remove();
    }
  });
}

function addToCart(plantName, plantPrice, plantImage) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    showLoginPopup();
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.name === plantName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: plantName, price: plantPrice, quantity: 1, image: plantImage });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartPopup();

  showToast(`${plantName} has been added to your cart.`);
}

function buyNow(plantName, plantPrice, plantImage) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    showLoginPopup();
    return;
  }

const buyNowItem = [{ name: plantName, price: plantPrice, quantity: 1, image: plantImage }];
localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));

  window.location.href = 'html/billing.html?mode=buyNow';
}

function goToBilling() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    showLoginPopup();
    return;
  }

  // Ensure cart data is saved before redirecting
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  localStorage.setItem('cart', JSON.stringify(cart));

  window.location.href = 'html/billing.html?mode=cart';
}

function fixCartImageUrls() {
  // This function is not necessary if image paths are correct
  // So we will remove it to avoid confusion
}

window.addEventListener('DOMContentLoaded', () => {
  fixCartImageUrls();
  updateCartCount();
  renderCartPopup();
});


// Toggle cart popup
function toggleCartPopup() {
  const popup = document.getElementById('cart-popup');
  popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';
  renderCartPopup();
}

// Close popup when clicking outside
document.addEventListener('click', function(event) {
  const cartContainer = document.getElementById('cart-container');
  if (!cartContainer.contains(event.target)) {
    document.getElementById('cart-popup').style.display = 'none';
  }
});










// Map of plant names to their individual page URLs
const plantPages = {
  "alo vera": "html/alovera.html",
  "bamboo": "html/bamboo.html",
  "croton": "html/croton.html",
  "jade plant": "html/jade-plant.html",
  "money plant": "html/money-plant.html",
  "peacelily": "html/peacelily.html",
  "rubber plant": "html/rubber-plant.html",
  "snake plant": "html/snake-plant.html",
  "spider plant": "html/spider-plant.html",
  "zz plant": "html/zz-plant.html",
  "begonia": "html/begonia.html",
    "begonia": "html/begonia.html",
    "bluebell": "html/bluebell.html",
    "bougainvillea": "html/bougainvillea.html",
    "calendula": "html/calendula.html",
    "camellia": "html/camellia.html",
    "chrysanthemum": "html/chrysanthemum.html",
    "cosmos": "html/cosmos.html",
    "dahlia": "html/dahlia.html",
    "daisy": "html/daisy.html",
    "geranium": "html/geranium.html",
    "hibiscus": "html/hibiscus.html",
    "ixora": "html/ixora.html",
    "jasmine": "html/jasmine.html",
    "lavender": "html/lavender.html",
    "lily": "html/lily.html",
    "marigold": "html/marigold.html",
    "petunia": "html/petunia.html",
    "rose": "html/rose.html",
    "snapdragon": "html/snapdragon.html",
    "sunflower": "html/sunflower.html",
    "zinnia": "html/zinnia.html",
    "petunia blue": "html/petunia_blue.html",
    "gerbera": "html/gerbera.html",
    "fuchsia": "html/fuchsia.html",
    "impatiens": "html/impatiens.html",
    "lantana": "html/lantana.html",
    "nerium": "html/nerium.html",
    "plumeria": "html/plumeria.html",
       "snake plant": "html/snake.html",
    "philodendron": "html/philodendron.html",
    "pothos": "html/pothos.html",
    "chinese evergreen": "html/chinese_evergreen.html",
    "dracaena": "html/dracaena.html",
    "fiddle leaf fig": "html/fiddle_leaf.html",
    "boston fern": "html/boston_fern.html",
    "calathea": "html/calathea.html",
    "cast iron plant": "html/cast_iron.html",
    "chinese money plant": "html/chinese_money_plant.html",
    "dracaena marginata": "html/dracaena_marginata.html",
    "lucky bamboo": "html/lucky_bamboo.html",
    "parlor palm": "html/parlor_palm.html",
       "string of pearls": "html/string-of-pearls.html",
    "english ivy": "html/english-ivy.html",
    "string of hearts": "html/string-of-hearts.html",
    "lipstick plant": "html/lipstick-plant.html",
    "burro's tail": "html/burros-tail.html",
    "hoya": "html/hoya.html",
    "maidenhair fern": "html/maidenhair-fern.html",
    "pothos": "html/pothos.html",
    "string of bananas": "html/string-of-bananas.html",
    "swedish ivy": "html/swedish-ivy.html",
    "string of nickels": "html/string-of-nickels.html",
    "fishbone cactus": "html/fishbone-cactus.html",
    "hanging lipstick plant": "html/hanging-lipstick-plant.html",
    "string of turtles": "html/string-of-turtles.html",
       "tulsi": "html/tulsi.html",
    "costus": "html/costus.html",
    "globe_artichoke": "html/globe_artichoke.html",
    "great burdock": "html/great_burdock.html",
    "lemon balm": "html/lemon_balm.html",
    "methi": "html/methi.html",
    "panfuti": "html/panfuti.html",
    "stevia": "html/stevia.html",
    "thyme": "html/thyme.html"
};

  // Search function to filter and display plant suggestions
  function searchPlants() {
    const input = document.getElementById('search-input').value.toLowerCase().trim();
    const suggestionList = document.getElementById('suggestion-list');

    // Clear previous suggestions and hide list
    suggestionList.innerHTML = '';
    suggestionList.classList.remove('show');

    if (input === '') return;

    let found = false;

  Object.keys(plantPages).forEach(plant => {
    if (plant.includes(input)) {
      found = true;
      const li = document.createElement('li');
      li.textContent = capitalizeWords(plant);
      li.style.padding = '10px 16px';
      li.style.cursor = 'pointer';
      li.style.borderBottom = '1px solid #e0e0e0';
      li.style.backgroundColor = '#ffffff';
      li.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
      li.style.fontSize = '15px';
      li.style.color = '#2f855a';
      li.style.transition = 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, border-left 0.3s ease';
      li.style.boxShadow = 'inset 0 0 5px rgba(0,0,0,0.05)';
      li.style.borderLeft = '4px solid transparent';
      li.addEventListener('mousedown', (event) => {
        event.preventDefault(); // Prevent blur from hiding the list before click
        window.location.href = plantPages[plant];
      });
      li.addEventListener('mouseover', () => {
        li.style.backgroundColor = '#1b4d1b'; // dark green
        li.style.color = '#ffffff';
        li.style.borderLeft = '4px solid #276927';
        li.style.boxShadow = 'inset 5px 0 10px rgba(39, 105, 39, 0.3)';
      });
      li.addEventListener('mouseout', () => {
        li.style.backgroundColor = '#ffffff';
        li.style.color = '#2f855a';
        li.style.borderLeft = '4px solid transparent';
        li.style.boxShadow = 'inset 0 0 5px rgba(0,0,0,0.05)';
      });
      suggestionList.appendChild(li);
    }
  });

  if (found) {
    suggestionList.style.position = 'absolute';
    suggestionList.style.zIndex = '10000';
    suggestionList.style.width = document.getElementById('search-input').offsetWidth + 'px';
    suggestionList.style.maxHeight = '250px';
    suggestionList.style.overflowY = 'auto';
    suggestionList.style.border = '1.5px solid #276927';
    suggestionList.style.borderRadius = '8px';
    suggestionList.style.backgroundColor = '#f7fff7';
    suggestionList.style.boxShadow = '0 8px 20px rgba(39, 105, 39, 0.3)';
    suggestionList.classList.add('show');
  }
  }

// Utility to capitalize each word
function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Add focus/blur behavior dynamically after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-input");
  const suggestionList = document.getElementById("suggestion-list");

  input.addEventListener("focus", () => {
    if (suggestionList.children.length > 0) {
      suggestionList.classList.add("show");
    }
  });

  input.addEventListener("blur", () => {
    setTimeout(() => {
      suggestionList.classList.remove("show");
    }, 200);
  });
});

// Show suggestions only if there's something to show
function toggleSuggestions(show) {
  const list = document.getElementById('suggestion-list');
  if (show && list.children.length > 0) {
    list.classList.add('show');
  }
}

// Hide suggestion dropdown with a delay to allow click
function hideSuggestions() {
  setTimeout(() => {
    const list = document.getElementById('suggestion-list');
    list.classList.remove('show');
  }, 200);
}


document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-input");
  const suggestionList = document.getElementById("suggestion-list");

  // Clear input and suggestions on page load
  input.value = '';
  suggestionList.innerHTML = '';
  suggestionList.classList.remove('show');

  // Focus behavior
  input.addEventListener("focus", () => {
    if (suggestionList.children.length > 0) {
      suggestionList.classList.add("show");
    }
  });

  // Hide dropdown on blur
  input.addEventListener("blur", () => {
    setTimeout(() => {
      suggestionList.classList.remove("show");
    }, 200);
  });
});

window.addEventListener("pageshow", () => {
  document.getElementById("search-input").value = '';
  document.getElementById("suggestion-list").innerHTML = '';
});






// CSS for toast messages
//toast functionality
function showToast(message, duration = 2000) {
  const container = document.getElementById('toast-container') || createToastContainer();

  const toast = document.createElement('div');
  toast.className = 'toast-message show';
  toast.textContent = message;

  container.appendChild(toast);

  // Hide after specified duration
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
  }, duration);

  // Remove from DOM after transition
  toast.addEventListener('transitionend', () => {
    toast.remove();
  });
}

// Create toast container if it doesn't exist
function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  document.body.appendChild(container);
  return container;
}










// Slider functionality
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const dotContainer = document.getElementById("dots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentIndex = 0;
  let intervalId;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      dots[i].classList.remove("active");
    });
    slides[index].classList.add("active");
    dots[index].classList.add("active");
    currentIndex = index;
  }

  function nextSlide() {
    const newIndex = (currentIndex + 1) % slides.length;
    showSlide(newIndex);
  }

  function startSlider() {
    intervalId = setInterval(nextSlide, 5000);
  }

  function stopSlider() {
    clearInterval(intervalId);
  }

  // Dot click functionality
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
    });
  });

  // Pause and resume on dot hover
  dotContainer.addEventListener("mouseenter", stopSlider);
  dotContainer.addEventListener("mouseleave", startSlider);

  // Pause and resume on nav button hover
  [prevBtn, nextBtn].forEach(btn => {
    btn.addEventListener("mouseenter", stopSlider);
    btn.addEventListener("mouseleave", startSlider);
  });

  // Navigation buttons click
  prevBtn.addEventListener("click", () => {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(newIndex);
  });

  nextBtn.addEventListener("click", () => {
    nextSlide();
  });

  // Start the slider
  startSlider();
});









