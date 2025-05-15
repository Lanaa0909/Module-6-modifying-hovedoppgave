"use strict";

//-----------------------------------------------------------------------------------------
//----------- Import modules, mjs files  ---------------------------------------------------
//-----------------------------------------------------------------------------------------
import libSprite from "../../common/libs/libSprite_v2.mjs";
import { TGameBoard, GameBoardSize, TBoardCell, EBoardCellInfoType } from "./gameBoard.mjs";
import { TSnake, EDirection } from "./snake.mjs";
import { TBait } from "./bait.mjs";
import { initMenu, showStartMenu, showPauseMenu, showGameOverMenu, drawMenu, hideResumeButton, getPlayButton } from "./menu.mjs";

//-----------------------------------------------------------------------------------------
//----------- variables and object --------------------------------------------------------
//-----------------------------------------------------------------------------------------
const cvs = document.getElementById("cvs");
const spcvs = new libSprite.TSpriteCanvas(cvs);
let gameSpeed = 4; // Game speed multiplier;
let hndUpdateGame = null;
export const EGameStatus = { Idle: 0, Playing: 1, Pause: 2, GameOver: 3 };
let score = 0;
let baitsEaten = 0; // New counter for baits eaten
let gameScoreDisplay = null; // Score display during gameplay
let baitCountDisplay = null; // Display for number of baits eaten
let lastBaitTime = 0; // Time when the last bait was generated
let maxTimePoints = 100; // Maximum points for eating immediately
let minTimePoints = 10; // Minimum points for waiting too long
let timeForMinPoints = 10000; // Time in ms after which only minimum points are awarded (10 seconds)
let playButton = null; 

// prettier-ignore
export const SheetData = {
  Head:     { x:   0, y:   0, width:  38, height:  38, count:  4 },
  Body:     { x:   0, y:  38, width:  38, height:  38, count:  6 },
  Tail:     { x:   0, y:  76, width:  38, height:  38, count:  4 },
  Bait:     { x:   0, y: 114, width:  38, height:  38, count:  1 },
  Play:     { x:   0, y: 155, width: 202, height: 202, count:  10 },
  GameOver: { x:   0, y: 647, width: 856, height: 580, count:  1 },
  Home:     { x:  65, y: 995, width: 169, height: 167, count:  1 },
  Retry:    { x: 614, y: 995, width: 169, height: 167, count:  1 },
  Resume:   { x:   0, y: 357, width: 202, height: 202, count:  10 },
  Number:   { x:   0, y: 560, width:  81, height:  86, count: 10 },
};

export const GameProps = {
  gameBoard: null,
  gameStatus: EGameStatus.Idle,
  snake: null,
  bait: null
};

//------------------------------------------------------------------------------------------
//----------- Exported functions -----------------------------------------------------------
//------------------------------------------------------------------------------------------

export function newGame() {
  GameProps.gameBoard = new TGameBoard();
  GameProps.snake = new TSnake(spcvs, new TBoardCell(5, 5)); // Initialize snake with a starting position
  GameProps.bait = new TBait(spcvs); // Initialize bait with a random position
  gameSpeed = 4; // Reset game speed
  score = 0; // Reset score
  baitsEaten = 0; // Reset bait counter
  lastBaitTime = Date.now(); // Initialize time for the first bait
  
  // Update displays
  if (gameScoreDisplay) {
    gameScoreDisplay.value = 0;
    gameScoreDisplay.visible = true;
  }
  
  if (baitCountDisplay) {
    baitCountDisplay.value = 0;
    baitCountDisplay.visible = true;
  }
  
  // Clear any previous game interval
  if (hndUpdateGame) {
    clearInterval(hndUpdateGame);
  }
  
  // Start the game update interval
  hndUpdateGame = setInterval(updateGame, 1000 / gameSpeed);
}

export function bateIsEaten() {
  console.log("Bait eaten!");
  
  // Increment bait counter
  baitsEaten++;
  if (baitCountDisplay) {
    baitCountDisplay.value = baitsEaten;
  }
  
  // Calculate how much time has passed since the bait was generated
  const currentTime = Date.now();
  const timeTaken = currentTime - lastBaitTime;
  
  // Calculate points based on time - more points for eating quickly
  let timePoints = Math.max(
    minTimePoints,
    Math.floor(maxTimePoints - (timeTaken / timeForMinPoints) * (maxTimePoints - minTimePoints))
  );
  
  // Increase score
  score += timePoints;
  if (gameScoreDisplay) {
    gameScoreDisplay.value = score; // Update the displayed score
  }
  
  console.log(`Baits eaten: ${baitsEaten}, Time taken: ${timeTaken}ms, Points earned: ${timePoints}, Total score: ${score}`);
  
  // Generate new bait and record the time
  GameProps.bait.update();
  lastBaitTime = Date.now();
  
  // Increase game speed
  increaseGameSpeed();
  
  // Grow the snake
  GameProps.snake.grow();
}

//------------------------------------------------------------------------------------------
//----------- functions -------------------------------------------------------------------
//------------------------------------------------------------------------------------------

