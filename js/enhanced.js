// Enhanced Features JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initStudentBanner();
    initWishlist();
    initQuickView();
    initFlashDealsTimer();
    initProductActions();
});

// Student Banner
function initStudentBanner() {
    const closeBanner = document.querySelector('.close-banner');
    const banner = document.querySelector('.student-banner');
    
    // Check if banner was previously closed
    if (localStorage.getItem('bannerClosed') === 'true') {
        if (banner) banner.style.display = 'none';
    }
    
    if (closeBanner) {
        closeBanner.addEventListener('click', function() {
            banner.style.animation = 'slideDown 0.5s reverse';
            setTimeout(() => {
                banner.style.display = 'none';
                localStorage.setItem('bannerClosed', 'true');
            }, 500);
        });
    }
}

// Wishlist Functionality
function initWishlist() {
    updateWishlistCount();
    
    // Wishlist toggle buttons
    const wishlistToggles = document.querySelectorAll('.wishlist-toggle');
    wishlistToggles.forEach(button => {
        const productCard = button.closest('.product-card');
        const productId = productCard?.getAttribute('data-product-id');
        
        // Check if already in wishlist
        if (isInWishlist(productId)) {
            button.classList.add('active');
            button.querySelector('i').classList.remove('far');
            button.querySelector('i').classList.add('fas');
        }
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            const productImage = productCard.querySelector('img').src;
            
            if (this.classList.contains('active')) {
                removeFromWishlist(productId);
                this.classList.remove('active');
                this.querySelector('i').classList.remove('fas');
                this.querySelector('i').classList.add('far');
                TechMart.showToast('Removed from wishlist', 'success');
            } else {
                addToWishlist({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage
                });
                this.classList.add('active');
                this.querySelector('i').classList.remove('far');
                this.querySelector('i').classList.add('fas');
                TechMart.showToast('Added to wishlist ❤️', 'success');
            }
        });
    });
}

function addToWishlist(product) {
    let wishlist = JSON.parse(localStorage.getItem('techmart_wishlist') || '[]');
    
    if (!wishlist.find(item => item.id === product.id)) {
        wishlist.push(product);
        localStorage.setItem('techmart_wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
    }
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('techmart_wishlist') || '[]');
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('techmart_wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

function isInWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('techmart_wishlist') || '[]');
    return wishlist.some(item => item.id === productId);
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('techmart_wishlist') || '[]');
    const wishlistCount = document.querySelector('.wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}

// Quick View Modal
function initQuickView() {
    const modal = document.getElementById('quickViewModal');
    const closeBtn = document.querySelector('.modal-close');
    
    // Quick view buttons
    const quickViewButtons = document.querySelectorAll('.quick-view');
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            
            openQuickView(productCard);
        });
    });
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Modal buttons
    const modalAddCart = document.querySelector('.modal-add-cart');
    const modalAddWishlist = document.querySelector('.modal-add-wishlist');
    
    if (modalAddCart) {
        modalAddCart.addEventListener('click', function() {
            const productName = document.getElementById('modalTitle').textContent;
            const productPrice = document.getElementById('modalCurrentPrice').textContent;
            
            TechMart.addToCart({
                name: productName,
                price: productPrice,
                quantity: 1
            });
            
            TechMart.showToast(`${productName} added to cart!`, 'success');
            modal.style.display = 'none';
        });
    }
    
    if (modalAddWishlist) {
        modalAddWishlist.addEventListener('click', function() {
            const productId = modal.getAttribute('data-current-product-id');
            const productName = document.getElementById('modalTitle').textContent;
            const productPrice = document.getElementById('modalCurrentPrice').textContent;
            const productImage = document.getElementById('modalImage').src;
            
            addToWishlist({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            });
            
            TechMart.showToast('Added to wishlist ❤️', 'success');
        });
    }
}

function openQuickView(productCard) {
    const modal = document.getElementById('quickViewModal');
    const productId = productCard.getAttribute('data-product-id');
    
    // Get product details
    const image = productCard.querySelector('img').src;
    const category = productCard.querySelector('.product-category')?.textContent || 'Product';
    const title = productCard.querySelector('h3').textContent;
    const rating = productCard.querySelector('.rating').innerHTML;
    const currentPrice = productCard.querySelector('.current-price').textContent;
    const originalPrice = productCard.querySelector('.original-price').textContent;
    
    // Populate modal
    document.getElementById('modalImage').src = image;
    document.getElementById('modalCategory').textContent = category;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalRating').innerHTML = rating;
    document.getElementById('modalCurrentPrice').textContent = currentPrice;
    document.getElementById('modalOriginalPrice').textContent = originalPrice;
    
    modal.setAttribute('data-current-product-id', productId);
    modal.style.display = 'block';
    
    // Track recently viewed
    trackRecentlyViewed({
        id: productId,
        name: title,
        price: currentPrice,
        image: image
    });
}

// Track Recently Viewed Products
function trackRecentlyViewed(product) {
    let recentlyViewed = JSON.parse(localStorage.getItem('techmart_recently_viewed') || '[]');
    
    // Remove if already exists
    recentlyViewed = recentlyViewed.filter(item => item.id !== product.id);
    
    // Add to beginning
    recentlyViewed.unshift(product);
    
    // Keep only last 10
    recentlyViewed = recentlyViewed.slice(0, 10);
    
    localStorage.setItem('techmart_recently_viewed', JSON.stringify(recentlyViewed));
}

// Flash Deals Timer
function initFlashDealsTimer() {
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (!hoursEl) return;
    
    // Set end time (e.g., 24 hours from now)
    const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    function updateTimer() {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        if (distance < 0) {
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Product Actions
function initProductActions() {
    // Flash product cards
    const flashCards = document.querySelectorAll('.flash-product-card');
    flashCards.forEach(card => {
        card.addEventListener('click', function() {
            TechMart.showToast('Flash deal! Add to cart quickly!', 'success');
        });
    });
    
    // Hero CTA buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .cta-btn');
    heroButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.textContent.includes('Shop Now')) {
                document.querySelector('.products')?.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            } else if (this.textContent.includes('Deals')) {
                document.querySelector('.flash-deals')?.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    });
}

// Add to global scope
window.TechMartEnhanced = {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    updateWishlistCount,
    openQuickView,
    trackRecentlyViewed
};
