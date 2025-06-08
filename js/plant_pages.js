
  document.addEventListener('DOMContentLoaded', function () {
    const cartBtn = document.getElementById('cart-toggle-btn');
    const cartPopup = document.getElementById('cart-popup');
    const cartContent = document.getElementById('cart-content');
    const cartTotal = document.getElementById('cart-total');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const buyNowBtn = document.getElementById('buy-now-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Toast container
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);

    if (cartBtn) {
      cartBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        cartPopup.style.display = cartPopup.style.display === 'block' ? 'none' : 'block';
        displayCart();
      });
    }

    document.addEventListener('click', (event) => {
      if (cartPopup && cartPopup.style.display === 'block' && !cartPopup.contains(event.target) && event.target !== cartBtn) {
        cartPopup.style.display = 'none';
      }
    });

    if (addToCartBtn) addToCartBtn.addEventListener('click', addToCart);
    if (buyNowBtn) buyNowBtn.addEventListener('click', buyNow);
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => window.location.href = '../html/billing.html');

    function showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
      }, 2500);

      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 3000);
    }

    function addToCart() {
      const plantNameElem = document.querySelector('.plant-title');
      const priceElem = document.querySelector('.price-section .price');

      if (!plantNameElem || !priceElem) {
        showToast('Error: Plant name or price not found.');
        return;
      }

      const product = {
        name: plantNameElem.textContent.trim(),
        price: parseFloat(priceElem.textContent.replace(/[^\d.]/g, '')),
        quantity: 1
      };

      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = cart.find(item => item.name === product.name);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push(product);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      showToast(`${product.name} added to cart!`);
      updateCartCount();
      displayCart();
    }

    function buyNow() {
      const plantNameElem = document.querySelector('.plant-title');
      const priceElem = document.querySelector('.price-section .price');

      if (!plantNameElem || !priceElem) {
        alert('Error: Plant name or price not found.');
        return;
      }

      const product = {
        name: plantNameElem.textContent.trim(),
        price: parseFloat(priceElem.textContent.replace(/[^\d.]/g, '')),
        quantity: 1
      };

      localStorage.setItem('cart', JSON.stringify([product]));
      window.location.href = '../html/billing.html';
    }

    function displayCart() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cartContent.innerHTML = '';
      let total = 0;

      if (cart.length === 0) {
        cartContent.innerHTML = '<p>Your cart is empty.</p>';
      } else {
        cart.forEach(item => {
          const itemEl = document.createElement('div');
          itemEl.className = 'cart-item';
          itemEl.innerHTML = `
            <div>
              <h4>${item.name}</h4>
              <p>Price: ₹${item.price} x ${item.quantity}</p>
              <div class="quantity-controls">
                <button class="decrease-btn enhanced-btn" data-name="${item.name}">−</button>
                <span class="quantity">${item.quantity}</span>
                <button class="increase-btn enhanced-btn" data-name="${item.name}">+</button>
              </div>
            </div>
          `;
          cartContent.appendChild(itemEl);
          total += item.price * item.quantity;
        });

        cartContent.querySelectorAll('.increase-btn').forEach(button => {
          button.addEventListener('click', (event) => {
            event.stopPropagation();
            const name = button.getAttribute('data-name');
            updateQuantity(name, 1);
          });
        });

        cartContent.querySelectorAll('.decrease-btn').forEach(button => {
          button.addEventListener('click', (event) => {
            event.stopPropagation();
            const name = button.getAttribute('data-name');
            updateQuantity(name, -1);
          });
        });
      }

      cartTotal.textContent = `Total: ₹${total}`;
    }

    function updateQuantity(name, change) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const item = cart.find(i => i.name === name);
      if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
          cart = cart.filter(i => i.name !== name);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCart();
      }
    }

    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      if (cartBtn) cartBtn.innerHTML = `🛒 (${count})`;
    }

    updateCartCount();
    displayCart();
    if (cartPopup) cartPopup.style.display = 'none';
  });

  // Review modal and review submission handling
  document.addEventListener('DOMContentLoaded', function () {
    const writeReviewBtn = document.getElementById('write-review-btn');
    const reviewModal = document.getElementById('review-modal');
    const closeReviewModalBtn = document.getElementById('close-review-modal');
    const reviewForm = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');
    const averageRatingElem = document.getElementById('average-rating');
    const reviewCountElem = document.getElementById('review-count');

    // Show modal on write review button click
    writeReviewBtn.addEventListener('click', () => {
      reviewModal.style.display = 'flex';
    });

    // Close modal on close button click
    closeReviewModalBtn.addEventListener('click', () => {
      reviewModal.style.display = 'none';
    });

    // Close modal on outside click
    window.addEventListener('click', (event) => {
      if (event.target === reviewModal) {
        reviewModal.style.display = 'none';
      }
    });

    // Load reviews from localStorage
    function loadReviews() {
      const reviews = JSON.parse(localStorage.getItem('aloveraReviews')) || [];
      return reviews;
    }

    // Save reviews to localStorage
    function saveReviews(reviews) {
      localStorage.setItem('aloveraReviews', JSON.stringify(reviews));
    }

    // Render reviews on the page
    function renderReviews() {
      const reviews = loadReviews();
      reviewsList.innerHTML = '';

      if (reviews.length === 0) {
        reviewsList.innerHTML = '<p>No reviews yet. Be the first to write one!</p>';
        averageRatingElem.textContent = '0';
        reviewCountElem.textContent = '0 reviews';
        updateRatingDistribution([]);
        return;
      }

      let totalRating = 0;
      reviews.forEach((review, index) => {
        totalRating += review.rating;

        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';

        const starsDiv = document.createElement('div');
        starsDiv.className = 'review-stars';
        for (let i = 1; i <= 5; i++) {
          const starIcon = document.createElement('i');
          if (i <= review.rating) {
            starIcon.className = 'fas fa-star';
          } else {
            starIcon.className = 'far fa-star';
          }
          starsDiv.appendChild(starIcon);
        }

        const dateDiv = document.createElement('div');
        dateDiv.className = 'review-date';
        dateDiv.textContent = new Date(review.date).toLocaleDateString();

        const textDiv = document.createElement('div');
        textDiv.className = 'review-text';
        const strong = document.createElement('strong');
        strong.textContent = review.name;
        const p = document.createElement('p');
        p.textContent = review.text;
        textDiv.appendChild(strong);
        textDiv.appendChild(p);

        // Add delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.marginTop = '8px';
        deleteBtn.style.backgroundColor = '#d32f2f';
        deleteBtn.style.color = 'white';
        deleteBtn.style.border = 'none';
        deleteBtn.style.padding = '6px 12px';
        deleteBtn.style.borderRadius = '6px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.addEventListener('click', () => {
          // Use toast message for confirmation instead of alert
          const toastContainer = document.getElementById('toast-container');
          if (!toastContainer) return;

          // Create toast element
          const toast = document.createElement('div');
          toast.className = 'toast';
          toast.textContent = 'Review deleted';

          // Add undo button
          const undoBtn = document.createElement('button');
          undoBtn.textContent = 'Undo';
          undoBtn.style.marginLeft = '10px';
          undoBtn.style.background = 'transparent';
          undoBtn.style.color = '#fff';
          undoBtn.style.border = 'none';
          undoBtn.style.cursor = 'pointer';
          undoBtn.style.fontWeight = 'bold';

          toast.appendChild(undoBtn);
          toastContainer.appendChild(toast);

          // Remove review immediately
          const removedReview = reviews.splice(index, 1)[0];
          saveReviews(reviews);
          renderReviews();

          // Undo handler
          undoBtn.addEventListener('click', () => {
            reviews.splice(index, 0, removedReview);
            saveReviews(reviews);
            renderReviews();
            toast.remove();
          });

          // Auto remove toast after 3seconds
          setTimeout(() => {
            toast.remove();
          }, 7000);
        });

        textDiv.appendChild(deleteBtn);

        reviewCard.appendChild(starsDiv);
        reviewCard.appendChild(dateDiv);
        reviewCard.appendChild(textDiv);

        reviewsList.appendChild(reviewCard);
      });

      const avgRating = (totalRating / reviews.length).toFixed(1);
      averageRatingElem.textContent = avgRating;
      reviewCountElem.textContent = `${reviews.length} review${reviews.length > 1 ? 's' : ''}`;

      updateRatingDistribution(reviews);
    }

    // New function to update rating distribution bars dynamically
    function updateRatingDistribution(reviews) {
      const totalReviews = reviews.length;
      const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 for 1-star, 4 for 5-star

      reviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          ratingCounts[review.rating - 1]++;
        }
      });

      const barFills = document.querySelectorAll('.rating-distribution .bar-fill');
      if (barFills.length !== 5) return;

      for (let i = 0; i < 5; i++) {
        const percentage = totalReviews === 0 ? 0 : (ratingCounts[4 - i] / totalReviews) * 100;
        barFills[i].style.width = percentage + '%';
      }
    }

    // Handle review form submission
    reviewForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('reviewer-name').value.trim();
      const rating = parseInt(document.getElementById('review-rating').value);
      const text = document.getElementById('review-text').value.trim();

      if (!name || !rating || !text) {
        alert('Please fill in all fields.');
        return;
      }

      const reviews = loadReviews();
      reviews.push({
        name,
        rating,
        text,
        date: new Date().toISOString()
      });

      saveReviews(reviews);
      renderReviews();

      reviewForm.reset();
      reviewModal.style.display = 'none';
    });

    // Initial render of reviews
    renderReviews();
  });
