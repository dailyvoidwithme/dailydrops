// Data storage using localStorage
const DataManager = {
    // Initialize data if not exists
    init: function() {
        if (!localStorage.getItem('thumbnails')) {
            const defaultThumbnails = [
                {
                    id: 1,
                    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500',
                    caption: 'Premium Collection Vol. 1'
                },
                {
                    id: 2,
                    image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=500',
                    caption: 'Exclusive Content Pack'
                },
                {
                    id: 3,
                    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=500',
                    caption: 'Daily Drops Special'
                },
                {
                    id: 4,
                    image: 'https://images.unsplash.com/photo-1611162616470-17b99c3a7f7b?w=500',
                    caption: 'Premium Access Pass'
                }
            ];
            localStorage.setItem('thumbnails', JSON.stringify(defaultThumbnails));
        }
        
        if (!localStorage.getItem('transactions')) {
            localStorage.setItem('transactions', JSON.stringify([]));
        }
    },
    
    // Thumbnail methods
    getThumbnails: function() {
        return JSON.parse(localStorage.getItem('thumbnails')) || [];
    },
    
    addThumbnail: function(thumbnail) {
        const thumbnails = this.getThumbnails();
        thumbnail.id = Date.now(); // Use timestamp as ID
        thumbnails.push(thumbnail);
        localStorage.setItem('thumbnails', JSON.stringify(thumbnails));
        return thumbnail;
    },
    
    updateThumbnail: function(id, updatedThumbnail) {
        const thumbnails = this.getThumbnails();
        const index = thumbnails.findIndex(t => t.id === id);
        if (index !== -1) {
            thumbnails[index] = { ...thumbnails[index], ...updatedThumbnail, id: id };
            localStorage.setItem('thumbnails', JSON.stringify(thumbnails));
            return true;
        }
        return false;
    },
    
    deleteThumbnail: function(id) {
        const thumbnails = this.getThumbnails();
        const filtered = thumbnails.filter(t => t.id !== id);
        localStorage.setItem('thumbnails', JSON.stringify(filtered));
    },
    
    // Transaction methods
    getTransactions: function() {
        return JSON.parse(localStorage.getItem('transactions')) || [];
    },
    
    addTransaction: function(transaction) {
        const transactions = this.getTransactions();
        transaction.id = Date.now();
        transaction.date = new Date().toLocaleString();
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        return transaction;
    },
    
    getStats: function() {
        const transactions = this.getTransactions();
        const totalEarnings = transactions.reduce((sum, t) => sum + t.amount, 0);
        const ultraMembers = transactions.filter(t => t.type === 'ultra').length;
        const normalMembers = transactions.filter(t => t.type === 'normal').length;
        
        return {
            totalEarnings,
            totalTransactions: transactions.length,
            ultraMembers,
            normalMembers
        };
    }
};

// Initialize data
DataManager.init();
