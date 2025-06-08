document.addEventListener("DOMContentLoaded", function () {
  const billingBox = document.getElementById("billing-box");
  const savedAddressList = document.getElementById("saved-addresses");
  const billingForm = document.getElementById("billing-form");
  const paymentPopup = document.getElementById("payment-popup");
  const paymentDetails = document.getElementById("payment-details");
  const confirmBtn = document.getElementById("confirm-payment");
  const cancelBtn = document.getElementById("cancel-payment");

  // 🛒 1. Render Billing Summary
  function renderBillingSummary() {
    // Check URL param mode
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    let cart = [];
    if (mode === 'buyNow') {
      cart = JSON.parse(localStorage.getItem("buyNowItem")) || [];
    } else {
      cart = JSON.parse(localStorage.getItem("cart")) || [];
    }

    if (cart.length === 0) {
      billingBox.innerHTML = `<h2>No items in cart</h2>`;
      return;
    }

    let total = 0;
    let summaryHTML = `<h2>Billing Summary</h2><hr>`;

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      summaryHTML += `
        <p><strong>${item.name}</strong> x ${item.quantity} — ₹${itemTotal.toFixed(2)}</p>
      `;
    });

    summaryHTML += `<hr><p class="total">Total Amount: ₹${total.toFixed(2)}</p>`;

    billingBox.innerHTML = summaryHTML;
  }

  // 🏠 2. Handle Address Form Submission
  billingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const zip = document.getElementById("zip").value;

    const newAddress = {
      fullName, address, city, state, zip
    };

    const saved = JSON.parse(localStorage.getItem("savedAddresses")) || [];
    saved.push(newAddress);
    localStorage.setItem("savedAddresses", JSON.stringify(saved));

    billingForm.reset();
    renderSavedAddresses();
  });

  // 💾 3. Render Saved Addresses
  function renderSavedAddresses() {
    const addresses = JSON.parse(localStorage.getItem("savedAddresses")) || [];
    savedAddressList.innerHTML = "";

    addresses.forEach((addr, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${addr.fullName}, ${addr.address}, ${addr.city}, ${addr.state}, ${addr.zip}
        <br>
        <button class="use-btn" onclick="showPaymentPopup()">Use This</button>
        <button class="delete-btn" onclick="deleteAddress(${index})">Delete</button>
      `;
      savedAddressList.appendChild(li);
    });
  }

  window.deleteAddress = function (index) {
    const addresses = JSON.parse(localStorage.getItem("savedAddresses")) || [];
    addresses.splice(index, 1);
    localStorage.setItem("savedAddresses", JSON.stringify(addresses));
    renderSavedAddresses();
  };

  // 💳 4. Payment Popup Logic
  window.showPaymentPopup = function () {
    paymentPopup.style.display = "flex";
    paymentDetails.innerHTML = "";
    const selected = document.querySelector('input[name="payment-method"]:checked');
    if (selected && selected.value.includes("Card")) {
      addPaymentFields(selected.value);
    }
  };

  const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
  paymentMethods.forEach(method => {
    method.addEventListener("change", function () {
      paymentDetails.innerHTML = "";
      if (this.value.includes("Card") || this.value === "UPI") {
        addPaymentFields(this.value);
      }
    });
  });

  function addPaymentFields(method) {
    if (method === "UPI") {
      paymentDetails.innerHTML = `
        <label for="upi-id">Enter UPI ID:</label>
        <input type="text" id="upi-id" placeholder="example@upi" required />
      `;
    } else {
      paymentDetails.innerHTML = `
        <label>Card Number:</label>
        <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required maxlength="19">
        <label>Expiry Date:</label>
        <input type="text" id="expiry-date" placeholder="MM/YY" required maxlength="5">
        <label>CVV:</label>
        <input type="password" id="cvv" placeholder="123" required maxlength="3">
      `;
    }
  }

  // Validate payment fields
  function validatePayment() {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
    if (!selectedMethod) {
      alert("Please select a payment method.");
      return false;
    }
    if (selectedMethod.value === "Cash on Delivery") {
      return true;
    }
    if (selectedMethod.value === "UPI") {
      const upiId = document.getElementById("upi-id");
      if (!upiId || !upiId.value.trim()) {
        alert("Please enter a valid UPI ID.");
        return false;
      }
      return true;
    }
    // Card validation for Credit Card and Debit Card
    if (selectedMethod.value === "Credit Card" || selectedMethod.value === "Debit Card") {
      const cardNumber = document.getElementById("card-number");
      const expiryDate = document.getElementById("expiry-date");
      const cvv = document.getElementById("cvv");
      if (!cardNumber || !expiryDate || !cvv) {
        alert("Please fill all card details.");
        return false;
      }
      const cardNumVal = cardNumber.value.replace(/\s+/g, '');
      if (!/^\d{16}$/.test(cardNumVal)) {
        alert("Card number must be 16 digits.");
        return false;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate.value)) {
        alert("Expiry date must be in MM/YY format.");
        return false;
      }
      if (!/^\d{3}$/.test(cvv.value)) {
        alert("CVV must be 3 digits.");
        return false;
      }
      return true;
    }
    return true;
  }

  confirmBtn.addEventListener("click", function () {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
    if (!selectedMethod) {
      alert("Please select a payment method before confirming payment.");
      return;
    }
    if (!validatePayment()) return;
    alert("✅ Payment Successful! Thank you for your purchase.");
    localStorage.removeItem("cart");
    localStorage.removeItem("buyNowItem");
    paymentPopup.style.display = "none";
    window.location.href = "../index.html"; // Redirect to home
  });

  cancelBtn.addEventListener("click", function () {
    paymentPopup.style.display = "none";
  });

  // 🔁 Init
  renderBillingSummary();
  renderSavedAddresses();
});
