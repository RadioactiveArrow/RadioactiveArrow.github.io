//Configuration
var opacityRange = 10; //Max Potential Opacity (Higher -> Noise is more appearant)

//Canvas Init
var canvas;
var ctx;
var data = [];
var frame = 0;

$(document).ready(function () {
    canvas = document.getElementById('static');
    canvas.width = screen.width*2;
    canvas.height = screen.height*2;
    ctx = canvas.getContext('2d');
    loadData()
});

/**
 * Generates 10 random black and white Image Buffers (Noise)
 */
function loadData() {
    data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < data.data.length; i += 4) {
        data.data[i] = data.data[i + 1] = data.data[i + 2] = Math.random() >= 0.5 ? 20 : 255;
        data.data[i + 3] = Math.floor(Math.random() * opacityRange) + 5;
    }
    ctx.putImageData(data, 0, 0);
}


