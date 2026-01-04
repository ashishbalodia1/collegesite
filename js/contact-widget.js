// Contact Widget Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Create floating contact button HTML
    const contactHTML = `
        <div class="floating-contact">
            <button class="contact-btn" id="contactBtn">
                <i class="fas fa-headset"></i>
            </button>
            <div class="contact-menu" id="contactMenu">
                <a href="tel:+1234567890" class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>Call Us</span>
                </a>
                <a href="mailto:support@techmart.com" class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>Email Us</span>
                </a>
                <a href="https://wa.me/1234567890" target="_blank" class="contact-item">
                    <i class="fab fa-whatsapp"></i>
                    <span>WhatsApp</span>
                </a>
                <a href="feedback.html" class="contact-item">
                    <i class="fas fa-comment-dots"></i>
                    <span>Feedback</span>
                </a>
            </div>
        </div>
    `;
    
    // Append to body
    document.body.insertAdjacentHTML('beforeend', contactHTML);
    
    // Get elements
    const contactBtn = document.getElementById('contactBtn');
    const contactMenu = document.getElementById('contactMenu');
    
    // Toggle contact menu
    contactBtn.addEventListener('click', function() {
        contactMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.floating-contact')) {
            contactMenu.classList.remove('active');
        }
    });
});
