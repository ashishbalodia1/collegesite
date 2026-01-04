// Profile Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('techmart_user'));
    
    if (!user) {
        TechMart.showToast('Please login to access your profile', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return;
    }
    
    // Load user data
    loadUserData();
    
    // Tab switching
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionId = this.dataset.section;
            
            // Update active menu item
            menuItems.forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
            
            // Update active content section
            contentSections.forEach(section => section.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
        });
    });
    
    // Profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Password form submission
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordUpdate);
    }
});

// Load user data into form
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('techmart_user'));
    
    if (!user) return;
    
    // Update sidebar profile
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    
    const avatar = document.getElementById('profileAvatar');
    avatar.textContent = user.name.charAt(0).toUpperCase();
    avatar.innerHTML = `<span>${user.name.charAt(0).toUpperCase()}</span>`;
    
    // Load form fields
    document.getElementById('fullName').value = user.name || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('dob').value = user.dob || '';
    document.getElementById('gender').value = user.gender || '';
    document.getElementById('bio').value = user.bio || '';
}

// Handle profile update
function handleProfileUpdate(e) {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('techmart_user'));
    const users = JSON.parse(localStorage.getItem('techmart_users') || '[]');
    
    const updatedData = {
        name: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        bio: document.getElementById('bio').value.trim()
    };
    
    // Validate
    if (!updatedData.name || updatedData.name.length < 3) {
        TechMart.showToast('Name must be at least 3 characters', 'error');
        return;
    }
    
    if (!TechMart.validateEmail(updatedData.email)) {
        TechMart.showToast('Please enter a valid email', 'error');
        return;
    }
    
    if (!TechMart.validatePhone(updatedData.phone)) {
        TechMart.showToast('Please enter a valid phone number', 'error');
        return;
    }
    
    // Update user in users array
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        localStorage.setItem('techmart_users', JSON.stringify(users));
    }
    
    // Update current user session
    const sessionUser = { ...user, ...updatedData };
    localStorage.setItem('techmart_user', JSON.stringify(sessionUser));
    
    // Update UI
    loadUserData();
    
    TechMart.showToast('Profile updated successfully!', 'success');
}

// Handle password update
function handlePasswordUpdate(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const user = JSON.parse(localStorage.getItem('techmart_user'));
    const users = JSON.parse(localStorage.getItem('techmart_users') || '[]');
    const userIndex = users.findIndex(u => u.email === user.email);
    
    if (userIndex === -1) {
        TechMart.showToast('User not found', 'error');
        return;
    }
    
    // Verify current password
    if (users[userIndex].password !== currentPassword) {
        TechMart.showToast('Current password is incorrect', 'error');
        return;
    }
    
    // Validate new password
    if (newPassword.length < 8) {
        TechMart.showToast('Password must be at least 8 characters', 'error');
        return;
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        TechMart.showToast('Password must contain uppercase, lowercase, and numbers', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        TechMart.showToast('Passwords do not match', 'error');
        return;
    }
    
    // Update password
    users[userIndex].password = newPassword;
    localStorage.setItem('techmart_users', JSON.stringify(users));
    
    // Clear form
    document.getElementById('passwordForm').reset();
    
    TechMart.showToast('Password updated successfully!', 'success');
}
