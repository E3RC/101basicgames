(function(){
  var slug='dice';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Dice');
    engine.setInstructions('Player vs Computer. Each round you both roll two dice. Higher total wins the round. Best of 5 rounds wins the game.');
    engine.println('D I C E');
    engine.println('Best 3 out of 5 rounds!');
    engine.println('');

    var playerWins = 0;
    var compWins = 0;
    var round = 0;

    while (playerWins < 3 && compWins < 3 && round < 5) {
      round++;
      engine.println('--- Round ' + round + ' ---');
      engine.println('');

      var input = await engine.input('Press Enter to roll your dice: ');

      var p1 = Dice.roll(6);
      var p2 = Dice.roll(6);
      var pTotal = p1 + p2;
      engine.println('You rolled: ' + p1 + ' + ' + p2 + ' = ' + pTotal);

      var c1 = Dice.roll(6);
      var c2 = Dice.roll(6);
      var cTotal = c1 + c2;
      engine.println('Computer rolled: ' + c1 + ' + ' + c2 + ' = ' + cTotal);

      if (pTotal > cTotal) {
        engine.println('You win this round!');
        playerWins++;
      } else if (cTotal > pTotal) {
        engine.println('Computer wins this round!');
        compWins++;
      } else {
        engine.println('It is a tie! No one gets a point.');
      }

      engine.println('Score: You ' + playerWins + ' - Computer ' + compWins);
      engine.println('');
    }

    engine.println('');
    engine.println('=== GAME OVER ===');
    if (playerWins > compWins) {
      engine.println('You win the game! ' + playerWins + ' to ' + compWins);
    } else {
      engine.println('Computer wins the game! ' + compWins + ' to ' + playerWins);
    }
    engine.end();
  };
})();
