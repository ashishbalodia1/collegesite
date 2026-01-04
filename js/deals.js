// Student Deals Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initCopyCodeButtons();
});

function initCopyCodeButtons() {
    const copyButtons = document.querySelectorAll('.btn-copy-code');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            
            // Copy to clipboard
            navigator.clipboard.writeText(code).then(() => {
                // Change button text temporarily
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                this.style.background = 'var(--success)';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = '';
                }, 2000);
                
                // Show toast notification
                TechMart.showToast(`Code ${code} copied to clipboard!`, 'success');
            }).catch(err => {
                console.error('Failed to copy:', err);
                TechMart.showToast('Failed to copy code', 'error');
            });
        });
    });
}
