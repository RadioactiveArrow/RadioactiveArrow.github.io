const destinations = [
    ["projects", "red"],
    ["about", "green"],
    ["contact", "blue"]
];

const stations = {
    about: "aboutObj",
    contact: "contactObj",
    home: "homeObj",
    projects: "projectsObj"
};

const color_mappings = {
    blue: "#3D393DCC",
    green: "#3D393DCC",
    red: "#3D393DCC"
};

let map;

const STATION_PAN_TIME = 3000; // time to pan between stations (milliseconds)
const BLUE_STATION_POS = 2865.1; // position of blue station on blue line (pixels)

const TRAIN_SPEED = 14; // speed of the train in pixels per frame
const TRAIN_CART_OFFSET = 40; // offset between train and each cart
const TRAIN_DIST_CUTOFF = 1.1; // distance multiplier to end the train animation
const TRAIN_ANGLE_LOOKAHEAD_COUNT = 5;  // # of look ahead points for smoothing



let currentState = "home";
let allowScroll = false;
let trainStop = true; // enables early stop on blue line
let scrollPos = 0;
let minScroll = 0;
let maxScroll = 0;


/*
    updateViewBox() -
    Updates the viewBox of the SVG container
    to center the current state's SVG element
    and maintain correct sizing
*/
function updateViewBox() {
    // get the current state's SVG element
    let svgElement = document.getElementById(`${currentState}Obj`);
    if (!svgElement) {
        console.error(`could not find SVG element for ${currentState}`);
        return;
    }

    // set a station's SVG element width to width of its HTML children
    const children = svgElement.children;
    const maxWidth = Math.max(...Array.from(children).map((x) => x.offsetWidth));
    svgElement.setAttribute("width", maxWidth);


    // calculate the center of the smaller SVG element
    let bbox = svgElement.getBBox();
    let bboxX = bbox.x ||  Number.parseFloat(svgElement.getAttribute("x"));
    let bboxY = bbox.y || Number.parseFloat(svgElement.getAttribute("y"));
    console.log(bboxX, bboxY, bbox.width, bbox.height)
    let centerX = (bboxX + bbox.width / 2);
    let centerY = (bboxY + bbox.height / 2);

    // get the dimensions of the SVG container
    let svgWidth = map.clientWidth;
    let svgHeight = map.clientHeight;

    // calculate new viewBox values to center the element
    let viewBoxX = centerX - svgWidth / 2;
    let viewBoxY = centerY - svgHeight / 2;
    
    // alert("svgWidth " + svgWidth + " svgHeight " + svgHeight + " viewBoxX " + viewBoxX + " viewBoxY " + viewBoxY + " centerX " + centerX + " centerY " + centerY + " bbox.x " + bbox.x + " bbox.y " + bbox.y + " bbox.width " + bbox.width + " bbox.height " + bbox.height)

    // if on projects page, preserve scroll position on resize / update
    allowScroll = (currentState == "projects")
    if (allowScroll) {
        const currentY = map.getAttribute('viewBox').split(" ")[1];
        map.setAttribute('viewBox', `${viewBoxX} ${currentY} ${svgWidth} ${svgHeight}`);
        return;
    }

    // alert(viewBoxX + " " + viewBoxY + " " + svgWidth + " " + svgHeight)

    // update SVG container's  viewBox 
    map.setAttribute('viewBox', `${viewBoxX} ${(viewBoxY)} ${svgWidth} ${svgHeight}`);
    // map.setAttribute('viewBox', `439 -117 390 669`);
    // map.setAttribute('viewBox', `-45 -184.5 390 669`);
}

/*
    _calculateIntermediateViewBox() -
    Calculates the intermediate viewBox values
    between the start and destination elements,
    enabling a smooth transition

    start - the viewBox values of the starting element
    targetElement - the destination SVG element
    svgContainer - the global SVG container
    progress - the progress of the animation, between 0 and 1
*/
function _calculateIntermediateViewBox(start, targetElement, svgContainer, progress) {
    let bbox = targetElement.getBBox();
    let bboxX = Number.parseFloat(targetElement.getAttribute("x"));
    let bboxY = Number.parseFloat(targetElement.getAttribute("y"));
    // destination center position
    let destCenterX = bboxX + bbox.width / 2;
    let destCenterY = bboxY + bbox.height / 2;

    // svg container dimensions
    let svgWidth = svgContainer.clientWidth;
    let svgHeight = svgContainer.clientHeight;

    // destination viewBox values to center the element
    let destViewBoxX = destCenterX - svgWidth / 2;
    let destViewBoxY = destCenterY - svgHeight / 2;

    // alert("bboxX" + bboxX + " bboxY" + bboxY +  " destViewBoxX " + destViewBoxX + " destViewBoxY " + destViewBoxY + " svgWidth " + svgWidth + " svgHeight " + svgHeight )

    // interpolate between start and destination values
    let x = start[0] + progress * (destViewBoxX - start[0]);
    let y = start[1] + progress * (destViewBoxY - start[1]);
    let width = start[2] + progress * (svgWidth - start[2]);
    let height = start[3] + progress * (svgHeight - start[3]);

    return `${x} ${y} ${width} ${height}`;
}

