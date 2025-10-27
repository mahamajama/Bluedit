
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


export function isImage(url) {
    if (!url) return false;
    if (url.split("?", 1)[0].slice(-16) === 'reddit.com/media') return false;

    const url3 = url.slice(-4);
    if (url3 === '.png' || url3 === '.jpg') return true;

    const url4 = url.slice(-5);
    if (url4 === '.jpeg' || url4 === '.webp') return true;

    return false;
}

export function isVideo(url) {
    if (!url) return false;
    const clean = url.split("?", 1)[0];
    if (clean.slice(-16) === 'reddit.com/media') return false;

    const url3 = clean.slice(-4);
    if (url3 === '.mp4') return true;

    const url4 = clean.slice(-5);
    if (url4 === '.webm') return true;

    return false;
}


export function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export const getTimestamp = (createdUtc) => {
    const postTime = new Date(createdUtc * 1000);
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

// scrollbar width via: https://davidwalsh.name/detect-scrollbar-width
export function getScrollbarWidth() {
    // Create the measurement node
    var scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    scrollDiv.style.overflow = 'scroll';
    document.body.appendChild(scrollDiv);

    // Get the scrollbar width
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    // Delete the DIV 
    document.body.removeChild(scrollDiv);

    return scrollbarWidth;
}

export function isEmpty(object) {
    for (const prop in object) {
        if (Object.hasOwn(object, prop)) {
            return false;
        }
    }
    return true;
}

export function mobileCheck() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

