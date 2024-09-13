const _CELL_LARGE_W = 1080;
const _CELL_LARGE_H = 1080;
const _CELL_SMALL_W = 270;
const _CELL_SMALL_H = 270;

const _CELL_COL_LIMIT = 4; // should be floor(_LARGE / _SMALL)

const _CELLTYPE_LARGE = Symbol("_CELLTYPE_LARGE");
const _CELLTYPE_SMALL = Symbol("_CELLTYPE_SMALL");

var _COLOR_VIVID = chroma.oklch(0.85, 0.18, 0);
var _COLOR_FADED = chroma.oklch(0.96, 0.04, 0);
var _COLOR_DARK  = chroma.oklch(0.09, 0.10, 0);
var _COLOR_ERCOT_LOW  = "#52B76D"; // Color scheme straight from danopia's ERCOT dashboard
var _COLOR_ERCOT_MED  = "#eba134";
var _COLOR_ERCOT_HIGH = "#bd0000";

//

const _CLOCK_LENHOUR = 0.25;
const _CLOCK_LENMINUTE = 0.42;
const _CLOCK_LENSECOND= 0.5;
const _CLOCK_SCALEHOUR = 0.4;
const _CLOCK_SCALEMINUTE = 0.5;
const _CLOCK_SCALESECOND = 0.6;

const _CLOCK_SCALELIMIT = 0.01;
const _CLOCK_SCALELIMIT_SMALL = 0.04;
const _CLOCK_DEPTHLIMIT = 10;

const _HAND_HOUR = 1;
const _HAND_MINUTE = 2;
const _HAND_SECOND = 3;

//const _DATE_FREQ // Not necessary, set update time to midnight
const _STR_DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const _STR_DAY_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const _STR_MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const _STR_MONTH_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const _WEATHER_FREQ_FAST = 600_000; //10min -- Temperature doesn't update that often.
const _WEATHER_FREQ_SLOW = 1200_000; //20min -- I assumed _fast was remotely fast, probably not needed. //TODO: Remove this?
//TODO: Separate timer for OAuth refresh and token lifetime?

const _DOODLE_WIDTH_BASE = 10;
const _DOODLE_WIDTH_THIN = 3;
const _DOODLE_WIDTH_MEDIUM = 10;
const _DOODLE_WIDTH_THICK = 30;
const _DOODLE_WIDTH_ERASE = 85;

const _MOON_FREQ = 3600_000; //1hr, pending other details in the full size version.

const _ERCOT_THRESHOLD_MED = 100;
const _ERCOT_THRESHOLD_HIGH = 500;
const _ERCOT_PRICE_IDX = 5;
const _ERCOT_FREQ = 900_000; //15min, may need to time to sync windows
//TODO: Separate timer for OAuth refresh and token lifetime?

const _SEVERE_FREQ = 3600_000; //1hr, TODO: Check API limits. Faster is better for severe warnings. Maybe two freqs for clear vs alert to look out for warnings?

//const _THUNDER_FREQ //How will this work? If can embed, not a problem, just use severe alerts to listen for when this should be live.

//

// localstorage consts?

//doodle_canvas - canvas persistence for whiteboard


/*

todo:
    * How does each brick prevent burn-in?
        Whole-screen sweep on the hour w/ time
    Bricks:
        Status/timestamp overlay for things that pull data + Default timestamp debug messages
        Scheduling for data pulls, caching pulls if refreshing too much
        Fractclock
            Alt palettes?
            Per-branch chances to grow/not grow?
        Weather
            Split from calendar
            Forecast?
        Severe weather alert as separate brick?
        Thunder map?
        Sunrise, sunset
        Random visualizers/screensavers like glowy lines, plasma ball, etc
        Whiteboard
            Restrict usage to when big (also indicator that it's not ready yet (maybe the transform needs to be faster))
            Change color scheme
            Hideable toolbar for buttons w/ color options + eraser
        ERCOT hourly
        ---
        Quick timer? (vacuum charging, washing, drying, etc)

    Features:
        Make each brick's update frequency depend on the content... probably only the clock should update per frame.
        Brick movement
            Should ignore input while moving around
        burn-in prevention
        autozoom? brick itself requests to zoom?
        autoscroll
        manual scroll and zoom
        Regular self-change of palette (night palette?)
        Fetch google calendar for holidays and astronomical events?
        Settings brick?

    ---

    Checklisting:
    Remaining issue list:
        - SIZE - behave as expected big vs small
        - BURN - have no static spots over a day
        - UPDATE - needs an actual update schedule instead of refreshing
        - CACHE - should it save anything to disc?
        - FOCUS - when does it take control on its own? how should it alert if it can't take priority?
        - STOP - does it support stop (and maybe other debug features)?

    Brick/Issue  SIZE  BURN  UPDT  CACHE FOCUS STOP  
    Clock        done        done  n/a         done 
    Date         n/a               n/a   n/a        
    Time         n/a   n/a?  n/a   n/a   n/a        
    Weather                                         
    Doodle       done  n/a?! n/a                    
    Moon                                            
    ERCOT                                           
    Severe                                          
    Thunder                                         

clock
date
time
weather
doodle
moon
ercot
severe
thunder

*/

