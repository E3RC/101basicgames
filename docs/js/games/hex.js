(function(){
  var slug='hex';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Hexapawn');
    engine.setInstructions('Pawn chess on 3x3 board. Move forward or capture diagonally. First to reach the opposite end or block wins.');
    engine.println('Hexapawn');
    engine.println('');
    engine.println('3x3 board. You are White (W), Computer is Black (B).');
    engine.println('Pawns move forward 1 space or capture diagonally forward.');
    engine.println('First to reach the opposite end or block all opponent moves wins.');
    engine.println('');

    var board = Grid.make(3, 3, '.');
    board[0][0] = 'W'; board[0][1] = 'W'; board[0][2] = 'W';
    board[2][0] = 'B'; board[2][1] = 'B'; board[2][2] = 'B';

    function displayBoard() {
      var lines = [];
      for (var r = 0; r < 3; r++) {
        var row = '';
        for (var c = 0; c < 3; c++) {
          row += ' ' + board[r][c] + ' ';
          if (c < 2) row += '|';
        }
        lines.push(row);
        if (r < 2) lines.push('---+---+---');
      }
      return lines.join('\n');
    }

    function getMoves(player) {
      var moves = [];
      var forward = player === 'W' ? -1 : 1;
      for (var r = 0; r < 3; r++) {
        for (var c = 0; c < 3; c++) {
          if (board[r][c] !== player) continue;
          var nr = r + forward;
          if (Grid.inBounds(board, nr, c) && board[nr][c] === '.') {
            moves.push({ fromR: r, fromC: c, toR: nr, toC: c });
          }
          for (var dc = -1; dc <= 1; dc += 2) {
            var nc = c + dc;
            if (Grid.inBounds(board, nr, nc) && board[nr][nc] !== '.' && board[nr][nc] !== player) {
              moves.push({ fromR: r, fromC: c, toR: nr, toC: nc });
            }
          }
        }
      }
      return moves;
    }

    function hasPlayerWon(player) {
      var goalRow = player === 'W' ? 0 : 2;
      for (var c = 0; c < 3; c++) {
        if (board[goalRow][c] === player) return true;
      }
      return false;
    }

    function applyMove(move) {
      board[move.toR][move.toC] = board[move.fromR][move.fromC];
      board[move.fromR][move.fromC] = '.';
    }

    function undoMove(move, captured) {
      board[move.fromR][move.fromC] = board[move.toR][move.toC];
      board[move.toR][move.toC] = captured;
    }

    function computerMove() {
      var cmoves = getMoves('B');
      if (cmoves.length === 0) return null;

      for (var i = 0; i < cmoves.length; i++) {
        var captured = board[cmoves[i].toR][cmoves[i].toC];
        applyMove(cmoves[i]);
        if (hasPlayerWon('B')) { undoMove(cmoves[i], captured); return cmoves[i]; }
        var pmoves = getMoves('W');
        var allBlocked = pmoves.length === 0;
        undoMove(cmoves[i], captured);
        if (allBlocked) return cmoves[i];
      }

      for (var i = 0; i < cmoves.length; i++) {
        var captured = board[cmoves[i].toR][cmoves[i].toC];
        applyMove(cmoves[i]);
        var pmoves = getMoves('W');
        for (var j = 0; j < pmoves.length; j++) {
          var pcaptured = board[pmoves[j].toR][pmoves[j].toC];
          applyMove(pmoves[j]);
          if (hasPlayerWon('W')) { undoMove(pmoves[j], pcaptured); undoMove(cmoves[i], captured); return null; }
          undoMove(pmoves[j], pcaptured);
        }
        undoMove(cmoves[i], captured);
      }

      RNG.shuffle(cmoves);
      return cmoves[0];
    }

    while (true) {
      engine.clear();
      engine.println(displayBoard());
      engine.println('');

      if (hasPlayerWon('W')) {
        engine.println('You reached the opposite end! You win!');
        break;
      }
      if (hasPlayerWon('B')) {
        engine.println('Computer reached the opposite end! Computer wins!');
        break;
      }

      var pmoves = getMoves('W');
      if (pmoves.length === 0) {
        engine.println('You have no moves. Computer wins!');
        break;
      }

      var cmoves = getMoves('B');
      if (cmoves.length === 0) {
        engine.println('Computer has no moves. You win!');
        break;
      }

      var input = await engine.input('Your move (e.g. "A1 A2" or "from to"): ');
      var parts = input.trim().split(/\s+/);
      if (parts.length < 2) {
        engine.println('Enter from and to coordinates.');
        continue;
      }

      var from = Grid.parseCoord(parts[0], 3, 3);
      var to = Grid.parseCoord(parts[1], 3, 3);
      if (!from || !to) {
        engine.println('Invalid coordinates.');
        continue;
      }

      var valid = false;
      for (var i = 0; i < pmoves.length; i++) {
        if (pmoves[i].fromR === from.r && pmoves[i].fromC === from.c &&
            pmoves[i].toR === to.r && pmoves[i].toC === to.c) {
          valid = true;
          break;
        }
      }
      if (!valid) {
        engine.println('Invalid move.');
        continue;
      }

      applyMove(pmoves[i]);

      if (hasPlayerWon('W')) {
        engine.clear();
        engine.println(displayBoard());
        engine.println('');
        engine.println('You win!');
        break;
      }

      var comp = computerMove();
      if (comp) {
        var compFrom = String.fromCharCode(65 + comp.fromC) + (comp.fromR + 1);
        var compTo = String.fromCharCode(65 + comp.toC) + (comp.toR + 1);
        engine.println('Computer plays: ' + compFrom + ' to ' + compTo);
        applyMove(comp);
      }

      if (hasPlayerWon('B')) {
        engine.clear();
        engine.println(displayBoard());
        engine.println('');
        engine.println('Computer wins!');
        break;
      }

      cmoves = getMoves('B');
      if (cmoves.length === 0) {
        engine.clear();
        engine.println(displayBoard());
        engine.println('');
        engine.println('Computer has no moves. You win!');
        break;
      }
    }

    engine.end();
  };
})();
