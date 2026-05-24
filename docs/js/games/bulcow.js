(function(){
  var slug='bulcow';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Bulls and Cows');
    engine.println('I am thinking of a secret 4-digit number with all different digits.');
    engine.println('You have 10 guesses. After each guess:');
    engine.println('  Bulls - correct digit in the correct position');
    engine.println('  Cows  - correct digit in the wrong position');
    engine.setInstructions('Guess the secret 4-digit number (all digits different). Bulls = right digit/position. Cows = right digit/wrong position. 10 guesses.');

    var digits = [0,1,2,3,4,5,6,7,8,9];
    RNG.shuffle(digits);
    var secret = digits.slice(0,4).join('');

    var maxGuesses = 10;
    var won = false;

    for(var g=1;g<=maxGuesses;g++){
      engine.println('');
      var guess = await engine.input('Guess #' + g + ': ');
      guess = guess.trim();
      if(!/^\d{4}$/.test(guess)){
        engine.println('Please enter a 4-digit number.');
        g--;
        continue;
      }
      if(guess === secret){
        engine.println('You got it!');
        won = true;
        break;
      }
      var bulls = 0, cows = 0;
      for(var i=0;i<4;i++){
        if(guess[i] === secret[i]){
          bulls++;
        } else if(secret.indexOf(guess[i]) !== -1){
          cows++;
        }
      }
      engine.println('Bulls: ' + bulls + ', Cows: ' + cows);
    }

    if(!won){
      engine.println('');
      engine.println('The number was ' + secret);
    }
    engine.end();
  };
})();
