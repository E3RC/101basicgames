(function(){
  var slug='stars';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Stars');
    engine.println('I am thinking of a number between 1 and 100.');
    engine.println('After each wrong guess, I\'ll show stars:');
    engine.println('  1 star if your guess is too low');
    engine.println('  2 stars if your guess is too high');
    engine.println('Watch the stars build up!');
    engine.setInstructions('Guess the number 1-100. Each wrong guess adds stars: 1 for too low, 2 for too high.');

    var secret = RNG.int(1,100);
    var guesses = 0;
    var won = false;
    var starRows = [];

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
      } else {
        var stars = (num < secret) ? 1 : 2;
        var row = '';
        for(var i=0;i<stars;i++){
          row += '* ';
        }
        starRows.push(row);

        for(var i=0;i<starRows.length;i++){
          engine.println(starRows[i]);
        }
      }
    }

    engine.println('You got it in ' + guesses + ' guess(es)!');
    engine.end();
  };
})();
