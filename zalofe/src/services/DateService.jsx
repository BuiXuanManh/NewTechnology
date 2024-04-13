import React from 'react';

export default function DateService(timestamp) {
    if (!timestamp || timestamp === null|| timestamp===undefined || timestamp==="") return undefined;
    else {
        // 1. Split the timestamp into date and time parts
        const parts = timestamp?.split(' ');
        const datePart = parts[0];
        const timePart = parts[1];
        // 2. Extract date components (year, month, day)
        const dateParts = datePart.split('-');
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10);
        const year = parseInt(dateParts[2], 10);
        // 3. Extract time components (hours, minutes, seconds)
        const timeParts = timePart.split(':');
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        const seconds = parseInt(timeParts[2], 10);

        // 4. Create a new Date object with extracted components and adjust time zone
        const newDate = new Date(`${month}-${day}-${year} ${hours}:${minutes}:${seconds}`).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });

        // 5. Return the formatted date string
        return newDate;
    }
}