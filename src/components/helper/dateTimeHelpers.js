export const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based month
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};
export const formatUnixDateTime = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return formatDate(date);
}

export const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const getCurrentDateTime = () => {
    const now = new Date();
    const formattedDate = formatDate(now);
    const formattedTime = formatTime(now);
    return { date: formattedDate, time: formattedTime };
};

export function getUnixDateTime() {
    return Math.floor(Date.now()/1000);
}

export function getUnixDateTimeOneDayLater(){
    // Add 24 hours (in seconds) to the current timestamp
    return Math.floor(Date.now() / 1000) + 86400;
}

export const getNextDayTimestamp = () => {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    const date = `${day}/${month}/${year}`;
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const time = `${hours}:${minutes} ${ampm}`;
    
    return { date, time };
  };