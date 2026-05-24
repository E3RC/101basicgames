(function(){
  var slug='slots';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Slots');
    engine.setInstructions('3-reel slot machine. Symbols: CHERRY, LEMON, ORANGE, PLUM, BELL, BAR, STAR, SEVEN. $1 per pull. Payouts: 3 BAR=$100, 3 SEVEN=$80, 3 BELL=$50, 3 STAR=$30, any 3 same=$10, any 2 same=$2.');
    engine.println('S L O T S');
    engine.println('');

    var symbols = ['CHERRY', 'LEMON', 'ORANGE', 'PLUM', 'BELL', 'BAR', 'STAR', 'SEVEN'];

    function spin() {
      return [
        RNG.pick(symbols),
        RNG.pick(symbols),
        RNG.pick(symbols)
      ];
    }

    function calcPayout(reels) {
      if (reels[0] === reels[1] && reels[1] === reels[2]) {
        var sym = reels[0];
        if (sym === 'BAR') return 100;
        if (sym === 'SEVEN') return 80;
        if (sym === 'BELL') return 50;
        if (sym === 'STAR') return 30;
        return 10;
      }
      if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
        return 2;
      }
      return 0;
    }

    var money = 500;
    var playing = true;

    while (playing && money > 0) {
      engine.println('You have $' + money);
      engine.println('');

      var input = await engine.input('Press Enter to spin ($1 per pull, or q to quit): ');
      if (input.trim().toLowerCase() === 'q') {
        engine.println('Thanks for playing! You leave with $' + money + '.');
        break;
      }

      money -= 1;

      var result = spin();
      var display = result.join(' | ');
      engine.println('[ ' + display + ' ]');

      var payout = calcPayout(result);
      if (payout > 0) {
        engine.println('You win $' + payout + '!');
        money += payout;
      } else {
        engine.println('No luck this time.');
      }

      engine.println('You have $' + money);
      engine.println('');

      if (money <= 0) {
        engine.println('You are out of money! Game over.');
        break;
      }
    }

    engine.end();
  };
})();
