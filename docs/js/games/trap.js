(function(){
  var slug='trap';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Trap');
    engine.println('I am thinking of a number between 1 and 100.');
    engine.println('After each wrong guess, the valid range narrows.');
    engine.println('Guesses outside the range don\'t count!');
    engine.setInstructions('Guess the number 1-100. The valid range shrinks with each wrong guess. Guesses outside the range are not counted.');

    var secret = RNG.int(1,100);
    var low = 1;
    var high = 100;
    var guesses = 0;
    var won = false;

    while(!won){
      engine.println('');
      engine.println('Valid range: ' + low + ' to ' + high);
      var guess = await engine.input('Your guess: ');
      var num = parseInt(guess,10);
      if(isNaN(num)){
        engine.println('Please enter a number.');
        continue;
      }

      if(num < low || num > high){
        engine.println('That\'s not in range!');
        continue;
      }

      guesses++;

      if(num === secret){
        engine.println('You got it!');
        won = true;
      } else if(num < secret){
        engine.println('Too low.');
        low = num + 1;
      } else {
        engine.println('Too high.');
        high = num - 1;
      }

      if(low > high){
        engine.println('Something went wrong - the range is empty!');
        break;
      }
    }

    engine.println('You got it in ' + guesses + ' guess(es)!');
    engine.end();
  };
})();
