let cart = [];

// Initialize or retrieve the cart from local storage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Save the cart to local storage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(productName, price) {
    const cart = getCart();
    const existingProductIndex = cart.findIndex(item => item.name === productName);

    if (existingProductIndex > -1) {
        // If product already exists, increase the quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // If product is new, add it to the cart
        cart.push({ name: productName, price: price, quantity: 1 });
    }

    saveCart(cart);
    alert(`${productName} has been added to your cart.`);
    viewCart(); // Refresh the cart view
}

// View cart function
function viewCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalContainer = document.getElementById('cartTotal');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartSummary = document.querySelector('.cart-summary');
    const billingAddress = document.querySelector('.billing-address');
    const paymentMethods = document.querySelector('.payment-methods');
    const deliveryOptions = document.querySelector('.delivery-options');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    cartItemsContainer.innerHTML = ''; // Clear previous items
    let total = 0;

    if (cart.length === 0) {
        // Show empty cart message and hide other sections
        emptyCartMessage.style.display = 'none';
        cartSummary.style.display = 'none';
        billingAddress.style.display = 'none';
        paymentMethods.style.display = 'none';
        deliveryOptions.style.display = 'none';
        cartTotalContainer.innerHTML = 'Total: R 0.00';
        placeOrderBtn.disabled = true;
    } else {
        // Show cart items and update total
        emptyCartMessage.style.display = 'none';
        cartSummary.style.display = 'block';
        billingAddress.style.display = 'block';
        paymentMethods.style.display = 'block';
        deliveryOptions.style.display = 'block';

        cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'cart-item';

    // Create a div for product details and quantity buttons to ensure alignment
    cartItemDiv.innerHTML = `
        <div class="cart-item-details">
            <span class="cart-item-name">${item.name} - R ${item.price} x ${item.quantity} = R ${itemTotal.toFixed(2)}</span>
            <div class="quantity-buttons">
                <button class="quantity-btn" onclick="changeQuantity('${item.name}', -1)">-</button>
                <button class="quantity-btn" onclick="changeQuantity('${item.name}', 1)">+</button>
            </div>
        </div>
    `;
    cartItemsContainer.appendChild(cartItemDiv);
});


        cartTotalContainer.innerHTML = `Total: R ${total.toFixed(2)}`;
        updatePlaceOrderButton(); // Update the Place Order button
    }
    
    document.getElementById('cartModal').style.display = 'block';
    updatePlaceOrderButton(); // Update Place Order button state
}

// Change quantity of cart items
function changeQuantity(productName, change) {
    const cart = getCart();
    const productIndex = cart.findIndex(item => item.name === productName);

    if (productIndex > -1) {
        cart[productIndex].quantity += change;
        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1); // Remove item if quantity is 0
        }
    }

    saveCart(cart);
    viewCart(); // Refresh cart view
}

// Clear cart function
function clearCart() {
    localStorage.removeItem('cart');
    viewCart(); // Refresh cart view
}

// Update Delivery Cost based on the selected option
function updateDeliveryCost() {
	const cart = getCart(); // Get the current cart items
    const deliveryOption = document.getElementById('deliveryOption').value; // Get selected delivery option from dropdown
    let additionalCost = 0;

    if (deliveryOption === 'delivery') {
        additionalCost = 19.99; // Example delivery cost
    }

    // Display delivery cost
    const deliveryCostElement = document.getElementById('additionalCost');
    if (additionalCost) {
        deliveryCostElement.style.display = 'block';
        deliveryCostElement.textContent = `Delivery Cost: R ${additionalCost.toFixed(2)}`;
    } else {
        deliveryCostElement.style.display = 'none';
    }

    // Recalculate total with delivery cost
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + additionalCost;
    document.getElementById('cartTotal').textContent = `Total: R ${total.toFixed(2)}`;

    updatePlaceOrderButton();
}

