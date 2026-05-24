(function(){
  var slug='awari';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Awari');
    engine.setInstructions('African board game. 12 pits + 2 stores. Each pit starts with 4 stones. Sow stones clockwise. If last stone lands in your empty pit, capture. If last stone lands in your store, go again. Game ends when one side is empty.');

    function showBoard(pits, pStore, cStore) {
      var lines = [];
      lines.push('Computer: ' + cStore);
      lines.push('   C11  C9  C7  C5  C3  C1');
      var topRow = ' ';
      for (var i = 11; i >= 0; i -= 2) {
        var val = pits[i];
        topRow += (val < 10 ? '  ' : ' ') + val + ' ';
      }
      lines.push(topRow);
      var botRow = ' ';
      for (var j = 0; j <= 11; j += 2) {
        var val2 = pits[j];
        botRow += (val2 < 10 ? '  ' : ' ') + val2 + ' ';
      }
      lines.push(botRow);
      lines.push('    P1  P3  P5  P7  P9  P11');
      lines.push('Player: ' + pStore);
      return lines.join('\n');
    }

    var pits = [];
    for (var i = 0; i < 12; i++) pits[i] = 4;
    var playerStore = 0, compStore = 0;
    var playerTurn = true;
    var gameOver = false;

    while (!gameOver) {
      engine.clear();
      engine.println(showBoard(pits, playerStore, compStore));
      engine.println('');

      var playerEmpty = true, compEmpty = true;
      for (var k = 0; k < 6; k++) { if (pits[k * 2] > 0) playerEmpty = false; }
      for (var k2 = 0; k2 < 6; k2++) { if (pits[k2 * 2 + 1] > 0) compEmpty = false; }

      if (playerEmpty || compEmpty) {
        for (var m = 0; m < 12; m++) {
          if (m % 2 === 0) playerStore += pits[m];
          else compStore += pits[m];
          pits[m] = 0;
        }
        gameOver = true;
        break;
      }

      if (playerTurn) {
        var inp = await engine.input('Your move (Pit number 1-11, odd): ');
        var pitNum = parseInt(inp, 10);
        if (isNaN(pitNum) || pitNum < 1 || pitNum > 11 || pitNum % 2 === 0) {
          engine.println('Invalid. Choose an odd-numbered pit (1,3,5,7,9,11).');
          continue;
        }
        var idx = pitNum - 1;
        if (pits[idx] === 0) { engine.println('Empty pit.'); continue; }

        var stones = pits[idx];
        pits[idx] = 0;
        var pos = idx;

        while (stones > 0) {
          pos = (pos + 1) % 12;
          if (pos % 2 === 1) { stones--; pits[pos]++; }
          else { stones--; pits[pos]++; }
        }

        if (pos % 2 === 0 && pos >= 0 && pos <= 10) {
          engine.println('Landed in your store! Go again!');
          continue;
        }

        if (pos % 2 === 0 && pits[pos] === 1) {
          var opp = pos + 1;
          if (opp < 12 && pits[opp] > 0) {
            var captured = pits[opp] + 1;
            playerStore += captured;
            pits[pos] = 0;
            pits[opp] = 0;
            engine.println('Captured ' + captured + ' stones!');
          }
        }

        playerTurn = false;
      } else {
        var bestMove = -1;
        var bestCap = -1;
        for (var ci = 1; ci < 12; ci += 2) {
          if (pits[ci] === 0) continue;
          var simPits = pits.slice();
          var s = simPits[ci];
          simPits[ci] = 0;
          var p = ci;
          while (s > 0) {
            p = (p + 1) % 12;
            simPits[p]++;
            s--;
          }
          if (p % 2 === 1 && p < 12) {
            var opp2 = p - 1;
            if (opp2 >= 0 && simPits[opp2] > 0 && simPits[p] === 1) {
              var cap = simPits[opp2] + 1;
              if (cap > bestCap) { bestCap = cap; bestMove = ci; }
            }
          }
        }

        if (bestMove === -1) {
          var valid = [];
          for (var vi = 1; vi < 12; vi += 2) if (pits[vi] > 0) valid.push(vi);
          if (valid.length > 0) bestMove = RNG.pick(valid);
          else bestMove = 1;
        }

        var cStones = pits[bestMove];
        pits[bestMove] = 0;
        var cPos = bestMove;
        while (cStones > 0) {
          cPos = (cPos + 1) % 12;
          if (cPos % 2 === 1) { pits[cPos]++; cStones--; }
          else { pits[cPos]++; cStones--; }
        }

        engine.println('Computer plays pit ' + (bestMove + 1));

        if (cPos % 2 === 1 && cPos === 11) {
          engine.println('Computer goes again!');
          continue;
        }

        if (cPos % 2 === 1 && pits[cPos] === 1) {
          var opp3 = cPos - 1;
          if (opp3 >= 0 && pits[opp3] > 0) {
            var captured2 = pits[opp3] + 1;
            compStore += captured2;
            pits[cPos] = 0;
            pits[opp3] = 0;
            engine.println('Computer captured ' + captured2 + ' stones!');
          }
        }

        playerTurn = true;
      }
    }

    engine.clear();
    engine.println('=== GAME OVER ===');
    engine.println(showBoard(pits, playerStore, compStore));
    engine.println('');
    engine.println('Final - You: ' + playerStore + '  Computer: ' + compStore);
    if (playerStore > compStore) engine.println('YOU WIN!');
    else if (compStore > playerStore) engine.println('COMPUTER WINS!');
    else engine.println('DRAW!');
    engine.end();
  };
})();
