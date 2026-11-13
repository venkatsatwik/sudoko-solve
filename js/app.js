const grid = document.getElementById("sudoku-grid");
const message = document.getElementById("message");

const solveBtn = document.getElementById("solve-btn");
const hintBtn = document.getElementById("hint-btn");
const clearBtn = document.getElementById("clear-btn");
const exampleBtn = document.getElementById("example-btn");

for (let i = 0; i < 81; i++) {
  const input = document.createElement("input");
  input.type = "number";
  input.min = "1";
  input.max = "9";
  input.classList.add("cell");
  input.dataset.index = i;
  grid.appendChild(input);
}

function getBoard() {
  const cells = document.querySelectorAll(".cell");
  const board = [];

  for (let row = 0; row < 9; row++) {
    const currentRow = [];
    for (let col = 0; col < 9; col++) {
      const index = row * 9 + col;
      const value = cells[index].value;
      currentRow.push(value === "" ? 0 : Number(value));
    }
    board.push(currentRow);
  }

  return board;
}

function displayBoard(board) {
  const cells = document.querySelectorAll(".cell");
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const index = row * 9 + col;
      cells[index].value = board[row][col] === 0 ? "" : board[row][col];
    }
  }
}

function isValid(board, row, col, number) {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === number) return false;
  }

  for (let x = 0; x < 9; x++) {
    if (board[x][col] === number) return false;
  }

  const startRow = row - (row % 3);
  const startCol = col - (col % 3);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === number) return false;
    }
  }

  return true;
}

function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isInitialBoardValid(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const number = board[row][col];
      if (number !== 0) {
        board[row][col] = 0;
        const valid = isValid(board, row, col, number);
        board[row][col] = number;
        if (!valid) return false;
      }
    }
  }
  return true;
}

solveBtn.addEventListener("click", () => {
  const board = getBoard();
  const originalBoard = board.map((row) => [...row]);
  message.textContent = "";

  if (!isInitialBoardValid(board)) {
    message.textContent = "Invalid Sudoku puzzle.";
    return;
  }

  if (solveSudoku(board)) {
    displayBoard(board);
    message.textContent = "Sudoku solved successfully!";
  } else {
    displayBoard(originalBoard);
    message.textContent = "This Sudoku puzzle has no solution.";
  }
});

clearBtn.addEventListener("click", () => {
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.value = "";
  });
  message.textContent = "";
});

exampleBtn.addEventListener("click", () => {
  const example = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];

  displayBoard(example);
  message.textContent = "Example puzzle loaded.";
});

hintBtn.addEventListener("click", () => {
  const board = getBoard();

  if (!isInitialBoardValid(board)) {
    message.textContent = "Fix the invalid numbers first.";
    return;
  }

  const solution = board.map((row) => [...row]);

  if (!solveSudoku(solution)) {
    message.textContent = "This puzzle cannot be solved.";
    return;
  }

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        board[row][col] = solution[row][col];
        displayBoard(board);
        message.textContent = `Hint: Row ${row + 1}, Column ${col + 1}`;
        return;
      }
    }
  }

  message.textContent = "The Sudoku is already solved!";
});
