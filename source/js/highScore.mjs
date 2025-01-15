let highScore = localStorage.getItem("highScore") || 0;

export function setHighScore(score) {
    if (score <= highScore) return;
    highScore = score;
    localStorage.setItem("highScore", score);
}

export function getHighScore() {
    return highScore;
}
