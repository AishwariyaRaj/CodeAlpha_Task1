// Main JavaScript for ElectroStore

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeCart();
    initializeWishlist();
    initializeSearch();
    initializeReviews();
    initializeQuantityControls();
    initializeAlerts();
});

// Cart functionality
function initializeCart() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if authentication is required
            if (this.dataset.requiresAuth === 'true') {
                showAuthRequiredModal('add to cart');
                return;
            }
            
            const productId = this.dataset.productId;
            addToCart(productId, this);
        });
    });

    // Update cart item quantity
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const itemId = this.dataset.itemId;
            const quantity = parseInt(this.value);
            updateCartItem(itemId, quantity);
        });
    });

    // Remove from cart buttons
    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const itemId = this.dataset.itemId;
            removeFromCart(itemId);
        });
    });
}

// Add product to cart
function addToCart(productId, button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="spinner"></span> Adding...';
    button.disabled = true;

    fetch(`/cart/add/${productId}/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('success', data.message);
            updateCartBadge(data.cart_total);
            
            // Update button text temporarily
            button.innerHTML = '<i class="fas fa-check"></i> Added!';
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }, 2000);
        } else {
            showAlert('error', data.message || 'Error adding to cart');
            button.innerHTML = originalText;
            button.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('error', 'Error adding to cart');
        button.innerHTML = originalText;
        button.disabled = false;
    });
}

// Update cart item quantity
function updateCartItem(itemId, quantity) {
    if (quantity < 1) {
        removeFromCart(itemId);
        return;
    }

    fetch(`/cart/update/${itemId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ quantity: quantity })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update item total
            const itemTotalElement = document.querySelector(`[data-item-total="${itemId}"]`);
            if (itemTotalElement) {
                itemTotalElement.textContent = `$${data.item_total.toFixed(2)}`;
            }
            
            // Update cart total
            const cartTotalElement = document.querySelector('.cart-total');
            if (cartTotalElement) {
                cartTotalElement.textContent = `$${data.cart_total.toFixed(2)}`;
            }
            
            showAlert('success', data.message);
        } else {
            showAlert('error', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('error', 'Error updating cart');
    });
}

// Remove item from cart
function removeFromCart(itemId) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        fetch(`/cart/remove/${itemId}/`, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove item from DOM
                const itemElement = document.querySelector(`[data-cart-item="${itemId}"]`);
                if (itemElement) {
                    itemElement.remove();
                }
                
                showAlert('success', data.message);
                
                // Reload page if cart is empty
                const remainingItems = document.querySelectorAll('[data-cart-item]');
                if (remainingItems.length === 0) {
                    location.reload();
                }
            } else {
                showAlert('error', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('error', 'Error removing item');
        });
    }
}

// Wishlist functionality
function initializeWishlist() {
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if authentication is required
            if (this.dataset.requiresAuth === 'true') {
                showAuthRequiredModal('add to wishlist');
                return;
            }
            
            const productId = this.dataset.productId;
            const isInWishlist = this.classList.contains('active');
            
            if (isInWishlist) {
                removeFromWishlist(productId, this);
            } else {
                addToWishlist(productId, this);
            }
        });
    });
}

// Add to wishlist
function addToWishlist(productId, button) {
    fetch(`/wishlist/add/${productId}/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.action === 'added') {
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-heart"></i>';
            showAlert('success', data.message);
        } else {
            showAlert('info', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('error', 'Error adding to wishlist');
    });
}

// Remove from wishlist
function removeFromWishlist(productId, button) {
    fetch(`/wishlist/remove/${productId}/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            button.classList.remove('active');
            button.innerHTML = '<i class="far fa-heart"></i>';
            showAlert('success', data.message);
        } else {
            showAlert('error', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('error', 'Error removing from wishlist');
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length >= 2) {
                searchTimeout = setTimeout(() => {
                    performSearch(query);
                }, 300);
            } else {
                hideSearchResults();
            }
        });
        
        // Hide search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-container')) {
                hideSearchResults();
            }
        });
    }
}

