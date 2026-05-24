(function(){
  var slug='war2';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('War II');
    engine.setInstructions('War II card game variant. Two players have 26 cards each. Each turn: secret sacrifice a card, then flip top card. Higher rank wins all cards including sacrifices. Ace high, 2 low. Game ends when one player has all the cards.');

    function rankVal(r) { return r === 1 ? 14 : r; }

    var deck = Deck.shuffle(Deck.create());
    var playerCards = deck.splice(0, 26);
    var compCards = deck;

    function countCards() { return {p: playerCards.length, c: compCards.length}; }

    function cardString(card) { return Deck.rankName(card.rank) + Deck.sym[card.suit]; }

    engine.clear();
    engine.println('WAR II');
    engine.println('');

    var round = 0;

    while (playerCards.length > 0 && compCards.length > 0) {
      round++;
      engine.println('--- Round ' + round + ' ---');
      var counts = countCards();
      engine.println('You: ' + counts.p + ' cards  |  Computer: ' + counts.c + ' cards');
      engine.println('');

      if (playerCards.length === 0 || compCards.length === 0) break;

      var pSacrificeInput = await engine.input('Sacrifice a card (0-based index from your deck, 0-' + (playerCards.length - 1) + '): ');
      var pIdx = parseInt(pSacrificeInput, 10);
      if (isNaN(pIdx) || pIdx < 0 || pIdx >= playerCards.length) {
        engine.println('Invalid index.');
        continue;
      }
      var pSacrifice = playerCards.splice(pIdx, 1)[0];
      var cIdx = RNG.int(0, compCards.length - 1);
      var cSacrifice = compCards.splice(cIdx, 1)[0];

      engine.println('You sacrificed: ???');
      engine.println('Computer sacrificed: ???');
      engine.println('');

      if (playerCards.length === 0 || compCards.length === 0) break;

      var pCard = playerCards.shift();
      var cCard = compCards.shift();

      engine.println('You flip: ' + cardString(pCard));
      engine.println('Computer flips: ' + cardString(cCard));

      var pVal = rankVal(pCard.rank);
      var cVal = rankVal(cCard.rank);

      var prize = [pCard, cCard, pSacrifice, cSacrifice];
      RNG.shuffle(prize);

      if (pVal > cVal) {
        engine.println('You win the round!');
        for (var i = 0; i < prize.length; i++) playerCards.push(prize[i]);
      } else if (cVal > pVal) {
        engine.println('Computer wins the round!');
        for (var i = 0; i < prize.length; i++) compCards.push(prize[i]);
      } else {
        engine.println('TIE! Both cards go to the middle...');
        var warCards = [pCard, cCard, pSacrifice, cSacrifice];
        while (true) {
          if (playerCards.length < 2 || compCards.length < 2) {
            if (playerCards.length < 2) {
              engine.println('You don\'t have enough cards for war!');
              for (var i = 0; i < warCards.length; i++) compCards.push(warCards[i]);
            } else {
              engine.println('Computer doesn\'t have enough cards for war!');
              for (var i = 0; i < warCards.length; i++) playerCards.push(warCards[i]);
            }
            break;
          }
          var pDown = playerCards.shift();
          var cDown = compCards.shift();
          var pUp = playerCards.shift();
          var cUp = compCards.shift();
          warCards.push(pDown, cDown, pUp, cUp);
          engine.println('War flip - You: ' + cardString(pUp) + '  Computer: ' + cardString(cUp));
          var wPv = rankVal(pUp.rank);
          var wCv = rankVal(cUp.rank);
          if (wPv > wCv) {
            engine.println('You win the war!');
            for (var i = 0; i < warCards.length; i++) playerCards.push(warCards[i]);
            break;
          } else if (wCv > wPv) {
            engine.println('Computer wins the war!');
            for (var i = 0; i < warCards.length; i++) compCards.push(warCards[i]);
            break;
          } else {
            engine.println('War again!');
          }
        }
      }
      engine.println('');
    }

    engine.println('--- GAME OVER ---');
    counts = countCards();
    if (counts.p > counts.c) {
      engine.println('YOU WIN! You have ' + counts.p + ' cards to ' + counts.c + '!');
    } else if (counts.c > counts.p) {
      engine.println('COMPUTER WINS! Computer has ' + counts.c + ' cards to ' + counts.p + '!');
    } else {
      engine.println('It\'s a tie! ' + counts.p + ' each.');
    }

    engine.end();
  };
})();
