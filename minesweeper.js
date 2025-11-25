// --- Налаштування гри ---
const ROWS = 8;
const COLS = 8;
const MINES = 10;

let board = [];
let revealedCount = 0;
let flagsLeft = MINES;
let timer = 0;
let timerInterval = null;
let gameOver = false;

const gameBoard = document.getElementById('gameBoard');
const timerEl = document.getElementById('timer');
const flagsCountEl = document.getElementById('flagsCount');
const restartBtn = document.getElementById('restartBtn');

// --- Генерація поля ---
function initBoard() {
    board = Array.from({ length: ROWS }, () =>
        Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, count: 0 }))
    );

    // Встановлення мін
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
        let r = Math.floor(Math.random() * ROWS);
        let c = Math.floor(Math.random() * COLS);
        if (!board[r][c].mine) {
            board[r][c].mine = true;
            minesPlaced++;
        }
    }

    // Обчислення сусідів
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (!board[r][c].mine) {
                board[r][c].count = countMines(r, c);
            }
        }
    }

    revealedCount = 0;
    flagsLeft = MINES;
    flagsCountEl.textContent = flagsLeft;
    timer = 0;
    timerEl.textContent = timer;
    gameOver = false;

    renderBoard();
}

// --- Підрахунок сусідніх мін ---
function countMines(r, c) {
    let count = 0;
    for (let i = r - 1; i <= r + 1; i++) {
        for (let j = c - 1; j <= c + 1; j++) {
            if (i >= 0 && i < ROWS && j >= 0 && j < COLS && board[i][j].mine) {
                count++;
            }
        }
    }
    return count;
}

// --- Рендеринг поля ---
function renderBoard() {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateRows = `repeat(${ROWS}, 30px)`;
    gameBoard.style.gridTemplateColumns = `repeat(${COLS}, 30px)`;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cellEl = document.createElement('div');
            cellEl.classList.add('cell');
            cellEl.dataset.row = r;
            cellEl.dataset.col = c;

            const cell = board[r][c];

            if (cell.revealed) {
                cellEl.classList.add('revealed');
                if (cell.mine) {
                    cellEl.textContent = '💣';
                    cellEl.classList.add('mine');
                } else if (cell.count > 0) {
                    cellEl.textContent = cell.count;
                    cellEl.dataset.count = cell.count; // для кольору цифр
                }
            } else if (cell.flagged) {
                cellEl.classList.add('flagged');
                cellEl.textContent = '🚩';
            }

            gameBoard.appendChild(cellEl);
        }
    }
}

// --- Обробка кліків ---
gameBoard.addEventListener('click', (e) => {
    if (gameOver) return;
    const cell = e.target;
    const r = +cell.dataset.row;
    const c = +cell.dataset.col;
    if (!board[r][c].revealed && !board[r][c].flagged) {
        revealCell(r, c);
        checkWin();
    }
});

gameBoard.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (gameOver) return;
    const cell = e.target;
    const r = +cell.dataset.row;
    const c = +cell.dataset.col;
    toggleFlag(r, c);
});

// --- Відкриття клітинки ---
function revealCell(r, c) {
    const cell = board[r][c];
    if (cell.revealed || cell.flagged) return;
    cell.revealed = true;
    revealedCount++;

    if (cell.mine) {
        gameOver = true;
        clearInterval(timerInterval);
        revealAllMines();
        alert('💥 Ви програли!');
        restartBtn.textContent = '😵';
    } else if (cell.count === 0) {
        // Рекурсивне відкриття порожніх клітинок
        for (let i = r - 1; i <= r + 1; i++) {
            for (let j = c - 1; j <= c + 1; j++) {
                if (i >= 0 && i < ROWS && j >= 0 && j < COLS) {
                    revealCell(i, j);
                }
            }
        }
    }

    renderBoard();
}

// --- Встановлення/зняття прапорця ---
function toggleFlag(r, c) {
    const cell = board[r][c];
    if (cell.revealed) return;
    if (cell.flagged) {
        cell.flagged = false;
        flagsLeft++;
    } else if (flagsLeft > 0) {
        cell.flagged = true;
        flagsLeft--;
    }
    flagsCountEl.textContent = flagsLeft;
    renderBoard();
}

// --- Перевірка виграшу ---
function checkWin() {
    if (revealedCount === ROWS * COLS - MINES) {
        gameOver = true;
        clearInterval(timerInterval);
        alert('🏆 Ви виграли!');
        restartBtn.textContent = '😎';
    }
}

// --- Відкриття всіх мін після поразки ---
function revealAllMines() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c].mine) {
                board[r][c].revealed = true;
            }
        }
    }
    renderBoard();
}

// --- Таймер ---
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer++;
        timerEl.textContent = timer;
    }, 1000);
}

// --- Кнопка рестарту ---
restartBtn.addEventListener('click', () => {
    initBoard();
    startTimer();
    restartBtn.textContent = '🙂';
});

// --- Старт гри при завантаженні ---
initBoard();
startTimer();
