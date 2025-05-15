"use strict";
//------------------------------------------------------------------------------------------
//----------- Import modules, mjs files  ---------------------------------------------------
//------------------------------------------------------------------------------------------
import libSprite from "../../common/libs/libSprite_v2.mjs";
import lib2D from "../../common/libs/lib2d_v2.mjs";
import { GameProps, SheetData, bateIsEaten } from "./game.mjs"
import { TBoardCell, EBoardCellInfoType } from "./gameBoard.mjs";

//------------------------------------------------------------------------------------------
//----------- variables and object ---------------------------------------------------------
//------------------------------------------------------------------------------------------
const ESpriteIndex = {UR: 0, LD: 0, RU: 1, DR: 1, DL: 2, LU: 2, RD: 3, UL: 3, RL: 4, UD: 5};
export const EDirection = { Up: 0, Right: 1, Left: 2, Down: 3 };


//-----------------------------------------------------------------------------------------
//----------- Classes ---------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
class TSnakePart extends libSprite.TSprite {
  constructor(aSpriteCanvas, aSpriteInfo, aBoardCell) {
    const pos = new lib2D.TPoint(aBoardCell.col * aSpriteInfo.width, aBoardCell.row * aSpriteInfo.height);
    super(aSpriteCanvas, aSpriteInfo, pos);
    this.boardCell = aBoardCell;
    let boardCellInfo = GameProps.gameBoard.getCell(aBoardCell.row, aBoardCell.col);
    this.direction = boardCellInfo.direction;
    boardCellInfo.infoType = EBoardCellInfoType.Snake;
    this.index = this.direction;
    
    // Ensure visibility
    this.visible = true;
    this.alpha = 1;
  }

  update(){
    this.x = this.boardCell.col * this.spi.width;
    this.y = this.boardCell.row * this.spi.height;
  }
} // class TSnakePart


class TSnakeHead extends TSnakePart {
  constructor(aSpriteCanvas, aBoardCell) {
    super(aSpriteCanvas, SheetData.Head, aBoardCell);
    this.newDirection = this.direction;
  }

  setDirection(aDirection) {
    if ((this.direction === EDirection.Right || this.direction === EDirection.Left) && 
        (aDirection === EDirection.Up || aDirection === EDirection.Down)) {
      this.newDirection = aDirection;
    } else if ((this.direction === EDirection.Up || this.direction === EDirection.Down) && 
               (aDirection === EDirection.Right || aDirection === EDirection.Left)) {
      this.newDirection = aDirection;
    }
  }

  update(){
    GameProps.gameBoard.getCell(this.boardCell.row, this.boardCell.col).direction = this.newDirection;
    switch (this.newDirection) {
      case EDirection.Up:
        this.boardCell.row--;
        break;
      case EDirection.Right:
        this.boardCell.col++;
        break;
      case EDirection.Left:
        this.boardCell.col--;
        break;
      case EDirection.Down:
        this.boardCell.row++;
        break;
    }
    this.direction = this.newDirection;
    this.index = this.direction;
    if (this.checkCollision()) {
      return false; // Collision detected, do not continue
    }
    // Update the position of the snake element
    super.update();
    
    // Check if the snake head is on a bait cell
    const boardCellInfo = GameProps.gameBoard.getCell(this.boardCell.row, this.boardCell.col);
    if(boardCellInfo.infoType === EBoardCellInfoType.Bait) {
      bateIsEaten();
    }
    boardCellInfo.infoType = EBoardCellInfoType.Snake; // Set the cell to Snake
    return true; // No collision, continue
  }

  checkCollision() {
    // Check if the head is outside the game board
    let collision = this.boardCell.row < 0 || 
                    this.boardCell.row >= GameProps.gameBoard.rows || 
                    this.boardCell.col < 0 || 
                    this.boardCell.col >= GameProps.gameBoard.cols;
    
    // Also check if the head collides with the snake's body
    if(!collision) {
      const boardCellInfo = GameProps.gameBoard.getCell(this.boardCell.row, this.boardCell.col);
      collision = boardCellInfo.infoType === EBoardCellInfoType.Snake;
    }
    return collision;
  }
} // class TSnakeHead


class TSnakeBody extends TSnakePart {
  constructor(aSpriteCanvas, aBoardCell) {
    super(aSpriteCanvas, SheetData.Body, aBoardCell);
    
    // Default to horizontal body segment
    this.index = ESpriteIndex.RL;
    
    // CRITICAL: Ensure visibility is explicitly set
    this.visible = true;
    this.alpha = 1;
    
    console.log(`Creating body segment at col=${aBoardCell.col}, row=${aBoardCell.row}`);
  }

