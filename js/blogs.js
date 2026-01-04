// Blogs Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    setupBlogFilter();
    setupNewsletterForm();
});

// Blog filter functionality
function setupBlogFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter blog cards
            blogCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Newsletter form
function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!TechMart.validateEmail(email)) {
                TechMart.showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Save to localStorage
            const subscribers = JSON.parse(localStorage.getItem('techmart_subscribers') || '[]');
            
            if (subscribers.includes(email)) {
                TechMart.showToast('You are already subscribed!', 'error');
                return;
            }
            
            subscribers.push(email);
            localStorage.setItem('techmart_subscribers', JSON.stringify(subscribers));
            
            TechMart.showToast('Successfully subscribed to newsletter!', 'success');
            emailInput.value = '';
        });
    }
}

// Blog card click handlers
document.querySelectorAll('.blog-card, .blog-featured-card').forEach(card => {
    const readMoreBtn = card.querySelector('.read-more');
    if (readMoreBtn) {
        readMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const blogTitle = card.querySelector('h2, h3').textContent;
            TechMart.showToast(`Opening: ${blogTitle}`, 'success');
            // In production, this would navigate to the blog post page
            // window.location.href = `blog-post.html?id=${blogId}`;
        });
    }
});

// Pagination
document.querySelectorAll('.page-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.page-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Scroll to top of blogs section
        document.querySelector('.blogs-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        TechMart.showToast('Loading page ' + this.textContent, 'success');
    });
});