//

/** @type {HTMLCanvasElement} */
let notifStopped = document.getElementById("notif_stopped");

let squareClock = document.getElementById("sqclock");

let squareClockdigit = document.getElementById("sqclockdigit");
let squareClockdigit_hour = document.getElementById("clockdigit_hour");
let squareClockdigit_minute = document.getElementById("clockdigit_minute");
let squareClockdigit_second = document.getElementById("clockdigit_second");

let squareWeather = document.getElementById("weathertest");
let squareWeather_details = document.getElementById("weather_details");
let squareWeather_icon = document.getElementById("weather_icon");
let cache_weather_data;
let cache_weather_data_time;

let squareMoon = document.getElementById("sqmoon");
let squareMoon_icon = document.getElementById("moon_icon");
let squareMoon_caption = document.getElementById("moon_caption");
let squareMoon_numphase = document.getElementById("moon_numphase");
let squareMoon_image = document.getElementById("moon_img");

let squareCalendar_month = document.getElementById("calendar_month");
let squareCalendar_date = document.getElementById("calendar_date");
let squareCalendar_day = document.getElementById("calendar_day");

let dCanvas = document.getElementById("doodle");
/** @type {CanvasRenderingContext2D} */
let dCtx = dCanvas.getContext("2d");

let squareErcot = document.getElementById("sqercot");
let squareErcot_labelDigits = document.getElementById("ercot_label_digits");
let cache_ercot_idtoken;
let cache_ercot_refreshtoken; //I give up with CORS. I pray this works.
let cache_ercot_expires;
let ercot_price = 0.0;


const ow_requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

const ercot_init_requestOptions = {
    method: 'POST',
    redirect: 'follow'
}

var ercot_headers = new Headers();
const ercot_query_requestOptions = {
    method: "GET",
    headers: ercot_headers,
    redirect: "follow"
}

const PI = Math.PI;
const _DUR_DAY = 86_400_000;

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

function clamp(from, to, now) {
    return (now < from) ? from : (now < to) ? now : to;
}

function progress(from, to, now) {
    return (clamp(from, to, now) - from) / (to - from);
}

function lerp( a, b, alpha ) {
    return a + alpha * ( b - a );
}

function lerpt(a, b, from, to, now) {
    return lerp(a, b, progress(from, to, now))
}

function depix(str) {
    return  str.slice(0, str.length - 2) - 0;
}

// Lune thoughts -- Lune with 1/4 area appears to be with a circle centered 0.621184 away from the circle with radius 1 (it should have radius = sqrt(1 + 0.621184^2))
// https://www.desmos.com/calculator/m1yhxauivs
//Mostly copy-pasted from Dither's https://gist.github.com/Dither/d2801f7b22d5602fff38821c2177e301
function moonphase(date = new Date(), type = 0) {
    let year = date.getFullYear(),
        month = date.getMonth(),
        day = date.getDate();

    let jd, phase;

    if (month < 3) {
        --year;
        month += 12;
    }

    ++month;

    jd = 365.25 * year + 30.6 * month + day - 694039.09; // jd is total days elapsed
    jd /= 29.53; // divide by the moon cycle (29.53 days)
    phase = parseInt(jd, 10); // int(jd) -> phase, take integer part of jd
    jd -= phase; // subtract integer part to leave fractional part of original jd

    jd *= 8;

    if(type <= 0.0001) {
        return jd;
    }

    phase = Math.ceil(jd); // scale fraction from 0-8 and round by adding 0.5
    phase = phase & 7; // 0 and 8 are the same so turn 8 into 0

    if(type <= 1.0001) {
        return phase;
    }
    
    let text;
    switch (phase) {
        case 0: text = "New Moon"; break;
        case 1: text = "Waxing Crescent"; break;
        case 2: text = "Quarter Moon"; break;
        case 3: text = "Waxing Gibbous"; break;
        case 4: text = "Full Moon"; break;
        case 5: text = "Waning Gibbous"; break;
        case 6: text = "Last Quarter"; break;
        case 7: text = "Waning Crescent"; break;
    }
    if(type <= 2.0001) {
        return text;
    } else {
        var o = {};
        o.id = phase;
        o.text = text;
        o.float = jd;
        return o;
    }
}

