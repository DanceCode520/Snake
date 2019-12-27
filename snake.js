const wallDiv = document.getElementsByClassName("wall")[0];
// 蛇类
function Snake() {
    this.body = [{ x: 30, y: 0 }, { x: 0, y: 0 }]
}

// 移动蛇
Snake.prototype.move = function(keyCode, step, food) {
    const lastBody = this.body[this.body.length - 1];
    const lastPositon = { x: lastBody.x, y: lastBody.y }
    console.log(`last:${lastBody}`)
        // 改变蛇身体的位置，蛇身位置为蛇的前一部分位置
    for (let index = this.body.length - 1; index > 0; index--) {
        this.body[index].x = this.body[index - 1].x;
        this.body[index].y = this.body[index - 1].y;
    }
    // 判读输入的是上下左右键，改变蛇头位置
    switch (keyCode) {
        case 37: // 左
            this.body[0].x = this.body[0].x - step;
            break;　　
        case 38: // 上
            this.body[0].y = this.body[0].y - step;
            break;　　
        case 39: // 右
            this.body[0].x = this.body[0].x + step;
            break;　　
        case 40: // 下
            this.body[0].y = this.body[0].y + step;
            break;　　
        default:
            break;
    }
    if (this.body[0].x < 0 || this.body[0].x > 570 || this.body[0].y < 0 || this.body[0].y > 390) {
        alert("你个废物,玩死了！！")
        return
    }

    // 判断是否吃到食物
    if (this.eatFood(food)) {
        const foodDivs = document.getElementsByClassName("food");
        for (const fooddiv of foodDivs) {
            let hx = this.body[0].x + "px";
            const hy = this.body[0].y + "px";
            if (fooddiv.style.left == hx && fooddiv.style.top == hy) {
                fooddiv.parentNode.removeChild(fooddiv);
                this.body.push(lastPositon)
                window.CreateElement(lastPositon, "snake_body");
                break;
            }
        }
    }

    // 改变页面蛇头及身体的位置
    const snakeDivs = document.getElementsByClassName("snake_body");
    const snakeHead = document.getElementsByClassName("snakeHead")[0];
    for (let index = 0; index < this.body.length; index++) {
        if (index != 0) { // 蛇身体
            snakeDivs[index - 1].style.top = this.body[index].y + "px";
            snakeDivs[index - 1].style.left = this.body[index].x + "px";
        } else { // 蛇头
            snakeHead.style.top = this.body[0].y + "px";
            snakeHead.style.left = this.body[0].x + "px";
        }
    }
}

// 吃到食物
Snake.prototype.eatFood = function(food) {
    let positon = this.body[0];
    console.log(positon)
    for (const item of food.positions) {
        if (item.x == positon.x && item.y == positon.y) {
            console.log("eat food");
            food.positions = food.positions.filter(ele => { return (ele != item) })
            food.add();
            return true;
        }
    }
    return false;
}

// 食物类
function Food(number, snake) {

    this.snake = snake;
    // 生成食物的坐标
    this.positions = [];
    let exitArr = [].concat(snake.body);
    // x:0~19 Y:0~13
    for (let index = 0; index < number; index++) {
        const po = {};
        po.x = Math.floor(Math.random() * 19) * 30;
        po.y = Math.floor(Math.random() * 13) * 30;
        for (let j = 0; j < exitArr.length; j++) {
            const ele = exitArr[j];
            if (po.x == ele.x && po.y == ele.y) {
                index = index - 1;
                break;
            }
        }
        exitArr.push(po);
        this.positions.push(po);
    }

    for (let index = 0; index < this.positions.length; index++) {
        const ele = this.positions[index];
        window.CreateElement(ele, "food");
    }
}

Food.prototype.add = function() {
    let exitArr = this.snake.body.concat(this.positions);
    let isAdded = false;
    const po = {};
    while (!isAdded) {
        po.x = Math.floor(Math.random() * 19) * 30;
        po.y = Math.floor(Math.random() * 13) * 30;
        for (let j = 0; j < exitArr.length; j++) {
            const ele = exitArr[j];
            if (po.x == ele.x && po.y == ele.y) {
                j == 0 ? 0 : j - 1;
                break;
            }
        }
        isAdded = true
    }
    window.CreateElement(po, "food");
    this.positions.push(po);
}

function CreateElement(ele, className) {
    const wallDiv = document.getElementsByClassName("wall")[0];
    let div = document.createElement("div");
    div.style.left = ele.x + "px";
    div.style.top = ele.y + "px";
    div.setAttribute("class", className);
    wallDiv.appendChild(div);
}

$(document).ready(function() {
    let snake = new Snake();
    (function() {
        for (let index = 0; index < snake.body.length; index++) {
            const ele = snake.body[index];
            if (index == 0) {
                window.CreateElement(ele, "snakeHead")
                continue
            }
            window.CreateElement(ele, "snake_body")
        }
    }())

    let food = new Food(3, snake);
    // 判断键盘上下左右
    $(document).keydown(function(event) {　
        snake.move(event.keyCode, 30, food);
    });


});