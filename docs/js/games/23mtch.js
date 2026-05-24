(function(){
  var slug='23mtch';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('23 Matches');
    engine.setInstructions('23 Matches (misère Nim). There are 23 matches on the table. Players take turns removing 1, 2, or 3 matches. The player who takes the LAST match LOSES. Computer uses strategy: leave a multiple of 4+1 matches (21, 17, 13, 9, 5, 1).');

    var matches = 23;

    function displayMatches() {
      var line = '';
      for (var i = 0; i < matches; i++) line += '|';
      return 'Matches remaining: ' + matches + '\n' + line;
    }

    function computerMove() {
      if (matches <= 1) return {take: 1, forced: true};

      var targets = [21, 17, 13, 9, 5, 1];
      for (var i = 0; i < targets.length; i++) {
        if (matches > targets[i]) {
          var diff = matches - targets[i];
          if (diff >= 1 && diff <= 3) {
            return {take: diff};
          }
        }
      }
      return {take: Math.min(3, matches - 1)};
    }

    var playerTurn = true;

    engine.clear();
    engine.println('23 MATCHES');
    engine.println('');
    engine.println('Take 1-3 matches. The one who takes the LAST match LOSES!');
    engine.println('');

    while (matches > 0) {
      engine.println(displayMatches());
      engine.println('');

      if (playerTurn) {
        var input = await engine.input('How many matches do you take (1-3)? ');
        var take = parseInt(input, 10);
        if (isNaN(take) || take < 1 || take > 3) {
          engine.println('Take 1, 2, or 3 matches.');
          continue;
        }
        if (take > matches) {
          engine.println('There are only ' + matches + ' matches left.');
          continue;
        }
        matches -= take;
        engine.println('You took ' + take + ' match' + (take > 1 ? 'es' : '') + '.');
        if (matches === 0) {
          engine.println('You took the last match! YOU LOSE!');
          break;
        }
      } else {
        var move = computerMove();
        matches -= move.take;
        engine.println('Computer takes ' + move.take + ' match' + (move.take > 1 ? 'es' : '') + '.');
        if (matches === 0) {
          engine.println('Computer took the last match! COMPUTER LOSES! YOU WIN!');
          break;
        }
      }

      playerTurn = !playerTurn;
    }

    engine.end();
  };
})();
