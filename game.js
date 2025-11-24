/*
    1. Canvas 생성
    2. Paddle, Ball 객체 만들기
    3. Brick 배열 생성
    4. 게임 루프 시작 (update + draw)
    5. 충돌 감지
        - 화면 벽
        - 패들
        - 벽돌
    6. 벽돌 사라지면 점수 증가
    7. 공을 놓치면 life 감소
    8. 벽돌 다 깨면 다음 스테이지 or clear
*/

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

// dx, dy란
/*
    ball.dx = 3 → 오른쪽으로 3씩 이동
    ball.dx = -3 → 왼쪽으로 3씩 이동
    
    ball.dy = -3 → 위쪽으로 3씩 이동
    ball.dy = +3 → 아래쪽으로 3씩 이동
*/

// 패들 움직임
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") paddle.dx = paddle.speed;
    else if (e.key === "ArrowLeft") paddle.dx = -paddle.speed;
});
document.addEventListener("keyup", () => (paddle.dx = 0));

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

// 업데이트
function update() {
    paddle.x += paddle.dx;

    // 벽 충돌
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width)
        paddle.x = canvas.width - paddle.width;

    ball.x += ball.dx;
    ball.y += ball.dy;

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

    // 바닥 충돌 = 실패
    if (ball.y > canvas.height) {
        alert("GAME OVER");
        document.location.reload();
    }
}

// 그리기
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
}

// 루프
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
