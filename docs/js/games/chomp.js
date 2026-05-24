(function(){
  var slug='chomp';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Chomp');
    engine.setInstructions('Eat cookies from a 4x5 grid. The top-left square is poisoned. The player who eats it loses.');
    engine.println('Chomp - The Poison Cookie Game');
    engine.println('');
    engine.println('The top-left cookie is poisoned!');
    engine.println('Choose a cookie — all cookies below and to the right are eaten.');
    engine.println('Whoever eats the poison cookie (top-left) loses.');
    engine.println('');

    var rows = 4, cols = 5;
    var board = Grid.make(rows, cols, '.');

    function displayBoard() {
      var lines = ['  '];
      for (var c = 0; c < cols; c++) lines[0] += ' ' + String.fromCharCode(65 + c);
      for (var r = 0; r < rows; r++) {
        var line = (r + 1) + '';
        for (var c = 0; c < cols; c++) {
          line += ' ' + board[r][c];
        }
        lines.push(line);
      }
      return lines.join('\n');
    }

    function isPoisonEaten() {
      return board[0][0] === ' ';
    }

    var playerTurn = true;

    while (!isPoisonEaten()) {
      engine.clear();
      engine.println(displayBoard());
      engine.println('');

      if (playerTurn) {
        var input = await engine.input('Enter coordinates (e.g. B3): ');
        var coord = Grid.parseCoord(input, rows, cols);
        if (!coord) {
          engine.println('Invalid coordinate.');
          continue;
        }
        if (board[coord.r][coord.c] === ' ') {
          engine.println('Already eaten.');
          continue;
        }
        for (var r = coord.r; r < rows; r++) {
          for (var c = coord.c; c < cols; c++) {
            board[r][c] = ' ';
          }
        }
      } else {
        var best = null;
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            if (board[r][c] === ' ' || (r === 0 && c === 0)) continue;
            var sim = [];
            for (var i = 0; i < rows; i++) sim[i] = board[i].slice();
            for (var i = r; i < rows; i++) {
              for (var j = c; j < cols; j++) {
                sim[i][j] = ' ';
              }
            }
            var ok = true;
            var dRows = 0;
            for (var i = 0; i < rows; i++) {
              for (var j = 0; j < cols; j++) {
                if ((i === 0 && j === 0) || sim[i][j] === ' ') continue;
                if (sim[i][j] === '#') continue;
                var sr = i, sc = j;
                var match = true;
                for (var k = 0; k < rows; k++) {
                  for (var l = 0; l < cols; l++) {
                    if (sim[k][l] !== ' ' && sim[k][l] !== '#') {
                      var k2 = rows - 1 - k, l2 = cols - 1 - l;
                      if (sim[k][l] !== sim[k2][l2] || (k !== k2 && l !== l2)) match = false;
                    }
                  }
                }
              }
            }
            if (r === 0 && c === 0) continue;
            best = { r: r, c: c };
            break;
          }
          if (best) break;
        }
        if (!best) {
          var moves = [];
          for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
              if (board[r][c] !== ' ' && !(r === 0 && c === 0)) moves.push({ r: r, c: c });
            }
          }
          if (moves.length === 0) best = { r: 0, c: 0 };
          else best = RNG.pick(moves);
        }
        var colLbl = String.fromCharCode(65 + best.c);
        engine.println('Computer plays ' + colLbl + (best.r + 1));
        for (var r = best.r; r < rows; r++) {
          for (var c = best.c; c < cols; c++) {
            board[r][c] = ' ';
          }
        }
      }

      if (isPoisonEaten()) {
        engine.clear();
        engine.println(displayBoard());
        engine.println('');
        if (playerTurn) {
          engine.println('You ate the poison cookie. You lose!');
        } else {
          engine.println('Computer ate the poison cookie. You win!');
        }
        break;
      }

      playerTurn = !playerTurn;
    }

    engine.end();
  };
})();