function updateColors(in_hue) {
    let hue = in_hue === undefined ? Math.random()*360 : in_hue;
    _COLOR_VIVID = chroma.oklch(0.80, 0.18, hue);
    _COLOR_FADED = chroma.oklch(0.96, 0.04, hue);
    _COLOR_DARK  = chroma.oklch(0.12, 0.10, hue);

    document.documentElement.style.setProperty('--main-bg-color-vivid', _COLOR_VIVID);
    document.documentElement.style.setProperty('--main-bg-color-faded', _COLOR_FADED);
    document.documentElement.style.setProperty('--main-bg-color-dark', _COLOR_DARK);
}



/* ... rest of setup */

var elem_clockhour;
var elem_clockminute;
var elem_clocksecond;

var doodleWidth = _DOODLE_WIDTH_BASE;
var doodleColorStr = "#000";

var is_stop = false;

window.onload = function() {
    let dud; //Placeholder to make clear where promises can start being handled

    scaleCell(ctx, _CELLTYPE_LARGE);
    updateColors(); //TODO: Replace random assignment with something more... intentional?
    dud = init_wakeLocker();
    init_dragElement();

    loop_clock();
    init_calendar();
    loop_fillClockdigit();
    dud = init_weather();
    init_doodle();
    fillMoon();
    init_ercot();
    dud = loop_ercot();

    dud = loop_slowUpdates();
    SquareManager(); //TODO: Should this be async?

    //Disable page move
    document.body.addEventListener('touchmove', function(evt) {
        evt.preventDefault();
    }, false);
};

// TODO: Save other bits of settings, too. Maybe query data so refreshing doesn't spam API requests?
window.onbeforeunload = function() { // TODO: Hardcode storage item name as a constant
    window.localStorage.setItem('weather_data', cache_weather_data);
    window.localStorage.setItem('weather_data_time', cache_weather_data_time);

    window.localStorage.setItem('doodle_canvas', dCanvas.toDataURL());
    // color setting?

    //moon?

    //ercot
    window.localStorage.setItem('ercot_idtoken', cache_ercot_idtoken);
    window.localStorage.setItem('ercot_refreshtoken', cache_ercot_refreshtoken);
    window.localStorage.setItem('ercot_expires', cache_ercot_expires);

    //severe?

    //thunder?
}

function init_doodle() {
    //from https://codepen.io/michaelsboost/pen/kQmwyq

    // Fill Window Width and Height
    dCanvas.width = _CELL_LARGE_W;
    dCanvas.height = _CELL_LARGE_H;

    //Set background color
    dCtx.fillStyle="#fff";
    dCtx.fillRect(0, 0, dCanvas.width, dCanvas.height);

    //Load cached canvas data
    let dataURL = window.localStorage.getItem('doodle_canvas');
    if(dataURL != null) {
        let img = new Image;
        img.src = dataURL;
        img.onload = function () {
            dCtx.drawImage(img, 0, 0);
        };
    }

    //Mouse event handlers
    if(dCanvas) {
        var isDown = false;
        var canvasX, canvasY;
        dCtx.lineWidth = doodleWidth;

        dCanvas.addEventListener("mousedown", function(e){
            isDown = true;
            dCtx.beginPath();
            canvasX = e.pageX - dCanvas.offsetLeft;
            canvasY = e.pageY - dCanvas.offsetTop;
            dCtx.moveTo(canvasX, canvasY);
        });
        
        dCanvas.addEventListener("mousemove", function(e){
            if(isDown !== false) {
                canvasX = e.pageX - dCanvas.offsetLeft;
                canvasY = e.pageY - dCanvas.offsetTop;
                dCtx.lineTo(canvasX, canvasY);
                dCtx.strokeStyle = doodleColorStr;
                dCtx.lineWidth = doodleWidth;
                dCtx.lineCap = "round";
                dCtx.stroke();
            }
        }); 
        
        dCanvas.addEventListener("mouseup", function(e){
            isDown = false;
            dCtx.closePath();
        });
    }

    // Touch event handlers
    var draw = {
        started: false,
        start: function(evt) {
            dCtx.beginPath();
            dCtx.moveTo(
                evt.touches[0].pageX,
                evt.touches[0].pageY
            );

            this.started = true;
        },
        move: function(evt){
            if(this.started) {
                dCtx.lineTo(
                    evt.touches[0].pageX,
                    evt.touches[0].pageY
                );

                dCtx.strokeStyle = doodleColorStr;
                dCtx.lineWidth = doodleWidth;
                dCtx.lineCap = "round";
                dCtx.stroke();
            }
        },
        end: function(evt) {
            this.started = false;
        }
    };

    //Hook touch events
    dCanvas.addEventListener('touchstart', draw.start, false);
    dCanvas.addEventListener('touchend', draw.end, false);
    dCanvas.addEventListener('touchmove', draw.move, false);
}

