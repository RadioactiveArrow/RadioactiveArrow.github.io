let fps = 60
const gridSquareSize = 1
const initSnakeCount = 100
const snakeLen = 10
let spacingCoefficient = 300

let lineW;
let lineH;


let snakeTimeout;
let loopTimeout;

var canvas
var ctx

window.onload = e => {
    canvas = document.getElementById('canvas')
    canvas.width = window.innerWidth * 4
    canvas.height = window.innerHeight * 4
    ctx = canvas.getContext('2d')

    // let ratio = device
    spacingCoefficient = ~~(150*(window.innerWidth/window.innerHeight))
    fps = ~~(50*(window.innerWidth/window.innerHeight))

    ctx.translate(window.innerHeight, -(window.innerHeight));
    ctx.rotate(45 * Math.PI / 180);

    // ctx.translate(,40)

    build()
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
    canvas = document.getElementById('canvas')
    canvas.width = window.innerWidth * 4
    canvas.height = window.innerHeight * 4
    ctx = canvas.getContext('2d')
 
    spacingCoefficient = ~~(150*(window.innerWidth/window.innerHeight))
    fps = ~~(50*(window.innerWidth/window.innerHeight))


    ctx.translate(window.innerHeight, -(window.innerHeight));
    ctx.rotate(45 * Math.PI / 180);
    // ctx.translate(,40)
    // canvas.width = window.innerWidth
    // canvas.height = window.innerHeight
    // ctx = canvas.getContext('2d')

    // ctx.translate(window.innerWidth*2, 0);
    // ctx.rotate(135 * Math.PI / 180);
    build()
}, 500)

window.addEventListener('resize', resizePostBounce);

const checkPos = (y, x) => {
    if (y >= 0 && x >= 0 && y < lineH && x < lineW)
        return lines[y][x];
    else
        return false;
}

const update = () => {
    for (var y = 0; y < lineH; y++) {
        for (var x = 0; x < lineW; x++) {
            if (lines[y][x] == snakeLen) {
                choices = []
                // if (checkPos(y - 1, x) === 0 && (checkPos(y - 2, x) == 0))
                    // choices.push([y - 1, x])
                // if (checkPos(y + 1, x) === 0 && (checkPos(y + 2, x) == 0))
                    // choices.push([y + 1, x])
                if (checkPos(y, x + 1) === 0 && (checkPos(y, x + 2) == 0)) {
                    choices.push([y, x + 1])
                }
                if (checkPos(y, x - 1) === 0 && (checkPos(y, x - 2) == 0 )) {
                    choices.push([y, x - 1])
                }

                if (choices.length > 0) {
                    next = choices[~~(Math.random() * choices.length)]
                    lines[next[0]][next[1]] = snakeLen + 1
                } else {
                    lines[y][x] = 0
                }
            }
        }
    }
    for (var y = 0; y < lines.length; y++) {
        for (var x = 0; x < lines[0].length; x++) {
            if (lines[y][x] == 1) {
                lines[y][x] = 0

            }
            else if (lines[y][x] > 0) {
                lines[y][x]--
            }
        }
    }
}

const render = () => {
    var hCan = canvas.height
    var wCan = canvas.width
    var yLen = lines.length
    var xLen = lines[0].length

    ctx.fillStyle = "#05041a"
    ctx.clearRect(0, 0, wCan, hCan)
    // ctx.fillRect(0, 0, wCan, hCan)
    for (var y = 0; y < yLen; y++) {
        for (var x = 0; x < xLen; x++) {
            if (lines[y][x] > 0) {
                let col = 40 * lines[y][x];
                ctx.fillStyle = "rgb(" + col + "," + col + "," +  col + ")"
                ctx.fillRect(xPos, yPos, gridSquareSize, gridSquareSize)

            } else {
                // if(~~(Math.random()*10000)==50)
                    // lines[y][x] = 10;
                // else
                    ctx.fillStyle = "#333333"
                ctx.fillRect(xPos, yPos, gridSquareSize, gridSquareSize)
            }

            var xPos = ~~(x * ((wCan + Math.floor(wCan / xLen) - gridSquareSize) / (xLen)))
            var yPos = ~~(y * ((hCan + Math.floor(hCan / yLen) - gridSquareSize) / (yLen)))

            // if (lines[y][x] > 0 && lines[y + 1] && lines[y + 1][x] > 0 && ((lines[y + 1][x] == lines[y][x] - 1) || (lines[y + 1][x] == lines[y][x] + 1))) {
            //     // ctx.fillRect(xPos, yPos, gridSquareSize, Math.ceil(hCan / yLen))
            // }
            // if (lines[y][x] > 0 && lines[y][x + 1] > 0) {
                // if(lines[y][x+1] == snakeLen && lines[y][x+4] == snakeLen) {
                    // ctx.fillStyle = "#09072e"
                    // ctx.fillRect(xPos, yPos, Math.ceil(wCan / xLen), gridSquareSize)
                // } else {
                    // ctx.fillRect(xPos, yPos, Math.ceil(wCan / xLen), gridSquareSize)
                // }
            // }
        }
    }
    update()

    //Loops Animation
    loopTimeout = window.setTimeout(() => {
        window.requestAnimationFrame(render);
    }, (1000 / (fps)));
}

const rand = (min, max) => {
    return ~~(Math.random() * (max - min) + min);
}

const recursiveSnake = () => {
    createSnake()
    snakeTimeout = setTimeout(recursiveSnake, (1000 / (fps)))
}

const createSnake = () => {
    let randVar = rand(1, 3)
    if (randVar == 1)
        lines[rand(0, lineH)][0] = snakeLen
    else
        lines[rand(0, lineH)][lineW - 1] = snakeLen
}

const build = () => {
    clearTimeout(loopTimeout)
    clearTimeout(snakeTimeout)

    lineW = ~~((window.innerHeight / window.innerHeight) * spacingCoefficient)
    lineH = ~~((window.innerHeight / window.innerWidth) * spacingCoefficient)

    lines = new Array(lineH)
    for (var y = 0; y < lineH; y++) {
        lines[y] = new Array(lineW)
    }
    for (var y = 0; y < lineH; y++) {
        for (var x = 0; x < lineW; x++) {
            lines[y][x] = 0
        }
    }

    recursiveSnake()
    render()

}