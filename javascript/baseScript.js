export {getColor};
import {Shape} from "./classScript.js";

let canvas = document.querySelector('#canvas');
let context = canvas.getContext("2d");

let shapeSelect = document.querySelectorAll('#select select')[0];
shapeSelect.value = 'Hình cung tròn';
shapeSelect.oninput = function () {
    createInput(shapeSelect.value);
    drawCanvas();
}

let colorSelect = document.querySelectorAll('#select select')[1];
colorSelect.value = 'Đơn sắc';
colorSelect.oninput = drawCanvas;

let input = document.querySelector('#input');
let measure = document.querySelectorAll('#measure div')[1];

createInput('Hình cung tròn');
drawCanvas();

function createInput(type) {
    input.innerHTML = type === 'Hình cung tròn' ? `<input className="input">
                <select className="input">
                    <option>Trọn vẹn</option>
                    <option>Một nửa</option>
                    <option>Một phần ba</option>
                    <option>Một phần tư</option>
                </select>`
        : `<input className="input"><input className="input">`;

    let children = [...input.children];

    if (type === 'Hình cung tròn') setInput(children[0]);
    else children.forEach(item => setInput(item));

    switch (type) {
        case 'Hình cung tròn':
            children[0].placeholder = 'Đường kính';
            children[0].value = '50 px';
            children[1].value = 'Trọn vẹn';
            children[1].oninput = drawCanvas;
            break;
        case 'Hình tứ giác':
            children[0].placeholder = 'Chiều dài';
            children[0].value = '50 px';
            children[1].placeholder = 'Chiều rộng';
            children[1].value = '50 px';
            break;
        case 'Hình tam giác':
            children[0].placeholder = 'Cạnh đáy';
            children[0].value = '50 px';
            children[1].placeholder = 'Góc độ';
            children[1].value = '60°';
            children[1].onblur = function () {
                document.body.style.pointerEvents = 'visible';
                if (!this.value || this.value < 45 || this.value > 150) {
                    this.setCustomValidity('Giá trị từ 45° đến 150°.');
                    this.reportValidity();
                } else {
                    this.value = this.value + '°';
                    drawCanvas();
                }
            }
            break;
        case 'Đoạn thẳng':
            children[0].placeholder = 'Chiều dài';
            children[0].value = '50 px';
            children[1].placeholder = 'Chiều rộng';
            children[1].value = '10 px';
            children[1].onblur = function () {
                document.body.style.pointerEvents = 'visible';
                if (!this.value || this.value < 5 || this.value > 15) {
                    this.setCustomValidity('Giá trị từ 5 px đến 15 px.');
                    this.reportValidity();
                } else {
                    this.value = this.value + ' px';
                    drawCanvas();
                }
            }
            break;
    }
}

function setInput(object) {
    object.inputMode = 'numeric';

    object.onfocus = function () {
        document.body.style.pointerEvents = 'none';
        this.value = '';
    }

    object.oninput = function () {
        this.value = this.value.replace(/[^\d]/, '');
    }

    object.onkeydown = function (event) {
        this.setCustomValidity('');
        if (event.key === 'Enter') this.blur();
    };

    object.onblur = function () {
        document.body.style.pointerEvents = 'visible';
        if (!this.value || this.value < 50 || this.value > 200) {
            this.setCustomValidity('Giá trị từ 50 px đến 200 px.');
            this.reportValidity();
        } else {
            this.value = this.value + ' px';
            drawCanvas();
        }
    }
}

function drawCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.filter = colorSelect.value === 'Trắng đen'
        ? 'grayscale(100%)'
        : 'none';

    let children = [...input.children];
    let quantity = 15;
    let positionArray = getPositionArray(quantity);
    console.log(positionArray);

    let shape;
    for (let i = 0; i < quantity; i++) {
        shape = new Shape(shapeSelect.value,
            children[0].value,
            children[1].value,
            positionArray[i][0],
            positionArray[i][1]);
        shape.drawShape(context);
    }

    let perimeter = Math.round(shape.getPerimeter() * 100) / 100;
    let area = Math.round(shape.getArea() * 100) / 100;
    measure.innerHTML = `Chu vi: ${perimeter} px<br>Diện tích: ${area} px<sup>2</sup>`;
}

function getPositionArray(quantity) {
    let positionArray = [];
    let limitX, limitY;
    let children = [...input.children];

    while (positionArray.length < quantity) {
        switch (shapeSelect.value) {
            default:
                limitX = limitY = parseInt(children[0].value);
                break;
            case 'Hình tứ giác':
                limitX = parseInt(children[0].value);
                limitY = parseInt(children[1].value);
                break;
            case 'Đoạn thẳng':
                limitX = parseInt(children[1].value);
                limitY = parseInt(children[0].value);
                break;
        }
        if (shapeSelect.value === 'Đoạn thẳng')
            positionArray.push([randomize(15, 450 - limitX - 15), randomize(15, 450 - limitY - 15)]);
        else
            positionArray.push([randomize(0, 450 - limitX), randomize(0, 450 - limitY)]);

        positionArray = positionArray.filter(function (item, index) {
            return positionArray.indexOf(item) === index;
        })
    }
    return positionArray;
}

function getColor(x1, y1) {
    let code = randomize(0, 360);
    let step = 80;
    let color0 = `hsl(${code}, 75%, 75%)`;
    let color1 = code > 360 - step
        ? `hsl(${code - step}, 75%, 75%)`
        : `hsl(${code + step}, 75%, 75%)`;

    let monoColor = color0;
    let multiColor = context.createLinearGradient(0, 0, x1, y1);
    multiColor.addColorStop(0, color0);
    multiColor.addColorStop(1, color1);

    return colorSelect.value === 'Gradient'
        ? multiColor
        : monoColor;
}

function randomize(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}