// Update Payment Method details when selected
function updatePaymentDetails() {
    const paymentMethod = document.getElementById('paymentMethod').value; // Get selected payment method from dropdown

    // Show details based on selected payment method
    if (paymentMethod === 'directTransfer') {
        document.getElementById('bankDetails').style.display = 'block';
        document.getElementById('paypalDetails').style.display = 'none';
    } else if (paymentMethod === 'paypal') {
        document.getElementById('paypalDetails').style.display = 'block';
        document.getElementById('bankDetails').style.display = 'none';
    }
}

// Enable or disable the Place Order button based on form input validity
function updatePlaceOrderButton() {
    // Get the values of the input fields and dropdowns
    const billingName = document.getElementById('billingName').value.trim();
    const billingEmail = document.getElementById('billingEmail').value.trim();
    const billingAddress = document.getElementById('billingAddress').value.trim();
    const billingPhone = document.getElementById('billingPhone').value.trim();
    const paymentMethod = document.getElementById('paymentMethod').value;
    const deliveryOption = document.getElementById('deliveryOption').value;

    // Check if all fields are filled and if a payment method and delivery option are selected
    const isFormValid = billingName && billingEmail && billingAddress && billingPhone && paymentMethod && deliveryOption;

    // Enable or disable the Place Order button based on the form validity
    document.getElementById('placeOrderBtn').disabled = !isFormValid;
}


// Handle the "Place Order" action
function placeOrder() {
    const cart = getCart();
    const billingName = document.getElementById('billingName').value;
    const billingEmail = document.getElementById('billingEmail').value;
    const billingAddress = document.getElementById('billingAddress').value;
    const billingPhone = document.getElementById('billingPhone').value;
    const paymentMethod = document.getElementById('paymentMethod').value; // Get selected payment method
    const deliveryOption = document.getElementById('deliveryOption').value; // Get selected delivery option

    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before checking out.");
        return;
    }

    let message = `Hello! I would like to place an order for the following items:\n\n`;
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `${item.name} - R ${item.price} x ${item.quantity} = R ${itemTotal.toFixed(2)}\n`;
    });

    const additionalCost = deliveryOption === 'delivery' ? 50 : 0;
    message += `\nDelivery: ${deliveryOption} (R ${additionalCost.toFixed(2)})\n`;
    message += `\nTotal: R ${(total + additionalCost).toFixed(2)}\n`;
    message += `\nBilling Info:\nName: ${billingName}\nEmail: ${billingEmail}\nAddress: ${billingAddress}\nPhone: ${billingPhone}\n`;
    message += `Payment Method: ${paymentMethod}\n`;

    // Encode the message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/27726962588?text=${encodedMessage}`;

    // Open WhatsApp link in a new tab
    window.open(whatsappLink, '_blank');

    // Clear the cart after placing the order
    localStorage.removeItem('cart');
    alert("Your order has been placed!");
}

// Close cart modal
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Hamburger menu for mobile view
document.getElementById('hamburger').addEventListener('click', function() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('show');
});

// Close menu
document.getElementById('close').addEventListener('click', function() {
    const menu = document.getElementById('menu');
    menu.classList.remove('show');
});


function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const products = document.querySelectorAll('.product');
    
    products.forEach(product => {
        const productName = product.querySelector('h3').innerText.toLowerCase();
        const productCategory = product.getAttribute('data-category');

        const matchesSearch = productName.includes(searchInput);
        const matchesCategory = categoryFilter === "" || productCategory === categoryFilter;

        if (matchesSearch && matchesCategory) {
            product.style.display = ''; // Show product
        } else {
            product.style.display = 'none'; // Hide product
        }
    });
}

function changeImage(newImage) {
    const productImage = event.target.closest('.product').querySelector('.product-image');
    productImage.src = newImage; // Change the image source
}

