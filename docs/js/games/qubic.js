(function(){
  var slug='qubic';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Qubic');
    engine.setInstructions('Get 4 in a row on a 4x4x4 board. Enter "layer row col" (1-4 each). You are X, computer is O.');
    engine.println('Qubic - 3D Tic-Tac-Toe');
    engine.println('');
    engine.println('4x4x4 board. Get 4 in a row in any direction.');
    engine.println('Enter moves as "layer row col" (each 1-4).');
    engine.println('');

    var size = 4;
    var board = [];
    for (var l = 0; l < size; l++) {
      board[l] = [];
      for (var r = 0; r < size; r++) {
        board[l][r] = [];
        for (var c = 0; c < size; c++) {
          board[l][r][c] = '.';
        }
      }
    }

    function displayAll() {
      var lines = [];
      for (var l = 0; l < size; l++) {
        lines.push('Layer ' + (l + 1) + ':');
        for (var r = 0; r < size; r++) {
          var row = '  ';
          for (var c = 0; c < size; c++) {
            row += ' ' + board[l][r][c];
          }
          lines.push(row);
        }
        lines.push('');
      }
      return lines.join('\n');
    }

    function checkWin(player) {
      for (var l = 0; l < size; l++) {
        for (var r = 0; r < size; r++) {
          for (var c = 0; c < size; c++) {
            if (board[l][r][c] !== player) continue;
            if (c + 3 < size) {
              var all = true;
              for (var i = 0; i < 4; i++) if (board[l][r][c + i] !== player) { all = false; break; }
              if (all) return true;
            }
            if (r + 3 < size) {
              var all = true;
              for (var i = 0; i < 4; i++) if (board[l][r + i][c] !== player) { all = false; break; }
              if (all) return true;
            }
            if (l + 3 < size) {
              var all = true;
              for (var i = 0; i < 4; i++) if (board[l + i][r][c] !== player) { all = false; break; }
              if (all) return true;
            }
            if (r + 3 < size && c + 3 < size) {
              var all = true;
              for (var i = 0; i < 4; i++) if (board[l][r + i][c + i] !== player) { all = false; break; }
              if (all) return true;
            }
            if (r + 3 < size && c - 3 >= 0) {
              var all = true;
              for (var i = 0; i < 4; i++) if (board[l][r + i][c - i] !== player) { all = false; break; }
              if (all) return true;
            }
            if (l + 3 < size && r + 3 < size) {
              var all = true;
              for (var i = 0; i < 4; i++) if (board[l + i][r + i][c] !== player) { all = false; break; }
              if (all) return true;
            }
            if (l + 3 < size && c + 3 < size) {
              var all = true;
              for (var i = 0; i < 4; i++) if (board[l + i][r][c + i] !== player) { all = false; break; }
              if (all) return true;
            }
            if (l + 3 < size && r + 3 < size && c + 3 < size) {
              var all = true;
              for (var i = 0; i < 4; i++) if (board[l + i][r + i][c + i] !== player) { all = false; break; }
              if (all) return true;
            }
            if (l + 3 < size && r + 3 < size && c - 3 >= 0) {
              var all = true;
              for (var i = 0; i < 4; i++) if (board[l + i][r + i][c - i] !== player) { all = false; break; }
              if (all) return true;
            }
            if (l + 3 < size && r - 3 >= 0 && c + 3 < size) {
              var all = true;
              for (var i = 0; i < 4; i++) if (board[l + i][r - i][c + i] !== player) { all = false; break; }
              if (all) return true;
            }
            if (l + 3 < size && r - 3 >= 0 && c - 3 >= 0) {
              var all = true;
              for (var i = 0; i < 4; i++) if (board[l + i][r - i][c - i] !== player) { all = false; break; }
              if (all) return true;
            }
          }
        }
      }
      return false;
    }

    function boardFull() {
      for (var l = 0; l < size; l++) {
        for (var r = 0; r < size; r++) {
          for (var c = 0; c < size; c++) {
            if (board[l][r][c] === '.') return false;
          }
        }
      }
      return true;
    }

    function computerMove() {
      for (var l = 0; l < size; l++) {
        for (var r = 0; r < size; r++) {
          for (var c = 0; c < size; c++) {
            if (board[l][r][c] !== '.') continue;
            board[l][r][c] = 'O';
            if (checkWin('O')) return { l: l, r: r, c: c };
            board[l][r][c] = '.';
          }
        }
      }
      for (var l = 0; l < size; l++) {
        for (var r = 0; r < size; r++) {
          for (var c = 0; c < size; c++) {
            if (board[l][r][c] !== '.') continue;
            board[l][r][c] = 'X';
            if (checkWin('X')) { board[l][r][c] = '.'; return { l: l, r: r, c: c }; }
            board[l][r][c] = '.';
          }
        }
      }
      var open = [];
      for (var l = 0; l < size; l++) {
        for (var r = 0; r < size; r++) {
          for (var c = 0; c < size; c++) {
            if (board[l][r][c] === '.') open.push({ l: l, r: r, c: c });
          }
        }
      }
      if (open.length === 0) return null;
      var centerOpen = open.filter(function(p) {
        return p.l >= 1 && p.l <= 2 && p.r >= 1 && p.r <= 2 && p.c >= 1 && p.c <= 2;
      });
      if (centerOpen.length > 0) return RNG.pick(centerOpen);
      return RNG.pick(open);
    }

    while (true) {
      engine.clear();
      engine.println(displayAll());

      var input = await engine.input('Your move (layer row col): ');
      var parts = input.trim().split(/\s+/);
      if (parts.length < 3) {
        engine.println('Enter 3 numbers: layer row col');
        continue;
      }
      var l = parseInt(parts[0], 10) - 1;
      var r = parseInt(parts[1], 10) - 1;
      var c = parseInt(parts[2], 10) - 1;
      if (isNaN(l) || isNaN(r) || isNaN(c) || l < 0 || l >= size || r < 0 || r >= size || c < 0 || c >= size) {
        engine.println('Each value must be 1-' + size + '.');
        continue;
      }
      if (board[l][r][c] !== '.') {
        engine.println('That cell is taken.');
        continue;
      }

      board[l][r][c] = 'X';

      if (checkWin('X')) {
        engine.clear();
        engine.println(displayAll());
        engine.println('');
        engine.println('You win!');
        break;
      }

      if (boardFull()) {
        engine.clear();
        engine.println(displayAll());
        engine.println('');
        engine.println('Draw!');
        break;
      }

      var cmove = computerMove();
      if (cmove) {
        board[cmove.l][cmove.r][cmove.c] = 'O';
        engine.println('Computer plays ' + (cmove.l + 1) + ' ' + (cmove.r + 1) + ' ' + (cmove.c + 1));

        if (checkWin('O')) {
          engine.clear();
          engine.println(displayAll());
          engine.println('');
          engine.println('Computer wins!');
          break;
        }

        if (boardFull()) {
          engine.clear();
          engine.println(displayAll());
          engine.println('');
          engine.println('Draw!');
          break;
        }
      }
    }

    engine.end();
  };
})();
