import { Dot } from './Dot.js';

export /** Class for Dot Game */
class DotGame {

  /**
   * Creates a Dot Game
   * @param {Object} gameSettings 
   *   {number} speed - Game speed based on the slider
   *   {number} score - Game score
   *   {Object} gameContainer - DON Element to render the game
   *   {Object} scoreContainer - DOM Element to render the score
   *   {number} dotMinSize - Dot Game's Dot minimum size
   *   {number} dotMaxSize - Dot Game's Dot maximum size
   */
  constructor(gameSettings) {
    // Game Settings
    this.makeSpeed = 1000;
    this.speed = gameSettings.speed;
    this.score = gameSettings.score;
    this.gameContainer = gameSettings.gameContainer;
    this.scoreContainer = gameSettings.scoreContainer;
    this.isPaused = false;
    // Animation Related
    this.now;
    this.then = Date.now();
    this.delta;
    // Dot params
    this.gameDots = [];
    this.dotMinSize = gameSettings.dotMinSize;
    this.dotMaxSize = gameSettings.dotMaxSize;
    // Star making Dots
    this.makeDots();
  }

  /** Makes a Dot and add Animation based on the Game Settings */
  makeDots() {
    const self = this;

    requestAnimationFrame(self.makeDots.bind(self));

    // Set FPS with speed
    self.now = Date.now();
    self.delta = self.now - self.then;
    if (self.delta < self.makeSpeed) return;

    // Exit if Paused
    if (self.isPaused) return;
  
    // Make a new Dot
    const dot = new Dot({
      x: Math.floor(Math.random() * (window.innerWidth - 1) + 1),
      y: 0,
      minSize: self.dotMinSize,
      maxSize: self.dotMaxSize,
      speed: self.speed,
    });

    // Add to Dot array
    self.gameDots.push(dot);

    // Add Dot Event
    dot.getBody().addEventListener('click', (e) => {
      if (self.isPaused) return;
      self.score += parseInt(e.target.dataset.points, 10);
      self.scoreContainer.textContent = self.score;
    });

    // Append Dot to Container
    self.gameContainer.appendChild(dot.getContainer());

    // Animate the Dot
    dot.animate();

    // Update the 'then'
    self.then = self.now - (self.delta % self.speed);
  }

  /** isPaused Setter */
  setIsPaused(isPaused) {
    this.isPaused = isPaused;
    this.makeDots();
    // Pause all Dots
    this.gameDots.forEach((dot) => {
      dot.setIsPaused(isPaused);
    });
  }

  /** speed Setter */
  setSpeed(speed) {
    this.speed = speed;
    // Update the speed for all Dots
    this.gameDots.forEach((dot) => {
      dot.setSpeed(speed);
    });
  }
}
