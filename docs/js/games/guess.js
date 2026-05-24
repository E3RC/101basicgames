(function(){
  var slug='guess';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Guess');
    engine.println('I am thinking of a number between 1 and 100.');
    engine.println('Try to guess it!');
    engine.setInstructions('Guess the number between 1 and 100. I\'ll tell you if you\'re too high or too low.');

    var secret = RNG.int(1,100);
    var guesses = 0;
    var won = false;

    while(!won){
      engine.println('');
      var guess = await engine.input('Your guess: ');
      var num = parseInt(guess,10);
      if(isNaN(num) || num < 1 || num > 100){
        engine.println('Please enter a number between 1 and 100.');
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

    engine.println('You got it in ' + guesses + ' guess(es)!');
    engine.end();
  };
})();
