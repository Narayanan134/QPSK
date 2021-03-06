class Block {
    constructor(x, y, w, h, name = null, onclick = null) {
        this.name = name;
        this.xo = x;
        this.yo = y;
        this.wo = w;
        this.ho = h;

        this.cx = x;
        this.cy = y;
        this.cw = w;
        this.ch = h;

        this.onclick = onclick
        this.update_pos();
    }

    populate_modal() {}

    update_pos() {
        const width = windowWidth;
        const height = windowHeight;

        this.cx = this.xo * (width / 1920);
        this.cy = this.yo * (height / 1080);
        this.cw = this.wo * (width / 1920);
        this.ch = this.ho * (height / 1080);
    }

    clicked(x, y) {
        return x >= this.cx && x <= this.cx + this.cw &&
               y >= this.cy && y <= this.cy + this.ch;
    }

    draw() {
        const cx = this.cx;
        const cy = this.cy;
        const cw = this.cw;
        const ch = this.ch;

        const font_size = 25 * Math.min(windowWidth / 1920, windowHeight / 1080);

        fill(10);
        rect(cx, cy, cw, ch, 20);
        if (this.name) {
            textSize(font_size);
            textStyle('bold');
            textAlign(CENTER, CENTER);
            fill(255);
            text(this.name, cx + cw / 2, cy + ch / 2);
        }
    }
}

function createSlider(min, max, value) {
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = String(min);
    slider.max = String(max);
    slider.value = String(value);
    slider.classList.add("slider");
    slider.style = "width: 200px";
    return slider;
}

export class BDS extends Block {
    constructor (x, y, w, h) {
        super(x, y, w, h, 'BINARY\nDATA\nSEQUENCE');
        this.amp_slider = createSlider(0, 5000, 500);
        this.amp_slider.onchange = (evt) => {
            this.amplitude = int(evt.target.value);
        };
        this.freq_slider = createSlider(0, 5000, 500);
        this.freq_slider.onchange = (evt) => {
            this.frequency = int(evt.target.value);
        };
        this.amplitude = this.amp_slider.value;
        this.frequency = this.freq_slider.value;
    }

    draw() {
        super.draw();
    }

    populate_modal(modal) {
        const label1 = document.createElement("h5");
        label1.innerText = "Amplitude: ";
        label1.style = "display: block;"
        modal.appendChild(label1);
        modal.appendChild(this.amp_slider);

        const label = document.createElement("h5");
        label.innerText = "Frequency: ";
        label.style = "display: block;"
        modal.appendChild(label);
        modal.appendChild(this.freq_slider);
    }
}

export class PNE extends Block {
    constructor (x, y, w, h) {
        super(x, y, w, h, 'POLAR\nNRZ\nENCODER');
        this.sampling_frequency = 0;
        this.sampling_slider = createSlider(0, 5000, 500);
        this.sampling_slider.onchange = this.sampling_slider_change;
    }

    sampling_slider_change() {
        let amp = this.value;
        console.log('SINE AMP: ', amp);
    }
    populate_modal(modal) {
        const label1 = document.createElement("h5");
        label1.innerText = "Sampling Frequency: ";
        label1.style = "display: block;"
        modal.appendChild(label1);
        modal.appendChild(this.sampling_slider);
    }
}
export class DEMUX extends Block {
    constructor (x, y, w, h) {
        super(x, y, w, h, 'DEMUX');
    }

    clicked(x, y) { return false; }
}
export class PredictionFilter extends Block {
    constructor (x, y, w, h) {
        super(x, y, w, h, 'PREDICTION\nFILTER');
    }

    clicked(x, y) { return false; }
}
export class Encoder extends Block {
    constructor (x, y, w, h) {
        super(x, y, w, h, 'ENCODER');
    }

    clicked(x, y) { return false; }
}

export class Output extends Block {
    constructor (x, y, w, h) {
        super(x, y, w, h, 'OUTPUT');
    }

    clicked(x, y) { return false; }
}

export class Integrator extends Block {
    constructor (x, y, w, h) {
        super(x, y, w, h, 'INTEGRATOR');
    }

    clicked(x, y) { return false; }
}

export class Dedevice extends Block {
    constructor (x, y, w, h) {
        super(x, y, w, h, 'DECISION\nDEVICE');
    }

    clicked(x, y) { return false; }
}

export class Mux extends Block {
    constructor (x, y, w, h) {
        super(x, y, w, h, 'MUX');
    }

    clicked(x, y) { return false; }
}

export class Rsignal extends Block {
    constructor (x, y, w, h) {
        super(x, y, w, h, 'Received\nSignal');
    }

    clicked(x, y) { return false; }
}