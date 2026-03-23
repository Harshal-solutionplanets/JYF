export const extractDescription = (description) => {
    if (!description) return "";
    if (description.startsWith("SECTIONS:")) {
        try {
            const parts = description.split(" | CONTENT: ");
            return parts[1] || "";
        } catch (e) {
            return description;
        }
    }
    return description;
};
