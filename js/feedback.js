// Feedback Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    setupStarRating();
    setupFeedbackForm();
});

// Star rating functionality
function setupStarRating() {
    const stars = document.querySelectorAll('.star-rating i');
    const ratingInput = document.getElementById('rating');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            ratingInput.value = rating;
            
            // Update star display
            stars.forEach((s, i) => {
                if (i < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas', 'active');
                } else {
                    s.classList.remove('fas', 'active');
                    s.classList.add('far');
                }
            });
        });
        
        // Hover effect
        star.addEventListener('mouseenter', function() {
            const rating = this.getAttribute('data-rating');
            stars.forEach((s, i) => {
                if (i < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                }
            });
        });
    });
    
    // Reset on mouse leave
    const starRating = document.getElementById('starRating');
    if (starRating) {
        starRating.addEventListener('mouseleave', function() {
            const currentRating = ratingInput.value || 0;
            stars.forEach((s, i) => {
                if (i < currentRating) {
                    s.classList.remove('far');
                    s.classList.add('fas', 'active');
                } else {
                    s.classList.remove('fas', 'active');
                    s.classList.add('far');
                }
            });
        });
    }
}

// Feedback form submission
function setupFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('feedbackName').value.trim(),
                email: document.getElementById('feedbackEmail').value.trim(),
                phone: document.getElementById('feedbackPhone').value.trim(),
                category: document.getElementById('feedbackCategory').value,
                rating: document.getElementById('rating').value,
                message: document.getElementById('feedbackMessage').value.trim(),
                allowContact: document.getElementById('allowContact').checked,
                timestamp: new Date().toISOString()
            };
            
            // Validate form
            if (!validateFeedbackForm(formData)) {
                return;
            }
            
            // Submit feedback
            const submitButton = this.querySelector('.submit-btn');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            
            setTimeout(() => {
                // Save feedback
                const feedbacks = JSON.parse(localStorage.getItem('techmart_feedbacks') || '[]');
                feedbacks.push({
                    id: Date.now(),
                    ...formData
                });
                localStorage.setItem('techmart_feedbacks', JSON.stringify(feedbacks));
                
                TechMart.showToast('Thank you for your feedback!', 'success');
                
                // Reset form
                feedbackForm.reset();
                document.querySelectorAll('.star-rating i').forEach(s => {
                    s.classList.remove('fas', 'active');
                    s.classList.add('far');
                });
                
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Feedback';
                
                // Show success message
                setTimeout(() => {
                    alert('Your feedback has been received!\n\nReference ID: FB' + Date.now() + '\n\nOur team will review it and get back to you if needed.');
                }, 500);
            }, 1500);
        });
    }
}

// Validate feedback form
function validateFeedbackForm(data) {
    if (data.name.length < 3) {
        TechMart.showToast('Please enter your name', 'error');
        return false;
    }
    
    if (!TechMart.validateEmail(data.email)) {
        TechMart.showToast('Please enter a valid email address', 'error');
        return false;
    }
    
    if (data.phone && !TechMart.validatePhone(data.phone)) {
        TechMart.showToast('Please enter a valid phone number', 'error');
        return false;
    }
    
    if (!data.category) {
        TechMart.showToast('Please select a feedback category', 'error');
        return false;
    }
    
    if (!data.rating) {
        TechMart.showToast('Please rate your experience', 'error');
        return false;
    }
    
    if (data.message.length < 10) {
        TechMart.showToast('Please provide more details in your feedback', 'error');
        return false;
    }
    
    return true;
}

// File upload handling
const fileInput = document.getElementById('feedbackFile');
if (fileInput) {
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Check file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                TechMart.showToast('File size should not exceed 5MB', 'error');
                this.value = '';
                return;
            }
            
            // Check file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                TechMart.showToast('Only JPG and PNG images are allowed', 'error');
                this.value = '';
                return;
            }
            
            TechMart.showToast('File uploaded: ' + file.name, 'success');
        }
    });
}

// Contact option clicks
document.querySelectorAll('.contact-option').forEach(option => {
    option.addEventListener('click', function() {
        const title = this.querySelector('h4').textContent;
        const value = this.querySelector('p').textContent;
        
        if (title.includes('Call')) {
            TechMart.showToast('Redirecting to call...', 'success');
            // window.location.href = 'tel:' + value.replace(/\s+/g, '');
        } else if (title.includes('Email')) {
            TechMart.showToast('Opening email client...', 'success');
            // window.location.href = 'mailto:' + value;
        } else if (title.includes('Chat')) {
            TechMart.showToast('Live chat feature coming soon!', 'success');
        }
    });
});
