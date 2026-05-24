(function(){
  var slug='hockey';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Ice Hockey');
    engine.setInstructions('3-period hockey. Face-offs. Choose shoot, pass, or skate. Try to score on the opponent. First to 5 goals or most goals after 3 periods wins.');

    function faceoffOutcome(pChoice, cChoice) {
      var r = RNG.int(1,100);
      if (pChoice === cChoice) return r < 50 ? 'player' : 'computer';
      if ((pChoice === 'shoot' && cChoice === 'pass') ||
          (pChoice === 'pass' && cChoice === 'skate') ||
          (pChoice === 'skate' && cChoice === 'shoot')) return 'player';
      return 'computer';
    }

    function shotOutcome(possession, choice) {
      var r = RNG.int(1,100);
      if (possession === 'player') {
        if (choice === 'shoot') {
          if (r <= 30) return {goal:true, msg:'You SCORE!'};
          if (r <= 60) return {goal:false, msg:'Goalie saves!'};
          return {goal:false, msg:'Shot wide!'};
        } else if (choice === 'pass') {
          if (r <= 20) return {goal:true, msg:'Deflection in!'};
          if (r <= 60) return {goal:false, msg:'Pass intercepted.'};
          return {goal:false, msg:'Puck turned over.'};
        } else {
          if (r <= 10) return {goal:true, msg:'Breakaway goal!'};
          if (r <= 50) return {goal:false, msg:'Checked off puck.'};
          return {goal:false, msg:'Skated into corner.'};
        }
      } else {
        if (choice === 'shoot') {
          if (r <= 20) return {goal:true, msg:'Computer SCORES!'};
          if (r <= 65) return {goal:false, msg:'You save!'};
          return {goal:false, msg:'Computer shoots wide.'};
        } else if (choice === 'pass') {
          if (r <= 15) return {goal:true, msg:'Computer tips it in!'};
          if (r <= 55) return {goal:false, msg:'You intercept!'};
          return {goal:false, msg:'Puck cleared.'};
        } else {
          if (r <= 8) return {goal:true, msg:'Computer dekes and scores!'};
          if (r <= 45) return {goal:false, msg:'You block the rush!'};
          return {goal:false, msg:'Computer loses puck.'};
        }
      }
    }

    var pScore = 0, cScore = 0;
    var pSog = 0, cSog = 0;

    for (var pd = 0; pd < 3; pd++) {
      engine.clear();
      engine.println('--- Period ' + (pd+1) + ' ---');
      engine.println('Score: You ' + pScore + ' - Computer ' + cScore);
      engine.println('');

      for (var pos = 0; pos < 6; pos++) {
        engine.println('Faceoff!');
        var pFace = await engine.input('Your choice (shoot/pass/skate): ');
        pFace = pFace.trim().toLowerCase();
        if (['shoot','pass','skate'].indexOf(pFace) === -1) { engine.println('Invalid.'); pos--; continue; }
        var cFace = RNG.pick(['shoot','pass','skate']);
        engine.println('Computer chooses: ' + cFace);

        var possession = faceoffOutcome(pFace, cFace);
        engine.println(possession === 'player' ? 'You have the puck!' : 'Computer has the puck!');

        if (possession === 'player') {
          var pAction = await engine.input('Action (shoot/pass/skate): ');
          pAction = pAction.trim().toLowerCase();
          if (['shoot','pass','skate'].indexOf(pAction) === -1) { engine.println('Invalid.'); pos--; continue; }
          var result = shotOutcome('player', pAction);
          engine.println(result.msg);
          if (result.goal) pScore++;
          else if (pAction === 'shoot') pSog++;
        } else {
          var cAction = RNG.pick(['shoot','shoot','pass','pass','skate']);
          engine.println('Computer action: ' + cAction);
          var result2 = shotOutcome('computer', cAction);
          engine.println(result2.msg);
          if (result2.goal) cScore++;
          else if (cAction === 'shoot') cSog++;
        }

        engine.println('Score: You ' + pScore + ' - Computer ' + cScore);
        engine.println('');
        if (pos < 5) await engine.input('Press Enter for next faceoff...');
      }
    }

    engine.clear();
    engine.println('=== FINAL SCORE ===');
    engine.println('You: ' + pScore + ' - Computer: ' + cScore);
    engine.println('Shots on Goal - You: ' + pSog + ' Computer: ' + cSog);
    if (pScore > cScore) engine.println('YOU WIN!');
    else if (cScore > pScore) engine.println('COMPUTER WINS!');
    else engine.println('TIE!');
    engine.end();
  };
})();
