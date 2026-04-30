


const leadStatusColors = {
    NEW: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        hex: "#374151"
    },
    IN_REVIEW: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        hex: "#D97706"
    },
    APPROVED: {
        bg: "bg-green-100",
        text: "text-green-700",
        hex: "#047857"
    },
    REJECTED: {
        bg: "bg-red-100",
        text: "text-red-700",
        hex: "#DC2626"
    },

    DISBURSED: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        hex: "#2563EB"
    },
};

const normalizeSentence = (text) => {
    return text?.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ") || "-";
}
const formatSentence = (text) => {
    return text?.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ") || "-";
}

const truncateString = (str, maxLength = 25) => {
    if (str.length <= maxLength) {
        return str;
    }
    return str.substring(0, maxLength) + '...';
};

export const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount || 0);
};
export const formatAmount = (amount) => {
    if (amount == null || isNaN(amount)) return "N/A"

    const num = Number(amount)

    if (num >= 10_000_000) return `${(num / 10_000_000).toFixed(num % 10_000_000 === 0 ? 0 : 1)}Cr`
    if (num >= 100_000) return `${(num / 100_000).toFixed(num % 100_000 === 0 ? 0 : 1)}L`
    if (num >= 1_000) return `${(num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1)}K`

    return `${num}`
}
export const formatToINR = (amount) => {
    if (isNaN(amount) || amount === null) return 0;

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);
}

export const formatToIndianNumber = (amount) => {
    if (isNaN(amount) || amount === null) return 0;
    return new Intl.NumberFormat("en-IN", {
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);
}
function formatINRShort(amount) {
    if (amount < 50000) {
        return `₹ ${formatToIndianNumber(amount)}`;
    }

    if (amount < 100000) {
        return `₹ ${(Math.floor(amount / 10) / 100).toFixed(2)} K`;
    }

    if (amount < 10000000) {
        return `₹ ${(Math.floor(amount / 1000) / 100).toFixed(2)} L`;
    }

    return `₹ ${(Math.floor(amount / 100000) / 100).toFixed(2)} Cr`;
}
export { truncateString, leadStatusColors, normalizeSentence, formatINRShort,formatSentence };