  update(){
    console.log(`Updating body at (${this.boardCell.col}, ${this.boardCell.row}) with direction ${this.direction}`);
    
    let spriteIndex = ESpriteIndex.RL;
    let boardCellInfo;
    
    // Store old position for reference
    const oldCol = this.boardCell.col;
    const oldRow = this.boardCell.row;
    
    switch (this.direction) {
      case EDirection.Up:
        this.boardCell.row--;
        boardCellInfo = GameProps.gameBoard.getCell(this.boardCell.row, this.boardCell.col);
        if (boardCellInfo.direction !== this.direction) {
          switch (boardCellInfo.direction) {
            case EDirection.Left:
              spriteIndex = ESpriteIndex.UL;
              break;
            case EDirection.Right:
              spriteIndex = ESpriteIndex.UR;
              break;
          }
        } else {
          spriteIndex = ESpriteIndex.UD;
        }
        break;
      case EDirection.Right:
        this.boardCell.col++;
        boardCellInfo = GameProps.gameBoard.getCell(this.boardCell.row, this.boardCell.col);
        if (boardCellInfo.direction !== this.direction) {
          switch (boardCellInfo.direction) {
            case EDirection.Up:
              spriteIndex = ESpriteIndex.RU;
              break;
            case EDirection.Down:
              spriteIndex = ESpriteIndex.RD;
              break;
          }
        } else {
          spriteIndex = ESpriteIndex.RL;
        }
        break;
      case EDirection.Left:
        this.boardCell.col--;
        boardCellInfo = GameProps.gameBoard.getCell(this.boardCell.row, this.boardCell.col);
        if (boardCellInfo.direction !== this.direction) {
          switch (boardCellInfo.direction) {
            case EDirection.Up:
              spriteIndex = ESpriteIndex.LU;
              break;
            case EDirection.Down:
              spriteIndex = ESpriteIndex.LD;
              break;
          }
        } else {
          spriteIndex = ESpriteIndex.RL;
        }
        break;
      case EDirection.Down:
        this.boardCell.row++;
        boardCellInfo = GameProps.gameBoard.getCell(this.boardCell.row, this.boardCell.col);
        if (boardCellInfo.direction !== this.direction) {
          switch (boardCellInfo.direction) {
            case EDirection.Left:
              spriteIndex = ESpriteIndex.DR;
              break;
            case EDirection.Right:
              spriteIndex = ESpriteIndex.DL;
              break;
          }
        } else {
          spriteIndex = ESpriteIndex.UD;
        }
        break;
    }
    
    // Mark the new cell as occupied by snake
    GameProps.gameBoard.getCell(this.boardCell.row, this.boardCell.col).infoType = EBoardCellInfoType.Snake;
    
    this.direction = boardCellInfo.direction;
    this.index = spriteIndex;
    
    // Update position
    super.update();
    
    console.log(`Body moved to (${this.boardCell.col}, ${this.boardCell.row}) with new index ${spriteIndex}`);
  }

  clone() {
    // Create a new body segment with the same position
    const newBody = new TSnakeBody(
      this.spcvs, 
      new TBoardCell(this.boardCell.col, this.boardCell.row)
    );
    
    // Copy important properties
    newBody.index = this.index;
    newBody.direction = this.direction;
    
    // Ensure the new body segment is visible
    newBody.visible = true;
    newBody.alpha = 1;
    
    console.log(`Cloned body segment at col=${this.boardCell.col}, row=${this.boardCell.row} with index ${this.index}`);
    
    return newBody;
  }
} // class TSnakeBody


class TSnakeTail extends TSnakePart {
  constructor(aSpriteCanvas, aBoardCell) {
    super(aSpriteCanvas, SheetData.Tail, aBoardCell);
  }

  update(){
    let boardCellInfo = GameProps.gameBoard.getCell(this.boardCell.row, this.boardCell.col);
    boardCellInfo.infoType = EBoardCellInfoType.Empty; // Clear the cell, before moving the tail
  
    switch (this.direction) {
      case EDirection.Up:
        this.boardCell.row--;
        break;
      case EDirection.Right:
        this.boardCell.col++;
        break;
      case EDirection.Left:
        this.boardCell.col--;
        break;
      case EDirection.Down:
        this.boardCell.row++;
        break;
    }
    boardCellInfo = GameProps.gameBoard.getCell(this.boardCell.row, this.boardCell.col);
    this.direction = boardCellInfo.direction; // Update the direction of the tail based on the new cell
    this.index = this.direction;
    super.update();
  }
} // class TSnakeTail


