// Look, if you use a dirt cheap projector and aim it at a random window, it's going to be... very poorly fitting.
// Assuming 1920x1080 window, parameters to align to the window and not have the wall around the window get too bright.
// todo:? tilt parameters/rendering because the projector is waaaay at an angle

const _top = 195;
const _left = 140;
const _canvas_top = `${_top.toString()}px`;
const _canvas_left = `${_left.toString()}px`;

const _h = 640;
const _w = 1660;
const _canvas_h = `${_h.toString()}px`;
const _canvas_w = `${_w.toString()}px`;

const tau = Math.PI * 2;

//Helpers
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

function r() {
    return Math.random();
}

var sin = Math.sin;
var cos = Math.cos;
var abs = Math.abs;

function rand2dir() {
    let theta = Math.random() * tau;
    return {x:Math.cos(theta), y:Math.sin(theta)};
}

function rand2rdir(r) {
    let theta = Math.random() * tau;
    return {x:r*Math.cos(theta), y:r*Math.sin(theta)};
}