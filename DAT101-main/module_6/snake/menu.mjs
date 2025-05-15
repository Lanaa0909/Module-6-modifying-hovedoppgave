"use strict";

import libSprite from "../../common/libs/libSprite_v2.mjs";
import { EGameStatus, SheetData, GameProps, newGame } from "./game.mjs";

// Menu elements
let playButton = null;
let resumeButton = null;
let homeButton = null;
let retryButton = null;
let scoreDisplay = null;
let gameOverTextSprite = null;
let scoreTextSprite = null;

// Function to get the play button
export function getPlayButton() {
  return playButton;
}

// Initialize the menu
export function initMenu(aSpriteCanvas) {
  // Create Play button (Start Menu)
  const playPos = {
    x: (aSpriteCanvas.canvas.width - SheetData.Play.width) / 2,
    y: (aSpriteCanvas.canvas.height - SheetData.Play.height) / 2
  };
  playButton = new libSprite.TSpriteButtonHaptic(aSpriteCanvas, SheetData.Play, playPos);
  playButton.onClick = () => {
    playButton.visible = false;
    newGame();
    GameProps.gameStatus = EGameStatus.Playing;
  };
  playButton.visible = true;

  // Create Resume button (Pause Menu)
  const resumePos = {
    x: (aSpriteCanvas.canvas.width - SheetData.Resume.width) / 2,
    y: (aSpriteCanvas.canvas.height - SheetData.Resume.height) / 2
  };
  resumeButton = new libSprite.TSpriteButtonHaptic(aSpriteCanvas, SheetData.Resume, resumePos);
  resumeButton.onClick = () => {
    resumeButton.visible = false;
    GameProps.gameStatus = EGameStatus.Playing;
  };
  resumeButton.visible = false;
  
  // Create Home button (Game Over Menu)
  const homePos = {
    x: aSpriteCanvas.canvas.width / 3 - SheetData.Home.width / 2,
    y: (aSpriteCanvas.canvas.height * 0.72)
  };
  homeButton = new libSprite.TSpriteButtonHaptic(aSpriteCanvas, SheetData.Home, homePos);
  homeButton.onClick = () => {
    hideGameOverMenu();
    showStartMenu();
  };
  homeButton.visible = false;

  // Create Retry button (Game Over Menu)
  const retryPos = {
    x: (aSpriteCanvas.canvas.width * 2/3) - SheetData.Retry.width / 2,
    y: (aSpriteCanvas.canvas.height * 0.72)
  };
  retryButton = new libSprite.TSpriteButtonHaptic(aSpriteCanvas, SheetData.Retry, retryPos);
  retryButton.onClick = () => {
    hideGameOverMenu();
    newGame();
    GameProps.gameStatus = EGameStatus.Playing;
  };
  retryButton.visible = false;

  // Create Score Display
  scoreDisplay = new libSprite.TSpriteNumber(
    aSpriteCanvas,
    SheetData.Number,
    { x: aSpriteCanvas.canvas.width / 2, y: aSpriteCanvas.canvas.height * 0.5 }
  );
  scoreDisplay.justify = libSprite.ESpriteNumberJustifyType.Center;
  scoreDisplay.digits = 3; // Allow up to 3 digits
  scoreDisplay.value = 0;
  scoreDisplay.visible = false;
}

// Show the start menu
export function showStartMenu() {
  GameProps.gameStatus = EGameStatus.Idle;
  playButton.visible = true;
  resumeButton.visible = false;
  homeButton.visible = false;
  retryButton.visible = false;
  scoreDisplay.visible = false;
}

// Show the pause menu
export function showPauseMenu() {
  GameProps.gameStatus = EGameStatus.Pause;
  playButton.visible = false;
  resumeButton.visible = true;
  homeButton.visible = false;
  retryButton.visible = false;
  scoreDisplay.visible = false;
}

// hiding the resume button
export function hideResumeButton() {
  if (resumeButton) resumeButton.visible = false;
}

// Show the game over menu
export function showGameOverMenu(score) {
  GameProps.gameStatus = EGameStatus.GameOver;
  playButton.visible = false;
  resumeButton.visible = false;
  homeButton.visible = true;
  retryButton.visible = true;
  scoreDisplay.visible = true;
  scoreDisplay.value = score || 0;
  
  console.log("Game Over menu shown with score:", score);
}

// Hide the game over menu
export function hideGameOverMenu() {
  homeButton.visible = false;
  retryButton.visible = false;
  scoreDisplay.visible = false;
}

// Draw the appropriate menu based on game state
export function drawMenu(aSpriteCanvas) {
  // Draw custom Game Over screen
  if (GameProps.gameStatus === EGameStatus.GameOver) {
    const ctx = aSpriteCanvas.context;
    

    ctx.strokeStyle = "#2a8f30"; // Green border color
    ctx.lineWidth = 6;
    ctx.strokeRect(
      3, // Left position (small offset from edge)
      3, // Top position
      aSpriteCanvas.canvas.width - 6, // Width
      aSpriteCanvas.canvas.height - 6  // Height
    );
    // Draw background rectangle
    ctx.fillStyle = "#fabd04"; // Yellow background color from your screenshots
    ctx.fillRect(
      aSpriteCanvas.canvas.width * 0.1,
      aSpriteCanvas.canvas.height * 0.15,
      aSpriteCanvas.canvas.width * 0.8,
      aSpriteCanvas.canvas.height * 0.5
    );
    
    // Draw border
    ctx.strokeStyle = "#2a8f30"; // Green border color
    ctx.lineWidth = 6;
    ctx.strokeRect(
      aSpriteCanvas.canvas.width * 0.1,
      aSpriteCanvas.canvas.height * 0.15,
      aSpriteCanvas.canvas.width * 0.8,
      aSpriteCanvas.canvas.height * 0.5
    );
    
    // Draw GAME OVER text
    ctx.font = "bold 96px Arial";
    ctx.fillStyle = "#ff6a00"; // Orange text color
    ctx.strokeStyle = "#000000"; // Black outline
    ctx.lineWidth = 8;
    ctx.textAlign = "center";
    ctx.strokeText("GAME OVER", aSpriteCanvas.canvas.width / 2, aSpriteCanvas.canvas.height * 0.3);
    ctx.fillText("GAME OVER", aSpriteCanvas.canvas.width / 2, aSpriteCanvas.canvas.height * 0.3);
    
    // Draw SCORE: text
    ctx.font = "bold 36px Arial";
    ctx.strokeText("SCORE:", aSpriteCanvas.canvas.width / 2 - 50, aSpriteCanvas.canvas.height * 0.45);
    ctx.fillText("SCORE:", aSpriteCanvas.canvas.width / 2 - 50, aSpriteCanvas.canvas.height * 0.45);
    
    // Draw score line
    ctx.beginPath();
    ctx.moveTo(aSpriteCanvas.canvas.width * 0.6, aSpriteCanvas.canvas.height * 0.45);
    ctx.lineTo(aSpriteCanvas.canvas.width * 0.8, aSpriteCanvas.canvas.height * 0.45);
    ctx.stroke();
  }
  
  // Draw menu elements
  if (playButton) playButton.draw();
  if (resumeButton) resumeButton.draw();
  if (homeButton) homeButton.draw();
  if (retryButton) retryButton.draw();
  if (scoreDisplay) scoreDisplay.draw();
}