//TODO: Place this function somewhere appropriate
async function loop_slowUpdates() {
    let dud; //placeholder for possible promise handling

    //What fills here?
    //update_date();
    dud = update_weather();
    //update_moon();
    //update_severe();
    //update_thunder();

    setTimeout(loop_slowUpdates, 10000);
}

// TODO: Where... does this go?
// TODO: Right now going off erase mode takes two clicks. Will take a lot of work, but make it more natural.
//       Maybe highlight current setting, and swap between erase/nonerase modes?
//       Maybe have small and large erasers?
function doodleTool(button) {
    switch(button) {
        case "eraser":
            doodleWidth = _DOODLE_WIDTH_ERASE;
            doodleColorStr = "#fff";
            break;
        case "thin":
            doodleWidth = _DOODLE_WIDTH_THIN;
            break;
        case "med":
            doodleWidth = _DOODLE_WIDTH_MEDIUM;
            break;
        case "thick":
            doodleWidth = _DOODLE_WIDTH_THICK;
            break;
        case "black":
            doodleColorStr = "#000";
            break;
        case "red":
            doodleColorStr = "#f00";
            break;
        case "green":
            doodleColorStr = "#0f0";
            break;
        case "blue":
            doodleColorStr = "#00f";
            break;
        case "new":
            //TODO
            break;
    }
} 

//catch keys for debug
document.onkeydown = function(evt) {
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        if(is_stop) {
            is_stop = false;
            notifStopped.classList.add("hidden");
        } else { //if !is_stop
            is_stop = true;
            notifStopped.classList.remove("hidden");
        }
    }
};

//

function init_calendar() {
    let curDate = new Date();
    squareCalendar_month.innerText = _STR_MONTH[curDate.getMonth()];
    squareCalendar_date.innerText = curDate.getDate();
    squareCalendar_day.innerText = _STR_DAY[curDate.getDay()];
}

async function init_weather() {
    cache_weather_data = window.localStorage.getItem('weather_data');
    cache_weather_data_time = window.localStorage.getItem('weather_data_time');

    return update_weather(true);
}

