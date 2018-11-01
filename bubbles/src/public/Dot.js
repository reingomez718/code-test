/** Class for Dot */
export class Dot {

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
