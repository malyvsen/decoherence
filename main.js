imagePicker = document.getElementById('select-image');
originalImage = document.getElementById('original-image');
originalImage.style.maxWidth = "512px";
originalImage.style.maxHeight = "512px";
transformedImage = document.getElementById('transformed-image');
angle = Math.PI * .25;

function pickFile() {
    imagePicker.click();
}

function usePickedFile() {
    fileReader = new FileReader();
    fileReader.onload = function(event) {
        useImage(event.target.result);
    };
    fileReader.readAsDataURL(imagePicker.files[0]);
}

function useDemoImage() {
    useImage('experiments/original.jpg');
}

function useImage(src) {
    originalImage.onload = updateTransformed;
    originalImage.src = src;
}

function updateTransformed() {
    let imageData = imageToArray(originalImage);
    let transformedData = transformImage(imageData);
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    let idata = ctx.createImageData(originalImage.width, originalImage.height);
    idata.data.set(transformedData);
    ctx.putImageData(idata, 0, 0);
    transformedImage.src = canvas.toDataURL();
}

function imageToArray(image) {
    let canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);
    let imageData = context.getImageData(0, 0, image.width, image.height);
    return imageData.data;
}

function transformImage(data) {
    let r = [];
    let g = [];
    let b = [];
    let a = [];
    for (let idx = 0; idx < data.length; idx += 4) {
        r.push(data[idx]);
        g.push(data[idx + 1]);
        b.push(data[idx + 2]);
        a.push(data[idx + 3]);
    }

    let newR = transformGrayscale(r);
    let newG = transformGrayscale(g);
    let newB = transformGrayscale(b);
    let newA = a;

    let transformed = [];
    for (let idx = 0; idx < newR.length; idx++) {
        transformed.push(newR[idx]);
        transformed.push(newG[idx]);
        transformed.push(newB[idx]);
        transformed.push(newA[idx]);
    }
    return transformed;
}

function transformGrayscale(data) {
    let paddedData = mirrorPad(data, nearestPowerOf2(data.length));
    let fft = realFft(paddedData);
    let transformedFft = fft.map(transformValue);
    let transformed = inverseRealFft(transformedFft);
    return transformed.slice(0, data.length);
}

function transformValue(value) {
    return new Fourier.Complex(Math.cos(angle), Math.sin(angle)).times(value);
}

function realFft(data) {
    let result = [];
    Fourier.transform(data, result);
    return result.slice(0, Math.floor(result.length / 2) + 1);
}

function inverseRealFft(data) {
    let negativeData = data.slice(1, -1).map((c) => new Fourier.Complex(c.real, -c.imag));
    negativeData.reverse();
    let dataWithNegative = data.concat(negativeData);
    let result = [];
    Fourier.invert(dataWithNegative, result);
    return result;
}

function mirrorPad(array, targetLength) {
    return array.concat(array.slice(array.length - targetLength).reverse());
}

function nearestPowerOf2(n) {
    return Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)));
}