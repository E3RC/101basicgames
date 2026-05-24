(function(){
  var slug='1check';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('One Check');
    engine.setInstructions('Remove checkers from an 8x8 board. Each checker must have a checker below-left or below-right to be removed.');
    engine.println('One Check');
    engine.println('');
    engine.println('Remove all checkers from the board.');
    engine.println('A checker can only be removed if there is another checker');
    engine.println('below-left or below-right of it.');
    engine.println('Checkers fall down to fill gaps.');
    engine.println('');

    var size = 8;
    var board = Grid.make(size, size, '.');

    for (var c = 0; c < size; c++) {
      for (var r = 0; r < 3; r++) {
        board[r][c] = 'O';
      }
    }

    function displayBoard() {
      return Grid.display(board, { header: true, colLabels: [], rowLabels: [] });
    }

    function hasSupport(r, c) {
      if (board[r][c] !== 'O') return false;
      if (r + 1 >= size) return true;
      var leftDown = (c > 0 && board[r + 1][c - 1] === 'O');
      var rightDown = (c < size - 1 && board[r + 1][c + 1] === 'O');
      return leftDown || rightDown;
    }

    function hasAnyValidMove() {
      for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
          if (board[r][c] === 'O' && hasSupport(r, c)) return true;
        }
      }
      return false;
    }

    function applyGravity() {
      for (var c = 0; c < size; c++) {
        var writeRow = size - 1;
        for (var r = size - 1; r >= 0; r--) {
          if (board[r][c] === 'O') {
            board[writeRow][c] = 'O';
            if (writeRow !== r) board[r][c] = '.';
            writeRow--;
          }
        }
        for (var r = writeRow; r >= 0; r--) {
          board[r][c] = '.';
        }
      }
    }

    function countCheckers() {
      var count = 0;
      for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
          if (board[r][c] === 'O') count++;
        }
      }
      return count;
    }

    var gameOver = false;

    while (!gameOver) {
      engine.clear();
      engine.println('Checkers: ' + countCheckers());
      engine.println('');
      engine.println(displayBoard());
      engine.println('');

      if (!hasAnyValidMove()) {
        engine.println('No valid moves remain!');
        engine.println('You left ' + countCheckers() + ' checker(s).');
        gameOver = true;
        break;
      }

      if (countCheckers() === 0) {
        engine.println('All checkers removed! You win!');
        gameOver = true;
        break;
      }

      var input = await engine.input('Enter coordinates to remove (e.g. C3): ');
      var coord = Grid.parseCoord(input, size, size);
      if (!coord) {
        engine.println('Invalid coordinate.');
        continue;
      }

      if (board[coord.r][coord.c] !== 'O') {
        engine.println('No checker there.');
        continue;
      }

      if (!hasSupport(coord.r, coord.c)) {
        engine.println('That checker has no support below-left or below-right.');
        continue;
      }

      board[coord.r][coord.c] = '.';
      applyGravity();
    }

    engine.end();
  };
})();
