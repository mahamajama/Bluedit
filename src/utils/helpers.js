
// MATHS

export function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}


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



export const lerp = (start, end, speed) => {
    return start + (end - start) * speed;
}
export const inerpolators = {
    identity: function(t){
        t = Math.max(0,Math.min(1,t));
        return t;
    },
    cubic: function(t){
        t = Math.max(0,Math.min(1,t));
        if(2*t<<0){
            return 4*(t-1)*(t-1)*(t-1)+1;
        } else {
            return 4*t*t*t;
        }
    },
    elastic: function(t){
        t = Math.max(0,Math.min(1,t));
        var range = 10.5*Math.PI;
        return (range - Math.sin(range*t)/t)/(range - 1);
    }
}




