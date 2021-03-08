const snakeboard = document.getElementById("gameCanvas");
const snakeboard_ctx = gameCanvas.getContext("2d");


let score = 0;

let cellSize = 70;
let boardSizeX = cellSize * 16;
let boardSizeY = cellSize * 10;
snakeboard.width = boardSizeX;
snakeboard.height = boardSizeY;

let snakeSpeed = 250;

let snake = [
    { x: boardSizeX / 2, y: boardSizeY / 2 },
    { x: boardSizeX / 2 - cellSize, y: boardSizeY / 2 },
    { x: boardSizeX / 2 - cellSize * 2, y: boardSizeY / 2 },
    { x: boardSizeX / 2 - cellSize * 3, y: boardSizeY / 2 },
];

let changingDirection = false;

let keyBacklog = 0;

let xVel = cellSize;
let yVel = 0;

let currentGamemode = "Normal";

document.getElementById('current-gamemode').innerHTML = currentGamemode;

function GamemodeEasier() {
    if (currentGamemode == "Normal") {
        currentGamemode = "Easy";
    }
    else if (currentGamemode == "Easy") {
        currentGamemode = "Hard";
    }
    else if (currentGamemode == "Hard") {
        currentGamemode = "Normal";
    }
    document.getElementById('current-gamemode').innerHTML = currentGamemode;
}


function GamemodeHarder() {
    if (currentGamemode == "Normal") {
        currentGamemode = "Hard";
    }
    else if (currentGamemode == "Hard") {
        currentGamemode = "Easy";
    }
    else if (currentGamemode == "Easy") {
        currentGamemode = "Normal";
    }
    document.getElementById('current-gamemode').innerHTML = currentGamemode;
}

function StartGame() {
    var buttons = document.getElementById("menu-buttons");
    buttons.style.display = "none";

    snake = [
        { x: boardSizeX / 2, y: boardSizeY / 2 },
        { x: boardSizeX / 2 - cellSize, y: boardSizeY / 2 },
        { x: boardSizeX / 2 - cellSize * 2, y: boardSizeY / 2 },
        { x: boardSizeX / 2 - cellSize * 3, y: boardSizeY / 2 },
    ];
    score = 0;
    document.getElementById('score').innerHTML = score;
    xVel = cellSize;
    yVel = 0;

    if (currentGamemode == "Easy") {
        snakeSpeed = 220
    }
    else if (currentGamemode == "Normal") {
        snakeSpeed = 150;
    }
    else if (currentGamemode == "Hard") {
        snakeSpeed = 80;
    }
    Main();
    GenerateFood();
}


document.addEventListener("keydown", ChangeDirection);

function Main() {
    if (CheckCollision()) {
        SnakeDied();
        return;
    }
    changingDirection = false;
    setTimeout(function onTick() {
        if (keyBacklog != 0) ChangeDirection();
        ClearCanvas();
        DrawFood();
        MoveSnake();
        DrawSnake();
        Main();
    }, snakeSpeed)
}
function ClearCanvas() {
    snakeboard_ctx.fillStyle = 'white';
    snakeboard_ctx.strokestyle = 'black';
    snakeboard_ctx.fillRect(0, 0, boardSizeX, boardSizeY);
    snakeboard_ctx.strokeRect(0, 0, boardSizeX, boardSizeY);
}

