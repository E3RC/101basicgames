(function(){
  var slug='fipfop';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Fip-Fop');
    engine.setInstructions('Guess the secret number 1-100. After each guess, you get FIP (divisible by 3), FOP (divisible by 5), or FIPFOP (both), plus too high/too low hints.');
    engine.println('I am thinking of a number between 1 and 100.');
    engine.println('After each guess I will say:');
    engine.println('  FIP    - if your guess is divisible by 3');
    engine.println('  FOP    - if your guess is divisible by 5');
    engine.println('  FIPFOP - if both');
    engine.println('  (nothing) - if neither');
    engine.println('I will also tell you too high or too low.');
    engine.println('');

    var secret = RNG.int(1, 100);
    var guesses = 0;
    var won = false;

    while (!won) {
      var guess = await engine.input('Your guess: ');
      var num = parseInt(guess, 10);
      if (isNaN(num) || num < 1 || num > 100) {
        engine.println('Please enter a number between 1 and 100.');
        continue;
      }
      guesses++;

      var fip = (num % 3 === 0);
      var fop = (num % 5 === 0);
      var msg = '';
      if (fip && fop) msg = 'FIPFOP';
      else if (fip) msg = 'FIP';
      else if (fop) msg = 'FOP';
      if (msg) engine.println(msg);

      if (num === secret) {
        engine.println('You got it!');
        won = true;
      } else if (num < secret) {
        engine.println('Too low.');
      } else {
        engine.println('Too high.');
      }
    }

    engine.println('You got it in ' + guesses + ' guess(es)!');
    engine.end();
  };
})();
