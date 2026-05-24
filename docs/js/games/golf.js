(function(){
  var slug='golf';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Golf');
    engine.setInstructions('9 holes of golf. Choose club (driver/iron/wedge/putter) and aim (left/center/right). Get closest to the pin in fewest strokes. Par varies per hole.');

    function clubDist(club) {
      if (club === 'driver') return {min:200, max:250};
      if (club === 'iron') return {min:100, max:180};
      if (club === 'wedge') return {min:50, max:100};
      return {min:1, max:30};
    }

    function aimMod(aim) {
      if (aim === 'left') return RNG.int(-20, -5);
      if (aim === 'center') return RNG.int(-10, 10);
      return RNG.int(5, 20);
    }

    function chooseClub(dist) {
      if (dist > 200) return 'driver';
      if (dist > 100) return 'iron';
      if (dist > 30) return 'wedge';
      return 'putter';
    }

    var totalStrokes = 0;
    var totalPar = 0;

    for (var hole = 0; hole < 9; hole++) {
      var holeDist = RNG.int(150, 500);
      var par = holeDist < 200 ? 3 : (holeDist < 350 ? 4 : 5);
      totalPar += par;
      var distToPin = holeDist;
      var strokes = 0;

      engine.clear();
      engine.println('--- Hole ' + (hole+1) + ' ---');
      engine.println('Distance: ' + holeDist + ' yds  Par: ' + par);
      engine.println('');

      while (distToPin > 0) {
        engine.println('Distance to pin: ' + distToPin + ' yds');
        var recClub = chooseClub(distToPin);
        engine.println('Recommended club: ' + recClub);
        var club = await engine.input('Club (driver/iron/wedge/putter): ');
        club = club.trim().toLowerCase();
        if (['driver','iron','wedge','putter'].indexOf(club) === -1) { engine.println('Invalid.'); continue; }
        var d = clubDist(club);
        if (distToPin < d.min && distToPin < 30 && club !== 'putter') {
          engine.println('Too close for that club. Try putter or wedge.');
          continue;
        }

        var aim = await engine.input('Aim (left/center/right): ');
        aim = aim.trim().toLowerCase();
        if (['left','center','right'].indexOf(aim) === -1) { engine.println('Invalid.'); continue; }

        var shotDist = RNG.int(d.min, d.max);
        var mod = aimMod(aim);
        var actualDist = shotDist + mod;
        if (actualDist < 0) actualDist = 0;

        var newDist = Math.abs(distToPin - actualDist);
        engine.println('You hit ' + actualDist + ' yds' + (mod !== 0 ? ' (aim: ' + aim + ')' : ''));
        distToPin = newDist;
        strokes++;

        if (distToPin <= 10 && club === 'putter' && distToPin > 0) {
          var putt = await engine.input('Putt? (y/n): ');
          if (putt.trim().toLowerCase() === 'y') {
            if (RNG.int(1,100) <= 70) {
              engine.println('You sunk the putt!');
              distToPin = 0;
              strokes++;
            } else {
              engine.println('Missed. Try again.');
            }
          }
        }
      }

      totalStrokes += strokes;
      engine.println('Hole ' + (hole+1) + ' complete in ' + strokes + ' (Par: ' + par + ')');
      engine.println('Total: ' + totalStrokes + ' (Par: ' + totalPar + ', ' + (totalStrokes - totalPar) + ')');
      if (hole < 8) await engine.input('Press Enter for next hole...');
    }

    engine.clear();
    engine.println('FINAL SCORE');
    engine.println('Total Strokes: ' + totalStrokes);
    engine.println('Total Par: ' + totalPar);
    var diff = totalStrokes - totalPar;
    if (diff < 0) engine.println('You are ' + Math.abs(diff) + ' under par! Excellent!');
    else if (diff === 0) engine.println('Even par. Great round!');
    else engine.println('You are ' + diff + ' over par.');
    engine.end();
  };
})();
