(function(){
  var slug='hang';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Hangman');
    engine.setInstructions('Guess the secret word one letter at a time. You can make 6 wrong guesses before the man is hanged. ASCII art shows your progress.');
    engine.println('H A N G M A N');
    engine.println('');

    var words = [
      'computer', 'program', 'language', 'javascript', 'python',
      'algorithm', 'database', 'network', 'keyboard', 'monitor',
      'graphics', 'software', 'hardware', 'internet', 'browser',
      'terminal', 'console', 'process', 'storage', 'memory',
      'printer', 'scanner', 'modem', 'router', 'server',
      'display', 'circuit', 'diagram', 'formula', 'library',
      'function', 'variable', 'pointer', 'string', 'binary',
      'octopus', 'jupiter', 'galaxy', 'nebula', 'planet'
    ];

    var hangmanArt = [
      '  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========',
      '  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n========='
    ];

    var playing = true;

    while (playing) {
      var word = RNG.pick(words).toUpperCase();
      var guessed = [];
      var wrongGuesses = 0;
      var maxWrong = 6;
      var correctLetters = [];
      for (var i = 0; i < word.length; i++) correctLetters.push(false);

      engine.println('The word has ' + word.length + ' letters.');
      engine.println('');

      while (wrongGuesses < maxWrong) {
        var display = '';
        for (var i = 0; i < word.length; i++) {
          display += correctLetters[i] ? word[i] : '_';
          display += ' ';
        }
        engine.println(display.trim());
        engine.println('');

        var wrongCount = 0;
        for (var i = 0; i < guessed.length; i++) {
          if (word.indexOf(guessed[i]) === -1) wrongCount++;
        }
        engine.println(hangmanArt[wrongCount]);
        engine.println('');

        engine.println('Guessed letters: ' + (guessed.length > 0 ? guessed.join(', ') : 'none'));
        engine.println('Wrong guesses: ' + wrongCount + '/' + maxWrong);
        engine.println('');

        var guess = await engine.input('Guess a letter: ');
        guess = guess.trim().toUpperCase();

        if (guess.length !== 1 || !/^[A-Z]$/.test(guess)) {
          engine.println('Please enter a single letter.');
          continue;
        }

        if (guessed.indexOf(guess) !== -1) {
          engine.println('You already guessed that letter!');
          continue;
        }

        guessed.push(guess);

        if (word.indexOf(guess) !== -1) {
          engine.println('Correct!');
          for (var i = 0; i < word.length; i++) {
            if (word[i] === guess) correctLetters[i] = true;
          }

          var won = true;
          for (var i = 0; i < correctLetters.length; i++) {
            if (!correctLetters[i]) { won = false; break; }
          }

          if (won) {
            engine.println('');
            engine.println('You win! The word was: ' + word);
            break;
          }
        } else {
          wrongGuesses++;
          if (wrongGuesses >= maxWrong) {
            engine.println('');
            engine.println(hangmanArt[maxWrong]);
            engine.println('');
            engine.println('You lose! The word was: ' + word);
            break;
          }
          engine.println('Wrong!');
        }
        engine.println('');
      }

      engine.println('');
      var again = await engine.input('Play again? (y/n): ');
      if (again.trim().toLowerCase() !== 'y') playing = false;
    }

    engine.end();
  };
})();