async function update_weather(force = false) {
    //TODO: There may be more kinds of weather info getting fetched. Fetch those, use different frequencies, etc.
    if(cache_weather_data_time != null && cache_weather_data_time > (Date.now() - _WEATHER_FREQ_FAST )) {
        if(force) {
            console.log('cached weather data loaded');
            console.log(cache_weather_data);
            fillWeather(JSON.parse(cache_weather_data));
        }
    } else {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${OW_LAT}&lon=${OW_LONG}&appid=${KEY_OPENWEATHER}&units=imperial`, ow_requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(`openweather data fetched|${Date.now()}|${result.main.temp}`)
            //console.log(result);
            fillWeather(result);
            cache_weather_data = JSON.stringify(result);
            cache_weather_data_time = Date.now();
        })
        .catch(error => console.log('error OW fetch', error));
    }
}

//TODO: Move calendar filling to its own function
function fillWeather(o) {
    squareWeather_details.innerHTML = `lon ${o.coord.lon} | lat ${o.coord.lat} <br> ${o.main.temp_min} [ ${o.main.temp} ] ${o.main.temp_max}`;
    squareWeather_icon.src = `./nonsharables/${o.weather[0].icon}.png`;
    squareWeather_icon.alt = `${o.weather[0].main}`;
}

//TODO: Add sunset/sunrise info, only in fullsize. Weirdly, already available from openweather data...
function fillMoon() {
    let oPhase = moonphase(new Date(), 3);

    squareMoon_image.src = `./nonsharables/moon-${oPhase.id}.svg`;
    squareMoon_image.alt = oPhase.text;
    squareMoon_image.title = oPhase.text;
    squareMoon_caption.innerHTML = oPhase.text;
    squareMoon_numphase.innerHTML = oPhase.float.toFixed(3) + " / 8";
}

function init_ercot() {
    cache_ercot_idtoken = window.localStorage.getItem('ercot_idtoken');
    cache_ercot_refreshtoken = window.localStorage.getItem('ercot_refreshtoken');
    cache_ercot_expires = window.localStorage.getItem('ercot_expires');
}

async function loop_ercot() {
    //Test OAuth fetch. Must be redone with proper handling of access tokens, etc.
    //TODO: above, and maybe make this not a nested fetch

    if(cache_ercot_refreshtoken == null || cache_ercot_idtoken == null || Date.now() > cache_ercot_expires) {
        await ercot_fetchToken();
    } else {
        await ercot_refreshToken();
    }
    await ercot_fetchPrice();
    ercot_updateSq();
    //.then(() => ercot_updatesq())

    //TODO: Wait to ~10 minutes after 15-minute blocks
    let now = Date.now();
    let hourOffset = ((now - 150_000) % 3600_000);
    let hourBase = now - hourOffset;
    let nearestQuarter = Math.floor(hourOffset/900_000);
    let target = hourBase + (nearestQuarter + 1)*900_000 + 450_000;
    setTimeout(loop_ercot, target - now);
}

async function ercot_fetchToken() {
    return fetch(`https://ercotb2c.b2clogin.com/ercotb2c.onmicrosoft.com/B2C_1_PUBAPI-ROPC-FLOW/oauth2/v2.0/token?username=${ERCOT_UNAME}&password=${ERCOT_PASS}&grant_type=password&scope=openid+fec253ea-0d06-4272-a5e6-b478baeecd70+offline_access&client_id=fec253ea-0d06-4272-a5e6-b478baeecd70&response_type=id_token`, ercot_init_requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log('ercot oauth');
        //console.log(result);
        //console.log(JSON.stringify(result));

        cache_ercot_idtoken = result.id_token;
        cache_ercot_expires = Date.now() + result.expires_in * 1000;
        cache_ercot_refreshtoken = result.refresh_token;
    })
    .catch(error => console.log('error ercot oauth', error))
    ;
}

async function ercot_refreshToken() {
    //Assertion: Refresh token has been cached
    return fetch(`https://ercotb2c.b2clogin.com/ercotb2c.onmicrosoft.com/B2C_1_PUBAPI-ROPC-FLOW/oauth2/v2.0/token?grant_type=refresh_token&scope=openid+fec253ea-0d06-4272-a5e6-b478baeecd70+offline_access&client_id=fec253ea-0d06-4272-a5e6-b478baeecd70&response_type=id_token&refresh_token=${cache_ercot_refreshtoken}`)
    .then(response => response.json())
    .then(result => {
        console.log('ercot refresh');

        cache_ercot_idtoken = result.id_token;
        cache_ercot_expires = result.expires_on;
        cache_ercot_refreshtoken = result.refresh_token;
    })
    .catch(error => console.log('error ercot refresh', error))
    ;
}

async function ercot_fetchPrice() {
    let now = new Date(Date.now() - 900_000); //Zoom 15min back. The data is weird...
    let now_y = now.getFullYear();
    let now_m = (now.getMonth() + 1).toString().padStart(2, '0');
    let now_d = now.getDate().toString().padStart(2, '0');
    let now_str = `${now_y}-${now_m}-${now_d}`;

    let err;

    ercot_headers.set("Ocp-Apim-Subscription-Key", ERCOT_SUBKEY);
    ercot_headers.set("Authorization", `Bearer ${cache_ercot_idtoken}`);

    return fetch(`https://api.ercot.com/api/public-reports/np6-905-cd/spp_node_zone_hub?settlementPoint=${ERCOT_SP}&deliveryDateFrom=${now_str}&deliveryDateTo=${now_str}`, ercot_query_requestOptions)
    .then(response => response.json())
    .then(innerResult => {
        console.log('ercot content');
        console.log(innerResult);
        //console.log(JSON.stringify(innerResult));

        //Calc index?
        //let now_h = now.getHours();
        //let now_q = Math.floor(now.getMinutes() / 15);
        //let idx = now_h*4 + now_q;
        //console.log(idx);

        //...or just use last
        let idx = innerResult.data.length - 1;
        ercot_price = innerResult.data[idx][_ERCOT_PRICE_IDX];
        console.log(ercot_price);

        //TODO: This doesn't work on the first data point of the day/midnight. Should it try to fall back to previous day? The offset "now" seems to just work...
    })
    .catch(error => console.log('error ercot price fetching', error))
    ;
}

