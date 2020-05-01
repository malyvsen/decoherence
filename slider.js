inputRange = document.getElementById('intensity');
inputRange.oninput = updateSliderColor;
inputRange.onmouseup = updateAngle;
inputRange.ontouchend = updateAngle;

function updateAngle() {
    angle = Math.PI * inputRange.value;
    if (transformedImage.src != "") {
        updateTransformed();
    }
}

function updateSliderColor() {
    let lowBorder = lerp(inputRange.min, inputRange.max, 0.2);
    let midBorder = lerp(inputRange.min, inputRange.max, 0.5);
    let highBorder = lerp(inputRange.min, inputRange.max, 0.8);

    // thumb color on way up
    if (inputRange.value > lowBorder) {
        inputRange.classList.add('ltpurple');
    }
    if (inputRange.value > midBorder) {
        inputRange.classList.add('purple');
    }
    if (inputRange.value > highBorder) {
        inputRange.classList.add('pink');
    }

    // thumb color on way down
    if (inputRange.value < lowBorder) {
        inputRange.classList.remove('ltpurple');
    }
    if (inputRange.value < midBorder) {
        inputRange.classList.remove('purple');
    }
    if (inputRange.value < highBorder) {
        inputRange.classList.remove('pink');
    }
}

function lerp(a, b, t) {
    return Number(a) + (Number(b) - Number(a)) * Number(t);
}

updateSliderColor();