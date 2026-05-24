(function(){
  var slug='even';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Even Wins');
    engine.setInstructions('Even Wins (Nim). There are 5 piles of objects (1-9 each). Players take turns removing any number of objects from a single pile. The player who takes the LAST object WINS. Computer uses optimal XOR strategy.');

    var piles = [];
    for (var i = 0; i < 5; i++) piles.push(RNG.int(1, 9));

    function xorAll() {
      var x = 0;
      for (var i = 0; i < piles.length; i++) x ^= piles[i];
      return x;
    }

    function displayPiles() {
      var lines = [];
      for (var i = 0; i < piles.length; i++) {
        var label = String.fromCharCode(65 + i);
        var bar = '';
        for (var j = 0; j < piles[i]; j++) bar += '|';
        lines.push('Pile ' + label + ' (' + piles[i] + '): ' + bar);
      }
      return lines.join('\n');
    }

    function isGameOver() {
      for (var i = 0; i < piles.length; i++) if (piles[i] > 0) return false;
      return true;
    }

    function computerMove() {
      var xor = xorAll();
      if (xor === 0) {
        var nonZero = [];
        for (var i = 0; i < piles.length; i++) if (piles[i] > 0) nonZero.push(i);
        var idx = RNG.pick(nonZero);
        return {pile: idx, count: 1};
      }
      for (var i = 0; i < piles.length; i++) {
        if (piles[i] > 0) {
          var target = piles[i] ^ xor;
          if (target < piles[i]) {
            return {pile: i, count: piles[i] - target};
          }
        }
      }
      var nonZero = [];
      for (var i = 0; i < piles.length; i++) if (piles[i] > 0) nonZero.push(i);
      var idx = RNG.pick(nonZero);
      return {pile: idx, count: 1};
    }

    var playerTurn = true;

    engine.clear();
    engine.println('EVEN WINS (Nim)');
    engine.println('');

    while (true) {
      engine.println(displayPiles());
      engine.println('');

      if (isGameOver()) {
        if (playerTurn) {
          engine.println('You took the last object! YOU WIN!');
        } else {
          engine.println('Computer took the last object! Computer wins!');
        }
        break;
      }

      if (playerTurn) {
        var pileInput = await engine.input('Your turn. Pile (A-E): ');
        pileInput = pileInput.trim().toUpperCase();
        var pileIdx = pileInput.charCodeAt(0) - 65;
        if (pileIdx < 0 || pileIdx >= piles.length) {
          engine.println('Invalid pile. Enter A-E.');
          continue;
        }
        if (piles[pileIdx] === 0) {
          engine.println('That pile is empty.');
          continue;
        }
        var countInput = await engine.input('How many to remove (1-' + piles[pileIdx] + '): ');
        var count = parseInt(countInput, 10);
        if (isNaN(count) || count < 1 || count > piles[pileIdx]) {
          engine.println('Enter a valid number.');
          continue;
        }
        piles[pileIdx] -= count;
      } else {
        var move = computerMove();
        engine.println('Computer removes ' + move.count + ' from pile ' + String.fromCharCode(65 + move.pile));
        piles[move.pile] -= move.count;
      }

      playerTurn = !playerTurn;
    }

    engine.end();
  };
})();
