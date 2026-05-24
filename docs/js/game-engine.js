var GameEngine = (function() {
  function GameEngine(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.outputEl = null;
    this.inputEl = null;
    this.promptEl = null;
    this.instructionsEl = null;
    this.terminalEl = null;
    this.inputCallback = null;
    this.resolveInput = null;
    this.running = false;
    this._boundKeydown = null;
  }

  GameEngine.prototype.start = function(title, instructions, gameLoop) {
    var self = this;
    var instrText = instructions || 'No instructions available yet. Explore the game to discover the rules.';
    this.container.innerHTML =
      '<div class="game-panel" id="' + this.containerId + '-panel">' +
        '<div class="game-view-header">' +
          '<h2>' + title + '</h2>' +
        '</div>' +
        '<div class="terminal-output" id="' + this.containerId + '-output"></div>' +
        '<div class="terminal-input-line">' +
          '<span class="terminal-prompt">&gt;</span>' +
          '<input type="text" class="terminal-input" id="' + this.containerId + '-input" autofocus spellcheck="false" autocomplete="off">' +
        '</div>' +
        '<div class="game-actions">' +
          '<button class="btn" id="' + this.containerId + '-restart">Restart</button>' +
        '</div>' +
      '</div>' +
      '<div class="instructions-panel" id="' + this.containerId + '-instructions">' +
        '<h3>How to Play</h3>' +
        '<div class="instructions-content">' + instrText + '</div>' +
      '</div>';

    this.outputEl = document.getElementById(this.containerId + '-output');
    this.inputEl = document.getElementById(this.containerId + '-input');
    this.promptEl = this.container.querySelector('.terminal-prompt');
    this.instructionsEl = document.getElementById(this.containerId + '-instructions');

    this._boundKeydown = function(e) {
      if (e.key === 'Enter') {
        var value = self.inputEl.value;
        self.inputEl.value = '';
        if (self.resolveInput) {
          var resolve = self.resolveInput;
          self.resolveInput = null;
          resolve(value);
        }
        if (self.inputCallback) {
          var cb = self.inputCallback;
          self.inputCallback = null;
          cb(value);
        }
      }
    };
    this.inputEl.addEventListener('keydown', this._boundKeydown);

    var restartBtn = document.getElementById(this.containerId + '-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', function() {
        self.clear();
        if (gameLoop) gameLoop();
      });
    }

    this.running = true;
    this.inputEl.focus();
    if (gameLoop) {
      var self2 = this;
      setTimeout(function() { gameLoop.call(self2); }, 50);
    }
  };

  GameEngine.prototype.print = function(text) {
    if (this.outputEl) {
      this.outputEl.textContent += text;
    }
    if (this.inputEl) {
      this.inputEl.scrollIntoView(false);
    }
  };

  GameEngine.prototype.println = function(text) {
    this.print((text || '') + '\n');
  };

  GameEngine.prototype.clear = function() {
    if (this.outputEl) {
      this.outputEl.textContent = '';
    }
  };

  GameEngine.prototype.prompt = function(message, callback) {
    this.print(message);
    this.inputCallback = callback;
    if (this.inputEl) this.inputEl.focus();
  };

  GameEngine.prototype.input = function(message) {
    var self = this;
    return new Promise(function(resolve) {
      self.print(message);
      self.resolveInput = resolve;
      if (self.inputEl) self.inputEl.focus();
    });
  };

  GameEngine.prototype.end = function() {
    this.running = false;
    if (this.inputEl) {
      this.inputEl.disabled = true;
    }
    if (this._boundKeydown && this.inputEl) {
      this.inputEl.removeEventListener('keydown', this._boundKeydown);
    }
  };

  GameEngine.prototype.setInstructions = function(text) {
    if (this.instructionsEl) {
      var content = this.instructionsEl.querySelector('.instructions-content');
      if (content) {
        content.innerHTML = text;
      }
    }
  };

  GameEngine.prototype.getInput = function() {
    return this.inputEl;
  };

  return GameEngine;
})();
