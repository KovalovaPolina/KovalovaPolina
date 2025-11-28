export function createBoard(rows, cols, mines) {
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, revealed: false, flagged: false, count: 0 }))
  );

  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].mine) { board[r][c].mine = true; placed++; }
  }

  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (!board[r][c].mine)
        board[r][c].count = [-1,0,1].flatMap(di => [-1,0,1].map(dj => [r+di, c+dj]))
          .filter(([i,j]) => i>=0 && i<rows && j>=0 && j<cols)
          .map(([i,j]) => board[i][j].mine ? 1 : 0)
          .reduce((a,b)=>a+b,0);

  return board;
}
