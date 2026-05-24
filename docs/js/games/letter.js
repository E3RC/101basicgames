(function(){
  var slug='letter';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Letter');
    engine.println('I am thinking of a letter from A to Z.');
    engine.println('Try to guess it!');
    engine.setInstructions('Guess the secret letter A-Z. I\'ll tell you if it\'s earlier or later in the alphabet.');

    var secret = String.fromCharCode(65 + Math.floor(Math.random()*26));
    var guesses = 0;
    var won = false;

    while(!won){
      engine.println('');
      var guess = await engine.input('Your guess: ');
      guess = guess.trim().toUpperCase();
      if(!/^[A-Z]$/.test(guess)){
        engine.println('Please enter a single letter A-Z.');
        continue;
      }
      guesses++;

      if(guess === secret){
        engine.println('You got it!');
        won = true;
      } else if(guess < secret){
        engine.println('Later in the alphabet.');
      } else {
        engine.println('Earlier in the alphabet.');
      }
    }

    engine.println('You got it in ' + guesses + ' guess(es)!');
    engine.end();
  };
})();