// EXTERNAL PAGE PRODUCT SEARCH // 
function filterProducts() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const resultsContainer = document.getElementById("searchResults");
    
    // Clear previous results
    resultsContainer.innerHTML = '';

    // If input is empty, return without doing anything
    if (!searchInput) {
        return;
    }

    // Get all product elements in the products list
    const allProducts = document.querySelectorAll(".products .product");

    let resultsFound = false;

    // Loop through each product and check if it matches the search input
    allProducts.forEach(product => {
        const productName = product.querySelector("h3").innerText.toLowerCase();

        if (productName.includes(searchInput)) {
            // Clone the product and append it to the results container
            const productClone = product.cloneNode(true);
            resultsContainer.appendChild(productClone);
            resultsFound = true;
        }
    });

    // If no results found, display a message
    if (!resultsFound) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
    }
}

// Event listener to handle input changes
document.getElementById("searchInput").addEventListener("input", filterProducts);

//ABOUT US ANIMATION//
document.addEventListener("DOMContentLoaded", function () {
  const animatedSection = document.querySelector(".about-text");

  // Function to check if an element is in the viewport
  const isInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.8; // Trigger when it's about 80% into view
  };

  const handleScrollAnimation = () => {
    if (isInViewport(animatedSection)) {
      animatedSection.classList.add("show");
    }
  };

  // Trigger animation on scroll
  window.addEventListener("scroll", handleScrollAnimation);

  // Trigger on page load in case it's already in view
  handleScrollAnimation();
});

//TESTIMONIALS//
document.addEventListener("DOMContentLoaded", function () {
  const testimonials = document.querySelectorAll(".testimonial");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  let currentIndex = 0;

  const showTestimonial = (index) => {
    testimonials.forEach((testimonial, idx) => {
      // Hide all testimonials
      testimonial.style.opacity = 0;
      testimonial.style.transform = "translateX(100%)";
    });

    // Show only the current testimonial
    testimonials[index].style.opacity = 1;
    testimonials[index].style.transform = "translateX(0)";
  };

  const showNextTestimonial = () => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
  };

  const showPreviousTestimonial = () => {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentIndex);
  };

  prevButton.addEventListener("click", showPreviousTestimonial);
  nextButton.addEventListener("click", showNextTestimonial);

  // Initialize the first testimonial view
  showTestimonial(currentIndex);

  // Optional: Auto-rotate testimonials every 5 seconds
  setInterval(showNextTestimonial, 5000);
});

//CONTACT FORM//
function sendMessage() {
      const fullName = document.getElementById("fullName").value;
      const email = document.getElementById("email").value;
      const contactNumber = document.getElementById("contactNumber").value;
      const address = document.getElementById("address").value;
      const messageContent = document.getElementById("message").value;

      const message = 
        `Full Name: ${fullName}%0A` +
        `Email: ${email}%0A` +
        `Contact Number: ${contactNumber}%0A` +
        `Address: ${address}%0A` +
        `Message: ${messageContent}`;

      const whatsappNumber = '27726962588'; // Replace with your WhatsApp number

      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      window.open(whatsappURL, '_blank');
    }
	
//FAQ QUESTIONS//	
// Function to toggle answers in the FAQ
        function toggleAnswer(index) {
            const answers = document.querySelectorAll('.faq-answer');
            const questions = document.querySelectorAll('.faq-question span');

            // Collapse all other answers
            answers.forEach((answer, i) => {
                if (i !== index) {
                    answer.style.display = 'none';
                    questions[i * 2 + 1].innerHTML = '&#9660;';
                }
            });

            // Toggle the clicked answer
            const currentAnswer = answers[index];
            const currentIcon = questions[index * 2 + 1];

            if (currentAnswer.style.display === 'block') {
                currentAnswer.style.display = 'none';
                currentIcon.innerHTML = '&#9660;';
            } else {
                currentAnswer.style.display = 'block';
                currentIcon.innerHTML = '&#9650;';
            }
        }
