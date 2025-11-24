const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 패들 설정
const paddle = {
    width: 75,
    height: 10,
    x: canvas.width / 2 - 75 / 2,
    speed: 7,
    dx: 0,
};

// 공 설정
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 8,
    dx: 3,
    dy: -3,
};

// 패들 움직임
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") paddle.dx = paddle.speed;
    else if (e.key === "ArrowLeft") paddle.dx = -paddle.speed;
});
document.addEventListener("keyup", () => (paddle.dx = 0));

/* -----------------------------
    벽돌 관련 설정
------------------------------ */
const brick = {
    rowCount: 5,
    columnCount: 7,
    width: 55,
    height: 20,
    padding: 10,
    offsetTop: 30,
    offsetLeft: 20,
};

// 벽돌 배열 만들기
let bricks = [];
for (let r = 0; r < brick.rowCount; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.columnCount; c++) {
        bricks[r][c] = { x: 0, y: 0, visible: true };
    }
}

// 벽돌 그리기 함수
function drawBricks() {
    for (let r = 0; r < brick.rowCount; r++) {
        for (let c = 0; c < brick.columnCount; c++) {
            if (bricks[r][c].visible) {
                const x = c * (brick.width + brick.padding) + brick.offsetLeft;
                const y = r * (brick.height + brick.padding) + brick.offsetTop;

                bricks[r][c].x = x;
                bricks[r][c].y = y;

                ctx.fillStyle = "#4caf50";
                ctx.fillRect(x, y, brick.width, brick.height);
            }
        }
    }
}

/* -----------------------------
    공 & 벽돌 충돌 체크
------------------------------ */
function collisionBrick() {
    for (let r = 0; r < brick.rowCount; r++) {
        for (let c = 0; c < brick.columnCount; c++) {
            const b = bricks[r][c];

            if (b.visible) {
                // 충돌 체크
                if (
                    ball.x > b.x &&
                    ball.x < b.x + brick.width &&
                    ball.y > b.y &&
                    ball.y < b.y + brick.height
                ) {
                    ball.dy *= -1; // 공 반전
                    b.visible = false; // 벽돌 제거
                }
            }
        }
    }
}

/* -----------------------------
              업데이트
------------------------------ */
let isGameOver = false;

function update() {
    if (isGameOver) return; // 이미 게임오버면 더 이상 업데이트 X

    paddle.x += paddle.dx;

    ball.x += ball.dx;
    ball.y += ball.dy;

    // 벽 충돌
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
        ball.dx *= -1;
    }
    if (ball.y < ball.radius) {
        ball.dy *= -1;
    }

    // 패들 충돌
    if (
        ball.y > canvas.height - paddle.height - 20 &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        ball.dy *= -1;
    }

    // 벽돌 충돌
    collisionBrick();

    // 🔥 바닥 충돌 = 게임 오버
    if (ball.y > canvas.height) {
        isGameOver = true;
        alert("GAME OVER");
        document.location.reload();
    }
}


/* 그리기 */

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(); // 패들
    drawBall(); // 공
    drawBricks(); // 벽돌
}

// 패들 그리기
function drawPaddle() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(
        paddle.x,
        canvas.height - paddle.height - 10,
        paddle.width,
        paddle.height
    );
}

// 공 그리기
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

/* 게임 루프 */
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
