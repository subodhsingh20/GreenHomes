document.addEventListener("DOMContentLoaded", () => {
const paymentForm = document.getElementById("payment-form");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const selectedAddress = JSON.parse(localStorage.getItem("selectedAddress"));
    const addressDisplay = document.getElementById("address-display");

    if (!loggedInUser) {
        alert("Please login to access the payment page.");
        window.location.href = "login.html";
        return;
    }

    if (selectedAddress) {
        addressDisplay.textContent = `Shipping to: ${selectedAddress.fullName}, ${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.zip}`;
    } else {
        alert("No address selected. Please go back to the billing page to select an address.");
        window.location.href = "billing.html";
        return;
    }

    paymentForm.addEventListener("submit", (e) => {
        e.preventDefault();
                const cardNumber = document.getElementById("cardNumber");
            });
        });