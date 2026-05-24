(function(){
  var slug='basket';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Basketball');
    engine.setInstructions('1-on-1 basketball. 10 turns each. Choose shot distance: close (80%), medium (50%), far (30%). First to score the most wins.');

    function shootPct(dist) {
      if (dist === 'close') return 80;
      if (dist === 'medium') return 50;
      return 30;
    }

    var playerScore = 0, compScore = 0;
    var turns = 10;
    var playerTurn = true;

    for (var t = 1; t <= turns; t++) {
      engine.clear();
      engine.println('--- Turn ' + t + ' of ' + turns + ' ---');
      engine.println('You: ' + playerScore + '  Computer: ' + compScore);
      engine.println('');

      if (playerTurn) {
        engine.println('Your shot:');
        var dist = await engine.input('Distance (close/medium/far): ');
        dist = dist.trim().toLowerCase();
        if (['close','medium','far'].indexOf(dist) === -1) { engine.println('Invalid. Use close, medium, or far.'); t--; continue; }
        var pct = shootPct(dist);
        var roll = RNG.int(1,100);
        if (roll <= pct) {
          engine.println('SWISH! You scored!');
          playerScore += 2;
        } else {
          engine.println('CLANK! You missed.');
        }
      } else {
        var compDists = ['close','medium','medium','far'];
        var compDist = RNG.pick(compDists);
        engine.println('Computer shoots ' + compDist + '...');
        var pct2 = shootPct(compDist);
        var roll2 = RNG.int(1,100);
        if (roll2 <= pct2) {
          engine.println('SWISH! Computer scores!');
          compScore += 2;
        } else {
          engine.println('CLANK! Computer missed.');
        }
      }

      playerTurn = !playerTurn;
      if (t < turns) await engine.input('Press Enter for next turn...');
    }

    engine.clear();
    engine.println('FINAL SCORE');
    engine.println('You: ' + playerScore + '  Computer: ' + compScore);
    if (playerScore > compScore) engine.println('YOU WIN!');
    else if (compScore > playerScore) engine.println('COMPUTER WINS!');
    else engine.println('TIE GAME!');
    engine.end();
  };
})();
