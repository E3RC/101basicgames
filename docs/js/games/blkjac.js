(function(){
  var slug='blkjac';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Blackjack');
    engine.setInstructions('Standard Blackjack vs the dealer. Start with $500. Minimum bet $10. Try to get 21 without going over. Aces count as 1 or 11. Natural 21 on first two cards is Blackjack and pays 3:2. Dealer hits on 16, stands on 17. You can Hit (H) or Stand (S).');

    var money = 500;

    function showHands(playerHand, dealerHand, hideDealer) {
      engine.println('');
      if (hideDealer) {
        engine.println('Dealer shows: ' + Deck.display([dealerHand[0]]) + ' [?]');
      } else {
        engine.println('Dealer hand: ' + Deck.display(dealerHand) + ' (Score: ' + Deck.handVal(dealerHand) + ')');
      }
      engine.println('Your hand: ' + Deck.display(playerHand) + ' (Score: ' + Deck.handVal(playerHand) + ')');
    }

    var playing = true;
    while (playing) {
      engine.println('');
      engine.println('You have $' + money);
      if (money < 10) {
        engine.println('You don\'t have enough money to continue!');
        break;
      }

      var bet = 10;
      var betInput = await engine.input('Place your bet ($10-$' + Math.min(money, 500) + ', or 0 to quit): ');
      var b = parseInt(betInput, 10);
      if (!isNaN(b) && b <= 0) {
        engine.println('Thanks for playing! You leave with $' + money + '.');
        break;
      }
      if (b >= 10 && b <= money) bet = b;

      var deck = Deck.shuffle(Deck.create());
      var playerHand = Deck.deal(deck, 2);
      var dealerHand = Deck.deal(deck, 2);

      var playerBJ = Deck.handVal(playerHand) === 21;
      var dealerBJ = Deck.handVal(dealerHand) === 21;

      if (playerBJ && dealerBJ) {
        showHands(playerHand, dealerHand, false);
        engine.println('Both have Blackjack! Push.');
      } else if (playerBJ) {
        showHands(playerHand, dealerHand, false);
        engine.println('Blackjack! You win 3:2!');
        money += Math.floor(bet * 1.5);
      } else if (dealerBJ) {
        showHands(playerHand, dealerHand, false);
        engine.println('Dealer has Blackjack! You lose.');
        money -= bet;
      } else {
        showHands(playerHand, dealerHand, true);
        var busted = false;

        while (true) {
          var action = await engine.input('Hit (H) or Stand (S): ');
          var a = action.trim().toUpperCase();
          if (a === 'H') {
            var card = Deck.deal(deck, 1)[0];
            playerHand.push(card);
            engine.println('You drew: ' + Deck.display([card]));
            var score = Deck.handVal(playerHand);
            if (score > 21) {
              engine.println('Bust! You have ' + score + '.');
              busted = true;
              break;
            } else if (score === 21) {
              engine.println('You have 21!');
              break;
            }
          } else if (a === 'S') {
            break;
          }
        }

        if (!busted) {
          engine.println('');
          engine.println('Dealer\'s turn:');
          engine.println('Dealer hand: ' + Deck.display(dealerHand) + ' (Score: ' + Deck.handVal(dealerHand) + ')');

          while (Deck.handVal(dealerHand) < 17) {
            var card = Deck.deal(deck, 1)[0];
            dealerHand.push(card);
            engine.println('Dealer draws: ' + Deck.display([card]) + ' (Score: ' + Deck.handVal(dealerHand) + ')');
          }

          var dealerScore = Deck.handVal(dealerHand);
          if (dealerScore > 21) {
            engine.println('Dealer busts! You win!');
            money += bet;
          } else {
            var playerScore = Deck.handVal(playerHand);
            if (playerScore > dealerScore) {
              engine.println('You win!');
              money += bet;
            } else if (playerScore < dealerScore) {
              engine.println('Dealer wins.');
              money -= bet;
            } else {
              engine.println('Push. Bet returned.');
            }
          }
        } else {
          money -= bet;
        }
      }

      engine.println('You now have $' + money);
      if (money <= 0) {
        engine.println('You ran out of money!');
        break;
      }

      var again = await engine.input('Play again? (y/n): ');
      if (again.trim().toLowerCase() !== 'y') playing = false;
    }

    if (money > 0) engine.println('You finished with $' + money + '. Goodbye!');
    else engine.println('YOU LOSE!');
    engine.end();
  };
})();
