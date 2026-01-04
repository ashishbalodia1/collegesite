// Authentication Protection System
// This script protects pages from unauthorized access

(function() {
    'use strict';
    
    // Pages that don't require authentication
    const publicPages = [
        'index.html',
        'login.html',
        '/'  // Root path
    ];
    
    // Check if current page is public
    function isPublicPage() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        return publicPages.some(page => 
            currentPage === page || 
            currentPage === '' || 
            currentPath === '/' ||
            currentPath.endsWith('/')
        );
    }
    
    // Check if user is authenticated
    function isAuthenticated() {
        const user = localStorage.getItem('techmart_user');
        return user !== null && user !== undefined;
    }
    
    // Redirect to login page
    function redirectToLogin() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        localStorage.setItem('redirect_after_login', currentPage);
        
        // Show toast message
        if (typeof TechMart !== 'undefined' && TechMart.showToast) {
            TechMart.showToast('Please login to access this page', 'error');
        }
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    }
    
    // Update navigation based on auth status
    function updateNavigation() {
        const authBtn = document.getElementById('authBtn');
        if (!authBtn) return;
        
        if (isAuthenticated()) {
            const user = JSON.parse(localStorage.getItem('techmart_user'));
            authBtn.textContent = user.name.split(' ')[0];
            authBtn.href = '#';
            authBtn.classList.add('user-menu');
            
            // Add logout functionality
            authBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showUserMenu(e);
            });
        } else {
            authBtn.textContent = 'Login';
            authBtn.href = 'login.html';
            authBtn.classList.remove('user-menu');
        }
    }
    
    // Show user menu dropdown
    function showUserMenu(e) {
        e.preventDefault();
        
        // Remove existing menu if any
        const existingMenu = document.querySelector('.user-dropdown');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }
        
        const user = JSON.parse(localStorage.getItem('techmart_user'));
        const menu = document.createElement('div');
        menu.className = 'user-dropdown';
        menu.innerHTML = `
            <div class="user-dropdown-header">
                <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-email">${user.email}</div>
                </div>
            </div>
            <div class="user-dropdown-menu">
                <a href="#" class="dropdown-item" onclick="alert('Profile page coming soon!')">
                    <i class="fas fa-user"></i> My Profile
                </a>
                <a href="#" class="dropdown-item" onclick="alert('Orders page coming soon!')">
                    <i class="fas fa-shopping-bag"></i> My Orders
                </a>
                <a href="wishlist.html" class="dropdown-item">
                    <i class="fas fa-heart"></i> Wishlist
                </a>
                <a href="#" class="dropdown-item" onclick="alert('Settings page coming soon!')">
                    <i class="fas fa-cog"></i> Settings
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item logout-btn" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Position the menu
        const rect = e.target.getBoundingClientRect();
        menu.style.top = (rect.bottom + 10) + 'px';
        menu.style.right = (window.innerWidth - rect.right) + 'px';
        
        // Add logout handler
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
        
        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && !e.target.closest('#authBtn')) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }
    
    // Logout function
    function logout() {
        localStorage.removeItem('techmart_user');
        localStorage.removeItem('techmart_remember');
        
        if (typeof TechMart !== 'undefined' && TechMart.showToast) {
            TechMart.showToast('Logged out successfully', 'success');
        }
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }
    
    // Main protection logic
    function protectPage() {
        // If on a protected page and not authenticated, redirect to login
        if (!isPublicPage() && !isAuthenticated()) {
            redirectToLogin();
            return;
        }
        
        // Update navigation for all pages
        updateNavigation();
    }
    
    // Run protection when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', protectPage);
    } else {
        protectPage();
    }
    
    // Also run immediately to prevent page flash
    protectPage();
    
})();
