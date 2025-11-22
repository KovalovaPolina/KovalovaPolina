// =======================
// СТАН ГРИ
// =======================
const game = {
    rows: 0,
    cols: 0,
    mines: 0,
    field: [],
    isGameOver: false,
    status: "in_progress", // in_progress | win | lose
    timer: null,
    seconds: 0
};

// =======================
// ТАЙМЕР
// =======================
function startTimer() {
    if (game.timer) return;

    game.timer = setInterval(() => {
        game.seconds++;
        console.log("Секунди:", game.seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(game.timer);
    game.timer = null;
    console.log("Таймер зупинено. Загальний час:", game.seconds);
}

// =======================
// ГЕНЕРАЦІЯ ПОЛЯ
// =======================
function generateField(rows, cols, mines) {
    game.rows = rows;
    game.cols = cols;
    game.mines = mines;
    game.seconds = 0;
    game.status = "in_progress";
    game.isGameOver = false;

    // Створюємо порожнє поле
    const field = [];
    for (let r = 0; r < rows; r++) {
        field[r] = [];
        for (let c = 0; c < cols; c++) {
            field[r][c] = {
                hasMine: false,
                neighbourMines: 0,
                isOpen: false,
                isFlagged: false
            };
        }
    }

    // Розставляємо міни
    let placed = 0;
    while (placed < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        if (!field[r][c].hasMine) {
            field[r][c].hasMine = true;
            placed++;
        }
    }

    // Підрахунок сусідніх мін
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            field[r][c].neighbourMines = countNeighbourMines(field, r, c);
        }
    }

    game.field = field;
    startTimer();
    console.log("Поле згенеровано:");
    console.table(field);
    return field;
}

// =======================
// ПІДРАХУНОК СУСІДНІХ МІН
// =======================
function countNeighbourMines(field, row, col) {
    const dirs = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0],  [1, 1]
    ];

    let count = 0;

    for (const [dr, dc] of dirs) {
        const r = row + dr;
        const c = col + dc;

        if (r >= 0 && r < game.rows && c >= 0 && c < game.cols) {
            if (field[r][c].hasMine) count++;
        }
    }

    return count;
}

// =======================
// ВІДКРИТТЯ КЛІТИНКИ
// =======================
function openCell(row, col) {
    if (game.isGameOver) return;
    const cell = game.field[row][col];

    if (cell.isOpen || cell.isFlagged) return;

    cell.isOpen = true;

    if (cell.hasMine) {
        game.status = "lose";
        game.isGameOver = true;
        stopTimer();
        console.log("💥 Ви підірвалися! Програш.");
        return;
    }

    // Якщо 0 — відкриваємо сусідів
    if (cell.neighbourMines === 0) {
        const dirs = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],          [0, 1],
            [1, -1], [1, 0],  [1, 1]
        ];

        for (const [dr, dc] of dirs) {
            const r = row + dr;
            const c = col + dc;

            if (r >= 0 && r < game.rows && c >= 0 && c < game.cols) {
                if (!game.field[r][c].isOpen) {
                    openCell(r, c);
                }
            }
        }
    }

    console.table(game.field);
}

// =======================
// ПРАПОРЕЦЬ
// =======================
function toggleFlag(row, col) {
    if (game.isGameOver) return;

    const cell = game.field[row][col];
    if (cell.isOpen) return;

    cell.isFlagged = !cell.isFlagged;

    console.log(`Прапорець ${cell.isFlagged ? "поставлено" : "знято"} на (${row}, ${col})`);
    console.table(game.field);
}

// ===================================================
// ============= ТЕСТОВІ ВИКЛИКИ =====================
// ===================================================

console.log("=== Старт гри ===");
generateField(5, 5, 5);

// Перевірка окремих функцій
console.log("Міни навколо (2,2):", countNeighbourMines(game.field, 2, 2));

toggleFlag(1, 1);
openCell(2, 2);
openCell(0, 0);
