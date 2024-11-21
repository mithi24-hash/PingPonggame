// script.js

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas and game settings
canvas.width = 800;
canvas.height = 400;

// Game elements
const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 15;
let playerScore = 0;
let aiScore = 0;
let maxScore = 10;

// Player paddle
const playerPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 5,
    dy: 0
};

// AI paddle
const aiPaddle = {
    x: canvas.width - 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 4
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 4,
    dy: 4,
    speed: 4
};

// Controls
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") playerPaddle.dy = -playerPaddle.speed;
    if (e.key === "ArrowDown") playerPaddle.dy = playerPaddle.speed;
});

window.addEventListener("keyup", () => {
    playerPaddle.dy = 0;
});

// Draw the background
function drawBackground() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setLineDash([5, 15]);
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
}

// Draw the paddles
function drawPaddle(paddle) {
    ctx.fillStyle = "white";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw the ball
function drawBall() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

// Draw the score
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Player: ${playerScore}`, 20, 30);
    ctx.fillText(`AI: ${aiScore}`, canvas.width - 100, 30);
}

// Update player paddle position
function updatePlayerPaddle() {
    playerPaddle.y += playerPaddle.dy;
    if (playerPaddle.y < 0) playerPaddle.y = 0;
    if (playerPaddle.y + paddleHeight > canvas.height) {
        playerPaddle.y = canvas.height - paddleHeight;
    }
}

// Update AI paddle position
function updateAIPaddle() {
    if (ball.y < aiPaddle.y + paddleHeight / 2) {
        aiPaddle.y -= aiPaddle.speed;
    } else {
        aiPaddle.y += aiPaddle.speed;
    }

    if (aiPaddle.y < 0) aiPaddle.y = 0;
    if (aiPaddle.y + paddleHeight > canvas.height) {
        aiPaddle.y = canvas.height - paddleHeight;
    }
}

// Update ball position and check for collisions
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Collision with walls
    if (ball.y - ballRadius < 0 || ball.y + ballRadius > canvas.height) {
        ball.dy *= -1; // Reverse direction
    }

    // Collision with player paddle
    if (
        ball.x - ballRadius < playerPaddle.x + playerPaddle.width &&
        ball.y > playerPaddle.y &&
        ball.y < playerPaddle.y + playerPaddle.height
    ) {
        ball.dx *= -1;
        ball.speed += 0.5; // Increase ball speed
    }

    // Collision with AI paddle
    if (
        ball.x + ballRadius > aiPaddle.x &&
        ball.y > aiPaddle.y &&
        ball.y < aiPaddle.y + aiPaddle.height
    ) {
        ball.dx *= -1;
        ball.speed += 0.5; // Increase ball speed
    }

    // Score points
    if (ball.x + ballRadius < 0) {
        aiScore++;
        resetBall();
    }
    if (ball.x - ballRadius > canvas.width) {
        playerScore++;
        resetBall();
    }
}

// Reset ball to the center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
    ball.speed = 4; // Reset ball speed
}

// Draw the game elements
function draw() {
    drawBackground();
    drawPaddle(playerPaddle);
    drawPaddle(aiPaddle);
    drawBall();
    drawScore();
}

// Update game elements
function update() {
    updatePlayerPaddle();
    updateAIPaddle();
    updateBall();
}

// Game loop
function gameLoop() {
    if (playerScore >= maxScore || aiScore >= maxScore) {
        endGame();
        return;
    }
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

// Start the game
function startGame() {
    document.getElementById("start-screen").style.display = "none";
    gameLoop();
}

// End the game
function endGame() {
    document.getElementById("game-over-screen").style.display = "block";
    document.getElementById("final-score").textContent = playerScore;
}

// Restart the game
function restartGame() {
    playerScore = 0;
    aiScore = 0;
    resetBall();
    document.getElementById("game-over-screen").style.display = "none";
    gameLoop();
}

// Event listeners for buttons
document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("restart-button").addEventListener("click", restartGame);
