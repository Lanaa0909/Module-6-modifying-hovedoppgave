// turnTracker.mjs
"use strict";

import { TBoardCell } from "./gameBoard.mjs";
import { EDirection } from "./snake.mjs";

// Class to track and manage snake turns
export class TTurnTracker {
  constructor() {
    this.turns = []; // Array of turn points with their directions
  }
  
  // Add a new turn point
  addTurn(row, col, newDirection) {
    // Check if there's already a turn at this location - if so, update it
    const existingTurnIndex = this.turns.findIndex(turn => 
      turn.position.row === row && turn.position.col === col
    );
    
    if (existingTurnIndex >= 0) {
      this.turns[existingTurnIndex].direction = newDirection;
    } else {
      // Add new turn
      this.turns.push({
        position: new TBoardCell(col, row),
        direction: newDirection
      });
    }
    
    console.log(`Turn added at [${row},${col}] to direction ${newDirection}`);
  }
  
  // Check if there's a turn at a specific location and return the new direction
  checkForTurn(row, col) {
    const turnIndex = this.turns.findIndex(turn => 
      turn.position.row === row && turn.position.col === col
    );
    
    if (turnIndex >= 0) {
      const turnDirection = this.turns[turnIndex].direction;
      // Once the tail passes this turn, we can remove it
      if (turnIndex === 0) {
        console.log(`Turn at [${row},${col}] is being processed`);
      }
      return turnDirection;
    }
    
    return null; // No turn at this location
  }
  
  // Remove a turn point after the tail has passed it
  removeTurn(row, col) {
    const turnIndex = this.turns.findIndex(turn => 
      turn.position.row === row && turn.position.col === col
    );
    
    if (turnIndex >= 0) {
      this.turns.splice(turnIndex, 1);
      console.log(`Turn at [${row},${col}] has been removed`);
      return true;
    }
    
    return false;
  }
  
  // Remove the oldest turn (after tail passes it)
  removeOldestTurn() {
    if (this.turns.length > 0) {
      const turn = this.turns.shift();
      console.log(`Oldest turn at [${turn.position.row},${turn.position.col}] has been removed`);
    }
  }
  
  // Get the current list of turns for debugging
  getTurns() {
    return this.turns.map(turn => ({
      row: turn.position.row,
      col: turn.position.col,
      direction: turn.direction
    }));
  }
}