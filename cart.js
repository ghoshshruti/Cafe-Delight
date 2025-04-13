// Shopping Cart Functionality
document.addEventListener('DOMContentLoaded', function() {
    let cart = [];
    
    // Load cart from localStorage if available
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCartCount();
    }
    
    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.btn-add');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item') || this.closest('.item-card');
            const itemName = menuItem.querySelector('h3').textContent;
            const itemPrice = parseFloat(menuItem.querySelector('.price').textContent.replace('$', ''));
            const itemImage = menuItem.querySelector('img').src;
            
            addToCart(itemName, itemPrice, itemImage);
        });
    });
    
    function addToCart(name, price, image) {
        // Check if item already in cart
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show notification
        showNotification(`${name} added to cart!`);
    }
    
    function updateCartCount() {
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.querySelector('.cart-count');
        
        if (cartCount > 0) {
            if (!cartCountElement) {
                const cartLink = document.createElement('a');
                cartLink.href = 'order.html';
                cartLink.className = 'cart-link';
                cartLink.innerHTML = `<i class="fas fa-shopping-cart"></i> <span class="cart-count">${cartCount}</span>`;
                
                const header = document.querySelector('header .container');
                header.appendChild(cartLink);
            } else {
                cartCountElement.textContent = cartCount;
            }
        } else if (cartCountElement) {
            document.querySelector('.cart-link').remove();
        }
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Order page functionality
    if (document.querySelector('.order-page')) {
        displayCartItems();
        setupOrderForm();
    }
    
    function displayCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalElement = document.querySelector('.cart-total');
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            cartTotalElement.textContent = '$0.00';
            return;
        }
        
        let total = 0;
        cartItemsContainer.innerHTML = '';
        
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="item-total">
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="btn-remove" data-index="${index}"><i class="fas fa-times"></i></button>
                </div>
            `;
            
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });
        
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromCart(index);
            });
        });
    }
    
    function removeFromCart(index) {
        if (index >= 0 && index < cart.length) {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            displayCartItems();
        }
    }
    
    function setupOrderForm() {
        const orderForm = document.querySelector('.order-form');
        
        if (orderForm) {
            orderForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const orderType = document.querySelector('input[name="order-type"]:checked').value;
                const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
                const specialRequests = document.getElementById('requests').value;
                
                // In a real app, you would send this data to your backend
                console.log('Order submitted:', {
                    name,
                    email,
                    phone,
                    orderType,
                    paymentMethod,
                    specialRequests,
                    cart
                });
                
                // Show success message
                alert('Order placed successfully! Thank you.');
                
                // Clear cart
                cart = [];
                localStorage.removeItem('cart');
                updateCartCount();
                displayCartItems();
                
                // Reset form
                orderForm.reset();
            });
        }
    }
});