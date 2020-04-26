//Configuration
var opacityRange = 5; //Max Potential Opacity (Higher -> Noise is more appearant)
var enableHumBars = true; //Show Hum Bars Moving From Bottom to Top

//Canvas Init
var canvas;
var canvas2;
var ctx;
var ctx2;
var data = [];
var frame = 0;

//Hum Bar Init
var randomTick = true;
var dY;
var speed = Math.floor(Math.random() * 12 + 10);
var thickness = Math.floor(Math.random() * 100);
var split = Math.random() >= 0.6;
var queue = [];

$(document).ready(function () {
    canvas = document.getElementById('static');
    canvas.width = screen.width;
    canvas.height = screen.height;
    ctx = canvas.getContext('2d');

    canvas2 = document.getElementById('bars');
    canvas2.width = screen.width;
    canvas2.height = screen.height;
    ctx2 = canvas2.getContext('2d');

    dY = window.innerHeight;
    loadData()
});

/**
 * Generates 10 random black and white Image Buffers (Noise)
 */
function loadData() {
    window.requestAnimationFrame(showStatic);
    window.requestAnimationFrame(showBars);
    data = []
    for (var x = 0; x < 10; x++) {
        data[x] = ctx.getImageData(0, 0, screen.width, screen.height);
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
    if(frame == 10)
        frame = 0

    //Displays Noise Frame
    ctx.putImageData(data[frame], 0, 0);

    //Loops Animation
    loopTimeout = window.setTimeout(() => {
        window.requestAnimationFrame(showStatic);
    }, 20);
}

function showBars() {
    //Generates Hum Bars
    if (randomTick) {
        if (dY > -thickness - 60) {
            //Draws Bars
            ctx2.clearRect(0, 0, canvas.width, canvas.height);
            ctx2.fillStyle = "rgba(0,0,0,0.05)";
            ctx2.fillRect(0, dY, canvas.width, thickness);
            if (split) //Splits Bar
                ctx2.fillRect(0, dY + thickness + 20, canvas.width, 10);
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
    loopTimeout = window.setTimeout(() => {
        window.requestAnimationFrame(showBars);
    }, 30);
}