//TODO: Decide the actual text in here -- Have to make clear it's electricity price.
//      Should this be clickable? Maybe just link to either ercot dashboard or datadog dashboard
//      Retry fetches when fail
//      Color scheme depending on price point
//      Animation when high?
function ercot_updateSq() {
    squareErcot_labelDigits.innerText = Math.round(ercot_price);

    if(ercot_price > _ERCOT_THRESHOLD_HIGH) {
        document.documentElement.style.setProperty('--ercot-color', _COLOR_ERCOT_HIGH);
    } else if(ercot_price > _ERCOT_THRESHOLD_MED) {
        document.documentElement.style.setProperty('--ercot-color', _COLOR_ERCOT_MED);
    } else {
        document.documentElement.style.setProperty('--ercot-color', _COLOR_ERCOT_LOW);
    }
}

//TODO: God damn it, maybe just put each digit in its own div so i can pretend it's monospaced and it can be aligned like:
//   19  
//    47 
//     41
function loop_fillClockdigit() {
    let dt = new Date();
    let msec = dt.getTime() % 1000;
    let delay = 1001 - msec;
    if(delay < 100) { delay += 1000; }

    squareClockdigit_hour.innerText = (""+dt.getHours()).padStart(2, '0');
    squareClockdigit_minute.innerText = (""+dt.getMinutes()).padStart(2, '0');
    squareClockdigit_second.innerText = (""+dt.getSeconds()).padStart(2, '0');

    setTimeout(loop_fillClockdigit, delay);
}

//

/** @type {HTMLCanvasElement} */
var canvas = document.getElementById("canvas"); 
/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext("2d");
canvas.width = _CELL_LARGE_W;
canvas.height = _CELL_LARGE_H;
var radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.90;

