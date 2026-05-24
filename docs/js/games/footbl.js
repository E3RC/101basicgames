(function(){
  var slug='footbl';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Pro Football');
    engine.setInstructions('4 downs to gain 10 yards. Choose run, short pass, or long pass. Computer defense picks rush or cover. Drive for a touchdown (7 pts) or settle for field goal (3 pts). 2-minute quarters.');

    function playOutcome(off, def) {
      var r = RNG.int(1,100);
      if (off === 'run') {
        if (def === 'rush') {
          if (r < 20) return {yds:-2, msg:'Stuffed at line!'};
          if (r < 60) return {yds:3, msg:'Short gain.'};
          return {yds:7, msg:'Nice run!'};
        } else {
          if (r < 15) return {yds:-1, msg:'Stopped.'};
          if (r < 50) return {yds:5, msg:'Good run.'};
          return {yds:15, msg:'Big run!'};
        }
      } else if (off === 'short pass') {
        if (def === 'rush') {
          if (r < 15) return {yds:-5, msg:'Sacked!'};
          if (r < 55) return {yds:8, msg:'Short completion.'};
          return {yds:20, msg:'Nice catch!'};
        } else {
          if (r < 10) return {yds:-3, msg:'Sacked!'};
          if (r < 40) return {yds:5, msg:'Short gain.'};
          if (r < 75) return {yds:12, msg:'First down!'};
          return {yds:25, msg:'Big play!'};
        }
      } else {
        if (def === 'rush') {
          if (r < 20) return {yds:-8, msg:'Sacked hard!'};
          if (r < 45) return {yds:15, msg:'Deep pass!'};
          if (r < 65) return {yds:30, msg:'Bomb!'};
          return {yds:50, msg:'TOUCHDOWN pass!'};
        } else {
          if (r < 30) return {yds:-5, msg:'Sacked!'};
          if (r < 50) return {yds:10, msg:'Medium gain.'};
          if (r < 70) return {yds:20, msg:'Deep completion!'};
          return {yds:40, msg:'Huge play!'};
        }
      }
    }

    var playerScore = 0, compScore = 0;
    var quarters = 4;
    var time = 120;

    for (var q = 0; q < quarters; q++) {
      engine.clear();
      engine.println('--- Quarter ' + (q+1) + ' ---');
      engine.println('Time remaining: ' + time + 's');
      engine.println('Score: You ' + playerScore + ' - Computer ' + compScore);
      engine.println('');

      for (var poss = 0; poss < 2; poss++) {
        var offense = poss === 0 ? 'player' : 'computer';
        var yardLine = 20;
        var down = 1;
        var toGo = 10;
        var plays = 0;

        while (plays < 10 && yardLine < 100) {
          engine.println(offense === 'player' ? 'Your ball' : 'Computer ball');
          engine.println('Down: ' + down + '  To go: ' + toGo + '  Yard Line: ' + yardLine);
          engine.println('');

          var offChoice, defChoice;
          if (offense === 'player') {
            offChoice = await engine.input('Play (run/short pass/long pass): ');
            offChoice = offChoice.trim().toLowerCase();
            if (['run','short pass','long pass'].indexOf(offChoice) === -1) { engine.println('Invalid.'); continue; }
            defChoice = RNG.pick(['rush','rush','cover','cover']);
            engine.println('Computer defense: ' + defChoice);
          } else {
            offChoice = RNG.pick(['run','run','short pass','short pass','long pass']);
            defChoice = await engine.input('Defense (rush/cover): ');
            defChoice = defChoice.trim().toLowerCase();
            if (['rush','cover'].indexOf(defChoice) === -1) { engine.println('Invalid.'); continue; }
            engine.println('Computer plays: ' + offChoice);
          }

          var outcome = playOutcome(offChoice, defChoice);
          engine.println(outcome.msg + ' (' + outcome.yds + ' yds)');

          yardLine += outcome.yds;
          if (yardLine < 0) yardLine = 0;
          toGo -= outcome.yds;
          down++;

          if (yardLine >= 100) {
            engine.println('TOUCHDOWN! ' + (offense === 'player' ? 'You' : 'Computer') + ' score!');
            if (offense === 'player') playerScore += 7; else compScore += 7;
            break;
          }

          if (toGo <= 0) { down = 1; toGo = 10; engine.println('First down!'); }
          else if (down > 4) {
            engine.println('Turnover on downs!');
            break;
          }

          plays++;
          if (plays < 10) await engine.input('Press Enter for next play...');
          engine.println('');
        }

        if (yardLine >= 80 && yardLine < 100) {
          if (offense === 'player') {
            var fg = await engine.input('Try field goal? (y/n): ');
            if (fg.trim().toLowerCase() === 'y') {
              if (RNG.int(1,100) <= 60) { playerScore += 3; engine.println('Field goal good!'); }
              else engine.println('Missed!');
            }
          } else {
            if (RNG.int(1,100) <= 50) { compScore += 3; engine.println('Computer kicks field goal. Good!'); }
            else engine.println('Computer misses field goal.');
          }
        }

        if (poss === 0) await engine.input('Press Enter for computer possession...');
        engine.clear();
      }
      time -= 30;
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
