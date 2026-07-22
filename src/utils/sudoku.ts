export type Difficulty = 'easy' | 'medium' | 'hard';
export type BoardOption = number | null;
export type Board = BoardOption[][];

// Helper to create an empty 9x9 board
export const createEmptyBoard = (): Board => Array.from({ length: 9 }, () => Array(9).fill(null));

// Check if placing a number is valid
export const isValidMove = (board: Board, row: number, col: number, num: number): boolean => {
    // Check row
    for (let c = 0; c < 9; c++) {
        if (board[row][c] === num) return false;
    }
    // Check col
    for (let r = 0; r < 9; r++) {
        if (board[r][col] === num) return false;
    }
    // Check 3x3 square
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[startRow + r][startCol + c] === num) return false;
        }
    }
    return true;
};

// Solve board using backtracking
export const solveBoard = (board: Board): boolean => {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === null) {
                // Try filling 1-9 in random order for more varied puzzle generation
                const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                for (const num of nums) {
                    if (isValidMove(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveBoard(board)) {
                            return true;
                        }
                        board[row][col] = null;
                    }
                }
                return false;
            }
        }
    }
    return true;
};

// Generate a completed valid Sudoku board
export const generateCompletedBoard = (): Board => {
    const board = createEmptyBoard();
    solveBoard(board);
    return board;
};

// Generate puzzle based on difficulty
export const generatePuzzle = (difficulty: Difficulty): { initialBoard: Board; solutionBoard: Board } => {
    const solutionBoard = generateCompletedBoard();
    const initialBoard = solutionBoard.map(row => [...row]); // Deep copy of primitive rows is fine

    let cellsToRemove = 0;
    if (difficulty === 'easy') cellsToRemove = 30; // 30 cells removed, 51 given
    else if (difficulty === 'medium') cellsToRemove = 45; // 45 removed, 36 given
    else if (difficulty === 'hard') cellsToRemove = 55; // 55 removed, 26 given

    let removed = 0;
    while (removed < cellsToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (initialBoard[row][col] !== null) {
            initialBoard[row][col] = null;
            removed++;
        }
    }

    return { initialBoard, solutionBoard };
};

export const checkWin = (currentBoard: Board, solutionBoard: Board): boolean => {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (currentBoard[r][c] !== solutionBoard[r][c]) {
                return false;
            }
        }
    }
    return true;
};
