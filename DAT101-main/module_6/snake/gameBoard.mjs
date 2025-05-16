"use strict";
//------------------------------------------------------------------------------------------
//----------- variables and objects --------------------------------------------------------
//------------------------------------------------------------------------------------------
export const EBoardCellInfoType = { Empty: 0, Snake: 1, Bait: 2 };
export const GameBoardSize = { Rows: 18, Cols: 24 }; // Adjust these values as needed

//------------------------------------------------------------------------------------------
//----------- Classes ---------------------------------------------------------------------
//------------------------------------------------------------------------------------------
export class TBoardCell {
  constructor(aCol, aRow) {
    this.col = aCol;
    this.row = aRow;
  }
}

class TBoardCellInfo {
  constructor() {
    this.infoType = EBoardCellInfoType.Empty;
    this.direction = 1; // Default direction (Right)
    this.alpha = 1.0; // Add alpha property to track visibility
  }
}

export class TGameBoard {
  #board = [];
  
  constructor() {
    this.rows = GameBoardSize.Rows;
    this.cols = GameBoardSize.Cols;
    
    // Initialize the game board with empty cells
    for (let row = 0; row < this.rows; row++) {
      this.#board[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.#board[row][col] = new TBoardCellInfo();
      }
    }
    
    console.log("Game board initialized with size:", this.rows, "rows x", this.cols, "columns");
  }
  
  getCell(aRow, aCol) {
    // Boundary check
    if (aRow >= 0 && aRow < this.rows && aCol >= 0 && aCol < this.cols) {
      return this.#board[aRow][aCol];
    }
    
    // Return a new cell if out of bounds (for safer handling)
    console.warn("Attempted to access cell outside board boundaries:", aRow, aCol);
    return new TBoardCellInfo();
  }
  
  resetBoard() {
    // Reset all cells to empty
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.#board[row][col].infoType = EBoardCellInfoType.Empty;
        this.#board[row][col].direction = 1; // Reset to default direction
        this.#board[row][col].alpha = 1.0; // Reset alpha to full visibility
      }
    }
    
    console.log("Game board has been reset");
  }
}