function loop_clock() {
    if(is_stop) {
        setTimeout(loop_clock, 60);
        return;
    }

    /* // I don't remember what this was for but it doesn't appear anymore
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 15;
    ctx.strokeStyle = "black";
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "#dddddd";
    ctx.fill();
    */
    
    //Outside-inside of clock base
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = _COLOR_FADED;
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = _COLOR_DARK;
    ctx.fill();

    //Markers for far corners
    //ctx.fillStyle = "green";
    //ctx.fillRect( 0.9, 0.9, 0.2, 0.2);
    //ctx.fillStyle = "magenta";
    //ctx.fillRect( -1.1, -1.1, 0.2, 0.2);

    let curDate = new Date();

    let cur_ms = curDate.getMilliseconds();
    let cur_s = curDate.getSeconds() + (cur_ms / 1000);
    let cur_sdeg = cur_s / 60 * 2 * PI;
    let cur_m = curDate.getMinutes() + (cur_s / 60);
    let cur_mdeg = cur_m / 60 * 2 * PI;
    let cur_h = curDate.getHours() + (cur_m / 60);
    let cur_hdeg = cur_h / 12.0 * 2 * PI;

    let cur_scalelimit = squareClock.classList.contains("focus") ? _CLOCK_SCALELIMIT : _CLOCK_SCALELIMIT_SMALL;

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
    let widths = ["0.3","0.35","0.18","0.08"];

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
        if(scaleHour > cur_scalelimit && depth <= _CLOCK_DEPTHLIMIT) {
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
        if(scaleMinute > cur_scalelimit && depth <= _CLOCK_DEPTHLIMIT) {
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
        if(scaleSecond > cur_scalelimit && depth <= _CLOCK_DEPTHLIMIT) {
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

    //Shadow. Maybe enable with settings, it's expensive.
    /*
    for(cur = 0; cur < drawQueue.length; ++cur) {
        let startX, startY, endX, endY, typeIdx;
        [startX, startY, endX, endY, typeIdx] = drawQueue[cur];
        let dist = Math.sqrt((endX - startX)*(endX - startX) + (endY - startY)*(endY - startY));
        //let shade = dist * 800;
        let shade = 255 * Math.pow((drawQueue.length - cur) / drawQueue.length, 8);

        ctx.beginPath();
        //ctx.strokeStyle = `rgb(${shade},${shade},${shade})`;
        ctx.strokeStyle = "#000000f0";
        //ctx.lineWidth = 0.004 + dist * 0.1;
        ctx.lineWidth = widths[typeIdx] * (0.02 + dist);
        
        ctx.moveTo(startX + 0.015, startY + 0.015);
        ctx.lineTo(endX + 0.015, endY + 0.015);
        ctx.stroke();
    }
    */

    //for(cur = drawQueue.length - 1; cur >= 0; --cur) {
    for(cur = 0; cur < drawQueue.length; ++cur) {
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

    setTimeout(loop_clock, 60);
}

//TODO: Now that the animation is desynced, change this to onclick events instead of frame loop. See where focusedSquare is changed.
var focusedSquare = "1";
var squarePositions;
const defaultLabels = ["sqcalendar", "sqclock", "sqclockdigit", "sqweather", "sqdoodle", "sqmoon", "sqercot", "sqplaceholder1", "sqplaceholder2"]; //Add new elements here
var windowHandles;
var initFlag;
function SquareManager() {
    if(is_stop) {
        setTimeout(SquareManager, 60);
        return;
    }

    let now = Date.now();
    
    //Init
    if(squarePositions === undefined) {
        windowHandles = [];
        squarePositions = [];
        for(i in defaultLabels) {
            let sqRef = document.getElementById(defaultLabels[i]);
            windowHandles[i] = sqRef
            let pos = {};
            pos.x = depix(sqRef.style.left);
            pos.y = depix(sqRef.style.top);
            pos.w = depix(sqRef.style.width);
            squarePositions[i] = pos;
            //console.log(JSON.stringify(pos));

            sqRef.onclick = ((id, ref) => () => clickBox(id, ref) )(i, sqRef);
        }
    }

    if(!initFlag) {
        initFlag = true;

        animStart = now;
        animEnd = animStart + 6000;

        let nextX, nextY, nextW;

        let columnIdx = 0;
        for(i in windowHandles) {
            let sq = squarePositions[i];
            let sqRef = windowHandles[i];
            //sq.x = depix(sqRef.style.left);
            //sq.y = depix(sqRef.style.top);
            //sq.w = depix(sqRef.style.width);

            if(i === focusedSquare) {
                nextX = 0;
                nextY = 0;
                nextW = _CELL_LARGE_W;
                windowHandles[i].style.zIndex = "2";
                windowHandles[i].classList.add("focus");
            } else {
                let idRow = columnIdx % _CELL_COL_LIMIT;
                let idCol = Math.floor(columnIdx / _CELL_COL_LIMIT);

                nextX = _CELL_LARGE_W + idCol*_CELL_SMALL_W + 10; // TODO: const this margin
                nextY = idRow * (_CELL_SMALL_H);
                nextW = _CELL_SMALL_W;
                windowHandles[i].style.zIndex = "1";
                windowHandles[i].classList.remove("focus");
                columnIdx += 1;
            }

            sqRef.style.left = nextX + "px";
            sqRef.style.top =  nextY + "px";
            sqRef.style.width = nextW + "px";
            sqRef.style.height = nextW + "px";

            sq.x = nextX;
            sq.y = nextY;
            sq.w = nextW;
        }
    }

    setTimeout(SquareManager, 60);
}

function clickBox(id, ref) {
    focusedSquare = id;
    initFlag = false;
}

var wakeLock;
async function init_wakeLocker() {
    wakeLock = null;
    if ("wakeLock" in navigator) {
        try {
            wakeLock = await navigator.wakeLock.request("screen");
        } catch (err) {
            console.log(`${err.name}, ${err.message}`);
        }
    }
}

/* draggable handler. taken from https://codepen.io/jkasun/pen/QrLjXP -- thanks jkasun */
function init_dragElement() {
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
        elmnt.style.top = clamp(0, _CELL_LARGE_H - elmnt.clientHeight, elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = clamp(0, _CELL_LARGE_W - elmnt.clientWidth, elmnt.offsetLeft - pos1) + "px";
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
