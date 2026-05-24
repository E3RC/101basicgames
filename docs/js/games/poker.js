(function(){
  var slug='poker';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Poker');
    engine.setInstructions('5-Card Draw Poker vs the computer. Start with $200. Ante $5. Get 5 cards, discard up to 5 and draw new ones. Then the computer draws. Two betting rounds. Best hand wins.');

    var HAND_NAMES = ['High Card', 'One Pair', 'Two Pair', 'Three of a Kind', 'Straight', 'Flush', 'Full House', 'Four of a Kind', 'Straight Flush', 'Royal Flush'];

    function evalHand(hand) {
      var ranks = hand.map(function(c){return c.rank;}).sort(function(a,b){return a-b;});
      var suits = hand.map(function(c){return c.suit;});
      var flush = suits.every(function(s){return s===suits[0];});
      var straight = ranks.every(function(r,i){return i===0||r===ranks[i-1]+1;})||(ranks[0]===1&&ranks[1]===10&&ranks[2]===11&&ranks[3]===12&&ranks[4]===13);
      var counts = {};
      ranks.forEach(function(r){counts[r]=(counts[r]||0)+1;});
      var groups = Object.values(counts).sort(function(a,b){return b-a;});
      if(flush&&straight&&ranks[4]===13) return 9;
      if(flush&&straight) return 8;
      if(groups[0]===4) return 7;
      if(groups[0]===3&&groups[1]===2) return 6;
      if(flush) return 5;
      if(straight) return 4;
      if(groups[0]===3) return 3;
      if(groups[0]===2&&groups[1]===2) return 2;
      if(groups[0]===2) return 1;
      return 0;
    }

    function compareHands(hand1, hand2) {
      var v1 = evalHand(hand1);
      var v2 = evalHand(hand2);
      if (v1 !== v2) return v1 - v2;

      var r1 = hand1.map(function(c){return c.rank;}).sort(function(a,b){return b-a;});
      var r2 = hand2.map(function(c){return c.rank;}).sort(function(a,b){return b-a;});
      var c1 = {}; r1.forEach(function(r){c1[r]=(c1[r]||0)+1;});
      var c2 = {}; r2.forEach(function(r){c2[r]=(c2[r]||0)+1;});

      var g1 = Object.keys(c1).sort(function(a,b){return c1[b]-c1[a]||b-a;});
      var g2 = Object.keys(c2).sort(function(a,b){return c2[b]-c2[a]||b-a;});

      for (var i = 0; i < g1.length; i++) {
        var diff = parseInt(g1[i],10) - parseInt(g2[i],10);
        if (diff !== 0) return diff;
      }
      return 0;
    }

    function handStrength(hand) {
      var v = evalHand(hand);
      if (v >= 6) return 3;
      if (v >= 4) return 2;
      if (v >= 1) return 1;
      return 0;
    }

    function bestDiscard(hand) {
      var ranks = hand.map(function(c){return c.rank;});
      var counts = {};
      ranks.forEach(function(r){counts[r]=(counts[r]||0)+1;});
      var keep = {};
      for (var r in counts) {
        if (counts[r] >= 2) keep[r] = true;
      }
      var discards = [];
      for (var i = 0; i < hand.length; i++) {
        if (!keep[hand[i].rank]) discards.push(i);
      }
      if (discards.length === 0) discards = [0, 1, 2, 3, 4];
      return discards;
    }

    var money = 200;
    var playing = true;

    while (playing) {
      engine.println('');
      engine.println('You have $' + money);
      if (money < 5) {
        engine.println('Not enough for ante!');
        break;
      }

      money -= 5;
      engine.println('Ante $5. Pot: $10.');
      var pot = 10;

      var deck = Deck.shuffle(Deck.create());
      var playerHand = Deck.deal(deck, 5);
      var compHand = Deck.deal(deck, 5);

      engine.println('Your hand: ' + Deck.display(playerHand));

      var playerBet = 0;
      var betInput = await engine.input('Bet (check=0, bet 1-$' + Math.min(money, 20) + '): ');
      var pb = parseInt(betInput, 10);
      if (!isNaN(pb) && pb > 0 && pb <= money) {
        playerBet = pb;
        money -= pb;
        pot += pb;
        engine.println('You bet $' + pb + '. Pot: $' + pot);
      } else {
        engine.println('You check.');
      }

      var compStrength = handStrength(compHand);
      var compAction = 'call';
      if (compStrength >= 3 && playerBet > 0) {
        compAction = 'raise';
      } else if (compStrength === 0 && playerBet > 5) {
        compAction = 'fold';
      }

      if (compAction === 'fold') {
        engine.println('Computer folds! You win the pot of $' + pot + '!');
        money += pot;
        var again = await engine.input('Play again? (y/n): ');
        if (again.trim().toLowerCase() !== 'y') playing = false;
        continue;
      }

      if (compAction === 'raise') {
        var compBet = Math.min(10, pot);
        engine.println('Computer raises $' + compBet + '!');
        pot += compBet;
        var callInput = await engine.input('Call (c) or Fold (f): ');
        if (callInput.trim().toLowerCase() === 'f') {
          engine.println('You fold. Computer wins $' + pot);
          again = await engine.input('Play again? (y/n): ');
          if (again.trim().toLowerCase() !== 'y') playing = false;
          continue;
        }
        money -= compBet;
      } else if (playerBet > 0) {
        engine.println('Computer calls $' + playerBet);
      } else {
        engine.println('Computer checks.');
      }

      engine.println('');
      engine.println('--- DRAW PHASE ---');

      var discStr = await engine.input('Which cards to discard? (0-5, space-separated positions 1-5, or 0 for none): ');
      var discards = [];
      var parts = discStr.trim().split(/\s+/);
      if (parts.length > 0 && parts[0] !== '0') {
        for (var i = 0; i < parts.length; i++) {
          var idx = parseInt(parts[i], 10) - 1;
          if (idx >= 0 && idx < 5 && discards.indexOf(idx) === -1) discards.push(idx);
        }
      }
      discards.sort(function(a,b){return b-a;});
      var drawnCards = Deck.deal(deck, discards.length);
      for (var i = 0; i < discards.length; i++) {
        playerHand[discards[i]] = drawnCards[i];
      }
      engine.println('Your new hand: ' + Deck.display(playerHand));

      var compDiscard = bestDiscard(compHand);
      var compDrawn = Deck.deal(deck, compDiscard.length);
      for (var i = 0; i < compDiscard.length; i++) {
        compHand[compDiscard[i]] = compDrawn[i];
      }

      engine.println('');
      engine.println('--- FINAL BETTING ---');

      var playerBet2 = 0;
      var betInput2 = await engine.input('Bet (check=0, bet 1-$' + Math.min(money, 20) + '): ');
      var pb2 = parseInt(betInput2, 10);
      if (!isNaN(pb2) && pb2 > 0 && pb2 <= money) {
        playerBet2 = pb2;
        money -= pb2;
        pot += pb2;
        engine.println('You bet $' + pb2 + '. Pot: $' + pot);
      } else {
        engine.println('You check.');
      }

      var compStrength2 = handStrength(compHand);
      var compAction2 = 'call';
      if (compStrength2 >= 2 && playerBet2 > 0) {
        compAction2 = 'raise';
      } else if (compStrength2 === 0 && playerBet2 > 5 && compStrength2 < 1) {
        compAction2 = 'fold';
      }

      if (compAction2 === 'fold') {
        engine.println('Computer folds! You win $' + pot + '!');
        money += pot;
        again = await engine.input('Play again? (y/n): ');
        if (again.trim().toLowerCase() !== 'y') playing = false;
        continue;
      }

      if (compAction2 === 'raise') {
        var compBet2 = Math.min(10, pot);
        engine.println('Computer raises $' + compBet2 + '!');
        pot += compBet2;
        var callInput2 = await engine.input('Call (c) or Fold (f): ');
        if (callInput2.trim().toLowerCase() === 'f') {
          engine.println('You fold. Computer wins $' + pot);
          again = await engine.input('Play again? (y/n): ');
          if (again.trim().toLowerCase() !== 'y') playing = false;
          continue;
        }
        money -= compBet2;
      } else if (playerBet2 > 0) {
        engine.println('Computer calls $' + playerBet2);
      } else {
        engine.println('Computer checks.');
      }

      engine.println('');
      engine.println('--- SHOWDOWN ---');
      engine.println('Your hand: ' + Deck.display(playerHand) + ' (' + HAND_NAMES[evalHand(playerHand)] + ')');
      engine.println('Computer hand: ' + Deck.display(compHand) + ' (' + HAND_NAMES[evalHand(compHand)] + ')');

      var cmp = compareHands(playerHand, compHand);
      if (cmp > 0) {
        engine.println('You win $' + pot + '!');
        money += pot;
      } else if (cmp < 0) {
        engine.println('Computer wins $' + pot + '.');
      } else {
        engine.println('Split pot!');
        money += Math.floor(pot / 2);
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
