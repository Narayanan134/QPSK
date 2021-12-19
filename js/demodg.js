import {binSeq,vertical_scaling_factor , horizontal_scaling_factor} from './graph.js'


let canvas = document.getElementById('canvas2');
let ctx = canvas.getContext('2d');


let canvas_width = window.screen.width-50;
let canvas_height = 600;
let orgx = 200;
let orgy = 315;

canvas.width = canvas_width;
canvas.height = canvas_height;

function drawPoint(ctx, x, y) {
    var radius = 3.0;
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.lineWidth = 1;
    ctx.arc(x, y, radius*1.3, 0, 2 * Math.PI, false);
    ctx.fill();

    ctx.closePath();
}

function drawAxes() {
    ctx.beginPath();
    // Vertical line
    ctx.moveTo(orgx, 100);
    ctx.lineTo(orgx, 530);
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Horizontal line
    ctx.moveTo(100, 510);
    ctx.lineTo(window.screen.width-100, 510);
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Base line
    ctx.moveTo(orgx, orgy);
    ctx.lineTo(window.screen.width-100, orgy);
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Amplitude", 100, 120, 90);
    ctx.fillText("Time", window.screen.width-200, 530, 70);
    ctx.closePath();

}


// function xrange(start, stop, step) {
//     var res = [];
//     var i = start;
//     while (i <= stop) {
//         res.push(i);
//         i += step;
//     }
//     return res;
// }


function plotStairCase(arr) {
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.moveTo(orgx, orgy);

    // Scale the values in the array for plotting _, idx
    arr.forEach((_, idx) => {
        arr[idx] *= vertical_scaling_factor;
    });

    ctx.lineWidth = 1;

    var px = orgx;
    var py = arr[0];

    for (var i = 0; i < arr.length; i++) {
        var xoff = i * horizontal_scaling_factor;
        ctx.lineTo(xoff + orgx, orgy - py);
        ctx.lineTo(xoff + orgx, orgy - arr[i]);
        px = xoff;
        py = arr[i];
    }

    ctx.stroke();
    ctx.closePath();
}


function drawGraph() {
    drawAxes();
    // plotSine(ctx, orgx, orgy);
    var d = binSeq()
    plotStairCase(d)
}

function draw() {
    // Clear the screen
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas_width, canvas_height);

    // wave_amplitude_element.innerText = wave_amplitude.value + ' V';
    // wave_frequency_element.innerText = wave_frequency.value + ' Hz';
    // sampling_frequency_element.innerText = sampling_frequency.value + ' Hz';
    // // delta_element.innerText = delta;
    // vertical_scaling_factor = vertical_scale_element.value;
    // horizontal_scaling_factor = horizontal_scale_element.value;

    drawGraph();

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);