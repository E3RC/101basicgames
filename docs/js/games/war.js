(function(){
  var slug='war';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('War');
    engine.setInstructions('Classic card game War. 52 cards are split between you and the computer. Each turn both flip the top card. Higher rank wins both. Aces are high. If tied, it\'s WAR - each puts 3 cards face down then flips a 4th; higher wins all 10 cards. Game ends when one player has all cards or runs out. If the game goes 200+ rounds, you can auto-resolve.');

    function rankVal(r) { return r === 1 ? 14 : r; }

    function countCards(pile) { return pile.reduce(function(s,p){return s+p.length;}, 0); }

    function collect(pile, cards) {
      RNG.shuffle(cards);
      for (var i = 0; i < cards.length; i++) pile.push(cards[i]);
    }

    function spoilWar(deck, count) {
      var taken = [];
      while (count > 0 && deck.length > 0) {
        var p = deck.shift();
        if (p.length > 0) {
          taken.push(p.shift());
          count--;
        } else {
          deck.shift();
        }
      }
      return taken;
    }

    var deck = Deck.shuffle(Deck.create());
    var playerPile = [{cards: deck.splice(0, 26)}];
    var compPile = [{cards: deck}];
    var rounds = 0;
    var playerCount = 26;
    var compCount = 26;

    engine.println('War! You vs the Computer.');
    engine.println('');

    function showState() {
      engine.println('You: ' + playerCount + ' cards  |  Computer: ' + compCount + ' cards');
    }

    var playing = true;
    var resolved = false;

    while (playing && playerCount > 0 && compCount > 0) {
      rounds++;
      engine.println('--- Round ' + rounds + ' ---');

      if (rounds >= 200) {
        engine.println('This is taking a while...');
        var auto = await engine.input('Auto-resolve? (y/n): ');
        if (auto.trim().toLowerCase() === 'y') {
          var odds = Math.round((playerCount / (playerCount + compCount)) * 100);
          engine.println('You have ~' + odds + '% chance to win.');
          var auto2 = await engine.input('Auto-complete (y) or keep playing (n): ');
          if (auto2.trim().toLowerCase() === 'y') {
            if (RNG.int(1, 100) <= odds) {
              engine.println('Simulation complete: You win the whole deck!');
              playerCount = playerCount + compCount;
              compCount = 0;
            } else {
              engine.println('Simulation complete: Computer wins!');
              compCount = compCount + playerCount;
              playerCount = 0;
            }
            resolved = true;
            break;
          }
        }
      }

      var pCard = spoilWar(playerPile, 1);
      var cCard = spoilWar(compPile, 1);
      if (pCard.length === 0 || cCard.length === 0) {
        if (pCard.length === 0) { engine.println('You have no cards left!'); compCount += cCard.length; playerCount = 0; }
        if (cCard.length === 0) { engine.println('Computer has no cards left!'); playerCount += pCard.length; compCount = 0; }
        break;
      }

      engine.println('You flip: ' + Deck.display(pCard));
      engine.println('Computer flips: ' + Deck.display(cCard));

      var pv = rankVal(pCard[0].rank);
      var cv = rankVal(cCard[0].rank);

      var prize = pCard.concat(cCard);

      if (pv > cv) {
        engine.println('You win the round!');
        collect(playerPile, prize);
        playerCount += prize.length;
        compCount -= cCard.length;
      } else if (cv > pv) {
        engine.println('Computer wins the round!');
        collect(compPile, prize);
        compCount += prize.length;
        playerCount -= pCard.length;
      } else {
        engine.println('WAR!');
        var warCards = [];
        warCards = warCards.concat(pCard, cCard);

        while (true) {
          var pDown = spoilWar(playerPile, 3);
          var cDown = spoilWar(compPile, 3);
          warCards = warCards.concat(pDown, cDown);

          var pUp = spoilWar(playerPile, 1);
          var cUp = spoilWar(compPile, 1);

          if (pUp.length === 0 || cUp.length === 0) {
            if (pUp.length === 0) {
              engine.println('You ran out of cards during WAR! Computer takes all.');
              collect(compPile, warCards.concat(cUp));
              compCount += warCards.length + cUp.length;
              playerCount = 0;
            }
            if (cUp.length === 0) {
              engine.println('Computer ran out of cards during WAR! You take all.');
              collect(playerPile, warCards.concat(pUp));
              playerCount += warCards.length + pUp.length;
              compCount = 0;
            }
            playing = false;
            break;
          }

          engine.println('War flip - You: ' + Deck.display(pUp) + '  Computer: ' + Deck.display(cUp));
          warCards = warCards.concat(pUp, cUp);

          var wPv = rankVal(pUp[0].rank);
          var wCv = rankVal(cUp[0].rank);

          if (wPv > wCv) {
            engine.println('You win the war!');
            collect(playerPile, warCards);
            playerCount += warCards.length;
            compCount -= (cDown.length + cUp.length);
            break;
          } else if (wCv > wPv) {
            engine.println('Computer wins the war!');
            collect(compPile, warCards);
            compCount += warCards.length;
            playerCount -= (pDown.length + pUp.length);
            break;
          } else {
            engine.println('War again! Both flip more cards...');
          }
        }
        if (!playing) break;
      }

      showState();
      engine.println('');

      if (rounds >= 500) {
        engine.println('Maximum rounds reached. Declaring winner by card count.');
        if (playerCount > compCount) engine.println('You have more cards! You win!');
        else if (compCount > playerCount) engine.println('Computer has more cards! Computer wins!');
        else engine.println('It\'s a tie!');
        break;
      }

      if (playerCount === 0) {
        engine.println('You have no cards left!');
      } else if (compCount === 0) {
        engine.println('Computer has no cards left!');
      }
    }

    if (!resolved) {
      if (playerCount > compCount && compCount === 0) {
        engine.println('YOU WIN! You captured all the cards!');
      } else if (compCount > playerCount && playerCount === 0) {
        engine.println('YOU LOSE! Computer captured all the cards!');
      } else if (playerCount > compCount) {
        engine.println('You win with ' + playerCount + ' cards to ' + compCount + '!');
      } else if (compCount > playerCount) {
        engine.println('Computer wins with ' + compCount + ' cards to ' + playerCount + '.');
      } else {
        engine.println('It\'s a tie!');
      }
    }

    engine.end();
  };
})();
