const _CELL_LARGE_W = 1000;
const _CELL_LARGE_H = 1000;
const _CELL_SMALL_W = 150;
const _CELL_SMALL_H = 150;

const _CELLTYPE_LARGE = Symbol("_CELLTYPE_LARGE");
const _CELLTYPE_SMALL = Symbol("_CELLTYPE_SMALL");

const _CLOCK_LENHOUR = 0.25;
const _CLOCK_LENMINUTE = 0.42;
const _CLOCK_LENSECOND= 0.5;
const _CLOCK_SCALEHOUR = 0.4;
const _CLOCK_SCALEMINUTE = 0.5;
const _CLOCK_SCALESECOND = 0.6;

const _CLOCK_SCALELIMIT = 0.002;
const _CLOCK_DEPTHLIMIT = 7;

const _HAND_HOUR = 1;
const _HAND_MINUTE = 2;
const _HAND_SECOND = 3;

const _STR_DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const _STR_DAY_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const _STR_MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const _STR_MONTH_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/*

todo:
    Bricks:
        Fractclock
            Alt palettes?
            Chances to grow/not grow?
        Weather
            use openweather API + icons?
            Current weather
            Forecast?
        Severe weather alert as separate brick?
        Thunder map?
        Sunrise, sunset
        Phase of moon
        Random visualizers/screensavers like glowy lines, plasma ball, etc

    Features:
        burn-in prevention
        autozoom? brick request to zoom?
        autoscroll
        manual scroll and zoom

*/

var PI = Math.PI;

/* Utility Funcs */

function scaleCell(ctx, celltype) {
    switch(celltype) {
        case _CELLTYPE_LARGE:
            scaleFrom(ctx, 0, 0, _CELL_LARGE_W, _CELL_LARGE_H);
            break;
        case _CELLTYPE_SMALL:
            scaleFrom(ctx, 0, 0, _CELL_SMALL_W, _CELL_SMALL_H);
            break;
    }
}

function scaleFrom(ctx, x1, y1, x2, y2) {
    ctx.transform((x2-x1)/2, 0, 0, (y1-y2)/2, 0, 0);
    //ctx.transform(500, 0, 0, -500, 0, 0);
}




/* ... rest of setup */

var elem_clockhour;
var elem_clockminute;
var elem_clocksecond;

var is_stop = false;

window.onload = function () {
    initDragElement();

    /*
    elem_clockhour = document.getElementById("clockhour");
    elem_clockminute = document.getElementById("clockminute");
    elem_clocksecond = document.getElementById("clocksecond");

    setTimeout(simpleUpdateClock, 100);
    */
};

//catch keys for debug
document.onkeydown = function(evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        is_stop = !is_stop;
    }
};

//

/** @type {HTMLCanvasElement} */
let squareWeather = document.getElementById("weathertest");
let squareWeather_details = document.getElementById("weather_details");
let squareWeather_icon = document.getElementById("weather_icon");

let calendar_month = document.getElementById("calendar_month");
let calendar_date = document.getElementById("calendar_date");
let calendar_day = document.getElementById("calendar_day");

//

/** @type {HTMLCanvasElement} */
var canvas = document.getElementById("canvas"); 
/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext("2d");
canvas.width = _CELL_LARGE_W;
canvas.height = _CELL_LARGE_H;
var radius = canvas.height / 2;
ctx.translate(radius, radius * 1.2);
radius = radius * 0.90;
ClockSetup();

function ClockSetup() {
    scaleCell(ctx, _CELLTYPE_LARGE);

    Clock();
}

