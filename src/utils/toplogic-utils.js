// Utility functions
export const TopLogicUtils = {
    // Format file size
    formatFileSize: (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    },
    
    // Format timestamp
    formatDate: (isoString) => {
        return new Date(isoString).toLocaleString('no-NO');
    },
    
    // Generate unique ID
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};