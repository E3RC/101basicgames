(function(){
  var slug='basbal';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Baseball');
    engine.setInstructions('3-inning baseball. You bat then field each inning. Choose pitch type (fastball/curve/changeup). Choose swing or take. Hits are random based on pitch contact. 3 outs per inning.');

    function inningLabel(n) { return n===0?'1st':n===1?'2nd':'3rd'; }

    function atBatResult(swing, pitch) {
      var r = RNG.int(1,100);
      var contactMod = 0;
      if (pitch === 'fastball') contactMod = swing ? 0 : -5;
      else if (pitch === 'curve') contactMod = swing ? -5 : 5;
      else if (pitch === 'changeup') contactMod = swing ? 5 : -5;
      var roll = r + contactMod;
      if (!swing) return roll < 30 ? 'strike' : 'ball';
      if (roll < 20) return 'strike';
      if (roll < 40) return 'out';
      if (roll < 60) return 'single';
      if (roll < 75) return 'double';
      if (roll < 88) return 'triple';
      return 'homerun';
    }

    var playerScore = 0, compScore = 0;
    var inning = 0;

    while (inning < 3) {
      engine.clear();
      engine.println('--- ' + inningLabel(inning) + ' Inning ---');
      engine.println('Score: You ' + playerScore + ' - Computer ' + compScore);
      engine.println('');

      for (var half = 0; half < 2; half++) {
        var batting = half === 0 ? 'You' : 'Computer';
        engine.println(batting + ' batting:');
        var outs = 0, hits = 0, runs = 0;
        var bases = [false, false, false];

        function showBases() {
          var d = '  ';
          d += bases[2] ? 'R ' : '  ';
          d += '  \n';
          d += bases[1] ? 'R ' : '  ';
          d += bases[0] ? 'R' : ' ';
          return d;
        }

        while (outs < 3) {
          engine.println('Outs: ' + outs + '  Runs: ' + runs);
          engine.println(showBases());
          engine.println('');

          if (batting === 'You') {
            var pitchChoice = await engine.input('Your pitch (fastball/curve/changeup): ');
            pitchChoice = pitchChoice.trim().toLowerCase();
            if (['fastball','curve','changeup'].indexOf(pitchChoice) === -1) { engine.println('Invalid pitch.'); continue; }
            var swingChoice = await engine.input('Swing or take? (s/t): ');
            var swing = swingChoice.trim().toLowerCase() === 's';
            var result = atBatResult(swing, pitchChoice);
            engine.println('Result: ' + result.toUpperCase());
          } else {
            var pitches = ['fastball','curve','changeup'];
            var compPitch = RNG.pick(pitches);
            var compSwing = RNG.pick([true, false, true]);
            engine.println('You threw: ' + compPitch);
            engine.println('Computer chooses: ' + (compSwing ? 'swing' : 'take'));
            var result = atBatResult(compSwing, compPitch);
            engine.println('Result: ' + result.toUpperCase());
          }

          if (result === 'ball') { engine.println('Ball.'); }
          else if (result === 'strike') { engine.println('Strike!'); }
          else if (result === 'out') { outs++; engine.println('Out!'); }
          else if (result === 'single') {
            if (bases[2]) { runs++; bases[2] = false; }
            if (bases[1]) { bases[2] = true; bases[1] = false; }
            bases[0] = true;
            engine.println('Single!');
          } else if (result === 'double') {
            if (bases[2]) { runs++; bases[2] = false; }
            if (bases[1]) { runs++; bases[1] = false; }
            if (bases[0]) { bases[2] = true; bases[0] = false; }
            bases[1] = true;
            engine.println('Double!');
          } else if (result === 'triple') {
            for (var b = 0; b < 3; b++) { if (bases[b]) { runs++; bases[b] = false; } }
            bases[2] = true;
            engine.println('Triple!');
          } else if (result === 'homerun') {
            runs++;
            for (var b2 = 0; b2 < 3; b2++) { if (bases[b2]) { runs++; bases[b2] = false; } }
            engine.println('HOME RUN!');
          }
          engine.println('');
        }

        if (batting === 'You') playerScore += runs;
        else compScore += runs;
        engine.println('Inning over. ' + batting + ' scored ' + runs + ' runs.');
        engine.println('Score: You ' + playerScore + ' - Computer ' + compScore);
        if (half === 0) await engine.input('Press Enter for bottom half...');
      }
      inning++;
    }

    engine.clear();
    engine.println('FINAL SCORE: You ' + playerScore + ' - Computer ' + compScore);
    if (playerScore > compScore) engine.println('YOU WIN!');
    else if (playerScore < compScore) engine.println('COMPUTER WINS!');
    else engine.println('TIE GAME!');
    engine.end();
  };
})();
