(function(){
  var slug='bowl';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Bowling');
    engine.setInstructions('10 frames. Roll 2 balls per frame (except 10th). Enter pins knocked down (0-remaining). Strike = 10 + next 2 rolls. Spare = 10 + next roll.');

    function showPins(pins) {
      var p = [];
      for (var i = 1; i <= 10; i++) p.push(pins[i] ? 'X' : 'O');
      return ' ' + p[6] + ' ' + p[7] + ' ' + p[8] + ' ' + p[9] + '\n' +
             '   ' + p[3] + ' ' + p[4] + ' ' + p[5] + '\n' +
             '     ' + p[1] + ' ' + p[2] + '\n' +
             '       ' + p[0];
    }

    function calcScore(frames) {
      var total = 0;
      for (var f = 0; f < 10; f++) {
        var fr = frames[f];
        if (!fr) break;
        if (f < 9) {
          if (fr[0] === 10) {
            var nf = frames[f+1];
            total += 10 + (nf ? nf[0] : 0);
            if (nf && nf[0] === 10 && f+1 < 9) {
              var nf2 = frames[f+2];
              total += nf2 ? nf2[0] : 0;
            } else if (nf && nf.length > 1) {
              total += nf[1];
            }
            total += fr[0];
          } else if (fr.length >= 2 && fr[0] + fr[1] === 10) {
            var nf3 = frames[f+1];
            total += 10 + (nf3 ? nf3[0] : 0) + fr[0] + fr[1];
          } else {
            for (var r = 0; r < fr.length; r++) total += fr[r];
          }
        } else {
          for (var r2 = 0; r2 < fr.length; r2++) total += fr[r2];
        }
      }
      return total;
    }

    var frames = [];
    for (var f = 0; f < 10; f++) {
      engine.clear();
      engine.println('--- Frame ' + (f+1) + ' ---');
      var totalScore = calcScore(frames);
      engine.println('Current Score: ' + totalScore);
      engine.println('');

      var pins = {};
      for (var i = 1; i <= 10; i++) pins[i] = true;
      var remaining = 10;
      var frameRolls = [];
      var maxRolls = (f === 9) ? 3 : 2;

      for (var roll = 0; roll < maxRolls; roll++) {
        if (remaining === 0) {
          if (f === 9 && (frameRolls[0] === 10 || frameRolls[0] + frameRolls[1] === 10)) {
          } else break;
        }
        engine.println(showPins(pins));
        engine.println('');
        var inp = await engine.input('Pins knocked down (0-' + remaining + '): ');
        var knocked = parseInt(inp, 10);
        if (isNaN(knocked) || knocked < 0 || knocked > remaining) { engine.println('Invalid.'); roll--; continue; }
        if (knocked === remaining) engine.println('STRIKE!');
        else if (roll > 0 && frameRolls[roll-1] + knocked === remaining && remaining > 0) engine.println('SPARE!');
        frameRolls.push(knocked);
        if (knocked === remaining && remaining > 0) {
          for (var k in pins) if (pins[k]) { pins[k] = false; break; }
          remaining = 0;
          if (f < 9) break;
        } else {
          var count = 0;
          for (var k2 in pins) {
            if (pins[k2]) {
              pins[k2] = false;
              count++;
              if (count >= knocked) break;
            }
          }
          remaining -= knocked;
        }
      }

      frames.push(frameRolls);
      engine.println('Frame ' + (f+1) + ' rolls: ' + frameRolls.join(', '));
      if (f < 9) await engine.input('Press Enter for next frame...');
    }

    engine.clear();
    engine.println('FINAL SCORE: ' + calcScore(frames));
    engine.end();
  };
})();
