//after https://x.com/theastralj/status/1841112036337455302

var distance = document.getElementById("distance");
var ve = document.getElementById("ve");

function input() {
    let d = distance.valueAsNumber;
    ve.style.setProperty("left", 69 + d + "px");
}

function submit() {
    window.open(`https://docs.google.com/forms/d/e/1FAIpQLSeOpelk8kMpPa_QOecA-_HTM7nABNOsVa3MsoDGJ6nuLu0qRA/viewform?usp=pp_url&entry.278270847=${distance.valueAsNumber}`, "_blank")
}