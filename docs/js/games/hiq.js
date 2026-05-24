(function(){
  var slug='hiq';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Hi-Q');
    engine.setInstructions('Jump pegs over adjacent pegs into empty holes. The jumped peg is removed. Goal: leave only 1 peg.');

    var pegLabels = [
      null, null, null,
      null, '1','2','3', null, null, null,
      null, '4','5','6', null, null, null,
      '7','8','9','10','11','12','13',
      '14','15','16','17','18','19','20',
      '21','22','23','24','25','26','27',
      null, '28','29','30', null, null, null,
      null, '31','32','33', null, null, null,
      null, null, null
    ];

    var pegIndices = {};
    for (var p = 1; p <= 33; p++) pegIndices[p] = null;
    var idx = 0;
    for (var r = 0; r < 7; r++) {
      for (var c = 0; c < 7; c++) {
        var label = pegLabels[idx];
        if (label) pegIndices[parseInt(label, 10)] = { r: r, c: c };
        idx++;
      }
    }

    var board = Grid.make(7, 7, ' ');
    for (var p = 1; p <= 33; p++) {
      var pos = pegIndices[p];
      if (pos) board[pos.r][pos.c] = 'O';
    }
    var center = pegIndices[17];
    board[center.r][center.c] = '.';

    var pegNum = {};
    idx = 0;
    for (var r = 0; r < 7; r++) {
      for (var c = 0; c < 7; c++) {
        var lbl = pegLabels[idx];
        if (lbl) pegNum[r + ',' + c] = parseInt(lbl, 10);
        idx++;
      }
    }

    function isPeg(r, c) {
      return Grid.inBounds(board, r, c) && board[r][c] === 'O';
    }

    function isEmpty(r, c) {
      return Grid.inBounds(board, r, c) && board[r][c] === '.';
    }

    function displayBoard() {
      var lines = [];
      lines.push('       1 2 3');
      lines.push('       4 5 6');
      var row7 = '     ';
      for (var c = 0; c < 7; c++) row7 += board[2][c] + ' ';
      lines.push(row7.trim());
      var row14 = '     ';
      for (var c = 0; c < 7; c++) row14 += board[3][c] + ' ';
      lines.push(row14.trim());
      var row21 = '     ';
      for (var c = 0; c < 7; c++) row21 += board[4][c] + ' ';
      lines.push(row21.trim());
      lines.push('       28 29 30');
      lines.push('       31 32 33');
      return lines.join('\n');
    }

    var pegsLeft = 32;

    while (pegsLeft > 1) {
      engine.clear();
      engine.println('Pegs left: ' + pegsLeft);
      engine.println('');
      engine.println(displayBoard());
      engine.println('');

      var input = await engine.input('Enter move (from to, e.g. "15 17"): ');
      var parts = input.trim().split(/\s+/);
      if (parts.length < 2) {
        engine.println('Enter two peg numbers.');
        continue;
      }
      var from = parseInt(parts[0], 10);
      var to = parseInt(parts[1], 10);
      if (isNaN(from) || isNaN(to) || from < 1 || from > 33 || to < 1 || to > 33) {
        engine.println('Invalid peg numbers.');
        continue;
      }

      var fromPos = pegIndices[from];
      var toPos = pegIndices[to];
      if (!fromPos || !toPos) {
        engine.println('Invalid positions.');
        continue;
      }

      var fr = fromPos.r, fc = fromPos.c;
      var tr = toPos.r, tc = toPos.c;

      if (!isPeg(fr, fc)) {
        engine.println('No peg at ' + from + '.');
        continue;
      }
      if (!isEmpty(tr, tc)) {
        engine.println('Destination is not empty.');
        continue;
      }

      var dr = tr - fr, dc = tc - fc;
      if ((Math.abs(dr) !== 2 && Math.abs(dc) !== 2) || (Math.abs(dr) === 2 && Math.abs(dc) === 2) || (dr !== 0 && dc !== 0)) {
        engine.println('Invalid jump (must be 2 squares in one direction).');
        continue;
      }

      var jumpR = fr + dr / 2, jumpC = fc + dc / 2;
      if (!isPeg(jumpR, jumpC)) {
        engine.println('No peg to jump over.');
        continue;
      }

      board[fr][fc] = '.';
      board[jumpR][jumpC] = '.';
      board[tr][tc] = 'O';
      pegsLeft--;
    }

    engine.clear();
    engine.println(displayBoard());
    engine.println('');
    if (pegsLeft === 1) {
      engine.println('Congratulations! You left 1 peg!');
    }
    engine.end();
  };
})();
