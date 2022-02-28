let canvas = document.querySelector('#canvas');
let context = canvas.getContext("2d");

class Circle {
    constructor(diameter, fraction) {
        this.radius = diameter / 2;
        this.fraction = fraction;
    }

    getPerimeter() {
        return 2 * this.radius * Math.PI * this.fraction;
    }

    getArea() {
        return Math.pow(this.radius, 2) * Math.PI * this.fraction;
    }

    drawShape(x, y, color) {
        context.beginPath();
        context.moveTo(x, y);
        context.arc(x, y, this.radius, 0, Math.PI * 2 * this.fraction);
        context.lineCap = "round";
        context.strokeStyle = color;
        context.fillStyle = color;
        context.fill();
        context.stroke();

    }
}

class Rectangle {
    constructor(length, width) {
        this.length = length;
        this.width = width;
    }

    getPerimeter() {
        return (this.length + this.width) * 2;
    }

    getArea() {
        return (this.length * this.width);
    }

    drawShape(x, y, color) {
        context.beginPath();
        context.rect(x, y, this.length, this.width);
        context.fillStyle = color;
        context.fill();
    }
}

class Triangle {
    constructor(base, height) {
        this.base = base;
        this.height = height;
    }

    getPerimeter() {
        return this.base + this.height + Math.sqrt(Math.pow(this.base, 2) + Math.pow(this.height, 2));
    }

    getArea() {
        return this.base * this.height / 2;
    }

    drawShape(x, y, color) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x, y + this.height);
        context.lineTo(x + this.base, y + this.height);
        context.closePath();
        context.fillStyle = color;
        context.fill();
    }
}

class Line {
    constructor(length, width) {
        this.length = length;
        this.width = width;
    }

    getPerimeter() {
        return (this.length + this.width) * 2;
    }

    getArea() {
        return (this.length * this.width);
    }

    drawShape(x, y, color) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x, y + this.length);
        context.strokeStyle = color;
        context.lineWidth = this.width;
        context.lineCap = 'round';
        context.stroke();
    }
}

let input = document.querySelector('#input');

let shapeSelect = document.querySelectorAll('select')[0];
shapeSelect.value = 'Hình cung tròn';
shapeSelect.oninput = function () {
    createInput(shapeSelect.value);
    drawCanvas();
}

let colorSelect = document.querySelectorAll('select')[1];
colorSelect.value = 'Đơn sắc';
colorSelect.oninput = drawCanvas;

let parameter = document.querySelectorAll('#parameter div')[1];

createInput('Hình cung tròn');
drawCanvas();