function DrawSnake() {
    const headSize = 0.65;
    const snakeSize = 0.5;

    snakeboard_ctx.fillStyle = 'green';
    snakeboard_ctx.strokestyle = 'black';
    snakeboard_ctx.fillRect(snake[0].x + (cellSize - (cellSize * headSize)) * 0.5, snake[0].y + (cellSize - (cellSize * headSize)) * 0.5, cellSize * headSize, cellSize * headSize);
    //snakeboard_ctx.strokeRect(snake[0].x + (cellSize - (cellSize * headSize)) * 0.5 , snake[0].y + (cellSize - (cellSize * headSize)) * 0.5, cellSize * headSize, cellSize * headSize);

    for (let i = 0; i < snake.length; i++) {
        let xCord = snake[i].x + (cellSize - (cellSize * snakeSize)) * 0.5;
        let yCord = snake[i].y + (cellSize - (cellSize * snakeSize)) * 0.5;
        let width = cellSize * snakeSize;
        let height = cellSize * snakeSize;
        snakeboard_ctx.fillStyle = 'green';
        if (i > 0) {
            if (snake[i].x < snake[i - 1].x) {
                width = (cellSize - (cellSize * snakeSize)) * 0.5 + cellSize * snakeSize;
                if (snake[i - 1].x - snake[i].x > cellSize) xCord = 0;
            }
            if (snake[i].x > snake[i - 1].x) {
                xCord = snake[i].x;
                width = (cellSize - (cellSize * snakeSize)) * 0.5 + cellSize * snakeSize;
                if (snake[i].x - snake[i - 1].x > cellSize) xCord = snake[i].x + (cellSize - (cellSize * snakeSize)) * 0.5;
            }

            if (snake[i].y < snake[i - 1].y) {
                height = (cellSize - (cellSize * snakeSize)) * 0.5 + cellSize * snakeSize;
                if (snake[i - 1].y - snake[i].y > cellSize) yCord = 0;
            }
            if (snake[i].y > snake[i - 1].y) {
                yCord = snake[i].y;
                height = (cellSize - (cellSize * snakeSize)) * 0.5 + cellSize * snakeSize;
                if (snake[i].y - snake[i - 1].y > cellSize) yCord = snake[i].y + (cellSize - (cellSize * snakeSize)) * 0.5;
            }
        }
        snakeboard_ctx.fillRect(xCord, yCord, width, height);

        xCord = snake[i].x + (cellSize - (cellSize * snakeSize)) * 0.5;
        yCord = snake[i].y + (cellSize - (cellSize * snakeSize)) * 0.5;
        width = cellSize * snakeSize;
        height = cellSize * snakeSize;
        if (i < snake.length - 1) {
            if (snake[i].x < snake[i + 1].x) {
                width = (cellSize - (cellSize * snakeSize)) * 0.5 + cellSize * snakeSize;
                if (snake[i + 1].x - snake[i].x > cellSize) xCord = 0;
            }
            if (snake[i].x > snake[i + 1].x) {
                xCord = snake[i].x;
                width = (cellSize - (cellSize * snakeSize)) * 0.5 + cellSize * snakeSize;
                if (snake[i].x - snake[i + 1].x > cellSize) xCord = snake[i].x + (cellSize - (cellSize * snakeSize)) * 0.5;
            }

            if (snake[i].y < snake[i + 1].y) {
                height = (cellSize - (cellSize * snakeSize)) * 0.5 + cellSize * snakeSize;
                if (snake[i + 1].y - snake[i].y > cellSize) yCord = 0;
            }
            if (snake[i].y > snake[i + 1].y) {
                yCord = snake[i].y;
                height = (cellSize - (cellSize * snakeSize)) * 0.5 + cellSize * snakeSize;
                if (snake[i].y - snake[i + 1].y > cellSize) yCord = snake[i].y + (cellSize - (cellSize * snakeSize)) * 0.5;
            }
        }
        snakeboard_ctx.fillRect(xCord, yCord, width, height);
    }
}

function MoveSnake() {
    const head = { x: snake[0].x + xVel, y: snake[0].y + yVel };
    snake.unshift(head);
    CheckCollision();

    const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;
    if (hasEatenFood) {
        GenerateFood();
        score++;
        document.getElementById('score').innerHTML = score;

    } else {
        snake.pop();
    }
}

function CheckCollision() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    snake.forEach(function isOutsideBoard(part) {
        if (part.x >= boardSizeX) part.x = 0;
        if (part.x <= -cellSize) part.x = boardSizeX - cellSize;
        if (part.y >= boardSizeY) part.y = 0;
        if (part.y <= -cellSize) part.y = boardSizeY - cellSize;
    });
    return false;
}

function ChangeDirection(event) {
    let keyPressed;
    if (event) {
        keyPressed = event.keyCode;
        keyBacklog = 0;
    }
    else keyPressed = keyBacklog;
    if (changingDirection) {
        keyBacklog = keyPressed;
        return;
    }
    changingDirection = true;
    keyBacklog = 0;
    UpdateDirection(keyPressed);
}

function UpdateDirection(keyPressed) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    if (keyPressed === LEFT_KEY && xVel !== cellSize) {
        xVel = -cellSize;
        yVel = 0;
    }
    if (keyPressed === RIGHT_KEY && xVel !== -cellSize) {
        xVel = cellSize;
        yVel = 0;
    }
    if (keyPressed === UP_KEY && yVel !== cellSize) {
        xVel = 0;
        yVel = -cellSize;
    }
    if (keyPressed === DOWN_KEY && yVel !== -cellSize) {
        xVel = 0;
        yVel = cellSize;
    }
}

function RandomCords(min, max) {
    return Math.round((Math.random() * (max - min) + min) / cellSize) * cellSize;
}
function GenerateFood() {
    foodX = RandomCords(0, boardSizeX - cellSize);
    foodY = RandomCords(0, boardSizeY - cellSize);
    snake.forEach(function IsOverlapping(part) {
        const overlapping = part.x == foodX && part.y == foodY;
        if (overlapping) GenerateFood();
    });
}

function DrawFood() {
    const foodSize = 0.4;
    snakeboard_ctx.fillStyle = 'red';
    snakeboard_ctx.strokestyle = 'red';
    snakeboard_ctx.fillRect(foodX + (cellSize - (cellSize * foodSize)) * 0.5, foodY + (cellSize - (cellSize * foodSize)) * 0.5, cellSize * foodSize, cellSize * foodSize);
    snakeboard_ctx.strokeRect(foodX + (cellSize - (cellSize * foodSize)) * 0.5, foodY + (cellSize - (cellSize * foodSize)) * 0.5, cellSize * foodSize, cellSize * foodSize);
}

function SnakeDied() {
    var buttons = document.getElementById("menu-buttons");
    buttons.style.display = "flex";

    snakeboard_ctx.font = "50px Arial";
    snakeboard_ctx.fillStyle = 'black';
    snakeboard_ctx.strokestyle = 'black';
    snakeboard_ctx.fillText("Game over!", 20, 60);
    snakeboard_ctx.fillText("Press \"Play\" to play again", 20, 120);
}