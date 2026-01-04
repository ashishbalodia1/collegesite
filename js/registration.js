// Registration Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }
    
    // Format inputs
    setupInputFormatting();
});

// Handle registration submission
async function handleRegistration(e) {
    e.preventDefault();
    
    // Get all form values
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        altPhone: document.getElementById('altPhone').value.trim(),
        businessName: document.getElementById('businessName').value.trim(),
        businessType: document.getElementById('businessType').value,
        gstNumber: document.getElementById('gstNumber').value.trim(),
        panNumber: document.getElementById('panNumber').value.trim().toUpperCase(),
        category: document.getElementById('category').value,
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value,
        pincode: document.getElementById('pincode').value.trim(),
        country: document.getElementById('country').value.trim(),
        accountNumber: document.getElementById('accountNumber').value.trim(),
        accountHolder: document.getElementById('accountHolder').value.trim(),
        ifscCode: document.getElementById('ifscCode').value.trim().toUpperCase(),
        bankName: document.getElementById('bankName').value.trim(),
        password: document.getElementById('regPassword').value,
        confirmPassword: document.getElementById('regConfirmPassword').value,
        termsAccept: document.getElementById('termsAccept').checked,
        marketingConsent: document.getElementById('marketingConsent').checked
    };
    
    // Validate all fields
    if (!validateRegistrationForm(formData)) {
        return;
    }
    
    // Submit form
    const submitButton = e.target.querySelector('.submit-btn');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    setTimeout(() => {
        // Save vendor data
        const vendors = JSON.parse(localStorage.getItem('techmart_vendors') || '[]');
        
        // Check if email already exists
        if (vendors.some(v => v.email === formData.email)) {
            TechMart.showToast('Email already registered!', 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Registration';
            return;
        }
        
        const newVendor = {
            id: Date.now(),
            ...formData,
            status: 'pending',
            registeredAt: new Date().toISOString()
        };
        
        delete newVendor.confirmPassword;
        delete newVendor.password; // Don't store password in plain text in production
        
        vendors.push(newVendor);
        localStorage.setItem('techmart_vendors', JSON.stringify(vendors));
        
        TechMart.showToast('Registration submitted successfully!', 'success');
        
        // Show success message and redirect
        setTimeout(() => {
            alert('Thank you for registering with TechMart!\n\nYour application has been received and is under review. Our team will contact you within 2-3 business days.\n\nRegistration ID: VM' + newVendor.id);
            window.location.href = 'index.html';
        }, 1500);
    }, 2000);
}

// Validate registration form
function validateRegistrationForm(data) {
    // Personal information
    if (data.fullName.length < 3) {
        TechMart.showToast('Please enter your full name', 'error');
        return false;
    }
    
    if (!TechMart.validateEmail(data.email)) {
        TechMart.showToast('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!TechMart.validatePhone(data.phone)) {
        TechMart.showToast('Please enter a valid phone number', 'error');
        return false;
    }
    
    // Business information
    if (data.businessName.length < 3) {
        TechMart.showToast('Please enter your business name', 'error');
        return false;
    }
    
    if (!data.businessType) {
        TechMart.showToast('Please select business type', 'error');
        return false;
    }
    
    // PAN validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    if (!panRegex.test(data.panNumber)) {
        TechMart.showToast('Please enter a valid PAN number', 'error');
        return false;
    }
    
    // GST validation (if provided)
    if (data.gstNumber) {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstRegex.test(data.gstNumber.toUpperCase())) {
            TechMart.showToast('Please enter a valid GST number', 'error');
            return false;
        }
    }
    
    if (!data.category) {
        TechMart.showToast('Please select a product category', 'error');
        return false;
    }
    
    // Address validation
    if (data.address.length < 10) {
        TechMart.showToast('Please enter complete address', 'error');
        return false;
    }
    
    if (!data.city || !data.state) {
        TechMart.showToast('Please enter city and state', 'error');
        return false;
    }
    
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(data.pincode)) {
        TechMart.showToast('Please enter a valid PIN code', 'error');
        return false;
    }
    
    // Bank details validation
    if (data.accountNumber.length < 9) {
        TechMart.showToast('Please enter valid account number', 'error');
        return false;
    }
    
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(data.ifscCode)) {
        TechMart.showToast('Please enter a valid IFSC code', 'error');
        return false;
    }
    
    // Password validation
    if (data.password.length < 8) {
        TechMart.showToast('Password must be at least 8 characters', 'error');
        return false;
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
        TechMart.showToast('Password must contain uppercase, lowercase, and numbers', 'error');
        return false;
    }
    
    if (data.password !== data.confirmPassword) {
        TechMart.showToast('Passwords do not match', 'error');
        return false;
    }
    
    if (!data.termsAccept) {
        TechMart.showToast('Please accept Terms & Conditions', 'error');
        return false;
    }
    
    return true;
}

// Setup input formatting
function setupInputFormatting() {
    // Format PAN number
    const panInput = document.getElementById('panNumber');
    if (panInput) {
        panInput.addEventListener('input', function(e) {
            this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
        });
    }
    
    // Format GST number
    const gstInput = document.getElementById('gstNumber');
    if (gstInput) {
        gstInput.addEventListener('input', function(e) {
            this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
        });
    }
    
    // Format IFSC code
    const ifscInput = document.getElementById('ifscCode');
    if (ifscInput) {
        ifscInput.addEventListener('input', function(e) {
            this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
        });
    }
    
    // Format phone numbers
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
        });
    });
    
    // Format pincode
    const pincodeInput = document.getElementById('pincode');
    if (pincodeInput) {
        pincodeInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').slice(0, 6);
        });
    }
    
    // Format account number
    const accountInput = document.getElementById('accountNumber');
    if (accountInput) {
        accountInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').slice(0, 18);
        });
    }
}
