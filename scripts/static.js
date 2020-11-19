//Configuration
var opacityRange = 10; //Max Potential Opacity (Higher -> Noise is more appearant)
var enableHumBars = false; //Show Hum Bars Moving From Bottom to Top
var frame_count = 20;

//Canvas Init
var static_canvas;
var static_ctx;
var bars;
var bars_ctx;
var data = [];
var frame = 0;

//Hum Bar Init
var randomTick = false;
var dY;
var speed = Math.floor(Math.random() * 12 + 10);
var thickness = Math.floor(Math.random() * 100);
var split = Math.random() >= 0.6;
var queue = [];

window.onload = e => {
    static_canvas = document.getElementById('static');
    static_canvas.width = window.innerWidth;
    static_canvas.height = window.innerHeight;
    static_ctx = static_canvas.getContext('2d');

    bars = document.getElementById('bars');
    bars.width = window.innerWidth;
    bars.height = window.innerHeight;
    bars_ctx = bars.getContext('2d');
    bars_ctx.fillStyle = "rgba(0,0,0,0.05)";


    dY = window.innerHeight;
    loadData()
}   

const debounce = (func, wait) => {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const resizePostBounce = debounce(() => {
    static_canvas.width = window.innerWidth
    static_canvas.height = window.innerHeight
    bars.width = window.innerWidth;
    bars.height = window.innerHeight;
    clearTimeout(loopTimeout)
    loadData()
}, 100)

window.addEventListener('resize', resizePostBounce);

/**
 * Generates 10 random black and white Image Buffers (Noise)
 */
function loadData() {
    window.requestAnimationFrame(showStatic);
    window.requestAnimationFrame(showBars);
    data = []
    for (var x = 0; x < frame_count; x++) {
        data[x] = static_ctx.getImageData(0, 0, static_canvas.width, static_canvas.height);
        for (var i = 0; i < data[x].data.length; i += 4) {
            data[x].data[i] = data[x].data[i + 1] = data[x].data[i + 2] = Math.random() >= 0.5 ? 20 : 255;
            data[x].data[i + 3] = Math.floor(Math.random() * opacityRange) + 5;
        }
    }
}

/**
 * Displays noise frames and iterates through hum bars
 */
function showStatic() {
    //Iterates Noise Frames
    frame++
    if(frame == frame_count)
        frame = 0

    //Displays Noise Frame

    createImageBitmap(data[frame]).then((imgBitmap) => {
        static_ctx.clearRect(0,0,static_canvas.width, static_canvas.height)
        static_ctx.drawImage(imgBitmap, 0, 0);
    });

    // static_ctx.drawImage(data[frame], 0, 0);

    //Loops Animation
    // loopTimeout = window.setTimeout(() => {
        window.requestAnimationFrame(showStatic);
    // }, 10);
}

function showBars() {
    //Generates Hum Bars
    if (randomTick) {
        if (dY > -thickness - 60) {
            //Draws Bars
            bars_ctx.clearRect(0, 0, bars.width, bars.height);
            bars_ctx.fillRect(0, dY, bars.width, thickness);
            if (split) //Splits Bar
                bars_ctx.fillRect(0, dY + thickness + 20, bars.width, 10);
            dY -= speed;
        } else { //Resets bar
            dY = window.innerHeight;
            speed = Math.floor(Math.random() * 6 + 10)
            thickness = Math.floor(Math.random() * 100);
            split = Math.random() >= 0.6;
            randomTick = false;
        }
    } else if (enableHumBars) {
        randomTick = Math.floor(Math.random() * 200) == 5; //Tries to generate random tick
    }

    //Loops Animation
    // loopTimeout = window.setTimeout(() => {
        window.requestAnimationFrame(showBars);
    // }, 10);
}
