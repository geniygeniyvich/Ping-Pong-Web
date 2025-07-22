const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const PADDLE_GAP = 30;
const BALL_SIZE = 16;

let leftPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let rightPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let leftScore = 0;
let rightScore = 0;

let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = (Math.random() * 4 - 2);

function resetBall() {
    ballX = WIDTH / 2 - BALL_SIZE / 2;
    ballY = HEIGHT / 2 - BALL_SIZE / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = (Math.random() * 4 - 2);
}


canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    leftPaddleY = mouseY - PADDLE_HEIGHT / 2;

    leftPaddleY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, leftPaddleY));
});


function updateRightPaddle() {
    const paddleCenter = rightPaddleY + PADDLE_HEIGHT / 2;
    if (ballY + BALL_SIZE / 2 < paddleCenter - 20) {
        rightPaddleY -= 5;
    } else if (ballY + BALL_SIZE / 2 > paddleCenter + 20) {
        rightPaddleY += 5;
    }
    rightPaddleY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, rightPaddleY));
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    for(let i = 0; i < HEIGHT; i += 36) {
        ctx.beginPath();
        ctx.moveTo(WIDTH / 2, i);
        ctx.lineTo(WIDTH / 2, i + 16);
        ctx.stroke();
    }
}

function draw() {
    
    drawRect(0, 0, WIDTH, HEIGHT, "#111");
    drawNet();

    drawRect(PADDLE_GAP, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, "#0f0");
    drawRect(WIDTH - PADDLE_WIDTH - PADDLE_GAP, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, "#f00");

    drawCircle(ballX + BALL_SIZE / 2, ballY + BALL_SIZE / 2, BALL_SIZE / 2, "#fff");
}

function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if(ballY <= 0) {
        ballY = 0;
        ballSpeedY = -ballSpeedY;
    }
    if(ballY + BALL_SIZE >= HEIGHT) {
        ballY = HEIGHT - BALL_SIZE;
        ballSpeedY = -ballSpeedY;
    }

    if(ballX <= PADDLE_GAP + PADDLE_WIDTH &&
        ballY + BALL_SIZE > leftPaddleY &&
        ballY < leftPaddleY + PADDLE_HEIGHT &&
        ballX >= PADDLE_GAP) {
        ballX = PADDLE_GAP + PADDLE_WIDTH;
        ballSpeedX = -ballSpeedX;
        let hitPoint = (ballY + BALL_SIZE / 2) - (leftPaddleY + PADDLE_HEIGHT / 2);
        ballSpeedY += hitPoint * 0.07;
    }


    if(ballX + BALL_SIZE >= WIDTH - PADDLE_GAP - PADDLE_WIDTH &&
        ballY + BALL_SIZE > rightPaddleY &&
        ballY < rightPaddleY + PADDLE_HEIGHT &&
        ballX + BALL_SIZE <= WIDTH - PADDLE_GAP) {
        ballX = WIDTH - PADDLE_GAP - PADDLE_WIDTH - BALL_SIZE;
        ballSpeedX = -ballSpeedX;
        let hitPoint = (ballY + BALL_SIZE / 2) - (rightPaddleY + PADDLE_HEIGHT / 2);
        ballSpeedY += hitPoint * 0.07;
    }


    if(ballX < 0) {
        rightScore++;
        document.getElementById('rightScore').textContent = rightScore;
        resetBall();
    }
    if(ballX > WIDTH) {
        leftScore++;
        document.getElementById('leftScore').textContent = leftScore;
        resetBall();
    }
}

function gameLoop() {
    updateBall();
    updateRightPaddle();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize scores
document.getElementById('leftScore').textContent = leftScore;
document.getElementById('rightScore').textContent = rightScore;

// Start game
gameLoop();
