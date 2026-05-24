(function(){
  var slug='checkr';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Checkers');
    engine.setInstructions('Standard 8x8 checkers. You are black (b). Enter moves like "A3 to B4". Mandatory jumps. King promotion. Computer plays red.');

    var board = Grid.make(8, 8, '.');
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) {
          if (r < 3) board[r][c] = 'r';
          else if (r > 4) board[r][c] = 'b';
        }
      }
    }

    function display() {
      var lines = ['  A B C D E F G H'];
      for (var r = 0; r < 8; r++) {
        var l = (r + 1) + ' ';
        for (var c = 0; c < 8; c++) l += board[r][c] + ' ';
        lines.push(l);
      }
      return lines.join('\n');
    }

    function isPlayer(p) { return p === 'b' || p === 'B'; }

    function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

    function getMoves(r, c) {
      var piece = board[r][c];
      if (piece === '.') return [];
      var dirs = [];
      if (piece === 'b') dirs = [[1,-1],[1,1]];
      else if (piece === 'r') dirs = [[-1,-1],[-1,1]];
      else { dirs = [[-1,-1],[-1,1],[1,-1],[1,1]]; }

      var moves = [];
      var jumps = [];

      for (var d = 0; d < dirs.length; d++) {
        var dr = dirs[d][0], dc = dirs[d][1];
        var nr = r + dr, nc = c + dc;
        if (inBounds(nr, nc) && board[nr][nc] === '.') {
          moves.push({fr:r, fc:c, tr:nr, tc:nc, jump:false});
        }
        var jr = r + 2*dr, jc = c + 2*dc;
        if (inBounds(jr, jc) && inBounds(nr, nc) && board[nr][nc] !== '.' && board[nr][nc] !== board[r][c] &&
            !isPlayer(board[nr][nc]) === !isPlayer(board[r][c]) &&
            board[jr][jc] === '.') {
          jumps.push({fr:r, fc:c, tr:jr, tc:jc, jump:true, captureR:nr, captureC:nc});
        }
      }

      return jumps.length > 0 ? jumps : moves;
    }

    function getAllMovesFor(side) {
      var all = [];
      for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
          var p = board[r][c];
          if (p !== '.' && ((side === 'player' && isPlayer(p)) || (side === 'computer' && !isPlayer(p)))) {
            var m = getMoves(r, c);
            for (var i = 0; i < m.length; i++) all.push(m[i]);
          }
        }
      }
      return all;
    }

    function applyMove(move) {
      board[move.tr][move.tc] = board[move.fr][move.fc];
      board[move.fr][move.fc] = '.';
      if (move.jump) { board[move.captureR][move.captureC] = '.'; }
      if (move.tr === 7 && board[move.tr][move.tc] === 'b') board[move.tr][move.tc] = 'B';
      if (move.tr === 0 && board[move.tr][move.tc] === 'r') board[move.tr][move.tc] = 'R';
    }

    function parseMove(s) {
      var m = s.toUpperCase().trim().match(/^([A-H])(\d)\s*TO\s*([A-H])(\d)$/);
      if (!m) return null;
      var fc = m[1].charCodeAt(0) - 65;
      var fr = parseInt(m[2], 10) - 1;
      var tc = m[3].charCodeAt(0) - 65;
      var tr = parseInt(m[4], 10) - 1;
      if (!inBounds(fr,fc) || !inBounds(tr,tc)) return null;
      return {fr:fr, fc:fc, tr:tr, tc:tc};
    }

    var gameOver = false;
    var playerTurn = true;

    while (!gameOver) {
      engine.clear();
      engine.println(display());
      engine.println('');

      var pMoves = getAllMovesFor('player');
      var cMoves = getAllMovesFor('computer');

      if (pMoves.length === 0) { engine.println('You have no moves. Computer wins!'); gameOver = true; break; }
      if (cMoves.length === 0) { engine.println('Computer has no moves. You win!'); gameOver = true; break; }

      if (playerTurn) {
        var inp = await engine.input('Your move (e.g. A3 to B4): ');
        var parsed = parseMove(inp);
        if (!parsed) { engine.println('Invalid format.'); continue; }

        var found = false;
        for (var i = 0; i < pMoves.length; i++) {
          if (pMoves[i].fr === parsed.fr && pMoves[i].fc === parsed.fc &&
              pMoves[i].tr === parsed.tr && pMoves[i].tc === parsed.tc) {
            found = true;
            applyMove(pMoves[i]);
            playerTurn = false;
            break;
          }
        }
        if (!found) { engine.println('Invalid move.'); continue; }
      } else {
        var hasJump = false;
        for (var j = 0; j < cMoves.length; j++) { if (cMoves[j].jump) { hasJump = true; break; } }

        var bestMove = null;
        if (hasJump) {
          for (var j2 = 0; j2 < cMoves.length; j2++) {
            if (cMoves[j2].jump) {
              if (!bestMove || cMoves[j2].captureR > bestMove.captureR) bestMove = cMoves[j2];
            }
          }
        } else {
          bestMove = RNG.pick(cMoves);
        }

        if (bestMove) {
          var fc2 = bestMove.fc, fr2 = bestMove.fr, tc2 = bestMove.tc, tr2 = bestMove.tr;
          engine.println('Computer: ' + String.fromCharCode(65+fc2) + (fr2+1) + ' to ' + String.fromCharCode(65+tc2) + (tr2+1));
          applyMove(bestMove);
          playerTurn = true;
        } else {
          gameOver = true;
        }
      }

      var bCount = 0, rCount = 0;
      for (var rr = 0; rr < 8; rr++) {
        for (var cc = 0; cc < 8; cc++) {
          var pp = board[rr][cc];
          if (pp === 'b' || pp === 'B') bCount++;
          if (pp === 'r' || pp === 'R') rCount++;
        }
      }
      if (bCount === 0) { engine.println('You lost all pieces!'); gameOver = true; }
      if (rCount === 0) { engine.println('Computer lost all pieces! You win!'); gameOver = true; }
    }

    engine.println(display());
    engine.println('Game over.');
    engine.end();
  };
})();
