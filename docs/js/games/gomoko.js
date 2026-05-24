(function(){
  var slug='gomoko';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Gomoko');
    engine.setInstructions('Get 5 stones in a row (horizontal, vertical, or diagonal) on a 15x15 board. You are X, computer is O.');
    engine.println('Gomoko - 5 in a Row');
    engine.println('');
    engine.println('15x15 board. Get 5 in a row to win.');
    engine.println('Enter coordinates like E5.');
    engine.println('');

    var size = 15;
    var board = Grid.make(size, size, '.');

    function displayBoard() {
      return Grid.display(board, { header: true, colLabels: [], rowLabels: [] });
    }

    function checkWin(player) {
      for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
          if (board[r][c] !== player) continue;
          if (c + 4 < size) {
            var all = true;
            for (var i = 0; i < 5; i++) if (board[r][c + i] !== player) { all = false; break; }
            if (all) return true;
          }
          if (r + 4 < size) {
            var all = true;
            for (var i = 0; i < 5; i++) if (board[r + i][c] !== player) { all = false; break; }
            if (all) return true;
          }
          if (r + 4 < size && c + 4 < size) {
            var all = true;
            for (var i = 0; i < 5; i++) if (board[r + i][c + i] !== player) { all = false; break; }
            if (all) return true;
          }
          if (r + 4 < size && c - 4 >= 0) {
            var all = true;
            for (var i = 0; i < 5; i++) if (board[r + i][c - i] !== player) { all = false; break; }
            if (all) return true;
          }
        }
      }
      return false;
    }

    function boardFull() {
      for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
          if (board[r][c] === '.') return false;
        }
      }
      return true;
    }

    function evaluateLine(r1, c1, r2, c2, player) {
      var count = 0, open = 0;
      var opp = player === 'X' ? 'O' : 'X';
      var dr = Math.sign(r2 - r1), dc = Math.sign(c2 - c1);
      var r = r1, c = c1;
      while (r >= 0 && r < size && c >= 0 && c < size) {
        if (board[r][c] === player) count++;
        else if (board[r][c] === '.') open++;
        else break;
        if (r === r2 && c === c2) break;
        r += dr; c += dc;
      }
      return { count: count, open: open };
    }

    function scoreMove(r, c, player) {
      var opp = player === 'X' ? 'O' : 'X';
      var score = 0;
      var dirs = [[0,1],[1,0],[1,1],[1,-1]];
      for (var d = 0; d < dirs.length; d++) {
        var dr = dirs[d][0], dc = dirs[d][1];
        var count = 0;
        for (var i = -4; i <= 4; i++) {
          if (i === 0) continue;
          var nr = r + i * dr, nc = c + i * dc;
          if (!Grid.inBounds(board, nr, nc)) continue;
          if (board[nr][nc] === player) count++;
          else if (board[nr][nc] === opp) { count = -10; break; }
        }
        if (count > score) score = count;
      }
      return score;
    }

    function computerMove() {
      for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
          if (board[r][c] !== '.') continue;
          board[r][c] = 'O';
          if (checkWin('O')) { return { r: r, c: c }; }
          board[r][c] = '.';
        }
      }
      for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
          if (board[r][c] !== '.') continue;
          board[r][c] = 'X';
          if (checkWin('X')) { board[r][c] = '.'; return { r: r, c: c }; }
          board[r][c] = '.';
        }
      }

      var bestScore = -1;
      var best = null;
      for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
          if (board[r][c] !== '.') continue;
          var s = scoreMove(r, c, 'O') + scoreMove(r, c, 'X') * 2;
          if (r === 7 && c === 7) s += 5;
          if (s > bestScore) {
            bestScore = s;
            best = { r: r, c: c };
          }
        }
      }
      return best;
    }

    while (true) {
      engine.clear();
      engine.println(displayBoard());
      engine.println('');

      var input = await engine.input('Your move (e.g. E5): ');
      var coord = Grid.parseCoord(input, size, size);
      if (!coord) {
        engine.println('Invalid coordinate.');
        continue;
      }
      if (board[coord.r][coord.c] !== '.') {
        engine.println('That square is taken.');
        continue;
      }

      board[coord.r][coord.c] = 'X';

      if (checkWin('X')) {
        engine.clear();
        engine.println(displayBoard());
        engine.println('');
        engine.println('You win!');
        break;
      }

      if (boardFull()) {
        engine.clear();
        engine.println(displayBoard());
        engine.println('');
        engine.println('Draw!');
        break;
      }

      var comp = computerMove();
      if (comp) {
        board[comp.r][comp.c] = 'O';
        engine.println('Computer plays ' + String.fromCharCode(65 + comp.c) + (comp.r + 1));

        if (checkWin('O')) {
          engine.clear();
          engine.println(displayBoard());
          engine.println('');
          engine.println('Computer wins!');
          break;
        }

        if (boardFull()) {
          engine.clear();
          engine.println(displayBoard());
          engine.println('');
          engine.println('Draw!');
          break;
        }
      }
    }

    engine.end();
  };
})();
