(function(){
  var slug='footbal';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('High School Football');
    engine.setInstructions('Simplified football. 2 downs to get 10 yards. Choose run or pass. 80-yard field. 4-minute quarters.');

    function playOutcome(off, def) {
      var r = RNG.int(1,100);
      if (off === 'run') {
        if (def === 'rush') {
          if (r < 30) return {yds:1, msg:'Stopped short.'};
          if (r < 70) return {yds:4, msg:'Short gain.'};
          return {yds:10, msg:'First down run!'};
        } else {
          if (r < 20) return {yds:0, msg:'No gain.'};
          if (r < 60) return {yds:6, msg:'Nice run.'};
          return {yds:18, msg:'Big run!'};
        }
      } else {
        if (def === 'rush') {
          if (r < 15) return {yds:-5, msg:'Sacked!'};
          if (r < 50) return {yds:8, msg:'Pass complete.'};
          if (r < 75) return {yds:18, msg:'Deep pass!'};
          return {yds:35, msg:'BOMB!'};
        } else {
          if (r < 25) return {yds:-3, msg:'Sacked!'};
          if (r < 55) return {yds:5, msg:'Short pass.'};
          if (r < 80) return {yds:14, msg:'Nice catch!'};
          return {yds:28, msg:'Long pass!'};
        }
      }
    }

    var playerScore = 0, compScore = 0;
    var time = 240;

    for (var q = 0; q < 4; q++) {
      engine.clear();
      engine.println('--- Quarter ' + (q+1) + ' ---');
      engine.println('Time: ' + time + 's  Score: You ' + playerScore + ' - Computer ' + compScore);
      engine.println('');

      for (var poss = 0; poss < 2; poss++) {
        var offense = poss === 0 ? 'player' : 'computer';
        var yardLine = 10;
        var down = 1;
        var toGo = 10;

        while (yardLine < 90) {
          engine.println(offense === 'player' ? 'Your ball' : 'Computer ball');
          engine.println('Down: ' + down + '  To go: ' + toGo + '  Yard Line: ' + yardLine);
          engine.println('');

          var offChoice, defChoice;
          if (offense === 'player') {
            offChoice = await engine.input('Play (run/pass): ');
            offChoice = offChoice.trim().toLowerCase();
            if (offChoice !== 'run' && offChoice !== 'pass') { engine.println('Invalid.'); continue; }
            defChoice = RNG.pick(['rush','cover']);
            engine.println('Computer defense: ' + defChoice);
          } else {
            offChoice = RNG.pick(['run','pass']);
            defChoice = await engine.input('Defense (rush/cover): ');
            defChoice = defChoice.trim().toLowerCase();
            if (defChoice !== 'rush' && defChoice !== 'cover') { engine.println('Invalid.'); continue; }
            engine.println('Computer plays: ' + offChoice);
          }

          var outcome = playOutcome(offChoice, defChoice);
          engine.println(outcome.msg + ' (' + outcome.yds + ' yds)');

          yardLine += outcome.yds;
          if (yardLine < 0) yardLine = 0;
          toGo -= outcome.yds;
          down++;

          if (yardLine >= 90) {
            engine.println('TOUCHDOWN! ' + (offense === 'player' ? 'You' : 'Computer') + ' score!');
            if (offense === 'player') playerScore += 7; else compScore += 7;
            break;
          }

          if (toGo <= 0) { down = 1; toGo = 10; engine.println('First down!'); }
          else if (down > 2) {
            engine.println('Turnover on downs!');
            break;
          }

          await engine.input('Press Enter for next play...');
          engine.println('');
        }

        if (poss === 0) await engine.input('Press Enter for computer possession...');
        engine.clear();
      }
      time -= 60;
    }

    engine.clear();
    engine.println('FINAL SCORE');
    engine.println('You: ' + playerScore + ' - Computer: ' + compScore);
    if (playerScore > compScore) engine.println('YOU WIN!');
    else if (compScore > playerScore) engine.println('COMPUTER WINS!');
    else engine.println('TIE!');
    engine.end();
  };
})();
