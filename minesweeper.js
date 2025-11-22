// ================================
// 1. Структура клітинки
// ================================
function createCell(hasMine = false, neighborMines = 0, state = "closed") {
    return {
        hasMine,          // булеве значення (true/false)
        neighborMines,    // кількість сусідніх мін
        state             // "closed", "open", "flagged"
    };
}

// ================================
// 2. Структура ігрового поля
// ================================
function createEmptyBoard(rows, cols) {
    const board = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push(createCell());
        }
        board.push(row);
    }
    return board;
}

// ================================
// 3. Структура стану гри
// ================================
function createGameState(rows, cols, mines) {
    return {
        rows,               // розмірність
        cols,
        mineCount: mines,   // кількість мін
        status: "inProgress", // можливі значення: "inProgress", "won", "lost"
        board: createEmptyBoard(rows, cols)
    };
}

// ================================
// 4. Тестове ігрове поле (приклад)
// ================================
const testBoard = [
    [
        createCell(false, 1, "closed"),
        createCell(true,  0, "closed"),
        createCell(false, 1, "closed")
    ],
    [
        createCell(false, 1, "closed"),
        createCell(false, 2, "closed"),
        createCell(true,  0, "closed")
    ],
    [
        createCell(false, 0, "closed"),
        createCell(false, 1, "closed"),
        createCell(false, 1, "closed")
    ]
];

const testGame = {
    rows: 3,
    cols: 3,
    mineCount: 2,
    status: "inProgress",
    board: testBoard
};

// ================================
// Виведення результату
// ================================
console.log("Тестовий стан гри:");
console.log(testGame);

console.log("Відображення поля:");
testGame.board.forEach(row => {
    console.log(row.map(cell => cell.hasMine ? "💣" : cell.neighborMines).join(" "));
});
