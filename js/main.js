// Current state
let currentThumbnail = null;
let selectedMembership = null;
let userDetails = {
    telegram: '',
    whatsapp: ''
};

// Load thumbnails on page load
document.addEventListener('DOMContentLoaded', () => {
    loadThumbnails();
    initializeModals();
});

// Load thumbnails into grid
function loadThumbnails() {
    const thumbnails = DataManager.getThumbnails();
    const grid = document.getElementById('thumbnailGrid');
    
    if (thumbnails.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No content available yet.</p>';
        return;
    }
    
    grid.innerHTML = thumbnails.map(thumb => createThumbnailCard(thumb)).join('');
}

function createThumbnailCard(thumb) {
    return `
        <div class="thumbnail-card" onclick="openSubscriptionModal(${thumb.id})">
            <img src="${thumb.image}" alt="Thumbnail" class="thumbnail-image" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
            <div class="thumbnail-content">
                <p class="thumbnail-caption">${thumb.caption}</p>
                <div class="price-container">
                    <button class="price-btn normal-price" onclick="event.stopPropagation(); selectMembership('normal', ${thumb.id})">
                        Buy Now ₹99
                    </button>
                    <button class="price-btn ultra-price" onclick="event.stopPropagation(); selectMembership('ultra', ${thumb.id})">
                        Ultra ₹189
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Modal functions
function initializeModals() {
    const subscriptionModal = document.getElementById('subscriptionModal');
    const paymentModal = document.getElementById('paymentModal');
    const qrModal = document.getElementById('qrModal');
    const successModal = document.getElementById('successModal');
    
    // Close buttons
    document.querySelector('.close').onclick = () => closeModal(subscriptionModal);
    document.querySelector('.close-payment').onclick = () => closeModal(paymentModal);
    document.querySelector('.close-qr').onclick = () => closeModal(qrModal);
    document.querySelector('.close-success').onclick = () => closeModal(successModal);
    
    // Close on outside click
    window.onclick = (event) => {
        if (event.target == subscriptionModal) closeModal(subscriptionModal);
        if (event.target == paymentModal) closeModal(paymentModal);
        if (event.target == qrModal) closeModal(qrModal);
        if (event.target == successModal) closeModal(successModal);
    };
}

function closeModal(modal) {
    modal.style.display = 'none';
}

function openSubscriptionModal(thumbnailId) {
    const thumbnails = DataManager.getThumbnails();
    currentThumbnail = thumbnails.find(t => t.id === thumbnailId);
    
    if (!currentThumbnail) return;
    
    const modal = document.getElementById('subscriptionModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 2rem;">Choose Your Membership</h2>
        <div style="text-align: center; margin-bottom: 2rem;">
            <img src="${currentThumbnail.image}" style="width: 200px; height: 150px; object-fit: cover; border-radius: 10px;" onerror="this.src='https://via.placeholder.com/200x150?text=Image+Not+Found'">
            <p style="margin-top: 1rem; font-size: 1.2rem;">${currentThumbnail.caption}</p>
        </div>
        <div class="subscription-options">
            <div class="subscription-card" onclick="selectMembershipType('normal')">
                <div class="subscription-title">Normal Subscription</div>
                <div class="subscription-price">₹99</div>
                <p>Access to basic content</p>
            </div>
            <div class="subscription-card" onclick="selectMembershipType('ultra')">
                <div class="subscription-title">Ultra Premium</div>
                <div class="subscription-price">₹189</div>
                <p>Full access to all premium content</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function selectMembershipType(type) {
    selectedMembership = type;
    document.getElementById('subscriptionModal').style.display = 'none';
    openPaymentModal();
}

function selectMembership(type, thumbnailId) {
    const thumbnails = DataManager.getThumbnails();
    currentThumbnail = thumbnails.find(t => t.id === thumbnailId);
    selectedMembership = type;
    openPaymentModal();
}

function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const content = document.getElementById('paymentContent');
    const price = selectedMembership === 'normal' ? '99' : '189';
    const title = selectedMembership === 'normal' ? 'Normal Subscription' : 'Ultra Premium';
    
    content.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 2rem;">Complete Your Purchase</h2>
        <div style="text-align: center; margin-bottom: 2rem;">
            <img src="${currentThumbnail.image}" style="width: 150px; height: 100px; object-fit: cover; border-radius: 10px;" onerror="this.src='https://via.placeholder.com/150x100?text=Image+Not+Found'">
            <p style="margin-top: 1rem; font-size: 1.2rem;">${currentThumbnail.caption}</p>
            <h3 style="color: #ffd700; margin-top: 1rem;">${title} - ₹${price}</h3>
        </div>
        <form id="userDetailsForm" onsubmit="event.preventDefault(); submitUserDetails()">
            <div class="form-group">
                <label>Telegram Username *</label>
                <input type="text" id="telegramUsername" placeholder="@username" required>
            </div>
            <div class="form-group">
                <label>WhatsApp Number (Optional)</label>
                <input type="tel" id="whatsappNumber" placeholder="+91 9876543210">
            </div>
            <button type="submit" class="btn">Proceed to Payment</button>
        </form>
    `;
    
    modal.style.display = 'block';
}

