// ===============================
//  Стани клітинок
// ===============================
const CELL_STATE = {
    CLOSED: "closed",
    OPENED: "opened",
    FLAGGED: "flagged"
};

// ===============================
//  Стани гри
// ===============================
const GAME_STATE = {
    PLAYING: "playing",
    WON: "won",
    LOST: "lost"
};

// ===============================
//  Структура гри
// ===============================
let game = {
    rows: 8,
    cols: 8,
    mines: 10,
    state: GAME_STATE.PLAYING,
    field: []
};

// ===============================
//  Створення пустого поля
// ===============================
function createEmptyField(rows, cols) {
    const field = [];

    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push({
                hasMine: false,
                adjacentMines: 0,
                state: CELL_STATE.CLOSED
            });
        }
        field.push(row);
    }

    return field;
}

// ===============================
//  Розставлення мін
// ===============================
function placeMines(field, minesCount) {
    const rows = field.length;
    const cols = field[0].length;
    let placed = 0;

    while (placed < minesCount) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        if (!field[r][c].hasMine) {
            field[r][c].hasMine = true;
            placed++;
        }
    }
}

// ===============================
//  Підрахунок сусідніх мін
// ===============================
function countAdjacentMines(field) {
    const dirs = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    for (let r = 0; r < field.length; r++) {
        for (let c = 0; c < field[0].length; c++) {

            let count = 0;

            dirs.forEach(([dr, dc]) => {
                const nr = r + dr;
                const nc = c + dc;

                if (nr >= 0 && nr < field.length && nc >= 0 && nc < field[0].length) {
                    if (field[nr][nc].hasMine) count++;
                }
            });

            field[r][c].adjacentMines = count;
        }
    }
}

// ===============================
//  Створення HTML-поля
// ===============================
function renderBoard() {
    const board = document.getElementById("gameBoard");
    board.innerHTML = "";

    for (let r = 0; r < game.rows; r++) {
        for (let c = 0; c < game.cols; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.r = r;
            cell.dataset.c = c;

            board.appendChild(cell);
        }
    }
}

// ===============================
//  Ініціалізація гри
// ===============================
function initGame() {
    game.field = createEmptyField(game.rows, game.cols);
    placeMines(game.field, game.mines);
    countAdjacentMines(game.field);

    console.log("Ігрове поле:", game.field);

    renderBoard();
}

initGame();