export class TSnake {
  #isDead = false;
  #head = null;
  #body = null;
  #tail = null;
  #shouldGrow = false;
  
  constructor(aSpriteCanvas, aBoardCell) {
    this.#head = new TSnakeHead(aSpriteCanvas, aBoardCell);
    let col = aBoardCell.col - 1;
    this.#body = [new TSnakeBody(aSpriteCanvas, new TBoardCell(col, aBoardCell.row))];
    col--;
    this.#tail = new TSnakeTail(aSpriteCanvas, new TBoardCell(col, aBoardCell.row));
    
    // Initialize with direction right
    this.#head.direction = EDirection.Right;
    this.#head.index = EDirection.Right;
    this.#body[0].direction = EDirection.Right;
    this.#body[0].index = ESpriteIndex.RL; // Horizontal body segment
    this.#tail.direction = EDirection.Right;
    this.#tail.index = EDirection.Right;
    
    console.log("Snake initialized with length", this.#body.length + 2);
  } // constructor

  draw() {
    // Debug info
    console.log(`Drawing snake - Head at (${this.#head.boardCell.col}, ${this.#head.boardCell.row})`);
    
    // Check body segments
    for (let i = 0; i < this.#body.length; i++) {
      // Force visibility to be true
      if (!this.#body[i].visible) {
        console.log(`Fixed visibility for body segment ${i}`);
        this.#body[i].visible = true;
        this.#body[i].alpha = 1;
      }
      
      console.log(`Drawing body ${i} at (${this.#body[i].boardCell.col}, ${this.#body[i].boardCell.row}) - visible: ${this.#body[i].visible}`);
      this.#body[i].draw();
    }
    
    // Draw tail and head
    console.log(`Drawing tail at (${this.#tail.boardCell.col}, ${this.#tail.boardCell.row})`);
    this.#tail.draw();
    
    this.#head.draw();
  } // draw

  // Returns true if the snake is alive
  update() {
    if (this.#isDead) {
      return false; // Snake is dead, do not continue
    }
    
    // Variable to hold cloned part if needed for growth
    let clonePart = null;
    
    // If we should grow, clone the last body part BEFORE it moves
    if (this.#shouldGrow && this.#body.length > 0) {
      // Get the last body part (the one closest to the tail)
      const lastBodyPart = this.#body[this.#body.length - 1];
      
      // Clone it before it moves
      clonePart = lastBodyPart.clone();
      
      console.log(`Cloned last body part at (${clonePart.boardCell.col}, ${clonePart.boardCell.row})`);
    }
    
    if (this.#head.update()) {
      // Update all body segments
      for (let i = 0; i < this.#body.length; i++) {
        this.#body[i].update();
      }
      
      // Handle growth or tail movement
      if (this.#shouldGrow && clonePart) {
        // Add the cloned part to the body array
        this.#body.push(clonePart);
        
        // Reset the growth flag
        this.#shouldGrow = false;
        
        console.log(`Snake grew! New length: ${this.#body.length + 2}`);
      } else {
        // Only update the tail if we're not growing
        this.#tail.update();
      }
    } else if (!this.#isDead) {
      this.#isDead = true;
      return false; // Collision detected, do not continue
    }
    
    return true; // No collision, continue
  }

  setDirection(aDirection) {
    this.#head.setDirection(aDirection);
  } // setDirection
  
  // Method to grow the snake when eating bait
  grow() {
    this.#shouldGrow = true;
    console.log("Snake will grow on next update!");
  }
  
  // Helper method to get snake length (for debugging)
  getLength() {
    return this.#body.length + 2; // Count head and tail too
  }
  
  // Debug helper method
  diagnose() {
    console.log("=== SNAKE DIAGNOSIS ===");
    console.log(`Head: col=${this.#head.boardCell.col}, row=${this.#head.boardCell.row}, visible=${this.#head.visible}, index=${this.#head.index}`);
    console.log(`Body segments: ${this.#body.length}`);
    
    for (let i = 0; i < this.#body.length; i++) {
      console.log(`  Segment ${i}: col=${this.#body[i].boardCell.col}, row=${this.#body[i].boardCell.row}, visible=${this.#body[i].visible}, index=${this.#body[i].index}, alpha=${this.#body[i].alpha}`);
    }
    
    console.log(`Tail: col=${this.#tail.boardCell.col}, row=${this.#tail.boardCell.row}, visible=${this.#tail.visible}, index=${this.#tail.index}`);
    console.log("======================");
  }
} // end of TSnake class