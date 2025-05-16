"use strict";

import libSprite from "../../common/libs/libSprite_v2.mjs";
import { EGameStatus, SheetData, GameProps, newGame } from "./game.mjs";

/**
 * Menu manager class for the game
 */
class MenuManager {
  // Private class variables using # prefix
  #playButton = null;
  #resumeButton = null;
  #homeButton = null;
  #retryButton = null;
  #scoreDisplay = null;
  #gameOverSprite = null;
  #spriteCanvas = null;

  /**
   * Constructor initializes the menu manager
   * @param {Object} spriteCanvas - The canvas for sprite rendering
   */
  constructor(spriteCanvas) {
    console.log("MenuManager: Initializing...");
    this.#spriteCanvas = spriteCanvas;
    this.#initializeMenuElements();
  }

  /**
   * Initialize all menu elements
   */
  #initializeMenuElements() {
    console.log("MenuManager: Setting up menu elements");
    this.#initPlayButton();
    this.#initResumeButton();
    this.#initGameOverSprite();
    this.#initHomeButton();
    this.#initRetryButton();
    this.#initScoreDisplay();
  }

  /**
   * Initialize the play button
   */
  #initPlayButton() {
    const playPos = {
      x: (this.#spriteCanvas.canvas.width - SheetData.Play.width) / 2,
      y: (this.#spriteCanvas.canvas.height - SheetData.Play.height) / 2
    };
    this.#playButton = new libSprite.TSpriteButton(this.#spriteCanvas, SheetData.Play, playPos);
    this.#playButton.onClick = () => {
      console.log("MenuManager: Play button clicked");
      this.#playButton.visible = false;
      newGame();
      GameProps.gameStatus = EGameStatus.Playing;
    };
    this.#playButton.animateSpeed = 50;
    this.#playButton.visible = true;
    console.log("MenuManager: Play button initialized at", playPos);
  }

  /**
   * Initialize the resume button
   */
  #initResumeButton() {
    const resumePos = {
      x: (this.#spriteCanvas.canvas.width - SheetData.Resume.width) / 2,
      y: (this.#spriteCanvas.canvas.height - SheetData.Resume.height) / 2
    };
    this.#resumeButton = new libSprite.TSpriteButton(this.#spriteCanvas, SheetData.Resume, resumePos);
    this.#resumeButton.onClick = () => {
      console.log("MenuManager: Resume button clicked");
      this.#resumeButton.visible = false;
      GameProps.gameStatus = EGameStatus.Playing;
    };
    this.#resumeButton.animateSpeed = 50;
    this.#resumeButton.visible = false;
    console.log("MenuManager: Resume button initialized at", resumePos);
  }

  /**
   * Initialize the game over sprite
   */
  #initGameOverSprite() {
    // Center the game over sprite horizontally and position it to show border
    const gameOverPos = {
      x: (this.#spriteCanvas.canvas.width - SheetData.GameOver.width) / 2,
      y: (this.#spriteCanvas.canvas.height - SheetData.GameOver.height) / 2 // Center vertically
    };
    this.#gameOverSprite = new libSprite.TSprite(this.#spriteCanvas, SheetData.GameOver, gameOverPos);
    this.#gameOverSprite.visible = false;
    console.log("MenuManager: Game over sprite initialized at", gameOverPos);
  }

  /**
   * Initialize the home button
   */
  #initHomeButton() {
    const homePos = {
      x: this.#spriteCanvas.canvas.width / 2/3 - SheetData.Home.width / 2.9,
      y: (this.#spriteCanvas.canvas.height * 0.58)
    };
    this.#homeButton = new libSprite.TSpriteButtonHaptic(this.#spriteCanvas, SheetData.Home, homePos);
    this.#homeButton.onClick = () => {
      console.log("MenuManager: Home button clicked");
      this.hideGameOverMenu();
      this.showStartMenu();
    };
    this.#homeButton.visible = false;
    console.log("MenuManager: Home button initialized at", homePos);
  }

  /**
   * Initialize the retry button
   */
  #initRetryButton() {
    const retryPos = {
      x: this.#spriteCanvas.canvas.width * 2/3 - SheetData.Retry.width / -5,
      y: (this.#spriteCanvas.canvas.height * 0.58)
    };
    this.#retryButton = new libSprite.TSpriteButtonHaptic(this.#spriteCanvas, SheetData.Retry, retryPos);
    this.#retryButton.onClick = () => {
      console.log("MenuManager: Retry button clicked");
      this.hideGameOverMenu();
      newGame();
      GameProps.gameStatus = EGameStatus.Playing;
    };
    this.#retryButton.visible = false;
    console.log("MenuManager: Retry button initialized at", retryPos);
  }

  /**
   * Initialize the score display
   */
  #initScoreDisplay() {
    const scorePos = { 
      x: this.#spriteCanvas.canvas.width * 2/2.72, 
      y: this.#spriteCanvas.canvas.height * 0.38 
    };
    this.#scoreDisplay = new libSprite.TSpriteNumber(
      this.#spriteCanvas,
      SheetData.Number,
      scorePos
    );
    this.#scoreDisplay.justify = libSprite.ESpriteNumberJustifyType.Center;
    this.#scoreDisplay.digits = 3; // Allow up to 3 digits
    this.#scoreDisplay.value = 0;
    this.#scoreDisplay.visible = false;
    console.log("MenuManager: Score display initialized at", scorePos);
  }

  /**
   * Get the play button
   * @returns {Object} The play button instance
   */
  getPlayButton() {
    return this.#playButton;
  }

  /**
   * Show the start menu
   */
  showStartMenu() {
    console.log("MenuManager: Showing start menu");
    GameProps.gameStatus = EGameStatus.Idle;
    this.#playButton.visible = true;
    this.#resumeButton.visible = false;
    this.#homeButton.visible = false;
    this.#retryButton.visible = false;
    this.#scoreDisplay.visible = false;
    this.#gameOverSprite.visible = false;
  }

  /**
   * Show the pause menu
   */
  showPauseMenu() {
    console.log("MenuManager: Showing pause menu");
    GameProps.gameStatus = EGameStatus.Pause;
    this.#playButton.visible = false;
    this.#resumeButton.visible = true;
    this.#homeButton.visible = false;
    this.#retryButton.visible = false;
    this.#scoreDisplay.visible = false;
    this.#gameOverSprite.visible = false;
  }

  /**
   * Hide the resume button
   */
  hideResumeButton() {
    if (this.#resumeButton) {
      console.log("MenuManager: Hiding resume button");
      this.#resumeButton.visible = false;
    }
  }

  /**
   * Show the game over menu with score
   * @param {number} score - The player's score
   */
  showGameOverMenu(score) {
    console.log(`MenuManager: Showing game over menu with score: ${score}`);
    GameProps.gameStatus = EGameStatus.GameOver;
    this.#playButton.visible = false;
    this.#resumeButton.visible = false;
    this.#homeButton.visible = true;
    this.#retryButton.visible = true;
    this.#scoreDisplay.visible = true;
    this.#scoreDisplay.value = score || 0;
    this.#gameOverSprite.visible = true;
  }

  /**
   * Hide the game over menu
   */
  hideGameOverMenu() {
    console.log("MenuManager: Hiding game over menu");
    this.#homeButton.visible = false;
    this.#retryButton.visible = false;
    this.#scoreDisplay.visible = false;
    this.#gameOverSprite.visible = false;
  }

  /**
   * Draw all visible menu elements
   */
  drawMenu() {
    // Draw menu elements in the correct order
    if (this.#gameOverSprite && this.#gameOverSprite.visible) this.#gameOverSprite.draw();
    if (this.#playButton && this.#playButton.visible) this.#playButton.draw();
    if (this.#resumeButton && this.#resumeButton.visible) this.#resumeButton.draw();
    if (this.#homeButton && this.#homeButton.visible) this.#homeButton.draw();
    if (this.#retryButton && this.#retryButton.visible) this.#retryButton.draw();
    if (this.#scoreDisplay && this.#scoreDisplay.visible) this.#scoreDisplay.draw();
  }
}

// Create a singleton instance to maintain the original API
let menuManagerInstance = null;

export function initMenu(aSpriteCanvas) {
  console.log("menu.mjs: Initializing menu with sprite canvas");
  menuManagerInstance = new MenuManager(aSpriteCanvas);
}

export function getPlayButton() {
  return menuManagerInstance ? menuManagerInstance.getPlayButton() : null;
}

export function showStartMenu() {
  if (menuManagerInstance) menuManagerInstance.showStartMenu();
}

export function showPauseMenu() {
  if (menuManagerInstance) menuManagerInstance.showPauseMenu();
}

export function hideResumeButton() {
  if (menuManagerInstance) menuManagerInstance.hideResumeButton();
}

export function showGameOverMenu(score) {
  if (menuManagerInstance) menuManagerInstance.showGameOverMenu(score);
}

export function hideGameOverMenu() {
  if (menuManagerInstance) menuManagerInstance.hideGameOverMenu();
}

export function drawMenu() {
  if (menuManagerInstance) menuManagerInstance.drawMenu();
}