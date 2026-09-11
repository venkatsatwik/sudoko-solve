const grid = document.getElementById("sudoku-grid");
const message = document.getElementById("message");

const solveBtn = document.getElementById("solve-btn");
const hintBtn = document.getElementById("hint-btn");
const clearBtn = document.getElementById("clear-btn");
const exampleBtn = document.getElementById("example-btn");


// Create 81 Sudoku cells

for (let i = 0; i < 81; i++) {

    const input = document.createElement("input");

    input.type = "number";
    input.min = "1";
    input.max = "9";

    input.classList.add("cell");

    input.dataset.index = i;

    grid.appendChild(input);
}


// Get current Sudoku board

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


// Display Sudoku board

function displayBoard(board) {

    const cells = document.querySelectorAll(".cell");

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const index = row * 9 + col;

            cells[index].value =
                board[row][col] === 0
                    ? ""
                    : board[row][col];
        }
    }
}


// Check if a number can be placed

function isValid(board, row, col, number) {

    // Check row

    for (let x = 0; x < 9; x++) {

        if (board[row][x] === number) {
            return false;
        }
    }


    // Check column

    for (let x = 0; x < 9; x++) {

        if (board[x][col] === number) {
            return false;
        }
    }


    // Check 3x3 box

    const startRow = row - row % 3;
    const startCol = col - col % 3;

    for (let i = 0; i < 3; i++) {

        for (let j = 0; j < 3; j++) {

            if (
                board[startRow + i][startCol + j] === number
            ) {
                return false;
            }
        }
    }

    return true;
}


// Sudoku solving algorithm

function solveSudoku(board) {

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            if (board[row][col] === 0) {

                for (let number = 1; number <= 9; number++) {

                    if (isValid(board, row, col, number)) {

                        board[row][col] = number;

                        if (solveSudoku(board)) {
                            return true;
                        }

                        board[row][col] = 0;
                    }
                }

                return false;
            }
        }
    }

    return true;
}


// Solve button

solveBtn.addEventListener("click", () => {

    const board = getBoard();

    const originalBoard = board.map(row => [...row]);

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

        message.textContent =
            "This Sudoku puzzle has no solution.";
    }
});


// Validate initial puzzle

function isInitialBoardValid(board) {

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const number = board[row][col];

            if (number !== 0) {

                board[row][col] = 0;

                const valid =
                    isValid(board, row, col, number);

                board[row][col] = number;

                if (!valid) {
                    return false;
                }
            }
        }
    }

    return true;
}


// Clear button

clearBtn.addEventListener("click", () => {

    const cells = document.querySelectorAll(".cell");

    cells.forEach(cell => {
        cell.value = "";
    });

    message.textContent = "";
});


// Example puzzle

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
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    displayBoard(example);

    message.textContent =
        "Example puzzle loaded.";
});


// Hint button

hintBtn.addEventListener("click", () => {

    const board = getBoard();

    if (!isInitialBoardValid(board)) {

        message.textContent =
            "Fix the invalid numbers first.";

        return;
    }

    const solution = board.map(row => [...row]);

    if (!solveSudoku(solution)) {

        message.textContent =
            "This puzzle cannot be solved.";

        return;
    }


    // Find the first empty cell

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            if (board[row][col] === 0) {

                board[row][col] =
                    solution[row][col];

                displayBoard(board);

                message.textContent =
                    `Hint: Row ${row + 1}, Column ${col + 1}`;

                return;
            }
        }
    }

    message.textContent =
        "The Sudoku is already solved!";
});
