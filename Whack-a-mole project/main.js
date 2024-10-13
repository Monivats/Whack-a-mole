const cursor = document.querySelector('.cursor');
const holes = [...document.querySelectorAll('.hole')];// all the holes are stored in this
const scoreEl = document.querySelector('.score h3')
const gameOverEl = document.querySelector('.game-over');
const finalScoreEl = document.querySelector('.final-score');
const restartButton = document.querySelector('.restart');
const gamePausedEl = document.querySelector('.game-paused');

let gamePaused = false;
let currentTimer = null;
let gameRunning = true;
let score=0;
let difficulty = 'easy'; 
const sound = new Audio('smash.mp3');
const sound2 = new Audio('bomb.mp3');

function setDifficulty() {
    const radios = document.getElementsByName('difficulty');
    for (const radio of radios) {
        if (radio.checked) {
            difficulty = radio.value;
            break;
        }
    }
}

function getMoleSpeed() {
    switch (difficulty) {
        case 'medium':
            return 1200; // Medium speed
        case 'hard':
            return 1000; // Fast speed
        default:
            return 1500; // Slow speed
    }
}

function run(){
    if (gamePaused || !gameRunning) return;
    setDifficulty();

    const i = Math.floor(Math.random() * holes.length); //random appearance of mole
    const hole = holes[i];
    let timer = null;

    const isBomb = Math.random() < 0.2; // 20% chance for a bomb
    const img = document.createElement('img');
    img.classList.add(isBomb ? 'bomb' : 'mole');
    img.src = isBomb ? 'bomb.png' : 'mole.png';


    img.addEventListener('click', ()=>{
        if (isBomb) {
            sound2.play();
            gameRunning = false; // Stop the game
            finalScoreEl.textContent = score;
            gameOverEl.classList.add('show');
            return;
        }
        score += 10;
        sound.play();
        img.src = 'smashed-mole.png';
        scoreEl.textContent = score;

       setTimeout(() => {
                    hole.removeChild(img);
                    if (gameRunning) {
                        run(); // Spawn another mole or bomb
                    }
                }, 500); // Time to display the smashed mole
            });
    currentTimer = timer;

    hole.appendChild(img);

    timer = setTimeout(() => {
        hole.removeChild(img);
        if (gameRunning) {
            run(); // Spawn another mole or bomb
        }
    }, getMoleSpeed()); // Adjust speed based on difficulty

    
}
run();

window.addEventListener('mousemove', e => {
    cursor.style.top = e.pageY + 'px';
    cursor.style.left = e.pageX + 'px';
});

window.addEventListener('mousedown', () => {
    cursor.classList.add('active');
});

window.addEventListener('mouseup', () => {
    cursor.classList.remove('active');
});

window.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        gamePaused = !gamePaused; // Toggle pause/resume
        if (gamePaused) {
            clearTimeout(currentTimer); // Stop the current timer
            gamePausedEl.classList.add('show'); // Show the paused screen
        } else {
            gamePausedEl.classList.remove('show'); // Hide the paused screen
            run(); // Resume the game
        }
    }
});

restartButton.addEventListener('click', () => {
    gameRunning = true; // Restart the game
    score = 0;
    scoreEl.textContent = score; // Reset the score display
    gameOverEl.classList.remove('show');
    gamePaused = false;
    setDifficulty(); // Hide the game over screen
    run(); // Start the game again
});

