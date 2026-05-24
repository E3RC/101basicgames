(function(){
  var slug='roulet';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Roulette');
    engine.setInstructions('European roulette. Wheel has numbers 0-36. 0 is green. Bet types: number (pays 35:1), red/black (1:1), odd/even (1:1), low/high 1-18/19-36 (1:1).');
    engine.println('R O U L E T T E');
    engine.println('');

    var reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    function isRed(n) { return reds.indexOf(n) !== -1; }
    function isBlack(n) { return n !== 0 && !isRed(n); }
    function isOdd(n) { return n !== 0 && n % 2 === 1; }
    function isEven(n) { return n !== 0 && n % 2 === 0; }
    function isLow(n) { return n >= 1 && n <= 18; }
    function isHigh(n) { return n >= 19 && n <= 36; }

    var money = 1000;
    var playing = true;

    while (playing && money > 0) {
      engine.println('You have $' + money);
      engine.println('');

      engine.println('Bet types:');
      engine.println('1 - Single number (pays 35:1)');
      engine.println('2 - Red or Black (pays 1:1)');
      engine.println('3 - Odd or Even (pays 1:1)');
      engine.println('4 - Low (1-18) or High (19-36) (pays 1:1)');
      engine.println('');

      var betType = await engine.input('Choose bet type (1-4, or 0 to quit): ');
      var bt = parseInt(betType, 10);
      if (isNaN(bt) || bt <= 0) {
        engine.println('Thanks for playing! You leave with $' + money + '.');
        break;
      }
      if (bt < 1 || bt > 4) {
        engine.println('Invalid choice.');
        continue;
      }

      var betAmt = await engine.input('Amount to bet (min $1, max $' + Math.min(money, 500) + '): ');
      var bet = parseInt(betAmt, 10);
      if (isNaN(bet) || bet <= 0) bet = 1;
      if (bet > money) bet = money;
      if (bet > 500) bet = 500;

      var choice;
      if (bt === 1) {
        var numChoice = await engine.input('Pick a number (0-36): ');
        choice = parseInt(numChoice, 10);
        if (isNaN(choice) || choice < 0 || choice > 36) {
          engine.println('Invalid number.');
          continue;
        }
      } else if (bt === 2) {
        choice = await engine.input('Red or Black? (r/b): ');
        choice = choice.trim().toLowerCase();
        if (choice !== 'r' && choice !== 'b') {
          engine.println('Choose r for Red or b for Black.');
          continue;
        }
      } else if (bt === 3) {
        choice = await engine.input('Odd or Even? (o/e): ');
        choice = choice.trim().toLowerCase();
        if (choice !== 'o' && choice !== 'e') {
          engine.println('Choose o for Odd or e for Even.');
          continue;
        }
      } else if (bt === 4) {
        choice = await engine.input('Low (1-18) or High (19-36)? (l/h): ');
        choice = choice.trim().toLowerCase();
        if (choice !== 'l' && choice !== 'h') {
          engine.println('Choose l for Low or h for High.');
          continue;
        }
      }

      engine.println('Spinning the wheel...');
      var spin = RNG.int(0, 36);
      engine.println('The ball lands on ' + spin + '!');

      var won = false;
      var payout = 0;

      if (bt === 1) {
        if (spin === choice) {
          won = true;
          payout = bet * 35;
        }
      } else if (bt === 2) {
        if ((choice === 'r' && isRed(spin)) || (choice === 'b' && isBlack(spin))) {
          won = true;
          payout = bet;
        }
      } else if (bt === 3) {
        if ((choice === 'o' && isOdd(spin)) || (choice === 'e' && isEven(spin))) {
          won = true;
          payout = bet;
        }
      } else if (bt === 4) {
        if ((choice === 'l' && isLow(spin)) || (choice === 'h' && isHigh(spin))) {
          won = true;
          payout = bet;
        }
      }

      if (won) {
        engine.println('You win $' + payout + '!');
        money += payout;
      } else {
        engine.println('You lose $' + bet + '.');
        money -= bet;
      }

      engine.println('You now have $' + money);
      engine.println('');

      if (money <= 0) {
        engine.println('You are out of money!');
        break;
      }

      var again = await engine.input('Play again? (y/n): ');
      if (again.trim().toLowerCase() !== 'y') playing = false;
    }

    if (money > 0) {
      engine.println('You cash out with $' + money + '.');
    }
    engine.end();
  };
})();