var testBuffer;
function Clock() {
    if(is_stop) {
        setTimeout(Clock, 60);
        return;
    }
    if(testBuffer !== undefined) {
        ctx.putImageData(testBuffer, 1, 0);
        //This is a packed array of RGBA pixels, 4000000 = 1000 x 1000 x 4
    }

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 15;
    ctx.strokeStyle = "black";
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "#dddddd";
    //ctx.fill();
    
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "red";
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "#402040";
    //ctx.fill();

    ctx.fillStyle = "green";
    ctx.fillRect( 0.9, 0.9, 0.2, 0.2);
    ctx.fillStyle = "magenta";
    ctx.fillRect( -1.1, -1.1, 0.2, 0.2);

    let curDate = new Date();

    let cur_ms = curDate.getMilliseconds();
    let cur_s = curDate.getSeconds() + (cur_ms / 1000);
    let cur_sdeg = cur_s / 60 * 2 * PI;
    let cur_m = curDate.getMinutes() + (cur_s / 60);
    let cur_mdeg = cur_m / 60 * 2 * PI;
    let cur_h = curDate.getHours() + (cur_m / 60);
    let cur_hdeg = cur_h / 12.0 * 2 * PI;

    ctx.beginPath();
    //ctx.strokeStyle = "#f00";
    //ctx.lineWidth = 0.01;
    ctx.lineCap = "round";

    let createCount = 1;
    let createQueue = [[0, 0, 0, 1, 0, 0]];
    //let drawCount = 0; Guaranteed to be createCount - 1
    let drawQueue = [];
    let cur = 0;
    //let palette = ["#888888","#ff0000","#00ff00","#0000ff"] //This should probably live way up
    let pal_h, pal_m, pal_s;
    let palette_type = 4;
    switch(palette_type) {
        case 1:
            pal_h = "#ff4040";
            pal_m = "#40ff40";
            pal_s = "#4040ff";
            break;
        case 2:
            pal_h = "#f0f0f0";
            pal_m = "#808080";
            pal_s = "#101010";
            break;
        case 3:
            pal_h = chroma.oklch(0.9, 0.2, cur_h * 30);
            pal_m = chroma.oklch(0.9, 0.2, cur_m * 6);
            pal_s = chroma.oklch(0.9, 0.2, cur_s * 6);
            break;
        case 4:
            let deg_h = cur_s * 6;
            pal_h = chroma.oklch(0.8, 0.25, deg_h);
            pal_m = chroma.oklch(0.8, 0.25, deg_h + 120);
            pal_s = chroma.oklch(0.8, 0.25, deg_h + 240);
            break;
    }
    //let palette = ["rgb(128,128,128)","rgb(255,64,64)","rgb(64,255,64)","rgb(64,64,255)"]
    let palette = ["", pal_h, pal_m, pal_s];
    let widths = ["0.3","0.35","0.14","0.10"];

    // Layer 0 -- Guide lines
    
        //Second
    ctx.beginPath();
    ctx.strokeStyle = `rgba(0,0,0,0.2)`;
    ctx.lineWidth = 0.05;
    ctx.moveTo(0, 0);
    ctx.lineTo(100*Math.sin(cur_sdeg), 100*Math.cos(cur_sdeg));
    ctx.stroke();
    ctx.strokeStyle = `rgb(0,0,0)`;
    ctx.lineWidth = 0.002;
    ctx.lineTo(0, 0);
    ctx.stroke();

        //Minute
    ctx.beginPath();
    ctx.strokeStyle = `rgba(128,128,128,0.2)`;
    ctx.lineWidth = 0.072;
    ctx.moveTo(0, 0);
    ctx.lineTo(100*Math.sin(cur_mdeg), 100*Math.cos(cur_mdeg));
    ctx.stroke();
    ctx.strokeStyle = `rgb(0,0,0)`;
    ctx.lineWidth = 0.002;
    ctx.lineTo(0, 0);
    ctx.stroke();

        //Hour
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255,255,255,0.2)`;
    ctx.lineWidth = 0.1;
    ctx.moveTo(0, 0);
    ctx.lineTo(100*Math.sin(cur_hdeg), 100*Math.cos(cur_hdeg));
    ctx.stroke();
    ctx.strokeStyle = `rgb(0,0,0)`;
    ctx.lineWidth = 0.002;
    ctx.lineTo(0, 0);
    ctx.stroke();

    // Layer 1 -- Decorations
    
    for(let h = 1; h <= 12; ++h) {
        let prog = h / 12;
        let shade = prog * 255;
        ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;

        //opt 1 -- squares
        //ctx.fillRect(-0.05 + 0.8*Math.sin(prog*2*PI), -0.05 + 0.8*Math.cos(prog*2*PI) , 0.1, 0.1);

        //opt 2 -- pills
        ctx.beginPath();
        ctx.strokeStyle = `rgb(${shade}, ${shade}, ${shade})`;
        ctx.lineWidth = 0.03;
        ctx.moveTo(0.8*Math.sin(prog*2*PI), 0.8*Math.cos(prog*2*PI));
        ctx.lineTo(0.9*Math.sin(prog*2*PI), 0.9*Math.cos(prog*2*PI));
        ctx.stroke();
    }

    // Layer 2 -- Clock itself
    // {startX, startY, startDegree, scale, depth}
    while(cur < createCount) {
        let startX, startY, startDeg, scale, depth;
        [startX, startY, startDeg, scale, depth] = createQueue[cur];
        depth += 1;

        //hour
        let scaleHour = scale * _CLOCK_SCALEHOUR;
        let scaleMinute = scale * _CLOCK_SCALEMINUTE;
        let scaleSecond = scale * _CLOCK_SCALESECOND;
        let nextX, nextY, curDeg;
        if(scaleHour > _CLOCK_SCALELIMIT && depth <= _CLOCK_DEPTHLIMIT) {
            curDeg = startDeg + cur_hdeg;
            //ctx.moveTo(startX, startY);
            nextX = startX + scale*_CLOCK_LENHOUR*Math.sin(curDeg);
            nextY = startY + scale*_CLOCK_LENHOUR*Math.cos(curDeg);
            //ctx.lineTo(nextX, nextY);
            drawQueue.push([startX, startY, nextX, nextY, _HAND_HOUR]);

            createCount += 1;
            createQueue.push([nextX, nextY, curDeg, scaleHour, depth, _HAND_HOUR]);
        }

        //minute
        if(scaleMinute > _CLOCK_SCALELIMIT && depth <= _CLOCK_DEPTHLIMIT) {
            curDeg = startDeg + cur_mdeg;
            //ctx.moveTo(startX, startY);
            nextX = startX + scale*_CLOCK_LENMINUTE*Math.sin(curDeg);
            nextY = startY + scale*_CLOCK_LENMINUTE*Math.cos(curDeg);
            //ctx.lineTo(nextX, nextY);
            drawQueue.push([startX, startY, nextX, nextY, _HAND_MINUTE]);

            createCount += 1;
            createQueue.push([nextX, nextY, curDeg, scaleMinute, depth, _HAND_MINUTE]);
        }

        //second
        if(scaleSecond > _CLOCK_SCALELIMIT && depth <= _CLOCK_DEPTHLIMIT) {
            curDeg = startDeg + cur_sdeg;
            //ctx.moveTo(startX, startY);
            nextX = startX + scale*_CLOCK_LENSECOND*Math.sin(curDeg);
            nextY = startY + scale*_CLOCK_LENSECOND*Math.cos(curDeg);
            //ctx.lineTo(nextX, nextY);
            drawQueue.push([startX, startY, nextX, nextY, _HAND_SECOND]);

            createCount += 1;
            createQueue.push([nextX, nextY, curDeg, scaleSecond, depth, _HAND_SECOND]);
        }

        //end
        cur += 1;
    }

    //and now draw
    for(cur = drawQueue.length - 1; cur >= 0; --cur) {
        let startX, startY, endX, endY, typeIdx;
        [startX, startY, endX, endY, typeIdx] = drawQueue[cur];
        let dist = Math.sqrt((endX - startX)*(endX - startX) + (endY - startY)*(endY - startY));
        //let shade = dist * 800;
        let shade = 255 * Math.pow((drawQueue.length - cur) / drawQueue.length, 8);

        ctx.beginPath();
        //ctx.strokeStyle = `rgb(${shade},${shade},${shade})`;
        ctx.strokeStyle = palette[typeIdx];
        //ctx.lineWidth = 0.004 + dist * 0.1;
        ctx.lineWidth = widths[typeIdx] * (0.02 + dist);
        
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    //Layer 3 -- Cap Decorations

    //Making a template for queue system
    // {startX, startY, startDegree, scale, depth}
    // use depth as limit or scale?
    // queue up and then draw backwards instead?
    /*
    ctx.moveTo(sX, sY);
    //let scale = Math.pow(0.6, depth - 1);
    let nextX = sX + s*Math.sin(sR);
    let nextY = sY + s*Math.cos(sR);
    ctx.lineTo(nextX, nextY);

    sX = nextX; sY = nextY;
    //queue hour - { nextX, nextY, sR + hourR, s * hourS }
    //queue minute
    //queue second
    ctx.stroke();
    */

    // Single segments
    /*
    let prevX = 0, prevY = 0;
    for(let depth = 1; depth <= 5; ++depth) {
        ctx.moveTo(prevX, prevY);
        let scale = Math.pow(0.6, depth - 1);
        let nextX = prevX + scale*0.5*Math.sin(cur_sdeg*depth);
        let nextY = prevY + scale*0.5*Math.cos(cur_sdeg*depth);
        ctx.lineTo(nextX, nextY);
        prevX = nextX; prevY = nextY;

        ctx.stroke();
    }
    */

    // Just the hour
    //ctx.lineTo(0.8*Math.sin(cur_sdeg), 0.8*Math.cos(cur_sdeg));

    //ctx.stroke();

    /*
    ctx.beginPath();
    ctx.strokeStyle = "#0f0";
    ctx.lineWidth = 0.07;
    ctx.moveTo(0,0);
    ctx.lineTo(0.8*Math.sin(cur_mdeg), 0.8*Math.cos(cur_mdeg));
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#00f";
    ctx.lineWidth = 0.05;
    ctx.moveTo(0,0);
    ctx.lineTo(0.8*Math.sin(cur_hdeg), 0.8*Math.cos(cur_hdeg));
    ctx.stroke();
    */

    testBuffer = ctx.getImageData(0, 0, 1000, 1000);

    setTimeout(Clock, 60);
}

function simpleUpdateClock() {
    /*
    let curDate = new Date();

    let cur_ms = curDate.getMilliseconds();
    let cur_s = curDate.getSeconds() + (cur_ms / 1000);
    let cur_sdeg = cur_s / 60 * 2 * PI;
    let cur_m = curDate.getMinutes() + (cur_s / 60);
    let cur_mdeg = cur_m / 60 * 2 * PI;
    let cur_h = curDate.getHours() + (cur_m / 60);
    let cur_hdeg = cur_h / 12.0 * 2 * PI;
    

    elem_clockhour.style.top    = (50 - 30 * Math.cos(cur_hdeg)) + "%";
    elem_clockhour.style.left   = (50 + 30 * Math.sin(cur_hdeg)) + "%";
    elem_clockminute.style.top  = (50 - 30 * Math.cos(cur_mdeg)) + "%";
    elem_clockminute.style.left = (50 + 30 * Math.sin(cur_mdeg)) + "%";
    elem_clocksecond.style.top  = (50 - 30 * Math.cos(cur_sdeg)) + "%";
    elem_clocksecond.style.left = (50 + 30 * Math.sin(cur_sdeg)) + "%";

    setTimeout(simpleUpdateClock, 120);
    */
}

/* draggable handler. taken from https://codepen.io/jkasun/pen/QrLjXP -- thanks jkasun */
function initDragElement() {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    var popups = document.getElementsByClassName("popup");
    var elmnt = null;
    var currentZIndex = 100; //TODO reset z index when a threshold is passed

    for (var i = 0; i < popups.length; i++) {
        var popup = popups[i];
        var header = getHeader(popup);

        popup.onmousedown = function () {
            this.style.zIndex = "" + ++currentZIndex;
        };

        if (header) {
            header.parentPopup = popup;
            header.onmousedown = dragMouseDown;
        }
    }

    function dragMouseDown(e) {
        elmnt = this.parentPopup;
        elmnt.style.zIndex = "" + ++currentZIndex;

        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        if (!elmnt) {
            return;
        }

        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function getHeader(element) {
        var headerItems = element.getElementsByClassName("popup-header");

        if (headerItems.length === 1) {
            return headerItems[0];
        }

        return null;
    }
}


