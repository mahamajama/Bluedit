



export function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export const getTimestamp = (postTime) => {
    const now = Date.now();
    let t = (now - postTime) / 1000;
    let unit = "seconds";
    let remainderT = '';
    if (t > 31557600) { // years
        t /= 31557600;
        unit = 'years';
        const remainder = Math.floor((t % 1) * 12);
        if (remainder > 0) {
            remainderT = `, ${remainder} month${remainder === 1 ? '' : 's'}`;
        }
    } else if (t > 2628000) { // months (yes, i know months have different lengths, its close enough)
        t /= 2628000;
        unit = 'months';
        const remainder = Math.floor((t % 1) * 30);
        if (remainder > 0) {
            remainderT = `, ${remainder} day${remainder === 1 ? '' : 's'}`;
        }
    } else if (t > 86400) { // days
        t /= 86400;
        unit = 'days';
        const remainder = Math.floor((t % 1) * 24);
        if (remainder > 0) {
            remainderT = `, ${remainder} hour${remainder === 1 ? '' : 's'}`;
        }
    } else if (t > 3600) { // hours
        t /= 3600;
        unit = 'hours';
        const remainder = Math.floor((t % 1) * 60);
        if (remainder > 0) {
            remainderT = `, ${remainder} minute${remainder === 1 ? '' : 's'}`;
        }
    } else if (t > 60) { // minutes
        t /= 60;
        unit = 'minutes';
        const remainder = Math.floor((t % 1) * 60);
        if (remainder > 0) {
            remainderT = `, ${remainder} second${remainder === 1 ? '' : 's'}`;
        }
    }

    const time = Math.floor(t);
    if (time === 1) {
        unit = unit.slice(0, -1);
    }
    return `${time} ${unit}${remainderT} ago`;
}



