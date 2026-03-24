export const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return "N/A";
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear(); // Keeping YYYY for clarity, matching previous session
        
        return `${day}/${month}/${year}`;
    } catch (e) {
        return "N/A";
    }
};

export const formatTime = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return "";
    }
};
