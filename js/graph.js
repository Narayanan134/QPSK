let but1 = document.getElementById('button1');
let canvas = document.getElementById('canvas1');
let ctx = canvas.getContext('2d');

let sampling_frequency_element = document.getElementById("Fs");
let wave_frequency_element = document.getElementById("Fm");
let wave_amplitude_element = document.getElementById("Am");
let delta_element = document.getElementById("Delta");
let vertical_scale_element = document.getElementById("vertical_scale_factor");
let horizontal_scale_element = document.getElementById("horizontal_scale_factor");
let check_unsampled_wave = document.getElementById("unsampled_wave");
let check_sampled_points = document.getElementById("sampled_points");
let check_staircase_wave = document.getElementById("staircase_wave");

let canvas_width = window.screen.width-50;
let canvas_height = 600;
let orgx = 200;
let orgy = 315;


//binary_sequence
function binSeq() {
    let bit1=document.getElementById("bit1").value;
    let bit2=document.getElementById("bit2").value;
    let bit3=document.getElementById("bit3").value;
    let bit4=document.getElementById("bit4").value;
    let bit5=document.getElementById("bit5").value;
    let bit6=document.getElementById("bit6").value;
    let bit7=document.getElementById("bit7").value;
    let bit8=document.getElementById("bit8").value;
    const bit_seq = bit1+""+ bit2 + "" + bit3 + "" + bit4 + "" + bit5+""+bit6+""+bit7+""+bit8;

    const usingSplit = bit_seq.split('')
    const usingObjectAssign = Object.assign([], bit_seq);
    return usingObjectAssign;
  }
// Set resolution for canvas
canvas.width = canvas_width;
canvas.height = canvas_height;

let wave_amplitude = document.getElementById("amplitude");
let wave_frequency = document.getElementById("frequency");
let sampling_frequency = document.getElementById("sampling_frequency");

let vertical_scaling_factor = vertical_scale_element.value;
let horizontal_scaling_factor = horizontal_scale_element.value;

let delta = 2 * Math.PI * wave_amplitude.value * wave_frequency.value / sampling_frequency.value;

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

function xrange(start, stop, step) {
    var res = [];
    var i = start;
    while (i <= stop) {
        res.push(i);
        i += step;
    }
    return res;
}

function plotStairCase(arr) {
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.moveTo(orgx, orgy);

    // Scale the values in the array for plotting
    arr.forEach((_, idx) => {
        arr[idx] *= vertical_scaling_factor;
    });

    ctx.lineWidth = 1;

    var px = orgx;
    var py = arr[0];

    for (var i = 1; i < arr.length; i++) {
        var xoff = i * horizontal_scaling_factor;
        ctx.lineTo(xoff + orgx, orgy - py);
        ctx.lineTo(xoff + orgx, orgy - arr[i]);
        px = xoff;
        py = arr[i];
    }

    ctx.stroke();
    ctx.closePath();
}

let printed = false;
function plotSine(ctx, xOffset, yOffset) {
    var width = 1000;
    var amplitude = wave_amplitude.value;
    var frequency = wave_frequency.value;
    var Fs = sampling_frequency.value;
    var Ts = 1 / sampling_frequency;
    var StopTime = 1;
    var dt = 1 / Fs;
    var t = xrange(0, StopTime + dt, dt);

    // First bit - 
    //var input_arr = [1, 0, 0, 1, 1, 1, 0, 0];
    var input_arr=binSeq();

    var cos_wave = [];
    amplitude = Math.sqrt(2 * Fs) * 0.5;
    t.forEach((val) => {
        cos_wave.push(amplitude * Math.cos(2 * Math.PI * frequency * val));
    });

    var sin_wave = [];
    t.forEach((val) => {
        sin_wave.push(amplitude * Math.sin(2 * Math.PI * frequency * val));
    });

    // sqrt(2 / Ts) * cos(2 pi fc t)
    var x = [];
    let odd_sig = []
    let even_sig = []
    for (var i = 0; i < input_arr.length - 1; i+=2) {
        // All even positions must be multiplied by cos
        let bit1 = input_arr[i];
        let bit2 = input_arr[i + 1];

        cos_wave.forEach((val) => {
            odd_sig.push((bit1 == 1) ? val : -val);
        })
        sin_wave.forEach((val) => {
            even_sig.push((bit2 == 1) ? val : -val);
        })
    }

    //console.assert(odd_sig.length == even_sig.length);

    for (var i = 0; i < odd_sig.length; i++) {
        x.push(odd_sig[i] + even_sig[i]);
    }

    if (!printed) {
        console.log(x);
        printed = true;
    }

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";

    var idx = 0;
    if (check_unsampled_wave.checked) {
        while (idx < width) {
            ctx.lineTo(xOffset + idx * horizontal_scaling_factor, yOffset - vertical_scaling_factor * x[idx]);
            idx++;
        }
    }
    ctx.stroke();
    ctx.save();


    // delta = ((2 * Math.PI * amplitude * frequency) / Fs).toFixed(4);
    // if (check_sampled_points.checked) {
    //     var idx = 0;
    //     while (idx < width) {
    //         drawPoint(ctx, xOffset + idx * horizontal_scaling_factor, yOffset - vertical_scaling_factor * x[idx]);

    //         ctx.moveTo(xOffset + idx * horizontal_scaling_factor, yOffset - vertical_scaling_factor * x[idx])
    //         ctx.lineTo(xOffset + idx * horizontal_scaling_factor, orgy)
    //         ctx.stroke();
    //         idx++;
    //     }
    // }

    // var e = new Array(x.length);
    // var eq = new Array(x.length);
    // var xq = new Array(x.length);

    // for (var i = 0; i < x.length; i++) {
    //     if (i == 0) {
    //         e[i] = x[i];
    //         eq[i] = delta * Math.sign(e[i]);
    //         xq[i] = parseFloat(eq[i].toFixed(2));
    //     } else {
    //         e[i] = x[i] - xq[i - 1]
    //         eq[i] = delta * Math.sign(e[i]);
    //         xq[i] = (eq[i] + xq[i - 1]);
    //     }
    // }

    // // Draw the stair case wave
    // if (check_staircase_wave.checked)
    //     plotStairCase(xq);
}

function drawGraph() {
    drawAxes();
    plotSine(ctx, orgx, orgy);
}

function draw() {
    // Clear the screen
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas_width, canvas_height);

    wave_amplitude_element.innerText = wave_amplitude.value + ' V';
    wave_frequency_element.innerText = wave_frequency.value + ' Hz';
    sampling_frequency_element.innerText = sampling_frequency.value + ' Hz';
    //delta_element.innerText = delta;
    vertical_scaling_factor = vertical_scale_element.value;
    horizontal_scaling_factor = horizontal_scale_element.value;

    drawGraph();

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
export {binSeq, vertical_scaling_factor,horizontal_scaling_factor};
for (var i = 1; i <= 8; i++) {
    document.getElementById("bit" + i.toString()).addEventListener('click', binSeq);
}
