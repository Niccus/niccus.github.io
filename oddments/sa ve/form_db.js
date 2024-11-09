//after https://x.com/theastralj/status/1841112036337455302

var distance = document.getElementById("distance");
var ve = document.getElementById("ve");

function input() {
    let d = distance.valueAsNumber;
    ve.style.setProperty("left", 194 + d + "px");
}
