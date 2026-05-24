(function(){
  var slug='mugwmp';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Mugwump');
    engine.println('Four Mugwumps are hiding on a 10x10 grid (0-9, 0-9).');
    engine.println('You have 10 turns to find them all.');
    engine.println('After each guess, I\'ll show the distance to each remaining Mugwump.');
    engine.setInstructions('Find all 4 Mugwumps on a 10x10 grid in 10 turns. Guess coordinates (x,y). Distances are Euclidean rounded to nearest integer.');

    var mugwumps = [];
    var used = {};
    while(mugwumps.length < 4){
      var x = RNG.int(0,9);
      var y = RNG.int(0,9);
      var key = x+','+y;
      if(!used[key]){
        used[key] = true;
        mugwumps.push({x:x,y:y});
      }
    }

    var maxTurns = 10;
    var found = [];

    for(var turn=1;turn<=maxTurns;turn++){
      engine.println('');
      engine.println('--- Turn ' + turn + ' ---');
      var guess = await engine.input('Guess (x,y): ');
      var parts = guess.split(',');
      if(parts.length !== 2){
        engine.println('Please enter coordinates as x,y (e.g., 3,5).');
        turn--;
        continue;
      }
      var gx = parseInt(parts[0],10);
      var gy = parseInt(parts[1],10);
      if(isNaN(gx) || isNaN(gy) || gx<0 || gx>9 || gy<0 || gy>9){
        engine.println('Coordinates must be between 0 and 9.');
        turn--;
        continue;
      }

      engine.println('Distances to remaining Mugwumps:');
      var allFound = true;
      for(var i=0;i<mugwumps.length;i++){
        var m = mugwumps[i];
        if(found[i]) continue;
        allFound = false;
        if(m.x === gx && m.y === gy){
          engine.println('Mugwump #' + (i+1) + ' found!');
          found[i] = true;
        } else {
          var dx = m.x - gx;
          var dy = m.y - gy;
          var dist = Math.round(Math.sqrt(dx*dx + dy*dy));
          engine.println('Mugwump #' + (i+1) + ' is ' + dist + ' unit(s) away');
        }
      }

      var remaining = 0;
      for(var i=0;i<found.length;i++){
        if(!found[i]) remaining++;
      }

      if(remaining === 0){
        engine.println('');
        engine.println('You found all 4 Mugwumps in ' + turn + ' turn(s)!');
        return engine.end();
      } else {
        engine.println(remaining + ' Mugwump(s) remaining.');
      }
    }

    engine.println('');
    engine.println('Out of turns! The Mugwumps were at:');
    for(var i=0;i<mugwumps.length;i++){
      if(!found[i]){
        engine.println('Mugwump #' + (i+1) + ': (' + mugwumps[i].x + ',' + mugwumps[i].y + ')');
      }
    }
    engine.end();
  };
})();
