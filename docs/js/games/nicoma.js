(function(){
  var slug='nicoma';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Nicoma');
    engine.println('Think of a number between 1 and 100.');
    engine.println('I (the computer) will try to guess it.');
    engine.println('After each guess, tell me if it\'s "high", "low", or "correct".');
    engine.setInstructions('Think of a number 1-100. The computer will guess. Answer: high, low, or correct.');

    var low = 1;
    var high = 100;
    var guesses = 0;
    var won = false;

    engine.println('');
    var ready = await engine.input('Ready? Press Enter when you have your number: ');

    while(!won){
      var guess = Math.floor((low + high) / 2);
      guesses++;

      engine.println('');
      engine.println('My guess is: ' + guess);
      var feedback = await engine.input('Is it high, low, or correct? ');
      feedback = feedback.trim().toLowerCase();

      if(feedback === 'correct'){
        engine.println('I got it in ' + guesses + ' guess(es)!');
        won = true;
      } else if(feedback === 'high'){
        high = guess - 1;
        if(low > high){
          engine.println('Is that so? Did you change your number?');
          break;
        }
      } else if(feedback === 'low'){
        low = guess + 1;
        if(low > high){
          engine.println('Is that so? Did you change your number?');
          break;
        }
      } else {
        engine.println('Please answer "high", "low", or "correct".');
        guesses--;
      }
    }
    engine.end();
  };
})();
