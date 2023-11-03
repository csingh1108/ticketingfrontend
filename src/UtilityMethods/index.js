const formatTimeDifference = (lastUpdatedDate) => {
    const currentDate = new Date();
    const updatedDate = new Date(lastUpdatedDate);
    const timeDifference = currentDate - updatedDate;

    const minutes = Math.floor(timeDifference / 60000);
    if (minutes < 60) {
        return minutes > 1 ? `${minutes} minutes ago` : '1 minute ago';
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return hours > 1 ? `${hours} hours ago` : '1 hour ago';
    }

    const days = Math.floor(hours / 24);
    return days > 1 ? `${days} days ago` : 'Yesterday';
};

// Function to format date as "month-day-year"
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format priority
const formatPriority = (priority) => {
    if (priority && typeof priority === 'string' && priority.length > 0){
        return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
    } else return "No Priority";
};


// Function to set text color based on priority
const getPriorityColor = (priority) => {
    switch (priority) {
        case 'High':
            return 'text-orange-600';
        case 'Low':
            return 'text-green-600';
        case 'Medium':
            return 'text-yellow-600';
        case 'Severe':
            return 'text-red-600';
        default:
            return 'text-black';
    }
};

const getPriorityColorBackground = (priority) => {
    switch (priority) {
        case 'High':
            return 'bg-orange-100';
        case 'Low':
            return 'bg-green-100';
        case 'Medium':
            return 'bg-yellow-100';
        case 'Severe':
            return 'bg-red-100';
        default:
            return 'bg-black';
    }
};

const rowBackgroundColors = {
    NEW: 'bg-blue-200',
    OPEN: 'bg-blue-200',
    RE_OPENED: 'bg-blue-200',
    IN_PROGRESS: 'bg-purple-300',
    CLOSED: 'bg-gray-100',
    RESOLVED: 'bg-gray-100',
    BLOCKED: 'bg-brown-100',
};

const formatStatus = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

export { formatTimeDifference, formatDate, getPriorityColor, formatStatus, getPriorityColorBackground, rowBackgroundColors, formatPriority };
