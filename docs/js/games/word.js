(function(){
  var slug='word';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Word');
    engine.setInstructions('Guess the secret 5-letter word. After each guess, feedback shows for each position: correct letter (shown), wrong position (?), or not in word (_).');
    engine.println('W O R D   G U E S S');
    engine.println('');

    var words = [
      'APPLE', 'BRAIN', 'CRANE', 'DREAM', 'EAGLE',
      'FLAME', 'GRAPE', 'HOUSE', 'IMAGE', 'JUICE',
      'KNIFE', 'LEMON', 'MOUSE', 'NIGHT', 'OCEAN',
      'PIANO', 'QUEEN', 'RIVER', 'SNAKE', 'TABLE',
      'ULTRA', 'VOICE', 'WATER', 'YACHT', 'ZEBRA',
      'BLACK', 'CLOUD', 'DRIVE', 'EARTH', 'FRUIT'
    ];

    var playing = true;

    while (playing) {
      var secret = RNG.pick(words);
      var guesses = [];
      var maxGuesses = 20;
      var won = false;

      engine.println('I am thinking of a 5-letter word.');
      engine.println('');

      while (guesses.length < maxGuesses) {
        var feedback = '';
        for (var i = 0; i < secret.length; i++) {
          if (guesses.length > 0) {
            var lastGuess = guesses[guesses.length - 1];
            feedback += lastGuess[i] + ' ';
          } else {
            feedback += '_ ';
          }
        }

        engine.println('Guess #' + (guesses.length + 1) + ' of ' + maxGuesses);
        engine.println('');

        var guessInput = await engine.input('Enter your 5-letter guess: ');
        var guess = guessInput.trim().toUpperCase();

        if (guess.length !== 5 || !/^[A-Z]{5}$/.test(guess)) {
          engine.println('Please enter a 5-letter word.');
          continue;
        }

        guesses.push(guess);

        if (guess === secret) {
          engine.println('');
          engine.println(secret.split('').join(' '));
          engine.println('');
          engine.println('You got it in ' + guesses.length + ' guesses!');
          won = true;
          break;
        }

        var result = [];
        var secretChars = secret.split('');
        var guessChars = guess.split('');
        var matched = [false, false, false, false, false];

        for (var i = 0; i < 5; i++) {
          if (guessChars[i] === secretChars[i]) {
            result.push(guessChars[i]);
            matched[i] = true;
          } else {
            result.push('_');
          }
        }

        for (var i = 0; i < 5; i++) {
          if (result[i] === '_') {
            for (var j = 0; j < 5; j++) {
              if (!matched[j] && guessChars[i] === secretChars[j]) {
                result[i] = '?';
                matched[j] = true;
                break;
              }
            }
          }
        }

        engine.println('Result: ' + result.join(' '));
        engine.println('');
      }

      if (!won) {
        engine.println('Out of guesses! The word was: ' + secret);
      }

      engine.println('');
      var again = await engine.input('Play again? (y/n): ');
      if (again.trim().toLowerCase() !== 'y') playing = false;
    }

    engine.end();
  };
})();