function submitUserDetails() {
    const telegram = document.getElementById('telegramUsername').value;
    const whatsapp = document.getElementById('whatsappNumber').value;
    
    if (!telegram) {
        alert('Please enter your Telegram username');
        return;
    }
    
    userDetails = { telegram, whatsapp };
    document.getElementById('paymentModal').style.display = 'none';
    openQRModal();
}

function openQRModal() {
    const modal = document.getElementById('qrModal');
    const content = document.getElementById('qrContent');
    const price = selectedMembership === 'normal' ? '99' : '189';
    const title = selectedMembership === 'normal' ? 'Normal Subscription' : 'Ultra Premium';
    
    // You can replace this QR code URL with your actual UPI QR code
    const qrData = `upi://pay?pa=yourupi@okhdfcbank&pn=DailyDrops&am=${price}&cu=INR`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
    
    content.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 2rem;">Scan & Pay</h2>
        <div class="qr-container">
            <div class="qr-image">
                <img src="${qrUrl}" alt="Payment QR Code">
            </div>
            <div class="payment-details">
                <div class="payment-amount">₹${price}</div>
                <p>${title}</p>
                <p style="margin-top: 1rem;">Scan QR code with any UPI app</p>
                <p style="font-size: 0.9rem; opacity: 0.8;">UPI ID: yourupi@okhdfcbank</p>
            </div>
            <form id="paymentConfirmForm" onsubmit="event.preventDefault(); confirmPayment()">
                <div class="form-group">
                    <label>Enter UTR/TRN Number *</label>
                    <input type="text" id="utrNumber" placeholder="Enter UTR/Transaction ID" required>
                </div>
                <button type="submit" class="btn">Confirm Payment</button>
                <button type="button" class="btn btn-secondary" onclick="goBackToPayment()">Back</button>
            </form>
        </div>
    `;
    
    modal.style.display = 'block';
}

function confirmPayment() {
    const utr = document.getElementById('utrNumber').value;
    
    if (!utr) {
        alert('Please enter UTR/Transaction number');
        return;
    }
    
    const amount = selectedMembership === 'normal' ? 99 : 189;
    const membershipType = selectedMembership === 'normal' ? 'normal' : 'ultra';
    
    // Save transaction
    const transaction = {
        type: membershipType,
        amount: amount,
        telegram: userDetails.telegram,
        whatsapp: userDetails.whatsapp || 'Not provided',
        utr: utr,
        content: currentThumbnail.caption,
        thumbnailId: currentThumbnail.id,
        status: 'completed'
    };
    
    DataManager.addTransaction(transaction);
    
    // Close QR modal and show success
    document.getElementById('qrModal').style.display = 'none';
    document.getElementById('successModal').style.display = 'block';
    
    // Reset state
    resetState();
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

function goBackToPayment() {
    document.getElementById('qrModal').style.display = 'none';
    openPaymentModal();
}

function resetState() {
    currentThumbnail = null;
    selectedMembership = null;
    userDetails = {
        telegram: '',
        whatsapp: ''
    };
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
