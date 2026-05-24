(function(){
  var slug='hilo';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Hi-Lo');
    engine.println('Hi-Lo number guessing game!');
    engine.setInstructions('Guess the number. You can set the range. After each game, see your stats.');

    var totalGames = 0;
    var totalGuesses = 0;

    var playing = true;
    while(playing){
      engine.println('');
      var low = 1, high = 1000;
      var rangeInput = await engine.input('Set range (low,high) or press Enter for 1-1000: ');
      rangeInput = rangeInput.trim();
      if(rangeInput !== ''){
        var parts = rangeInput.split(',');
        if(parts.length === 2){
          var l = parseInt(parts[0],10);
          var h = parseInt(parts[1],10);
          if(!isNaN(l) && !isNaN(h) && l < h){
            low = l;
            high = h;
          }
        }
      }

      engine.println('I\'m thinking of a number between ' + low + ' and ' + high + '.');
      var secret = RNG.int(low, high);
      var guesses = 0;
      var won = false;

      while(!won){
        engine.println('');
        var guess = await engine.input('Your guess: ');
        var num = parseInt(guess,10);
        if(isNaN(num) || num < low || num > high){
          engine.println('Please enter a number between ' + low + ' and ' + high + '.');
          continue;
        }
        guesses++;

        if(num === secret){
          engine.println('You got it!');
          won = true;
        } else if(num < secret){
          engine.println('Too low.');
        } else {
          engine.println('Too high.');
        }
      }

      totalGames++;
      totalGuesses += guesses;
      var avg = (totalGuesses / totalGames).toFixed(1);
      engine.println('You took ' + guesses + ' guess(es).');
      engine.println('Stats: ' + totalGames + ' game(s), average ' + avg + ' guesses.');

      var again = await engine.input('Play again? (y/n): ');
      playing = again.trim().toLowerCase() === 'y';
    }
    engine.end();
  };
})();
