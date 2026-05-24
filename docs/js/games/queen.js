(function(){
  var slug='queen';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Queen');
    engine.setInstructions('Place 8 queens on a chessboard so no two queens attack each other. Enter coordinates like E5.');
    engine.println('Eight Queens Puzzle');
    engine.println('');
    engine.println('Place 8 queens on the board so that no queen attacks another.');
    engine.println('Queens attack along rows, columns, and diagonals.');
    engine.println('');

    var size = 8;
    var board = Grid.make(size, size, '.');
    var placed = 0;

    var colLabels = [];
    for (var i = 0; i < size; i++) colLabels.push(String.fromCharCode(65 + i));
    var rowLabels = [];
    for (var i = 0; i < size; i++) rowLabels.push(String(i + 1));

    function isSafe(r, c) {
      for (var i = 0; i < size; i++) {
        if (board[r][i] === 'Q') return false;
        if (board[i][c] === 'Q') return false;
      }
      for (var i = -size; i <= size; i++) {
        if (r + i >= 0 && r + i < size && c + i >= 0 && c + i < size && board[r + i][c + i] === 'Q') return false;
        if (r + i >= 0 && r + i < size && c - i >= 0 && c - i < size && board[r + i][c - i] === 'Q') return false;
      }
      return true;
    }

    while (placed < size) {
      engine.clear();
      engine.println('Queens placed: ' + placed + ' / ' + size);
      engine.println('');
      engine.println(Grid.display(board, { header: true, colLabels: colLabels, rowLabels: rowLabels }));
      engine.println('');

      var input = await engine.input('Place queen at (e.g. E5): ');
      var coord = Grid.parseCoord(input, size, size);
      if (!coord) {
        engine.println('Invalid coordinate. Use letter+number (e.g. E5).');
        continue;
      }

      if (board[coord.r][coord.c] !== '.') {
        engine.println('That square is already occupied.');
        continue;
      }

      if (!isSafe(coord.r, coord.c)) {
        engine.println('That queen is under attack! Choose another square.');
        continue;
      }

      board[coord.r][coord.c] = 'Q';
      placed++;

      if (placed === size) {
        engine.clear();
        engine.println('Queens placed: ' + placed + ' / ' + size);
        engine.println('');
        engine.println(Grid.display(board, { header: true, colLabels: colLabels, rowLabels: rowLabels }));
        engine.println('');
        engine.println('Congratulations! You placed all 8 queens safely!');
      }
    }

    engine.end();
  };
})();