function createInput(type) {
    switch (type) {
        case 'Hình cung tròn':
            input.innerHTML = `<input className="input">
                <select className="input">
                    <option disabled>Kiểu phân chia</option>
                    <option>Trọn vẹn</option>
                    <option>Một nửa</option>
                    <option>Một phần ba</option>
                    <option>Một phần tư</option>
                </select>`;

            input.children[0].placeholder = 'Đường kính';
            input.children[0].value = '50 px';
            setInput(input.children[0]);

            input.children[1].value = 'Trọn vẹn';
            input.children[1].oninput = drawCanvas;
            break;
        case 'Hình tứ giác':
            input.innerHTML = `<input className="input"><input className="input">`;
            input.children[0].placeholder = 'Chiều dài';
            input.children[0].value = '50 px';
            setInput(input.children[0]);

            input.children[1].placeholder = 'Chiều rộng';
            input.children[1].value = '50 px';
            setInput(input.children[1]);
            break;
        case 'Đoạn thẳng':
            input.innerHTML = `<input className="input"><input className="input">`;
            input.children[0].placeholder = 'Chiều dài';
            input.children[0].value = '50 px';
            setInput(input.children[0]);

            input.children[1].placeholder = 'Chiều rộng';
            input.children[1].value = '5 px';
            setInput(input.children[1]);
            input.children[1].onblur = function () {
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
        case 'Hình tam giác':
            input.innerHTML = `<input className="input"><input className="input">`;
            input.children[0].placeholder = 'Cạnh đáy';
            input.children[0].value = '50 px';
            setInput(input.children[0]);

            input.children[1].placeholder = 'Chiều cao';
            input.children[1].value = '50 px';
            setInput(input.children[1]);
            break;
    }
}

function setInput(object) {
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

    let shape;
    switch (shapeSelect.value) {
        case 'Hình cung tròn':
            shape = new Circle(parseInt(input.children[0].value),
                eval(input.children[1].value
                    .replace('Trọn vẹn', '1')
                    .replace('Một nửa', '1/2')
                    .replace('Một phần ba', '1/3')
                    .replace('Một phần tư', '1/4')));
            break;
        case 'Hình tứ giác':
            shape = new Rectangle(parseInt(input.children[0].value), parseInt(input.children[1].value));
            break;
        case 'Hình tam giác':
            shape = new Triangle(parseInt(input.children[0].value), parseInt(input.children[1].value));
            break;
        case 'Đoạn thẳng':
            shape = new Line(parseInt(input.children[0].value), parseInt(input.children[1].value));
            break;
    }
    let perimeter = Math.round(shape.getPerimeter() * 100) / 100;
    let area = Math.round(shape.getArea() * 100) / 100;
    parameter.innerHTML = `Chu vi: ${perimeter} px<br>Diện tích: ${area} px<sup>2</sup>`;

    let quantity = 15;
    let positionArray = getPositionArray(quantity);
    for (let i = 0; i < quantity; i++) {
        let colorPosition;
        switch (shapeSelect.value) {
            case 'Hình cung tròn':
                colorPosition = positionArray[i][0] + shape.radius * 2;
                break;
            case 'Hình tứ giác':
                colorPosition = positionArray[i][0] + Math.max(shape.length, shape.width);
                break;
            case 'Hình tam giác':
                colorPosition = positionArray[i][0] + shape.base;
                break;
            case 'Đoạn thẳng':
                colorPosition = positionArray[i][0] + Math.min(shape.length, shape.width);
                break;
        }
        shape.drawShape(positionArray[i][0],
            positionArray[i][1],
            getColor(colorPosition));
    }
}

function getPositionArray(quantity) {
    let positionArray = [];
    while (positionArray.length < quantity) {
        positionArray.push([randomNumber(0, 450), randomNumber(0, 450)]);
        positionArray = positionArray.filter(function (item, index) {
            return positionArray.indexOf(item) === index;
        })
    }
    return positionArray;
}

function getColor(colorPosition) {
    let monoColor = `hsl(${randomNumber(0, 359)}, 75%, 75%)`;

    let colorArray = getColorArray();
    let multiColor = context.createLinearGradient(0, 0, colorPosition, 0);
    multiColor.addColorStop(0, colorArray[0]);
    multiColor.addColorStop(1, colorArray[1]);

    return colorSelect.value === 'Gradient'
        ? multiColor
        : monoColor;
}

function getColorArray() {
    let colorArray = [];
    let code = randomNumber(0, 359);
    let step = 80;
    let color1 = `hsl(${code}, 75%, 75%)`;
    let color2 = code > 360 - step
        ? `hsl(${code - step}, 75%, 75%)`
        : `hsl(${code + step}, 75%, 75%)`;
    colorArray.push(color1, color2);
    return colorArray;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function createLine(x, y, width) {
//     context.beginPath();
//     context.moveTo(x, y);
//     context.lineTo(width, y);
//
//     context.strokeStyle = "black";
//     context.lineWidth = 10;
//     context.lineCap = "square"; // butt round square
//     context.stroke();
//
//     context.strokeStyle = "red";
//     context.lineWidth = 10 * 70 / 100;
//     context.stroke();
// }