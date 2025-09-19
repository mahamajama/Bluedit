



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
        remainderT = `, ${remainder} month${remainder === 1 ? '' : 's'}`;
    } else if (t > 2628000) { // months
        t /= 2628000;
        unit = 'months';
        const remainder = Math.floor((t % 1) * 30);
        remainderT = `, ${remainder} day${remainder === 1 ? '' : 's'}`;
    } else if (t > 86400) { // days
        t /= 86400;
        unit = 'days';
    } else if (t > 3600) { // hours
        t /= 3600;
        unit = 'hours';
    } else if (t > 60) { // minutes
        t /= 60;
        unit = 'minutes';
    }

    const time = Math.floor(t);
    if (time === 1) {
        unit = unit.slice(0, -1);
    }
    return `${time} ${unit}${remainderT} ago`;
}