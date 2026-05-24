(function(){
  var slug='digits';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Digits');
    engine.setInstructions('Guess the secret 5-digit number. After each guess, I\'ll tell you how many digits are correct and how many are in the right position. Lower score is better.');

    var playing = true;
    while(playing){
      var secret = '';
      for(var i=0;i<5;i++){
        secret += Math.floor(Math.random()*10).toString();
      }

      engine.println('I am thinking of a 5-digit number.');
      engine.println('Guess it! I\'ll tell you how many digits are correct');
      engine.println('and how many are in the right position.');

      var guesses = 0;
      var won = false;

      while(!won){
        engine.println('');
        var guess = await engine.input('Guess: ');
        guess = guess.trim();
        if(!/^\d{5}$/.test(guess)){
          engine.println('Please enter a 5-digit number.');
          continue;
        }
        guesses++;

        if(guess === secret){
          engine.println('You got it!');
          won = true;
          break;
        }

        var correctDigits = 0;
        var rightPlace = 0;
        var secCount = {};
        var gueCount = {};
        for(var i=0;i<5;i++){
          secCount[secret[i]] = (secCount[secret[i]]||0) + 1;
          gueCount[guess[i]] = (gueCount[guess[i]]||0) + 1;
          if(guess[i] === secret[i]) rightPlace++;
        }
        for(var d in gueCount){
          if(secCount[d]){
            correctDigits += Math.min(secCount[d], gueCount[d]);
          }
        }
        engine.println(correctDigits + ' digit(s) correct, ' + rightPlace + ' in the right place.');
      }

      engine.println('You took ' + guesses + ' guess(es).');
      var score = Math.max(0, 100 - guesses * 5);
      engine.println('Your score: ' + score);

      var again = await engine.input('Play again? (y/n): ');
      playing = again.trim().toLowerCase() === 'y';
    }
    engine.end();
  };
})();
