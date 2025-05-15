"use strict";
//------------------------------------------------------------------------------------------
//----------- Import modules, mjs files  ---------------------------------------------------
//------------------------------------------------------------------------------------------
import libSprite from "../../common/libs/libSprite_v2.mjs";
import lib2D from "../../common/libs/lib2d_v2.mjs";
import { GameProps, SheetData } from "./game.mjs"
import { GameBoardSize, TBoardCell, EBoardCellInfoType } from "./gameBoard.mjs";

//------------------------------------------------------------------------------------------
//----------- Classes ---------------------------------------------------------------------
//------------------------------------------------------------------------------------------
export class TBait extends libSprite.TSprite {
  constructor(aSpriteCanvas) {
    // Initialize the bait at a random position
    const pos = new lib2D.TPoint(0, 0);
    super(aSpriteCanvas, SheetData.Bait, pos);
    this.boardCell = new TBoardCell(0, 0);
    this.alpha = 1; // Ensure bait is fully visible
    this.update(); // Position the bait
  }

  update() {
    // Find an empty cell to place the bait
    let emptyCells = [];
    
    // Collect all empty cells on the game board
    for (let row = 0; row < GameBoardSize.Rows; row++) {
      for (let col = 0; col < GameBoardSize.Cols; col++) {
        if (GameProps.gameBoard.getCell(row, col).infoType === EBoardCellInfoType.Empty) {
          emptyCells.push(new TBoardCell(col, row));
        }
      }
    }
    
    // If there are empty cells, randomly choose one
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      this.boardCell = emptyCells[randomIndex];
      
      // Update the bait's position
      this.x = this.boardCell.col * this.spi.width;
      this.y = this.boardCell.row * this.spi.height;
      
      // Mark the cell as containing bait
      GameProps.gameBoard.getCell(this.boardCell.row, this.boardCell.col).infoType = EBoardCellInfoType.Bait;
      
      // Make sure bait is fully visible
      this.alpha = 1;
      
      console.log("Bait positioned at:", this.boardCell.row, this.boardCell.col, "with alpha:", this.alpha);
    } else {
      console.log("No empty cells available for bait placement!");
      // Game is over or board is full
    }
  }

  draw() {
    // Ensure the bait is fully visible before drawing
    this.alpha = 1;
    super.draw();
  }
}