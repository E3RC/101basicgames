(function(){
  var slug='bagles';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Bagels');
    engine.println('I am thinking of a secret 3-digit number.');
    engine.println('Each digit is different. You have 20 guesses.');
    engine.println('After each guess, I will give you clues:');
    engine.println('  Fermi   - digit is correct and in the right position');
    engine.println('  Pico    - digit is correct but in the wrong position');
    engine.println('  Bagels  - no digits are correct');
    engine.setInstructions('Guess the secret 3-digit number. All digits are different. Get clues: Fermi (correct digit/position), Pico (correct digit, wrong position), Bagels (nothing correct).');

    var digits = [0,1,2,3,4,5,6,7,8,9];
    RNG.shuffle(digits);
    var secret = digits.slice(0,3).join('');

    var guesses = 0;
    var maxGuesses = 20;
    var won = false;

    while(guesses < maxGuesses){
      var remaining = maxGuesses - guesses;
      engine.println('');
      var guess = await engine.input('Guess #' + (guesses+1) + ' (' + remaining + ' left): ');
      guess = guess.trim();
      if(!/^\d{3}$/.test(guess)){
        engine.println('Please enter a 3-digit number.');
        continue;
      }
      if (guess === secret){
        engine.println('You got it!');
        won = true;
        break;
      }
      var clues = [];
      for(var i=0;i<3;i++){
        if(guess[i] === secret[i]){
          clues.push('Fermi');
        } else if(secret.indexOf(guess[i]) !== -1){
          clues.push('Pico');
        }
      }
      if(clues.length === 0){
        clues.push('Bagels');
      }
      clues.sort();
      engine.println(clues.join(' '));
      guesses++;
    }

    if(!won){
      engine.println('');
      engine.println('The number was ' + secret);
    }
    engine.end();
  };
})();