function loadGame() {
  // Set canvas dimensions based on game board size
  cvs.width = GameBoardSize.Cols * SheetData.Head.width;
  cvs.height = GameBoardSize.Rows * SheetData.Head.height;

  // Create score display for during gameplay
  gameScoreDisplay = new libSprite.TSpriteNumber(
    spcvs,
    SheetData.Number,
    { x: 30, y: 90 } // Position in corner for score
  );
  gameScoreDisplay.justify = libSprite.ESpriteNumberJustifyType.Left;
  gameScoreDisplay.digits = 3; // Allow up to 3 digits
  gameScoreDisplay.value = 0;
  gameScoreDisplay.visible = false;
  gameScoreDisplay.alpha = 0.7; // Make the numbers slightly transparent/faded
  gameScoreDisplay.scale = 0.7; // Make the numbers smaller
  
  // Create bait counter display (positioned above the score display)
  baitCountDisplay = new libSprite.TSpriteNumber(
    spcvs,
    SheetData.Number,
    { x: 30, y: 30 } // Position in corner for bait count, above score
  );
  baitCountDisplay.justify = libSprite.ESpriteNumberJustifyType.Left;
  baitCountDisplay.digits = 2; // Allow up to 2 digits for bait count
  baitCountDisplay.value = 0;
  baitCountDisplay.visible = false;
  baitCountDisplay.alpha = 0.7; // Make the numbers slightly transparent/faded
  baitCountDisplay.scale = 0.7; // Make the numbers smaller

  // Initialize the menu system
  initMenu(spcvs);

  // Get a reference to the play button
  playButton = getPlayButton();
  
  // Show the start menu initially
  showStartMenu();

  // Start the animation loop
  requestAnimationFrame(drawGame);
  console.log("Game canvas is rendering!");
}

function drawGame() {
  // Clear the canvas
  spcvs.clearCanvas();

  switch (GameProps.gameStatus) {
    case EGameStatus.Playing:
    case EGameStatus.Pause:
      // Draw game elements (we still show the game in pause state)
      GameProps.bait.draw();
      GameProps.snake.draw();
      
      // Draw the score displays during gameplay (only in playing state, not pause)
      if (GameProps.gameStatus === EGameStatus.Playing) {
        if (gameScoreDisplay) gameScoreDisplay.draw();
        if (baitCountDisplay) baitCountDisplay.draw();
      }
      break;
  }
  
  // Draw appropriate menu elements based on game state
  drawMenu(spcvs);
  
  // Request the next frame
  requestAnimationFrame(drawGame);
}

function updateGame() {
  // Update game logic here
  switch (GameProps.gameStatus) {
    case EGameStatus.Playing:
      if (!GameProps.snake.update()) {
        console.log("Game over!");
        if (hndUpdateGame) {
          clearInterval(hndUpdateGame);
          hndUpdateGame = null;
        }
        // Hide gameplay displays before showing game over screen
        if (gameScoreDisplay) gameScoreDisplay.visible = false;
        if (baitCountDisplay) baitCountDisplay.visible = false;
        
        showGameOverMenu(score);
      }
      break;
  }
}

function increaseGameSpeed() {
  // Increase game speed up to a maximum
  if (gameSpeed < 10) {
    gameSpeed += 0.5;
    
    // Update the game interval
    if (hndUpdateGame) {
      clearInterval(hndUpdateGame);
      hndUpdateGame = setInterval(updateGame, 1000 / gameSpeed);
    }
    
    console.log("Game speed increased to: " + gameSpeed);
  }
}

function togglePause() {
  if (GameProps.gameStatus === EGameStatus.Playing) {
    showPauseMenu();
  } else if (GameProps.gameStatus === EGameStatus.Pause) {
    hideResumeButton();
    GameProps.gameStatus = EGameStatus.Playing;
  }
}

//-----------------------------------------------------------------------------------------
//----------- Event handlers --------------------------------------------------------------
//-----------------------------------------------------------------------------------------

function onKeyDown(event) {
  switch (event.key) {
    case "ArrowUp":
      if (GameProps.gameStatus === EGameStatus.Playing) {
        GameProps.snake.setDirection(EDirection.Up);
      }
      break;
    case "ArrowDown":
      if (GameProps.gameStatus === EGameStatus.Playing) {
        GameProps.snake.setDirection(EDirection.Down);
      }
      break;
    case "ArrowLeft":
      if (GameProps.gameStatus === EGameStatus.Playing) {
        GameProps.snake.setDirection(EDirection.Left);
      }
      break;
    case "ArrowRight":
      if (GameProps.gameStatus === EGameStatus.Playing) {
        GameProps.snake.setDirection(EDirection.Right);
      }
      break;
    case " ":
      console.log("Space key pressed!");
      if (GameProps.gameStatus === EGameStatus.Idle) {
        startGameFromMenu();
      // Toggle pause only if the game is in Playing or Pause state
      } else if (GameProps.gameStatus === EGameStatus.Playing || 
          GameProps.gameStatus === EGameStatus.Pause) {
        togglePause();
      }
      break;
    default:
      console.log(`Key pressed: "${event.key}"`);
  }
}

function startGameFromMenu() {
  // Hide the play button
  if (playButton) {
    playButton.visible = false;
  }
  
  // Start a new game
  newGame();
  GameProps.gameStatus = EGameStatus.Playing;
}

//-----------------------------------------------------------------------------------------
//----------- main -----------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

spcvs.loadSpriteSheet("./Media/spriteSheet.png", loadGame);
document.addEventListener("keydown", onKeyDown);