// Perform search
function performSearch(query) {
    fetch(`/search/?q=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
        displaySearchResults(data.results);
    })
    .catch(error => {
        console.error('Search error:', error);
    });
}

// Display search results
function displaySearchResults(results) {
    let resultsContainer = document.getElementById('searchResults');
    
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'searchResults';
        resultsContainer.className = 'search-results position-absolute bg-white border rounded shadow-lg';
        resultsContainer.style.cssText = 'top: 100%; left: 0; right: 0; z-index: 1000; max-height: 300px; overflow-y: auto;';
        
        const searchContainer = document.querySelector('.input-group');
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(resultsContainer);
    }
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="p-3 text-muted">No products found</div>';
    } else {
        resultsContainer.innerHTML = results.map(product => `
            <a href="${product.url}" class="d-block p-2 text-decoration-none border-bottom">
                <div class="d-flex align-items-center">
                    ${product.image ? `<img src="${product.image}" class="me-2" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">` : ''}
                    <div>
                        <div class="fw-semibold">${product.name}</div>
                        <div class="text-primary">$${product.price}</div>
                    </div>
                </div>
            </a>
        `).join('');
    }
    
    resultsContainer.style.display = 'block';
}

// Hide search results
function hideSearchResults() {
    const resultsContainer = document.getElementById('searchResults');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
}

// Review functionality
function initializeReviews() {
    // Star rating interaction
    document.querySelectorAll('.star-rating').forEach(rating => {
        const stars = rating.querySelectorAll('.star');
        const input = rating.querySelector('input[type="hidden"]') || rating.nextElementSibling;
        
        stars.forEach((star, index) => {
            star.addEventListener('click', function() {
                const value = index + 1;
                if (input) input.value = value;
                
                stars.forEach((s, i) => {
                    s.classList.toggle('active', i < value);
                });
            });
            
            star.addEventListener('mouseover', function() {
                stars.forEach((s, i) => {
                    s.style.color = i <= index ? '#ffc107' : '#ddd';
                });
            });
        });
        
        rating.addEventListener('mouseleave', function() {
            const currentValue = input ? parseInt(input.value) || 0 : 0;
            stars.forEach((s, i) => {
                s.style.color = i < currentValue ? '#ffc107' : '#ddd';
            });
        });
    });
}

// Quantity controls
function initializeQuantityControls() {
    document.querySelectorAll('.quantity-controls').forEach(control => {
        const minusBtn = control.querySelector('.quantity-minus');
        const plusBtn = control.querySelector('.quantity-plus');
        const input = control.querySelector('.quantity-input');
        
        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', function() {
                const currentValue = parseInt(input.value) || 1;
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
            
            plusBtn.addEventListener('click', function() {
                const currentValue = parseInt(input.value) || 1;
                const maxValue = parseInt(input.getAttribute('max')) || 999;
                if (currentValue < maxValue) {
                    input.value = currentValue + 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
        }
    });
}

// Alert system
function initializeAlerts() {
    // Auto-hide alerts after 5 seconds
    document.querySelectorAll('.alert').forEach(alert => {
        setTimeout(() => {
            if (alert.parentNode) {
                alert.classList.add('fade');
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.remove();
                    }
                }, 150);
            }
        }, 5000);
    });
}

// Show alert message
function showAlert(type, message) {
    const alertContainer = document.querySelector('.container');
    if (!alertContainer) return;
    
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.innerHTML = `
        <i class="fas fa-info-circle me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert after navbar or at the beginning of container
    const navbar = document.querySelector('.navbar');
    if (navbar && navbar.nextElementSibling) {
        navbar.parentNode.insertBefore(alertElement, navbar.nextElementSibling);
    } else {
        alertContainer.insertBefore(alertElement, alertContainer.firstChild);
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.classList.remove('show');
            setTimeout(() => {
                if (alertElement.parentNode) {
                    alertElement.remove();
                }
            }, 150);
        }
    }, 5000);
}

// Update cart badge
function updateCartBadge(count) {
    const badge = document.querySelector('.navbar .badge');
    if (badge) {
        badge.textContent = count;
        if (count > 0) {
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Image lazy loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if supported
if ('IntersectionObserver' in window) {
    initializeLazyLoading();
}

// Form validation enhancement
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn && !submitBtn.disabled) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
            submitBtn.disabled = true;
            
            // Re-enable button after 10 seconds as fallback
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 10000);
        }
    });
});

// Show authentication required modal/alert
function showAuthRequiredModal(action) {
    const message = `Please <a href="/accounts/login/" class="fw-bold text-decoration-none">login</a> or <a href="/accounts/register/" class="fw-bold text-decoration-none">register</a> to ${action}.`;
    
    // Create a more prominent modal-style alert
    const modalHtml = `
        <div class="modal fade" id="authRequiredModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-user-lock me-2"></i>Authentication Required
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center py-4">
                        <i class="fas fa-shopping-cart text-primary mb-3" style="font-size: 3rem;"></i>
                        <p class="mb-4">You need to be logged in to ${action}.</p>
                        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                            <a href="/accounts/login/" class="btn btn-primary btn-lg me-md-2">
                                <i class="fas fa-sign-in-alt me-2"></i>Login
                            </a>
                            <a href="/accounts/register/" class="btn btn-outline-primary btn-lg">
                                <i class="fas fa-user-plus me-2"></i>Register
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if present
    const existingModal = document.getElementById('authRequiredModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal using Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('authRequiredModal'));
    modal.show();
    
    // Clean up modal after it's hidden
    document.getElementById('authRequiredModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Enhanced button hover effects for non-authenticated users
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects for buttons that require authentication
    document.querySelectorAll('[data-requires-auth="true"]').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});