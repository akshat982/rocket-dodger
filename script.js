const game = document.getElementById("game");
const rocket = document.getElementById("rocket");

const scoreText = document.getElementById("score");
const bestText = document.getElementById("best");
const livesText = document.getElementById("lives");

const overlay = document.getElementById("overlay");
const finalScore = document.getElementById("finalScore");
const playAgain = document.getElementById("playAgain");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const pauseBtn = document.getElementById("pauseBtn");

let rocketX = 220;

let score = 0;
let lives = 3;

let paused = false;
let gameEnded = false;

let best = Number(localStorage.getItem("rocketBest")) || 0;

bestText.textContent = "🏆 Best: " + best;

function updateRocket() {
    rocket.style.left = rocketX + "px";
}

updateRocket();

// Keyboard controls
document.addEventListener("keydown", function (e) {

    if (paused || gameEnded) return;

    if (e.key === "ArrowLeft") {
        rocketX = Math.max(0, rocketX - 20);
    }

    if (e.key === "ArrowRight") {
        rocketX = Math.min(game.clientWidth - 50, rocketX + 20);
    }

    updateRocket();

});

// Mobile buttons
leftBtn.onclick = function () {

    if (paused || gameEnded) return;

    rocketX = Math.max(0, rocketX - 20);

    updateRocket();

};

rightBtn.onclick = function () {

    if (paused || gameEnded) return;

    rocketX = Math.min(game.clientWidth - 50, rocketX + 20);

    updateRocket();

};

pauseBtn.onclick = function () {

    paused = !paused;

    pauseBtn.textContent =
        paused ? "▶ Resume" : "⏸ Pause";

};
function updateLives() {

    if (lives === 3) livesText.textContent = "❤️ ❤️ ❤️";
    if (lives === 2) livesText.textContent = "❤️ ❤️";
    if (lives === 1) livesText.textContent = "❤️";
    if (lives <= 0) {

        gameEnded = true;

        if (score > best) {
            best = score;
            localStorage.setItem("rocketBest", best);
            bestText.textContent = "🏆 Best: " + best;
        }

        finalScore.textContent =
            "⭐ Score: " + score + "   🏆 Best: " + best;

        overlay.classList.remove("hidden");
        overlay.style.display ="flex";

    }

}

function createAsteroid() {

    if (paused || gameEnded) return;

    const asteroid = document.createElement("div");

    asteroid.className = "asteroid";
    asteroid.textContent = "☄️";

    asteroid.style.left =
        Math.floor(Math.random() * (game.clientWidth - 40)) + "px";

    asteroid.style.top = "-50px";

    game.appendChild(asteroid);

    let speed = 4 + Math.floor(score / 10);

    const move = setInterval(function () {

        if (paused) return;

        if (gameEnded) {

            clearInterval(move);
            asteroid.remove();
            return;

        }

        asteroid.style.top =
            (asteroid.offsetTop + speed) + "px";

        const r = rocket.getBoundingClientRect();
        const a = asteroid.getBoundingClientRect();

        if (
            r.left < a.right &&
            r.right > a.left &&
            r.top < a.bottom &&
            r.bottom > a.top
        ) {

            clearInterval(move);
            asteroid.remove();

            lives--;

            updateLives();

            return;

        }

        if (asteroid.offsetTop > game.clientHeight) {

            score++;

            scoreText.textContent =
                "⭐ Score: " + score;

            clearInterval(move);

            asteroid.remove();

        }

    }, 25);

}

let asteroidLoop = setInterval(createAsteroid, 900);
// ---------- Play Again ----------

playAgain.onclick = function () {

    // Reset values
    score = 0;
    lives = 3;
    paused = false;
    gameEnded = false;

    scoreText.textContent = "⭐ Score: 0";
    livesText.textContent = "❤️ ❤️ ❤️";

    pauseBtn.textContent = "⏸ Pause";

    rocketX = Math.max(0, Math.floor(game.clientWidth / 2) - 25);
    updateRocket();

    overlay.classList.add("hidden");
    overlay.style.display = "none"

    // Remove old asteroids
    document.querySelectorAll(".asteroid").forEach(function (a) {
        a.remove();
    });

    // Restart asteroid generator
    clearInterval(asteroidLoop);
    asteroidLoop = setInterval(createAsteroid, 900);

};

// ---------- Mobile Drag ----------

let dragging = false;

rocket.addEventListener("touchstart", function () {
    dragging = true;
});

document.addEventListener("touchend", function () {
    dragging = false;
});

game.addEventListener("touchmove", function (e) {

    if (!dragging || paused || gameEnded) return;

    e.preventDefault();

    const rect = game.getBoundingClientRect();

    rocketX = e.touches[0].clientX - rect.left - 25;

    if (rocketX < 0) rocketX = 0;

    if (rocketX > game.clientWidth - 50) {
        rocketX = game.clientWidth - 50;
    }

    updateRocket();

}, { passive: false });

// Start in the middle
rocketX = Math.max(0, Math.floor(game.clientWidth / 2) - 25);
updateRocket();