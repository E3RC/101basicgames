(function(){
  var slug='aceydu';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Acey-Ducey');
    engine.setInstructions('Two cards are dealt face up. Bet on whether the next card will be BETWEEN them in value (not including equal to). Aces are high. If the two cards are the same rank or adjacent, the next card cannot possibly be between them, so you lose your bet. Minimum bet $1. Bet $0 to quit.');
    engine.println('Acey-Ducey');
    engine.println('');

    function rankVal(r) { return r === 1 ? 14 : r; }

    var money = 100;
    var playing = true;

    while (playing && money > 0) {
      engine.println('You have $' + money);
      engine.println('');

      var deck = Deck.shuffle(Deck.create());
      var cards = Deck.deal(deck, 2);
      var r1 = rankVal(cards[0].rank);
      var r2 = rankVal(cards[1].rank);
      var low = Math.min(r1, r2);
      var high = Math.max(r1, r2);

      engine.println('Your cards: ' + Deck.display(cards));
      engine.println('');

      if (r1 === r2) {
        engine.println('Both cards are the same rank! You cannot win this hand.');
        money -= 1;
        if (money < 0) money = 0;
        engine.println('You lose $1 (minimum). You have $' + money + ' left.');
        if (money <= 0) {
          engine.println('You ran out of money!');
          break;
        }
        var cont = await engine.input('Play again? (y/n): ');
        if (cont.trim().toLowerCase() !== 'y') playing = false;
        continue;
      }

      if (high - low === 1) {
        engine.println('The cards are adjacent! There is no card between them.');
        money -= 1;
        if (money < 0) money = 0;
        engine.println('You lose $1 (minimum). You have $' + money + ' left.');
        if (money <= 0) {
          engine.println('You ran out of money!');
          break;
        }
        var cont2 = await engine.input('Play again? (y/n): ');
        if (cont2.trim().toLowerCase() !== 'y') playing = false;
        continue;
      }

      var maxBet = Math.min(money, 100);
      var betInput = await engine.input('Your bet ($1-$' + maxBet + ', or 0 to quit): ');
      var bet = parseInt(betInput, 10);
      if (isNaN(bet)) bet = 1;
      if (bet <= 0) {
        engine.println('Thanks for playing! You leave with $' + money + '.');
        break;
      }
      if (bet > maxBet) bet = maxBet;

      var third = Deck.deal(deck, 1)[0];
      var r3 = rankVal(third.rank);
      engine.println('Next card: ' + Deck.display([third]));

      if (r3 > low && r3 < high) {
        engine.println('You win! The card is between.');
        money += bet;
      } else {
        engine.println('You lose! The card is not between.');
        money -= bet;
      }

      engine.println('You now have $' + money);
      engine.println('');

      if (money <= 0) {
        engine.println('You ran out of money!');
        break;
      }

      var again = await engine.input('Play again? (y/n): ');
      if (again.trim().toLowerCase() !== 'y') playing = false;
    }

    if (money > 0) {
      engine.println('You finished with $' + money + '. Goodbye!');
    } else {
      engine.println('YOU LOSE! You\'re broke!');
    }
    engine.end();
  };
})();
