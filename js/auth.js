// Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    
    // Switch between login and signup forms
    if (showSignupLink) {
        showSignupLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.classList.remove('active');
            signupForm.classList.add('active');
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            signupForm.classList.remove('active');
            loginForm.classList.add('active');
        });
    }
    
    // Handle login
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Handle signup
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Social auth buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.textContent.includes('Google') ? 'Google' : 'Facebook';
            TechMart.showToast(`${provider} authentication will be integrated soon!`, 'success');
        });
    });
});

// Handle login submission
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validate inputs
    if (!TechMart.validateEmail(email)) {
        TechMart.showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        TechMart.showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Simulate API call
    const submitButton = e.target.querySelector('.auth-btn');
    submitButton.disabled = true;
    submitButton.textContent = 'Logging in...';
    
    setTimeout(() => {
        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('techmart_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store user session
            const userData = {
                name: user.name,
                email: user.email,
                phone: user.phone
            };
            
            localStorage.setItem('techmart_user', JSON.stringify(userData));
            
            if (rememberMe) {
                localStorage.setItem('techmart_remember', 'true');
            }
            
            TechMart.showToast('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                // Check if there's a redirect page
                const redirectPage = localStorage.getItem('redirect_after_login');
                if (redirectPage && redirectPage !== 'login.html') {
                    localStorage.removeItem('redirect_after_login');
                    window.location.href = redirectPage;
                } else {
                    window.location.href = 'index.html';
                }
            }, 1500);
        } else {
            TechMart.showToast('Invalid email or password', 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
        }
    }, 1000);
}

// Handle signup submission
async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validate inputs
    if (name.length < 3) {
        TechMart.showToast('Name must be at least 3 characters', 'error');
        return;
    }
    
    if (!TechMart.validateEmail(email)) {
        TechMart.showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (!TechMart.validatePhone(phone)) {
        TechMart.showToast('Please enter a valid 10-digit phone number', 'error');
        return;
    }
    
    if (password.length < 8) {
        TechMart.showToast('Password must be at least 8 characters', 'error');
        return;
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        TechMart.showToast('Password must contain uppercase, lowercase, and numbers', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        TechMart.showToast('Passwords do not match', 'error');
        return;
    }
    
    if (!agreeTerms) {
        TechMart.showToast('Please agree to the Terms & Conditions', 'error');
        return;
    }
    
    // Simulate API call
    const submitButton = e.target.querySelector('.auth-btn');
    submitButton.disabled = true;
    submitButton.textContent = 'Creating Account...';
    
    setTimeout(() => {
        // Get existing users
        const users = JSON.parse(localStorage.getItem('techmart_users') || '[]');
        
        // Check if email already exists
        if (users.some(u => u.email === email)) {
            TechMart.showToast('Email already registered. Please login.', 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Sign Up';
            return;
        }
        
        // Add new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            phone,
            password,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('techmart_users', JSON.stringify(users));
        
        // Auto login
        const userData = {
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone
        };
        
        localStorage.setItem('techmart_user', JSON.stringify(userData));
        
        TechMart.showToast('Account created successfully! Redirecting...', 'success');
        
        setTimeout(() => {
            // Check if there's a redirect page
            const redirectPage = localStorage.getItem('redirect_after_login');
            if (redirectPage && redirectPage !== 'login.html') {
                localStorage.removeItem('redirect_after_login');
                window.location.href = redirectPage;
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);
    }, 1000);
}

// Password visibility toggle
function setupPasswordToggle() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', function() {
            if (input.type === 'password') {
                input.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });
}

// Check if already logged in
const currentUser = localStorage.getItem('techmart_user');
if (currentUser && window.location.pathname.includes('login.html')) {
    TechMart.showToast('You are already logged in!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}
