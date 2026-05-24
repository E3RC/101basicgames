(function(){
  var slug='blkjak';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Blackjack (Standard)');
    engine.setInstructions('Advanced Blackjack rules. Dealer hits on soft 17. Double down allowed on first two cards (double bet, get one more card). Split allowed if first two cards are same rank (play two hands, double bet). Insurance offered when dealer shows Ace.');

    var money = 500;

    function showHands(playerHands, dealerHand, hideDealer, currentHand) {
      engine.println('');
      if (hideDealer) {
        engine.println('Dealer shows: ' + Deck.display([dealerHand[0]]) + ' [?]');
      } else {
        engine.println('Dealer: ' + Deck.display(dealerHand) + ' (' + Deck.handVal(dealerHand) + ')');
      }
      for (var i = 0; i < playerHands.length; i++) {
        var label = (playerHands.length > 1 ? 'Hand ' + (i + 1) + ': ' : 'Your hand: ');
        var mark = (i === currentHand ? ' <<<' : '');
        engine.println(label + Deck.display(playerHands[i]) + ' (' + Deck.handVal(playerHands[i]) + ')' + mark);
      }
    }

    function isSoft17(hand) {
      var val = 0, aces = 0;
      for (var i = 0; i < hand.length; i++) {
        val += Deck.bjVal(hand[i]);
        if (hand[i].rank === 1) aces++;
      }
      while (val > 21 && aces > 0) { val -= 10; aces--; }
      return val === 17 && aces > 0;
    }

    var playing = true;
    while (playing) {
      engine.println('');
      engine.println('You have $' + money);
      if (money < 10) {
        engine.println('Not enough money!');
        break;
      }

      var bet = 10;
      var betInput = await engine.input('Bet ($10-$' + Math.min(money, 500) + ', 0 quit): ');
      var b = parseInt(betInput, 10);
      if (!isNaN(b) && b <= 0) { engine.println('You leave with $' + money + '.'); break; }
      if (b >= 10 && b <= money) bet = b;

      var deck = Deck.shuffle(Deck.create());
      var playerHands = [Deck.deal(deck, 2)];
      var dealerHand = Deck.deal(deck, 2);
      var bets = [bet];
      var currentHand = 0;
      var finished = [];
      var insuranceBet = 0;

      if (dealerHand[0].rank === 1) {
        var insInput = await engine.input('Dealer shows Ace. Insurance? (y/n): ');
        if (insInput.trim().toLowerCase() === 'y') {
          insuranceBet = Math.min(bet, money) / 2;
          if (insuranceBet > 0) {
            engine.println('Insurance bet: $' + insuranceBet);
          } else {
            insuranceBet = 0;
          }
        }
      }

      if (Deck.handVal(dealerHand) === 21) {
        showHands(playerHands, dealerHand, false, 0);
        if (insuranceBet > 0) {
          engine.println('Dealer has Blackjack! Insurance pays 2:1.');
          money += insuranceBet;
        }
        for (var i = 0; i < playerHands.length; i++) {
          if (Deck.handVal(playerHands[i]) === 21) {
            engine.println('Hand ' + (i + 1) + ' also has 21. Push.');
          } else {
            engine.println('Hand ' + (i + 1) + ' loses to dealer Blackjack.');
            money -= bets[i];
          }
        }
        engine.println('You now have $' + money);
        if (money <= 0) { engine.println('Broke!'); break; }
        var ag = await engine.input('Play again? (y/n): ');
        if (ag.trim().toLowerCase() !== 'y') playing = false;
        continue;
      }

      if (insuranceBet > 0) {
        engine.println('Dealer does not have Blackjack. Insurance lost.');
        money -= insuranceBet;
      }

      while (currentHand < playerHands.length) {
        if (finished.indexOf(currentHand) !== -1) { currentHand++; continue; }
        var hand = playerHands[currentHand];

        showHands(playerHands, dealerHand, true, currentHand);

        if (Deck.handVal(hand) === 21) {
          engine.println('21! Standing.');
          finished.push(currentHand);
          currentHand++;
          continue;
        }

        var canSplit = (hand.length === 2 && hand[0].rank === hand[1].rank && playerHands.length < 4 && bets[currentHand] <= money);
        var canDouble = (hand.length === 2 && bets[currentHand] * 2 <= money);

        var done = false;
        while (!done) {
          var prompt = 'Hit (H) or Stand (S)';
          if (canDouble) prompt += ' or Double (D)';
          if (canSplit) prompt += ' or Split (P)';
          var action = await engine.input(prompt + ': ');
          var a = action.trim().toUpperCase();

          if (a === 'S') {
            done = true;
            finished.push(currentHand);
          } else if (a === 'H') {
            var card = Deck.deal(deck, 1)[0];
            hand.push(card);
            engine.println('You drew: ' + Deck.display([card]));
            var score = Deck.handVal(hand);
            if (score > 21) {
              engine.println('Bust!');
              done = true;
              finished.push(currentHand);
            } else if (score === 21) {
              engine.println('21!');
              done = true;
              finished.push(currentHand);
            }
            showHands(playerHands, dealerHand, true, currentHand);
          } else if (a === 'D' && canDouble) {
            bets[currentHand] *= 2;
            var card = Deck.deal(deck, 1)[0];
            hand.push(card);
            engine.println('Double down! You drew: ' + Deck.display([card]));
            done = true;
            finished.push(currentHand);
          } else if (a === 'P' && canSplit) {
            var newHand = [hand.pop()];
            var extraBet = bets[currentHand];
            bets.push(extraBet);
            playerHands.push(newHand);
            var card1 = Deck.deal(deck, 1)[0];
            hand.push(card1);
            var card2 = Deck.deal(deck, 1)[0];
            newHand.push(card2);
            engine.println('Split! Bet $' + extraBet + ' on new hand.');
            money -= extraBet;
            canSplit = false;
            if (Deck.handVal(hand) === 21) finished.push(currentHand);
          }
        }
        currentHand++;
      }

      engine.println('');
      engine.println('Dealer reveals: ' + Deck.display(dealerHand) + ' (' + Deck.handVal(dealerHand) + ')');

      while (Deck.handVal(dealerHand) < 17 || isSoft17(dealerHand)) {
        var card = Deck.deal(deck, 1)[0];
        dealerHand.push(card);
        engine.println('Dealer draws: ' + Deck.display([card]) + ' (' + Deck.handVal(dealerHand) + ')');
      }

      var dealerScore = Deck.handVal(dealerHand);

      for (var i = 0; i < playerHands.length; i++) {
        var ps = Deck.handVal(playerHands[i]);
        if (ps > 21) {
          engine.println('Hand ' + (i + 1) + ': Bust. Lose $' + bets[i]);
          money -= bets[i];
        } else if (dealerScore > 21) {
          engine.println('Hand ' + (i + 1) + ': Dealer busts! Win $' + bets[i]);
          money += bets[i];
        } else if (ps > dealerScore) {
          engine.println('Hand ' + (i + 1) + ': You win $' + bets[i]);
          money += bets[i];
        } else if (ps < dealerScore) {
          engine.println('Hand ' + (i + 1) + ': Dealer wins. Lose $' + bets[i]);
          money -= bets[i];
        } else {
          engine.println('Hand ' + (i + 1) + ': Push. Bet returned.');
        }
      }

      engine.println('You now have $' + money);
      if (money <= 0) { engine.println('Broke!'); break; }
      var again = await engine.input('Play again? (y/n): ');
      if (again.trim().toLowerCase() !== 'y') playing = false;
    }

    if (money > 0) engine.println('You finished with $' + money + '. Goodbye!');
    else engine.println('YOU LOSE!');
    engine.end();
  };
})();
