(function(){
  var slug='buleye';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Bullseye');
    engine.setInstructions('Darts! 3 rounds of 3 darts each. Aim by choosing height (high/mid/low) and direction (left/center/right). Bullseye=50, Inner=25, outer rings vary.');

    function throwDart(vert, horiz) {
      var baseAcc = 70;
      var vertMod = vert === 'mid' ? 10 : 0;
      var horizMod = horiz === 'center' ? 10 : 0;
      var acc = baseAcc + vertMod + horizMod;

      var r = RNG.int(1, 100);
      if (r <= acc) {
        var r2 = RNG.int(1, 100);
        if (r2 <= 5) return 50;
        if (r2 <= 20) return 25;
        if (r2 <= 45) return RNG.pick([10, 20]);
        if (r2 <= 70) return RNG.pick([5, 15]);
        return RNG.pick([1, 2, 3, 4]);
      } else {
        var missRoll = RNG.int(1, 100);
        if (missRoll <= 30) return RNG.pick([1, 2, 3]);
        return 0;
      }
    }

    var totalScore = 0;

    for (var rd = 0; rd < 3; rd++) {
      engine.clear();
      engine.println('--- Round ' + (rd + 1) + ' of 3 ---');
      engine.println('Current score: ' + totalScore);
      engine.println('');

      var roundScore = 0;

      for (var d = 0; d < 3; d++) {
        engine.println('Dart ' + (d + 1) + ':');
        var vert = await engine.input('Height (high/mid/low): ');
        vert = vert.trim().toLowerCase();
        if (['high','mid','low'].indexOf(vert) === -1) { engine.println('Invalid.'); d--; continue; }
        var horiz = await engine.input('Direction (left/center/right): ');
        horiz = horiz.trim().toLowerCase();
        if (['left','center','right'].indexOf(horiz) === -1) { engine.println('Invalid.'); d--; continue; }

        var score = throwDart(vert, horiz);
        roundScore += score;
        if (score === 50) engine.println('BULLSEYE! 50 points!');
        else if (score === 25) engine.println('Inner ring! 25 points!');
        else if (score > 0) engine.println('Scored ' + score + ' points!');
        else engine.println('Missed! 0 points.');
        engine.println('');
      }

      totalScore += roundScore;
      engine.println('Round ' + (rd + 1) + ' total: ' + roundScore);
      engine.println('Overall total: ' + totalScore);
      if (rd < 2) await engine.input('Press Enter for next round...');
    }

    engine.clear();
    engine.println('=== FINAL SCORE ===');
    engine.println('Total: ' + totalScore + ' points');
    if (totalScore >= 200) engine.println('Outstanding!');
    else if (totalScore >= 150) engine.println('Great shooting!');
    else if (totalScore >= 100) engine.println('Good game!');
    else engine.println('Keep practicing!');
    engine.end();
  };
})();
