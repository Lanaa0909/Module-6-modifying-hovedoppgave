"use strict";

import { EDirection } from "./snake.mjs";
import { SheetData } from "./game.mjs";

// This function ensures sprites are properly connected
export function connectSnakeSprites(head, bodySegments, tail) {
  // Ensure consistent sprite orientation for straight segments
  for (let i = 0; i < bodySegments.length; i++) {
    const segment = bodySegments[i];
    
    // Force consistent appearance for straight segments
    // ESpriteIndex: {UR: 0, LD: 0, RU: 1, DR: 1, DL: 2, LU: 2, RD: 3, UL: 3, RL: 4, UD: 5}
    if (segment.index === 4 || segment.index === 5) { // If it's a straight segment (RL or UD)
      if (segment.direction === EDirection.Up || segment.direction === EDirection.Down) {
        segment.index = 5; // UD - vertical
      } else {
        segment.index = 4; // RL - horizontal
      }
    }
  }
  
  // Make sure the tail points in the right direction
  if (tail) {
    // Set tail sprite based on its direction
    tail.index = tail.direction;
  }
}