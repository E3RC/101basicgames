(function(){
  var slug='zoop';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Zoop');
    engine.setInstructions('Remove objects from rows. The player who takes the last object loses (misère Nim).');
    engine.println('Zoop - Game of Nim');
    engine.println('');
    engine.println('There are 7 rows of objects.');
    engine.println('On each turn, remove any number of objects from one row.');
    engine.println('The player who takes the LAST object LOSES.');
    engine.println('');

    var rows = [1, 3, 5, 7, 9, 11, 13];

    function showRows() {
      var lines = [];
      for (var i = 0; i < rows.length; i++) {
        var num = (i + 1) + '';
        var objs = '';
        for (var j = 0; j < rows[i]; j++) objs += '*';
        lines.push('Row ' + num + ': ' + objs + ' (' + rows[i] + ')');
      }
      return lines.join('\n');
    }

    function totalObjects() {
      var sum = 0;
      for (var i = 0; i < rows.length; i++) sum += rows[i];
      return sum;
    }

    function isWinForPlayer() {
      var xor = 0;
      for (var i = 0; i < rows.length; i++) xor ^= rows[i];
      return xor !== 0;
    }

    function computerMove() {
      var xor = 0;
      for (var i = 0; i < rows.length; i++) xor ^= rows[i];

      for (var i = 0; i < rows.length; i++) {
        if (rows[i] === 0) continue;
        var target = xor ^ rows[i];
        if (target < rows[i]) {
          return { row: i, count: rows[i] - target };
        }
      }

      var nonZero = [];
      for (var i = 0; i < rows.length; i++) {
        if (rows[i] > 0) nonZero.push(i);
      }
      if (nonZero.length === 0) return null;

      var singleOnes = 0;
      for (var i = 0; i < rows.length; i++) {
        if (rows[i] === 1) singleOnes++;
      }

      if (singleOnes === nonZero.length) {
        var biggest = 0;
        for (var i = 1; i < nonZero.length; i++) {
          if (rows[nonZero[i]] > rows[nonZero[biggest]]) biggest = i;
        }
        return { row: nonZero[biggest], count: rows[nonZero[biggest]] - 1 };
      }

      var r = RNG.pick(nonZero);
      var c = RNG.int(1, rows[r]);
      return { row: r, count: c };
    }

    var playerTurn = true;
    var turn = await engine.input('Who goes first? (P or C): ');
    if (turn.trim().toUpperCase() === 'C') playerTurn = false;

    while (totalObjects() > 0) {
      engine.clear();
      engine.println(showRows());
      engine.println('');

      if (playerTurn) {
        var input = await engine.input('Enter row and count (e.g. "3 5"): ');
        var parts = input.trim().split(/\s+/);
        if (parts.length < 2) {
          engine.println('Enter row and count.');
          continue;
        }
        var rowNum = parseInt(parts[0], 10) - 1;
        var count = parseInt(parts[1], 10);
        if (isNaN(rowNum) || isNaN(count) || rowNum < 0 || rowNum >= rows.length) {
          engine.println('Invalid row (1-7).');
          continue;
        }
        if (count < 1 || count > rows[rowNum]) {
          engine.println('Invalid count.');
          continue;
        }
        rows[rowNum] -= count;
        engine.println('You removed ' + count + ' from row ' + (rowNum + 1) + '.');
      } else {
        var move = computerMove();
        if (!move) break;
        rows[move.row] -= move.count;
        engine.println('Computer removes ' + move.count + ' from row ' + (move.row + 1) + '.');
      }

      if (totalObjects() === 0) {
        if (playerTurn) {
          engine.println('You took the last object. You lose!');
        } else {
          engine.println('Computer took the last object. You win!');
        }
        break;
      }

      playerTurn = !playerTurn;
    }

    engine.end();
  };
})();
