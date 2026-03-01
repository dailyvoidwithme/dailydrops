// Load admin data
document.addEventListener('DOMContentLoaded', () => {
    loadThumbnailsTable();
    loadTransactionsTable();
    updateStats();
});

// Load thumbnails table
function loadThumbnailsTable() {
    const thumbnails = DataManager.getThumbnails();
    const tbody = document.getElementById('thumbnailsList');
    
    if (thumbnails.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">No thumbnails found</td></tr>';
        return;
    }
    
    tbody.innerHTML = thumbnails.map(thumb => `
        <tr>
            <td><img src="${thumb.image}" class="thumbnail-preview" onerror="this.src='https://via.placeholder.com/50?text=Error'"></td>
            <td>${thumb.caption}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editThumbnail(${thumb.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete-btn" onclick="deleteThumbnail(${thumb.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Load transactions table
function loadTransactionsTable(filteredTransactions = null) {
    const transactions = filteredTransactions || DataManager.getTransactions();
    const tbody = document.getElementById('transactionsList');
    
    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No transactions found</td></tr>';
        return;
    }
    
    tbody.innerHTML = transactions.sort((a, b) => b.id - a.id).map(t => `
        <tr>
            <td>${t.date || 'N/A'}</td>
            <td><span class="status-badge">${t.type === 'ultra' ? 'Ultra Premium' : 'Normal'}</span></td>
            <td>₹${t.amount}</td>
            <td>${t.telegram}</td>
            <td>${t.whatsapp}</td>
            <td>${t.utr}</td>
            <td>${t.content}</td>
            <td><span class="status-badge">Completed</span></td>
        </tr>
    `).join('');
}

// Update statistics
function updateStats() {
    const stats = DataManager.getStats();
    
    document.getElementById('totalEarnings').textContent = `₹${stats.totalEarnings}`;
    document.getElementById('totalTransactions').textContent = stats.totalTransactions;
    document.getElementById('ultraMembers').textContent = stats.ultraMembers;
    document.getElementById('normalMembers').textContent = stats.normalMembers;
}

// Filter transactions
function filterTransactions() {
    const searchTerm = document.getElementById('searchTransaction').value.toLowerCase();
    const filterType = document.getElementById('filterType').value;
    
    let transactions = DataManager.getTransactions();
    
    // Apply type filter
    if (filterType !== 'all') {
        transactions = transactions.filter(t => t.type === filterType);
    }
    
    // Apply search filter
    if (searchTerm) {
        transactions = transactions.filter(t => 
            t.telegram.toLowerCase().includes(searchTerm) ||
            t.utr.toLowerCase().includes(searchTerm) ||
            (t.whatsapp && t.whatsapp.toLowerCase().includes(searchTerm))
        );
    }
    
    loadTransactionsTable(transactions);
}

// Thumbnail modal functions
function openThumbnailModal(thumbnail = null) {
    const modal = document.getElementById('thumbnailModal');
    const title = document.getElementById('modalTitle');
    const idInput = document.getElementById('thumbnailId');
    const imageInput = document.getElementById('thumbnailImage');
    const captionInput = document.getElementById('thumbnailCaption');
    const saveBtn = document.getElementById('saveBtn');
    
    if (thumbnail) {
        title.textContent = 'Edit Thumbnail';
        idInput.value = thumbnail.id;
        imageInput.value = thumbnail.image;
        captionInput.value = thumbnail.caption;
        saveBtn.textContent = 'Update Thumbnail';
    } else {
        title.textContent = 'Add New Thumbnail';
        idInput.value = '';
        imageInput.value = '';
        captionInput.value = '';
        saveBtn.textContent = 'Save Thumbnail';
    }
    
    modal.style.display = 'block';
}

function closeThumbnailModal() {
    document.getElementById('thumbnailModal').style.display = 'none';
}

function saveThumbnail() {
    const id = document.getElementById('thumbnailId').value;
    const image = document.getElementById('thumbnailImage').value;
    const caption = document.getElementById('thumbnailCaption').value;
    
    if (!image || !caption) {
        alert('Please fill all fields');
        return;
    }
    
    const thumbnailData = { image, caption };
    
    if (id) {
        // Update existing
        DataManager.updateThumbnail(parseInt(id), thumbnailData);
    } else {
        // Add new
        DataManager.addThumbnail(thumbnailData);
    }
    
    closeThumbnailModal();
    loadThumbnailsTable();
}

function editThumbnail(id) {
    const thumbnails = DataManager.getThumbnails();
    const thumbnail = thumbnails.find(t => t.id === id);
    if (thumbnail) {
        openThumbnailModal(thumbnail);
    }
}

function deleteThumbnail(id) {
    if (confirm('Are you sure you want to delete this thumbnail?')) {
        DataManager.deleteThumbnail(id);
        loadThumbnailsTable();
    }
}
