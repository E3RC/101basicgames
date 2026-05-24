(function(){
  var slug='tictac';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Tic-Tac-Toe');
    engine.setInstructions('Play Tic-Tac-Toe against the computer. Get 3 in a row to win. You are X.');

    var again = true;
    while (again) {
      engine.clear();
      engine.println('Tic-Tac-Toe');
      engine.println('');

      var board = Grid.make(3, 3, ' ');
      var player = 'X';
      var comp = 'O';
      var gameOver = false;

      function displayBoard() {
        var lines = [];
        for (var r = 0; r < 3; r++) {
          var cells = [];
          for (var c = 0; c < 3; c++) {
            var val = board[r][c];
            cells.push(val === ' ' ? (r * 3 + c + 1) + '' : val);
          }
          lines.push(' ' + cells.join(' | ') + ' ');
          if (r < 2) lines.push('---+---+---');
        }
        return lines.join('\n');
      }

      async function playerMove() {
        var input = await engine.input('Your move (1-9): ');
        var num = parseInt(input, 10);
        if (isNaN(num) || num < 1 || num > 9) {
          engine.println('Enter 1-9.');
          return null;
        }
        var r = Math.floor((num - 1) / 3);
        var c = (num - 1) % 3;
        if (board[r][c] !== ' ') {
          engine.println('That square is taken.');
          return null;
        }
        return { r: r, c: c };
      }

      while (!gameOver) {
        engine.println(displayBoard());
        engine.println('');

        var move = await playerMove();
        if (!move) continue;

        board[move.r][move.c] = player;

        if (AI.wins(board, player)) {
          engine.println(displayBoard());
          engine.println('');
          engine.println('You win!');
          gameOver = true;
          break;
        }

        if (AI.boardFull(board)) {
          engine.println(displayBoard());
          engine.println('');
          engine.println('Draw!');
          gameOver = true;
          break;
        }

        var cmove = AI.tictacToeMove(board, comp);
        if (cmove) {
          board[cmove[0]][cmove[1]] = comp;
          engine.println('Computer plays ' + (cmove[0] * 3 + cmove[1] + 1));

          if (AI.wins(board, comp)) {
            engine.println(displayBoard());
            engine.println('');
            engine.println('Computer wins!');
            gameOver = true;
            break;
          }

          if (AI.boardFull(board)) {
            engine.println(displayBoard());
            engine.println('');
            engine.println('Draw!');
            gameOver = true;
            break;
          }
        }
      }

      var ans = await engine.input('Play again? (Y/N): ');
      again = ans.trim().toUpperCase() === 'Y';
    }

    engine.end();
  };
})();
