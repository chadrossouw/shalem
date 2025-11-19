export function dateToString(date) {
    let dateObj = new Date(date);
    // convert to j F Y format
    let day = dateObj.getDate();
    let month = dateObj.toLocaleString('default', { month: 'long' });
    let year = dateObj.getFullYear();

    return `${day} ${month} ${year}`;
}