/*
    _animateViewBox() -
    Animates the viewBox of the SVG container
    to center the current state's SVG element
    and maintain correct sizing

    originViewBox [] - the viewBox values of the starting element
    destElementId - the id of the destination SVG element
    duration - the duration of the animation in milliseconds
*/
function _animateViewBox(originViewBox, destElementId, duration) {
    let targetElement = document.getElementById(destElementId);

    let start_time = null;

    function animate(time) {
        updateViewBox();
        if (!start_time) {
            start_time = time;
        }

        let progress = (time - start_time) / duration;
        progress = progress < 0.5 ? 4 * progress * progress * progress : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;

        // intermediate viewBox values during animation
        let currentViewBox = _calculateIntermediateViewBox(originViewBox, targetElement, map, progress);

        map.setAttribute('viewBox', currentViewBox);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            minScroll = Number.parseFloat(currentViewBox.split(" ")[1]);
            maxScroll = minScroll + Number.parseFloat(currentViewBox.split(" ")[3]);
        }
    }

    requestAnimationFrame(animate);
}

/*
    moveScreenToStation() -
    Moves the screen to the specified station
    by animating the viewBox of the SVG container

    destination - the name of the destination station
*/
const moveScreenToStation = (destination) => {
    currentState = Object.keys(stations).find((key) => stations[key] === destination);
    currentViewBox = map.getAttribute('viewBox').split(" ");
    currentViewBox = currentViewBox.map((x) => parseInt(x));
    // alert("currentViewBox " + currentViewBox + " currentState " + currentState + " destination " + destination)
    _animateViewBox(currentViewBox, `${currentState}Obj`, STATION_PAN_TIME); // 3 seconds
}


const moveTrain = (pathWay) => {
    trainStop = true; // enable early stop on blue line by default

    const path = document.getElementById(`${pathWay}Line`);
    const train = document.getElementById('train');
    const carts = [document.getElementById('cart1'), document.getElementById('cart2')]; // Add more carts as needed
    const train_components = document.getElementsByClassName('train_component');

    // train position offsets for red line
    for (i = 0; i < train_components.length; i++) {
        train_components[i].setAttribute("y", pathWay == "red" ? "-4" : "-11");
        train_components[i].setAttribute("stroke", color_mappings[pathWay]);
    }

    let pathLength = path.getTotalLength();
    let trainPos = 0; // starting position of train on path
    let angles = { train: 0, cart1: 0, cart2: 0 }; // separate angle tracking for each cart

    // make train appear / disappear
    function setTrainVisibility(visibile) {
        const visVal = visibile ? "visible" : "hidden";
        train.setAttribute("visibility", visVal);
        carts.forEach((cart) => {
            cart.setAttribute("visibility", visVal);
        });
    }

    // handle train animations based on speed and path
    function animateTrain() {
        // end ride once it's fully past end of path
        if (trainPos > TRAIN_DIST_CUTOFF * pathLength) {
            setTrainVisibility(false)
            return;
        }

        // stop blue train & wait if at intermediate station
        if (pathWay == "blue" && trainStop && trainPos + TRAIN_SPEED >= BLUE_STATION_POS) {
            requestAnimationFrame(animateTrain);
            return;
        }

        // update train and cart positions based on speed
        trainPos += TRAIN_SPEED;
        updatePosition(train, trainPos % pathLength, 'train');
        carts.forEach((cart, index) => {
            let cartId = cart.id;
            let cartPos = (trainPos - TRAIN_CART_OFFSET * (index + 1) + pathLength);
            updatePosition(cart, cartPos % pathLength, cartId);
        });

        requestAnimationFrame(animateTrain);
    }

    function updatePosition(element, pos, id) {
        let point = path.getPointAtLength(pos);

        /* calculate the average angle over the next few points to smooth out the rotation */

        // generate cumulative angle over next ANGLE_SMOOTHING_LOOKAHEAD points
        let totalAngle = 0;
        for (i = 1; i <= TRAIN_ANGLE_LOOKAHEAD_COUNT; i++) {
            let nextPoint = path.getPointAtLength(pos + i);
            totalAngle += Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
        }
        let angle = totalAngle / TRAIN_ANGLE_LOOKAHEAD_COUNT * 180 / Math.PI;

        // smooth out the rotation for each element
        let smoothedAngle = angles[id] + (angle - angles[id]) * 0.24; // Adjust the smoothing factor if needed
        angles[id] = smoothedAngle;

        if (isNaN(smoothedAngle)) {
            console.log("lookahead angle is NaN")
            return;
        }

        // calculate the center of the train
        let centerX = element.width.baseVal.value / 2;
        let centerY = element.height.baseVal.value / 2 - (pathWay == "red" ? 5 : 10);
        let scale = 1;

        // shrink train if close to destination
        if (pos > pathLength - 50) {
            scale = 1 - (pos - (pathLength - 50)) / 100;
        }

        // finally, update the train component's position, rotation, and scale
        element.setAttribute("transform", `translate(${point.x - centerX},${point.y - centerY}) rotate(${smoothedAngle},${centerX},${centerY}) scale(${scale})`);
    }

    setTrainVisibility(true)
    animateTrain();
}

