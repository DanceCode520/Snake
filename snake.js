const wallDiv = document.getElementsByClassName("wall")[0];
const snakeHead = document.getElementsByClassName("snakeHead")[0];
let touchWallDead = true
let eatSelfDead = true
const foodNames = ["food1.png", "food2.png", "food3.png", "food4.png"]
    // 蛇类
function Snake() {
    this.body = [{ x: 30, y: 0 }, { x: 0, y: 0 }]
}

// 重置蛇
Snake.prototype.reset = function() {
    this.body = [{ x: 30, y: 0 }, { x: 0, y: 0 }]
    $(".wall").empty();
    for (let index = 0; index < this.body.length; index++) {
        const ele = this.body[index];
        if (index == 0) {
            window.CreateElement(ele, "snakeHead")
            continue
        }
        window.CreateElement(ele, "snake_body")
    }
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
            // snakeHead.style.transform = "rotate(180deg)";
            break;　　
        case 38: // 上
            this.body[0].y = this.body[0].y - step;
            // snakeHead.style.transform = "rotate(180deg)";
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
        if (touchWallDead) {
            alert("你走道不看路！！前面有墙还走！！(͡° ͜ʖ ͡°)")
            this.reset();
            food.setFoodPosition(3);
            return
        }
    }
    if (eatSelfDead) {
        for (let index = 1; index < this.body.length; index++) {
            const ele = this.body[index];
            if (ele.x == this.body[0].x && ele.y == this.body[0].y) {
                alert("你饿疯了把！！怎么把自己给吃了！！(¬‿¬)")
                this.reset();
                food.setFoodPosition(3);
                return
            }
        }
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
    this.setFoodPosition(number);
}

// 设置食物位置
Food.prototype.setFoodPosition = function(number) {
    this.positions = [];
    let exitArr = [].concat(this.snake.body);
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

// 吃一个食物添加一个食物
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


// 创建元素
function CreateElement(ele, className) {
    let div = document.createElement("div");
    div.style.left = ele.x + "px";
    div.style.top = ele.y + "px";
    div.setAttribute("class", className);
    if (className == "food") {
        const picName = foodNames[Math.floor(Math.random() * (foodNames.length - 1))];
        div.style.background = `url(\"./imgs/${picName}\") no-repeat`;
        div.style.backgroundSize = "100%";
    }
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

    let clickNumber = 0;
    $(".snakeHead").click(function(e) {
        e.preventDefault();
        clickNumber += 1;
        console.log(`number:${clickNumber}`)
        if (clickNumber == 2) {
            touchWallDead = false
        }
        if (clickNumber == 6) {
            eatSelfDead = false;
        }
    });
});