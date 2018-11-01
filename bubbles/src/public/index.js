import { style } from './style.scss';

/** Class for Dot */
class Dot {

  /**
   * Creates a Dot
   * @param {Object} dotSettings
   *   {number} speed - Dot's fall animation speed based on the slider
   *   {number} x - Dot's x coordinate
   *   {number} y - Dot's y coordinate
   *   {number} minSize - Dot's minimum size
   *   {number} maxSize - Dot's maximum size
   */
  constructor(dotSettings) {
    // Dot Settings
    this.speed = dotSettings.speed;
    this.x = dotSettings.x;
    this.y = dotSettings.y;
    this.minSize = dotSettings.minSize;
    this.maxSize = dotSettings.maxSize;
    this.isPaused = false;
    // Animation Related
    this.now;
    this.then = Date.now();
    this.delta;
    // Size & Points
    this.size = Math.floor(Math.random() * (this.maxSize - this.minSize) + this.minSize) * 10;
    this.points = this.maxSize - (this.size / 10) + 1;
    // Dot Div
    this.dotContainer = document.createElement('div');
    this.dotBody;
    // Render the Dot
    this.renderDot();
  }

  /** Render the Dot */
  renderDot() {
    const self = this;

    // Append the Dot Body to the Dot Container
    self.dotContainer.innerHTML = `<div class="dot-body" data-points="${self.points}"></div>`;
    self.dotContainer.className = 'dot-container';

    // Set the Dot's POP Event
    self.dotContainer.addEventListener('click', () => {
      if (self.isPaused) return;
      self.pop();
    });

    // Set the size and color
    self.dotBody = self.dotContainer.querySelector('.dot-body');
    self.dotBody.style.width = `${self.size}px`;
    self.dotBody.style.height = `${self.size}px`;
    self.dotBody.classList.add(`color-${Math.floor((Math.random() * 10) + 1)}`);

    // Make sure the whole Dot will be rendered within the game container's width
    self.x = window.innerWidth < (self.x + self.size) ? window.innerWidth - self.size : self.x;

    // Move the div above the game container
    self.move(self.x, self.y - self.size);
  }

  /** Animate the Dot's falling animation */
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Set FPS with speed
    this.now = Date.now();
    this.delta = this.now - this.then;
    if (this.delta < this.speed) return;

    // Exit if Paused
    if (this.isPaused) return;

    // If the Dot goes over the window's height, the Dot will be popped
    if (window.innerHeight < (this.y + 1)) {
      this.pop();
    } else {
      // Else it will be moved to a new coordinate
      this.move(this.x, this.y + 1);
    }

    // Update the 'then'
    this.then = this.now - (this.delta % this.speed);
  }

  /** Animate the Dot's pop animation and delete afterwards */
  pop() {
    const self = this;
    self.dotBody.classList.add('pop');
    setTimeout(() => {
      if (!self.dotContainer.parentNode) return;
      self.dotContainer.parentNode.removeChild(self.dotContainer);
    }, 100);
    
  }

  /** speed Setter */
  setSpeed(speed) {
    this.speed = speed;
  }

  /** isPaused Setter */
  setIsPaused(isPaused) {
    this.isPaused = isPaused;
    this.animate();
  }

  /** Dot Container Getter */
  getContainer() {
    return this.dotContainer;
  }

  /** Dot Body Getter */
  getBody() {
    return this.dotBody;
  }

  /** Set the Dot's coordinates */
  move(x, y) {
    this.x = x;
    this.y = y;
    this.dotContainer.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
  }
}

/** Class for Dot Game */
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

let dotGame,
  startButton,
  speedSlider,
  speedDisplay;

const gameSettings = {
  speed: 100,
  score: 0,
  isStarted: false,
  isPaused: false,
  scoreContainer: null,
  gameContainer: null,
  dotMinSize: 1,
  dotMaxSize: 10,
};

/** Initialize the Application */
function init() {
  // Set DOM Elements
  startButton = document.getElementById('startButton');
  speedSlider = document.getElementById('speedSlider');
  speedDisplay = document.getElementById('speedDisplay').querySelector('.speed-display');
  gameSettings.scoreContainer = document.getElementById('points');
  gameSettings.gameContainer = document.getElementById('gameContainer');

  // Bind Events
  bindEvents();
}

/** Bind Start Button and Speed Slider events */
function bindEvents() {

  // Start / Pause Button
  startButton.addEventListener('click', () => {
    runGame();
  });

  // Speed Slider
  speedSlider.addEventListener('input', () => {
    speedDisplay.textContent = speedSlider.value;
    gameSettings.speed = 1000 / (parseInt(speedSlider.value, 10) * 10);
    if (!dotGame) return;
    dotGame.setSpeed(gameSettings.speed);
  });
}

/** Run the Game */
function runGame() {
  // If the game havent start yet then we run it
  if (!gameSettings.isStarted) {
    dotGame = new DotGame(gameSettings);
    gameSettings.isStarted = true;
    startButton.textContent = 'PAUSE';
  } else {
    // If it already started we toggle it
    gameSettings.isPaused = !gameSettings.isPaused;
    // Then change the button name
    startButton.textContent = gameSettings.isPaused ? 'RESUME' : 'PAUSE';
    // Togglet the game itself
    dotGame.setIsPaused(gameSettings.isPaused);
  }
}

/** Execute the appllication after the DOM finishes loading */
document.addEventListener('DOMContentLoaded', () => { 
  init();
});
