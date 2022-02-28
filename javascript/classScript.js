export {Shape};
import {getColor} from "./baseScript.js";

class Shape {
    constructor(type, param0, param1, x, y) {
        this.type = type;
        this.param0 = param0;
        this.param1 = param1;
        this.x = x;
        this.y = y;
    }

    getObject() {
        switch (this.type) {
            case 'Hình cung tròn':
                return new Circle(this.param0, this.param1, this.x, this.y);
            case 'Hình tứ giác':
                return new Rectangle(this.param0, this.param1, this.x, this.y);
            case 'Hình tam giác':
                return new Triangle(this.param0, this.param1, this.x, this.y);
            case 'Đoạn thẳng':
                return new Line(this.param0, this.param1, this.x, this.y);
        }
    }

    getPerimeter() {
        return this.getObject().getPerimeter();
    }

    getArea() {
        return this.getObject().getArea();
    }

    drawShape(context) {
        this.getObject().drawShape(context);
    }
}

class Circle {
    constructor(diameter, fraction, x, y) {
        this.diameter = parseInt(diameter);
        this.radius = parseInt(diameter) / 2;
        this.fraction = eval(fraction.replace('Trọn vẹn', '1')
            .replace('Một nửa', '1/2')
            .replace('Một phần ba', '1/3')
            .replace('Một phần tư', '1/4'));
        this.x = x;
        this.y = y;
    }

    getPerimeter() {
        return 2 * this.radius * Math.PI * this.fraction;
    }

    getArea() {
        return Math.pow(this.radius, 2) * Math.PI * this.fraction;
    }

    getColor() {
        return getColor(this.x + this.diameter, 0);
    }

    drawShape(context) {
        let x0 = this.x + this.radius, y0 = this.y + this.radius;
        context.beginPath();
        context.moveTo(x0, y0);
        context.arc(x0, y0, this.radius, 0, Math.PI * 2 * this.fraction);
        context.fillStyle = this.getColor();
        context.fill();
    }
}

class Rectangle {
    constructor(length, width, x, y) {
        this.length = parseInt(length);
        this.width = parseInt(width);
        this.x = x;
        this.y = y;
    }

    getPerimeter() {
        return (this.length + this.width) * 2;
    }

    getArea() {
        return (this.length * this.width);
    }

    getColor() {
        return getColor(this.x + this.length, 0);
    }

    drawShape(context) {
        context.beginPath();
        context.rect(this.x, this.y, this.length, this.width);
        context.fillStyle = this.getColor();
        context.fill();
    }
}

class Triangle {
    constructor(base, degree, x, y) {
        this.base = parseInt(base);
        this.degree = parseInt(degree.replace('°', ''));
        this.x = x;
        this.y = y;
    }

    getHeight() {
        return Math.abs(this.base / 2 * Math.tan(toRadian(180 - this.degree) / 2));
    }

    getPerimeter() {
        return this.base + (this.base * Math.sin(toRadian(180 - this.degree) / 2)) / Math.sin(toRadian(this.degree)) * 2;
    }

    getArea() {
        return this.base * this.getHeight() / 2;
    }

    getColor() {
        return getColor(this.x + this.base, 0);
    }

    drawShape(context) {
        context.beginPath();
        context.moveTo(this.x, this.y + this.getHeight());
        context.lineTo(this.x + this.base, this.y + this.getHeight());
        context.lineTo(this.x + this.base / 2, this.y);
        context.closePath();
        context.fillStyle = this.getColor();
        context.fill();
    }
}

class Line {
    constructor(length, width, x, y) {
        this.length = parseInt(length);
        this.width = parseInt(width);
        this.x = x;
        this.y = y;
    }

    getPerimeter() {
        return (this.length + this.width) * 2;
    }

    getArea() {
        return (this.length * this.width);
    }

    getColor() {
        return getColor(0, this.y + this.length);
    }

    drawShape(context) {
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.x, this.y + this.length);
        context.strokeStyle = this.getColor();
        context.lineWidth = this.width;
        context.lineCap = 'round';
        context.stroke();
    }
}

function toRadian(degree) {
    return degree * Math.PI / 180;
}