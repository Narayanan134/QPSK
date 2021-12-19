import { BDS,PNE,DEMUX, Rsignal, Output,Integrator,Dedevice,Mux } from './Block.js';
import { Adder } from './Adder.js';
import { Mul } from './Multiplier.js'
import { Line } from './Line.js';

let myblocks = new Map();

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    myblocks.forEach((block) => {
        block.update_pos();
    });
}

export function setup() {
    createCanvas(windowWidth, windowHeight);

    myblocks.set('BDS', new BDS(160, 120, 200, 100));
    myblocks.set('PNE', new PNE(480, 120, 200, 100));
    myblocks.set('DEMUX', new DEMUX(970, 120, 220, 100));
    myblocks.set('output', new Output(1650, 120, 220, 100));

    myblocks.set('Integrator1', new Integrator(700, 450, 200, 100));
    myblocks.set('Integrator2', new Integrator(700, 750, 200, 100));
    myblocks.set('Dedevice1', new Dedevice(980, 450, 200, 100));
    myblocks.set('Dedevice2', new Dedevice(980, 750, 200, 100));
    myblocks.set('Mux', new Mux(1300, 600, 220, 100));
    myblocks.set('Rsignal', new Rsignal(160, 600, 200, 100));
    myblocks.set('output2', new Output(1650, 600, 220, 100));

    /* FIXME: Find a new way to make the elements responsive to resize */
    myblocks.set('adder1', new Adder(15, (val) => {
        const demux = myblocks.get('DEMUX');
        // const encode = myblocks.get('encoder');
        val.cx = demux.cx+(2.5*demux.cw) ;
        val.cy = demux.cy + demux.ch / 2;
    }));

    myblocks.set('mul1', new Adder(20, (val) => {
        const demux = myblocks.get('DEMUX');
        // const encode = myblocks.get('encoder');
        val.cx = (1.5* demux.cw) + demux.cx ;
        val.cy = demux.cy - demux.ch;
    }));

    myblocks.set('mul2', new Adder(20, (val) => {
        const demux = myblocks.get('DEMUX');
        // const encode = myblocks.get('encoder');
        val.cx = (1.5* demux.cw) + demux.cx ;
        val.cy = demux.cy + (2*demux.ch);
    }));

    myblocks.set('mul3', new Adder(20, (val) => {
        const rsig = myblocks.get('Rsignal');
        // const encode = myblocks.get('encoder');
        val.cx = (1.5* rsig.cw) + rsig.cx ;
        val.cy = rsig.cy - rsig.ch;
    }));

    myblocks.set('mul4', new Adder(20, (val) => {
        const rsig = myblocks.get('Rsignal');
        // const encode = myblocks.get('encoder');
        val.cx = (1.5* rsig.cw) + rsig.cx ;
        val.cy = rsig.cy + (2*rsig.ch);
    }));


    myblocks.set('line0', new Line((val) => {
        const BDS = myblocks.get('BDS');
        const PNE = myblocks.get('PNE');

        val.x1 = BDS.cx + BDS.cw;
        val.y1 = BDS.cy + BDS.ch / 2;
        val.x2 = PNE.cx;
        val.y2 = PNE.cy + PNE.ch / 2;
    }, 0));

    myblocks.set('line1', new Line((val) => {
        const PNE = myblocks.get('PNE');
        const DEMUX = myblocks.get('DEMUX');

        val.x1 = PNE.cx + PNE.cw;
        val.y1 = PNE.cy + PNE.ch/2;
        val.x2 = DEMUX.cx ;
        val.y2 = DEMUX.cy + DEMUX.ch / 2;
    }, 0));

    // Small line from demux
    myblocks.set('line2', new Line((val) => {
        const DEMUX = myblocks.get('DEMUX');
        const mul1= myblocks.get('mul1');

        val.x1 = DEMUX.cx + DEMUX.cw;
        val.y1 = DEMUX.cy + DEMUX.ch/2;
        val.x2 = val.x1 + 0.1 * (mul1.cx - DEMUX.cx);
        val.y2 = DEMUX.cy + DEMUX.ch/2;
    }));

    // Upwards line from demux
    myblocks.set('line22', new Line((val) => {
        const bt_line = myblocks.get('line2');
        const mul1= myblocks.get('mul1');

        val.x1 = bt_line.x2;
        val.y1 = bt_line.y2;
        val.x2 = val.x1;
        val.y2 = mul1.cy;
    }));

    // Downwards line from demux
    myblocks.set('line31', new Line((val) => {
        const bt_line = myblocks.get('line2');
        const mul2= myblocks.get('mul2');

        val.x1 = bt_line.x2;
        val.y1 = bt_line.y2;
        val.x2 = val.x1;
        val.y2 = mul2.cy;
    }));

    // Upwards horizontal line
    myblocks.set('line32', new Line((val) => {
        const bt_line = myblocks.get('line22');
        const mul1= myblocks.get('mul1');

        val.x1 = bt_line.x2;
        val.y1 = bt_line.y2;
        val.x2 = mul1.cx - mul1.cr;
        val.y2 = mul1.cy;
    }, 0));

    // Downwards horizontal line
    myblocks.set('line311', new Line((val) => {
        const bt_line = myblocks.get('line31');
        const mul2= myblocks.get('mul2');

        val.x1 = bt_line.x2;
        val.y1 = bt_line.y2;
        val.x2 = mul2.cx - mul2.cr;
        val.y2 = mul2.cy;
    }, 0));

    // Upwards horizontal line from mult1 to adder
    myblocks.set('line42', new Line((val) => {
        const mul1 = myblocks.get('mul1');
        const addr1 = myblocks.get('adder1');

        val.x1 = mul1.cx + mul1.cr;
        val.y1 = mul1.cy;
        val.x2 = addr1.cx;
        val.y2 = mul1.cy;
    }));

    // Downwards horizontal line from mult2 to adder
    myblocks.set('line3111', new Line((val) => {
        const mul2 = myblocks.get('mul2');
        const addr1 = myblocks.get('adder1');

        val.x1 = mul2.cx + mul2.cr;
        val.y1 = mul2.cy;
        val.x2 = addr1.cx;
        val.y2 = mul2.cy;
    }));

    // downwards vertical line from mult1 to adder
    myblocks.set('line52', new Line((val) => {
        const line = myblocks.get('line42');
        const mul1 = myblocks.get('mul1');
        const addr1 = myblocks.get('adder1');

        val.x1 = line.x2;
        val.y1 = line.y2;
        val.x2 = addr1.cx;
        val.y2 = addr1.cy - addr1.cr;
    }, 270));

    // downwards vertical line from mult2 to adder
    myblocks.set('line31111', new Line((val) => {
        const line = myblocks.get('line3111');
        const mul2 = myblocks.get('mul2');
        const addr1 = myblocks.get('adder1');

        val.x1 = line.x2;
        val.y1 = line.y2;
        val.x2 = addr1.cx;
        val.y2 = addr1.cy + addr1.cr;
    },90));

    // myblocks.set('line3', new Line((val) => {
    //     const DEMUX = myblocks.get('DEMUX');
    //     const mul2= myblocks.get('mul2');

    //     val.x1 = DEMUX.cx + DEMUX.cw;
    //     val.y1 = DEMUX.cy + DEMUX.ch/2;
    //     val.x2 = mul2.cx ;
    //     val.y2 = mul2.cy ;
    // }, 270));

    // myblocks.set('line5', new Line((val) => {
    //     const mul2 = myblocks.get('mul2');
    //     const adder1= myblocks.get('adder1');

    //     val.x1 = mul2.cx ;
    //     val.y1 = mul2.cy ;
    //     val.x2 = adder1.cx;
    //     val.y2 = adder1.cy ;
    // },90));

    myblocks.set('line6', new Line((val) => {
        const adder1 = myblocks.get('adder1');
        const output = myblocks.get('output');

        val.x1 = adder1.cx + adder1.cr;
        val.y1 = adder1.cy;
        val.x2 = output.cx;
        val.y2 = output.cy + output.ch / 2;
    },0));



    // Small line from rsignal
    myblocks.set('line7', new Line((val) => {
        const rsig = myblocks.get('Rsignal');
        const mul3= myblocks.get('mul3');

        val.x1 = rsig.cx + rsig.cw;
        val.y1 = rsig.cy + rsig.ch/2;
        val.x2 = val.x1 + 0.1 * (mul3.cx - rsig.cx);
        val.y2 = rsig.cy + rsig.ch/2;
    }));

    // Upwards line from rsignal
    myblocks.set('line71', new Line((val) => {
        const bt_line = myblocks.get('line7');
        const mul3= myblocks.get('mul3');

        val.x1 = bt_line.x2;
        val.y1 = bt_line.y2;
        val.x2 = val.x1;
        val.y2 = mul3.cy;
    }));

    // Downwards line from rsignal
    myblocks.set('line72', new Line((val) => {
        const bt_line = myblocks.get('line7');
        const mul4= myblocks.get('mul4');

        val.x1 = bt_line.x2;
        val.y1 = bt_line.y2;
        val.x2 = val.x1;
        val.y2 = mul4.cy;
    }));

    // Upwards horizontal line
    myblocks.set('line73', new Line((val) => {
        const bt_line = myblocks.get('line71');
        const mul3= myblocks.get('mul3');

        val.x1 = bt_line.x2;
        val.y1 = bt_line.y2;
        val.x2 = mul3.cx - mul3.cr;
        val.y2 = mul3.cy;
    }, 0));

    // Downwards horizontal line
    myblocks.set('line74', new Line((val) => {
        const bt_line = myblocks.get('line72');
        const mul4= myblocks.get('mul4');

        val.x1 = bt_line.x2;
        val.y1 = bt_line.y2;
        val.x2 = mul4.cx - mul4.cr;
        val.y2 = mul4.cy;
    }, 0));

    myblocks.set('line75', new Line((val) => {
        const mul3 = myblocks.get('mul3');
        const intg = myblocks.get('Integrator1');

        val.x1 = mul3.cx + mul3.cr;
        val.y1 = mul3.cy;
        val.x2 = intg.cx;
        val.y2 = intg.cy + intg.ch / 2;
    },0));

    myblocks.set('line76', new Line((val) => {
        const mul4 = myblocks.get('mul4');
        const intg = myblocks.get('Integrator2');

        val.x1 = mul4.cx + mul4.cr;
        val.y1 = mul4.cy;
        val.x2 = intg.cx;
        val.y2 = intg.cy + intg.ch / 2;
    },0));

    myblocks.set('line77', new Line((val) => {
        const intg = myblocks.get('Integrator1');
        const ddev = myblocks.get('Dedevice1');

        val.x1 = intg.cx + intg.cw;
        val.y1 = intg.cy + intg.ch / 2;
        val.x2 = ddev.cx;
        val.y2 = ddev.cy + ddev.ch / 2;
    }, 0));

    myblocks.set('line78', new Line((val) => {
        const intg = myblocks.get('Integrator2');
        const ddev = myblocks.get('Dedevice2');

        val.x1 = intg.cx + intg.cw;
        val.y1 = intg.cy + intg.ch / 2;
        val.x2 = ddev.cx;
        val.y2 = ddev.cy + ddev.ch / 2;
    }, 0));
//upward horizontal line from ddevice1 to mux
    myblocks.set('line9',new Line((val)=>{
        const ddevice=myblocks.get("Dedevice1");
        const mux=myblocks.get("Mux");

        val.x1=ddevice.cx+ddevice.cw;
        val.y1=ddevice.cy+ddevice.ch/2;
        val.y2=ddevice.cy+ddevice.ch/2;
        val.x2=mux.cx+mux.cw/2;
    }));
//upward vertical line from ddevice1 to mux
    myblocks.set('line91',new Line((val)=>{
        const line=myblocks.get("line9");
        const mux=myblocks.get("Mux");

        val.x1=line.x2;
        val.y1=line.y2;
        val.y2=mux.cy;
        val.x2=line.x2;
    },270));

//downward horizontal line from ddevice2 to mux
myblocks.set('line10',new Line((val)=>{
    const ddevice=myblocks.get("Dedevice2");
    const mux=myblocks.get("Mux");

    val.x1=ddevice.cx+ddevice.cw;
    val.y1=ddevice.cy+ddevice.ch/2;
    val.y2=ddevice.cy+ddevice.ch/2;
    val.x2=mux.cx+mux.cw/2;
}));
//downward vertical line from ddevice2 to mux
myblocks.set('line11',new Line((val)=>{
    const line=myblocks.get("line10");
    const mux=myblocks.get("Mux");

    val.x1=line.x2;
    val.y1=line.y2;
    val.y2=mux.cy+mux.ch;
    val.x2=line.x2;
}, 90));

    myblocks.set('line83', new Line((val) => {
        const mux = myblocks.get('Mux');
        const op2 = myblocks.get('output2');

        val.x1 = mux.cx + mux.cw;
        val.y1 = mux.cy + mux.ch / 2;
        val.x2 = op2.cx;
        val.y2 = op2.cy + op2.ch / 2;
    }, 0));





}

// Get DOM Elements
const modal = document.getElementById('my-modal');
const modalBtn = document.querySelector('#modal-btn');
const closeBtn = document.querySelector('.close');

// Events
// modalBtn.addEventListener('click', openModal);
// closeBtn.addEventListener('click', closeModal);
// window.addEventListener('click', outsideClick);

// Open
function openModal() {
  modal.style.display = 'block';
}

// Close
function closeModal() {
  modal.style.display = 'none';
}

// Close If Outside Click
function outsideClick(e) {
    console.log(e);
  if (e.target == modal) {
    modal.style.display = 'none';
  }
}


export function draw() {
    clear();

    myblocks.forEach((val, key) => {
        val.draw();
    });
}

function doubleClicked() {
}

function mousePressed(e) {
    let clicked = false;
    console.log(e);
    console.log(e.target);
    myblocks.forEach((val) => {
        if (val.clicked(mouseX, mouseY)) {
            clicked = true;
            // modal.style.display = 'block';
        }
    });
    // if (!clicked)
    //     modal.style.display = 'none';
}

window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
window.doubleClicked = doubleClicked;
window.windowResized = windowResized;
