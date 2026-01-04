// Chatbot Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Create chatbot HTML
    const chatbotHTML = `
        <div class="chatbot-widget">
            <button class="chatbot-toggle" id="chatbotToggle">
                <i class="fas fa-comments"></i>
            </button>
            <div class="chatbot-window" id="chatbotWindow">
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <div class="chatbot-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div>
                            <h3>TechMart Assistant</h3>
                            <div class="chatbot-status">Online</div>
                        </div>
                    </div>
                    <button class="chatbot-close" id="chatbotClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chatbot-messages" id="chatbotMessages">
                    <div class="chat-message bot">
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div>
                            <div class="message-content">
                                Hi! 👋 Welcome to TechMart! I'm your virtual assistant. How can I help you today?
                            </div>
                            <div class="quick-replies">
                                <button class="quick-reply-btn" data-reply="Show me laptops">💻 Laptops</button>
                                <button class="quick-reply-btn" data-reply="What are today's deals?">🔥 Deals</button>
                                <button class="quick-reply-btn" data-reply="Track my order">📦 Track Order</button>
                                <button class="quick-reply-btn" data-reply="Help with account">👤 Account Help</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chatInput" placeholder="Type your message...">
                    <button class="chatbot-send" id="chatSend">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Append to body
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    
    // Get elements
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatbotMessages');
    
    // Toggle chatbot window
    chatbotToggle.addEventListener('click', function() {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            chatInput.focus();
        }
    });
    
    // Close chatbot
    chatbotClose.addEventListener('click', function() {
        chatbotWindow.classList.remove('active');
    });
    
    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                const response = getBotResponse(message);
                addMessage(response, 'bot');
            }, 1000);
        }
    }
    
    // Send button click
    chatSend.addEventListener('click', sendMessage);
    
    // Enter key to send
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Quick reply buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quick-reply-btn')) {
            const reply = e.target.dataset.reply;
            addMessage(reply, 'user');
            
            setTimeout(() => {
                const response = getBotResponse(reply);
                addMessage(response, 'bot');
            }, 1000);
        }
    });
    
    // Add message to chat
    function addMessage(text, sender) {
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const messageHTML = `
            <div class="chat-message ${sender}">
                <div class="message-avatar">
                    <i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>
                </div>
                <div>
                    <div class="message-content">${text}</div>
                </div>
            </div>
        `;
        
        chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Bot response logic
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('laptop')) {
            return '🖥️ We have amazing laptops! Check out our deals page for up to 40% off on Dell, HP, and Lenovo laptops. Would you like me to show you our best sellers?';
        } else if (lowerMessage.includes('deal') || lowerMessage.includes('offer')) {
            return '🎉 We have amazing deals today! Visit our Deals page to see up to 50% off on electronics. New deals added daily!';
        } else if (lowerMessage.includes('track') || lowerMessage.includes('order')) {
            return '📦 To track your order, please log in to your account and go to "My Orders". You\'ll find real-time tracking information there.';
        } else if (lowerMessage.includes('account') || lowerMessage.includes('profile')) {
            return '👤 For account help, you can visit your profile page after logging in. Need help with password reset or account settings?';
        } else if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
            return '↩️ We offer a 30-day return policy on most items. Visit our Services page for detailed return and refund information.';
        } else if (lowerMessage.includes('payment')) {
            return '💳 We accept all major credit cards, debit cards, PayPal, and UPI. Your payment information is secure with us!';
        } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
            return '🚚 We offer free shipping on orders over $50. Standard delivery takes 3-5 business days. Express delivery available!';
        } else if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
            return 'Hello! 👋 How can I assist you today? Feel free to ask about products, orders, or any help you need!';
        } else if (lowerMessage.includes('thanks') || lowerMessage.includes('thank')) {
            return 'You\'re welcome! 😊 Is there anything else I can help you with?';
        } else {
            return 'I understand you\'re asking about "' + message + '". Let me help! You can browse our products, check deals, or contact our support team for personalized assistance. What would you like to explore?';
        }
    }
});
