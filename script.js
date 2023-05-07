const canvas = document.getElementById("myCanvas");
const c = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = - 2;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let score = 0;
let lives = 3;

let rightPressed = false;
let leftPressed = false;

// Bricks variables
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];
for(let col = 0; col < brickColumnCount; col++) {
    bricks[col] = [];
    for(let row = 0; row < brickRowCount; row++) {
        bricks[col][row] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {

    const relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function keyDownHandler(e) {

    if(e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if(e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {

    if(e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if(e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {

    for(let col = 0; col < brickColumnCount; col++) {
        for(let row = 0; row < brickRowCount; row++) {
            const b = bricks[col][row];
            if(b.status === 1) {
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                dy = -dy;
                b.status = 0;
                score++;
                if(score === brickRowCount * brickColumnCount) {
                    alert("YOU WIN, CONGRATULATIONS!");
                    document.location.reload();
                    }
                }
            }
       }
    }
}

function drawScore() {

    c.font = "16px Arial";
    c.fillStyle = "#0095DD";
    c.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {

    c.font = "16px Arial";
    c.fillStyle = "#0095DD";
    c.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function drawBall() {

    c.beginPath();
    c.arc(x, y, ballRadius, 0, Math.PI * 2);
    c.fillStyle = "#0095DD";
    c.fill();
    c.closePath();
}

function drawPaddle() {

    c.beginPath();
    c.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    c.fillStyle = "#0095DD";
    c.fill();
    c.closePath();
}

function drawBricks() {

    for(let col = 0; col < brickColumnCount; col++) {
        for(let row = 0; row < brickRowCount; row++) {
            if(bricks[col][row].status === 1) {
                const brickX = col * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = row * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[col][row].x = brickX;
                bricks[col][row].y = brickY;
                c.beginPath();
                c.rect(brickX, brickY, brickWidth, brickHeight);
                c.fillStyle = "#0095DD";
                c.fill();
                c.closePath();
            }
       }
    }
}

function draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    // Bouncing the ball
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
    
    // Moving the paddle
    if(rightPressed) {
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
    } else if(leftPressed) {
        paddleX = Math.max(paddleX - 7, 0);
    }
    
    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

draw();