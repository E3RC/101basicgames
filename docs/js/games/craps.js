(function(){
  var slug='craps';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Craps');
    engine.setInstructions('Vegas-style craps. Shooter rolls two dice. First roll: 7 or 11 wins, 2/3/12 loses (craps). Any other number becomes the point. Keep rolling until you hit the point (win) or 7 (lose).');
    engine.println('C R A P S');
    engine.println('');

    var money = 100;
    var playing = true;

    while (playing && money > 0) {
      engine.println('You have $' + money);
      engine.println('');

      var betInput = await engine.input('Place your bet ($1-$' + Math.min(money, 100) + ', or 0 to quit): ');
      var bet = parseInt(betInput, 10);
      if (isNaN(bet)) bet = 1;
      if (bet <= 0) {
        engine.println('Thanks for playing! You leave with $' + money + '.');
        break;
      }
      if (bet > money) bet = money;
      if (bet > 100) bet = 100;

      engine.println('Shooter, roll the dice!');
      var roll1 = Dice.roll(6);
      var roll2 = Dice.roll(6);
      var total = roll1 + roll2;
      engine.println('You rolled: ' + roll1 + ' + ' + roll2 + ' = ' + total);

      if (total === 7 || total === 11) {
        engine.println('Natural! You win!');
        money += bet;
      } else if (total === 2 || total === 3 || total === 12) {
        engine.println('Craps! You lose.');
        money -= bet;
      } else {
        var point = total;
        engine.println('Point is ' + point + '. Keep rolling...');
        engine.println('');

        var rolled = true;
        while (rolled) {
          var input = await engine.input('Press Enter to roll again: ');
          var r1 = Dice.roll(6);
          var r2 = Dice.roll(6);
          var t = r1 + r2;
          engine.println('You rolled: ' + r1 + ' + ' + r2 + ' = ' + t);

          if (t === point) {
            engine.println('You hit the point! You win!');
            money += bet;
            rolled = false;
          } else if (t === 7) {
            engine.println('Seven out! You lose.');
            money -= bet;
            rolled = false;
          } else {
            engine.println('No decision. Roll again.');
          }
        }
      }

      if (money <= 0) {
        engine.println('');
        engine.println('You are broke!');
        break;
      }

      engine.println('You now have $' + money);
      engine.println('');
      var again = await engine.input('Play again? (y/n): ');
      if (again.trim().toLowerCase() !== 'y') playing = false;
    }

    if (money > 0) {
      engine.println('You leave with $' + money + '. Goodbye!');
    } else {
      engine.println('Better luck next time!');
    }
    engine.end();
  };
})();
