(function(){
  var slug='hurkle';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Hurkle');
    engine.println('A Hurkle is hiding on a 10x10 grid (0-9, 0-9).');
    engine.println('You have 10 guesses to find it.');
    engine.println('After each guess, I\'ll tell you the direction to the Hurkle.');
    engine.setInstructions('Find the Hurkle on a 10x10 grid. Guess coordinates (x,y). Directions: N, NE, E, SE, S, SW, W, NW.');

    var hx = RNG.int(0,9);
    var hy = RNG.int(0,9);
    var maxGuesses = 10;

    for(var g=1;g<=maxGuesses;g++){
      engine.println('');
      var guess = await engine.input('Guess #' + g + ' (x,y): ');
      var parts = guess.split(',');
      if(parts.length !== 2){
        engine.println('Please enter coordinates as x,y (e.g., 3,5).');
        g--;
        continue;
      }
      var gx = parseInt(parts[0],10);
      var gy = parseInt(parts[1],10);
      if(isNaN(gx) || isNaN(gy) || gx<0 || gx>9 || gy<0 || gy>9){
        engine.println('Coordinates must be between 0 and 9.');
        g--;
        continue;
      }

      if(gx === hx && gy === hy){
        engine.println('You found the Hurkle!');
        return engine.end();
      }

      var dir = '';
      if(gy < hy) dir += 'North';
      if(gy > hy) dir += 'South';
      if(gx < hx) dir += 'East';
      if(gx > hx) dir += 'West';

      engine.println('The Hurkle is to the ' + dir);

      engine.println('');
      engine.println('  Grid hint (H=Hurkle, *=guessed):');
      for(var row=9;row>=0;row--){
        var line = row + ' ';
        if(hy === row) line += 'H ';
        else line += '. ';
        engine.println(line);
      }
      engine.println('  0 1 2 3 4 5 6 7 8 9');
    }

    engine.println('');
    engine.println('You ran out of guesses! The Hurkle was at (' + hx + ',' + hy + ').');
    engine.end();
  };
})();