const initializeEventListeners = () => {
    // initialize station travel triggers
    destinations.forEach((destination) => {
        document.querySelector(`#to_${destination}`).addEventListener("click", () => {
            moveTrain(destination[1], 1);
            setTimeout(() => {
                moveScreenToStation(stations[destination[0]]);
            }, 100);
        });
    });

    // initialize return to home triggers
    document.querySelectorAll(`.to_home`).forEach((element) => {
        element.addEventListener("click", (e) => {
            e.preventDefault()
            id = element.id.split("_")[1]
            moveScreenToStation(stations["home"]);
        });
    });

    // initialize contact form trigger
    document.querySelector(`#send_form`).addEventListener("click", (e) => {
        e.preventDefault()
        const btn = document.getElementById('send_form');
        btn.value = 'Sending...';

        const serviceID = 'service_3dixceg';
        const templateID = 'template_7grvjan';

        const content = {
            sender: document.getElementById('email').value,
            content: document.getElementById('text').value,
        }
   emailjs.send(serviceID, templateID, content)
    .then(() => {
      btn.value = 'Send Email';
      alert('Sent!');
    }, (err) => {
      btn.value = 'Send Email';
      alert(JSON.stringify(err));
    });

        trainStop = false
    });
}

const initializeScroll = () => {
    function handleScroll(deltaY, speed) {
        projFO = document.getElementById("projectsObj-fO");
        const projFOHeight = projFO.getBBox().height;
        if (!allowScroll || (minScroll > scrollPos && deltaY < 0) || (minScroll + projFOHeight - 500 < scrollPos && deltaY > 0)) {
            return;
        }

        const viewBox = map.viewBox.baseVal;

        let speedY = speed || 40;

        viewBox.y += deltaY * speedY / 100;
        scrollPos = viewBox.y;
    }

    map.addEventListener('wheel', function (event) {
        event.preventDefault();
        handleScroll(event.deltaY);
    });

    map.addEventListener('touchstart', function (event) {
        if (event.touches.length === 1) {
            lastTouchY = event.touches[0].clientY;
        }
    }, { passive: false });

    map.addEventListener('touchmove', function (event) {
        if (event.touches.length === 1) {
            let deltaY = lastTouchY - event.touches[0].clientY;
            lastTouchY = event.touches[0].clientY;
            handleScroll(deltaY * 1.5, 60);
        }
    }, { passive: false });

    // Listen for focus and blur events on input elements
    document.addEventListener("focusin", (event) => {
        if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
            // console.log("Virtual keyboard likely opened for an input field.");
            // const currentPos = map.getAttribute('viewBox').split(" ");
            // map.setAttribute('viewBox', `${currentPos[0]} ${currentPos[1]-20} ${currentPos[2]} ${currentPos[3]}`);
        }
    });

    document.addEventListener("focusout", (event) => {
        if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
            // console.log("Virtual keyboard likely closed for an input field.");
            // moveScreenToStation(stations["contact"]);
            // updateViewBox();
            // move viewport back to original position
            // const currentPos = map.getAttribute('viewBox').split(" ");
            // map.setAttribute('viewBox', `${currentPos[0]} ${currentPos[1]-20} ${currentPos[2]} ${currentPos[3]}`);
        }
    });
}

const loaded = () => {
    // initialize map
    map = document.getElementById('map');


    // initialize and periodically refresh viewBox
    updateViewBox();
    // setInterval(updateViewBox, 2000);

    // show map after loading viewBox
    setTimeout(() => {
        map.style.visibility = 'visible';
        moveScreenToStation(stations["home"]);

    }, 150);

    initializeEventListeners();
    initializeScroll();
}

window.onresize = updateViewBox;
window.visualViewport.addEventListener('resize', updateViewBox);
