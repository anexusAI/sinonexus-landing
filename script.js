// SinoNexus Frontend JavaScript
const API_URL = 'https://sinonexus-api.onrender.com';

// Chat Widget State
let chatSessionId = null;
let chatUserType = 'unknown';
let isChatOpen = true;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initChat();
});

// ====================
// CHAT WIDGET FUNCTIONS
// ====================

function initChat() {
    // Generate session ID
    chatSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Focus input when chat opens
    const chatInput = document.getElementById('chat-input');
    if (chatInput && isChatOpen) {
        chatInput.focus();
    }
}

function toggleChat() {
    const chatWidget = document.getElementById('chat-widget');
    const chatFab = document.getElementById('chat-fab');
    
    isChatOpen = !isChatOpen;
    
    if (isChatOpen) {
        chatWidget.classList.remove('minimized');
        chatWidget.style.display = 'block';
        chatFab.style.display = 'none';
        setTimeout(() => document.getElementById('chat-input')?.focus(), 100);
    } else {
        chatWidget.classList.add('minimized');
        setTimeout(() => {
            chatWidget.style.display = 'none';
            chatFab.style.display = 'flex';
        }, 300);
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Clear input
    input.value = '';
    
    // Add user message to chat
    addMessage(message, 'user');
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Call API
        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                sessionId: chatSessionId,
                userType: chatUserType
            })
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Update session info
        if (data.sessionId) chatSessionId = data.sessionId;
        if (data.userType) chatUserType = data.userType;
        
        // Add bot response
        addMessage(data.reply, 'bot');
        
        // Show lead form if needed
        if (data.showLeadForm && chatUserType === 'corporate') {
            showLeadForm();
        }
        
    } catch (error) {
        console.error('Chat error:', error);
        removeTypingIndicator();
        addMessage("Oops! I'm having a moment 😅 Please try again or download our app for the best experience!", 'bot');
    }
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// ====================
// CORPORATE LEAD FORM
// ====================

function showLeadForm() {
    const messagesContainer = document.getElementById('chat-messages');
    
    const formDiv = document.createElement('div');
    formDiv.className = 'message bot-message';
    formDiv.innerHTML = `
        <div class="lead-form">
            <h4>🎯 Let's Connect You With Our Corporate Team</h4>
            <input type="text" id="lead-company" placeholder="Company Name *" required>
            <input type="text" id="lead-contact" placeholder="Contact Name *" required>
            <input type="email" id="lead-email" placeholder="Email *" required>
            <input type="tel" id="lead-phone" placeholder="Phone">
            <select id="lead-size">
                <option value="">Company Size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="200+">200+ employees</option>
            </select>
            <select id="lead-service">
                <option value="">Service Needed</option>
                <option value="company_setup">Company Setup</option>
                <option value="hr_consulting">HR/Immigration Consulting</option>
                <option value="accounting">Accounting & Payroll</option>
                <option value="full_package">Full Corporate Package</option>
            </select>
            <textarea id="lead-message" placeholder="Tell us about your needs..." rows="3"></textarea>
            <button onclick="submitLeadForm()">Submit Request</button>
        </div>
    `;
    
    messagesContainer.appendChild(formDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function submitLeadForm() {
    const company = document.getElementById('lead-company').value;
    const contact = document.getElementById('lead-contact').value;
    const email = document.getElementById('lead-email').value;
    const phone = document.getElementById('lead-phone').value;
    const size = document.getElementById('lead-size').value;
    const service = document.getElementById('lead-service').value;
    const message = document.getElementById('lead-message').value;
    
    if (!company || !contact || !email) {
        alert('Please fill in all required fields (Company Name, Contact Name, Email)');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/corporate-lead`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                companyName: company,
                contactName: contact,
                email: email,
                phone: phone,
                companySize: size,
                serviceNeeded: service,
                message: message,
                sessionId: chatSessionId
            })
        });
        
        const data = await response.json();
        
        // Remove form and show confirmation
        const formDiv = document.querySelector('.lead-form').closest('.message');
        formDiv.innerHTML = `
            <div class="message-content" style="background: #dcfce7; color: #166534;">
                ✅ ${data.message}
            </div>
        `;
        
    } catch (error) {
        console.error('Lead submission error:', error);
        alert('Failed to submit. Please try again or email us directly.');
    }
}
