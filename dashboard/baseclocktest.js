const _CELL_LARGE_W = 1000;
const _CELL_LARGE_H = 1000;
const _CELL_SMALL_W = 150;
const _CELL_SMALL_H = 150;

const _CELLTYPE_LARGE = Symbol("_CELLTYPE_LARGE");
const _CELLTYPE_SMALL = Symbol("_CELLTYPE_SMALL");

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

window.onload = function () {
    initDragElement();

    elem_clockhour = document.getElementById("clockhour");
    elem_clockminute = document.getElementById("clockminute");
    elem_clocksecond = document.getElementById("clocksecond");

    setTimeout(simpleUpdateClock, 100);
};

/** @type {HTMLCanvasElement} */
var canvas = document.getElementById("canvas"); 
/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext("2d");
canvas.width = _CELL_LARGE_W;
canvas.height = _CELL_LARGE_H;
var radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.90;
ClockSetup();

function ClockSetup() {
    scaleCell(ctx, _CELLTYPE_LARGE);

    Clock();
}

function Clock() {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 15;
    ctx.strokeStyle = "black";
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "#dddddd";
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "red";
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "#ff00ff";
    ctx.fill();

    ctx.fillStyle = "green";
    ctx.fillRect( 0.9, 0.9, 0.2, 0.2);
    ctx.fillStyle = "magenta";
    ctx.fillRect( -1.1, -1.1, 0.2, 0.2);

    for(let h = 1; h <= 12; ++h) {
        let prog = h / 12;
        let shade = prog * 255;
        ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
        ctx.fillRect(-0.05 + 0.8*Math.sin(prog*2*PI), -0.05 + 0.8*Math.cos(prog*2*PI) , 0.1, 0.1);
    }

    let curDate = new Date();

    let cur_ms = curDate.getMilliseconds();
    let cur_s = curDate.getSeconds() + (cur_ms / 1000);
    let cur_sdeg = cur_s / 60 * 2 * PI;
    let cur_m = curDate.getMinutes() + (cur_s / 60);
    let cur_mdeg = cur_m / 60 * 2 * PI;
    let cur_h = curDate.getHours() + (cur_m / 60);
    let cur_hdeg = cur_h / 12.0 * 2 * PI;

    ctx.beginPath();
    ctx.strokeStyle = "#f00";
    ctx.lineWidth = 0.1;
    ctx.lineCap = "round";
    /*
    // Single conga line. Really nasty behavior when angle is very acute
    ctx.moveTo(0,0);
    let prevX = 0, prevY = 0;
    for(let depth = 1; depth <= 5; ++depth) {
        let scale = Math.pow(0.6, depth - 1);
        let nextX = prevX + scale*0.5*Math.sin(cur_sdeg*depth);
        let nextY = prevY + scale*0.5*Math.cos(cur_sdeg*depth);
        ctx.lineTo(nextX, nextY);
        prevX = nextX; prevY = nextY;
    }
    */

    // Single segments
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

    // Just the hour
    //ctx.lineTo(0.8*Math.sin(cur_sdeg), 0.8*Math.cos(cur_sdeg));

    //ctx.stroke();

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

    setTimeout(Clock, 100);
}

function simpleUpdateClock() {
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


