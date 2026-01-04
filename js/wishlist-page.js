// Wishlist Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadWishlist();
    initWishlistActions();
    updateWishlistCount();
});

function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('techmart_wishlist') || '[]');
    const wishlistItems = document.querySelector('.wishlist-items');
    const emptyWishlist = document.querySelector('.empty-wishlist');
    const wishlistActions = document.querySelector('.wishlist-actions');
    
    if (wishlist.length === 0) {
        emptyWishlist.style.display = 'flex';
        wishlistItems.style.display = 'none';
        wishlistActions.style.display = 'none';
        return;
    }
    
    emptyWishlist.style.display = 'none';
    wishlistActions.style.display = 'flex';
    
    wishlistItems.innerHTML = wishlist.map(item => `
        <div class="wishlist-item" data-product-id="${item.id}">
            <div class="wishlist-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="wishlist-item-details">
                <h3>${item.name}</h3>
                <div class="wishlist-item-price">
                    <span class="price">${item.price}</span>
                </div>
                <div class="wishlist-item-actions">
                    <button class="btn-primary add-to-cart" data-product-id="${item.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-remove" data-product-id="${item.id}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const item = wishlist.find(p => p.id === productId);
            
            if (item) {
                TechMart.addToCart({
                    name: item.name,
                    price: item.price,
                    quantity: 1
                });
                TechMart.showToast(`${item.name} added to cart!`, 'success');
            }
        });
    });
    
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            removeFromWishlist(productId);
            TechMart.showToast('Item removed from wishlist', 'success');
            loadWishlist();
            updateWishlistCount();
        });
    });
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('techmart_wishlist') || '[]');
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('techmart_wishlist', JSON.stringify(wishlist));
}

function initWishlistActions() {
    const clearBtn = document.querySelector('.clear-wishlist');
    
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your entire wishlist?')) {
                localStorage.setItem('techmart_wishlist', '[]');
                TechMart.showToast('Wishlist cleared', 'success');
                loadWishlist();
                updateWishlistCount();
            }
        });
    }
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('techmart_wishlist') || '[]');
    const wishlistCounts = document.querySelectorAll('.wishlist-count');
    wishlistCounts.forEach(count => {
        count.textContent = wishlist.length;
    });
}
