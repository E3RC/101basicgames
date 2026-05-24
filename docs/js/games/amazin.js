(function(){
  var slug='amazin';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Amazing');
    engine.setInstructions('The computer generates a random maze. Watch it being built using depth-first search.');

    function makeMaze(cols, rows) {
      var grid = [];
      for (var r = 0; r < rows; r++) {
        grid[r] = [];
        for (var c = 0; c < cols; c++) {
          grid[r][c] = { visited: false, N: true, S: true, E: true, W: true };
        }
      }

      function neighbors(r, c) {
        var n = [];
        if (r > 0 && !grid[r - 1][c].visited) n.push({ r: r - 1, c: c, dir: 'N' });
        if (r < rows - 1 && !grid[r + 1][c].visited) n.push({ r: r + 1, c: c, dir: 'S' });
        if (c > 0 && !grid[r][c - 1].visited) n.push({ r: r, c: c - 1, dir: 'W' });
        if (c < cols - 1 && !grid[r][c + 1].visited) n.push({ r: r, c: c + 1, dir: 'E' });
        return n;
      }

      function removeWall(a, b, dir) {
        if (dir === 'N') { grid[a.r][a.c].N = false; grid[b.r][b.c].S = false; }
        else if (dir === 'S') { grid[a.r][a.c].S = false; grid[b.r][b.c].N = false; }
        else if (dir === 'E') { grid[a.r][a.c].E = false; grid[b.r][b.c].W = false; }
        else if (dir === 'W') { grid[a.r][a.c].W = false; grid[b.r][b.c].E = false; }
      }

      var stack = [{ r: 0, c: 0 }];
      grid[0][0].visited = true;

      while (stack.length > 0) {
        var current = stack[stack.length - 1];
        var n = neighbors(current.r, current.c);
        if (n.length === 0) {
          stack.pop();
        } else {
          var next = RNG.pick(n);
          removeWall(current, next, next.dir);
          grid[next.r][next.c].visited = true;
          stack.push({ r: next.r, c: next.c });
        }
      }
      return grid;
    }

    function displayMaze(grid) {
      var rows = grid.length;
      var cols = grid[0].length;
      var lines = [];

      var top = '  +';
      for (var c = 0; c < cols; c++) top += (grid[0][c].N ? '---' : '   ') + '+';
      lines.push(top);

      for (var r = 0; r < rows; r++) {
        var mid = '';
        if (grid[r][0].W) mid += ' |'; else mid += '  ';
        for (var c = 0; c < cols; c++) {
          mid += '   ';
          if (grid[r][c].E) mid += '|'; else mid += ' ';
        }
        lines.push(mid);

        var bot = '  +';
        for (var c = 0; c < cols; c++) {
          if (grid[r][c].S) bot += '---+'; else bot += '   +';
        }
        lines.push(bot);
      }

      var S = lines[0];
      lines[0] = '  ' + S.substring(3, S.length - 1);
      return lines.join('\n');
    }

    var again = true;
    while (again) {
      engine.clear();
      engine.println('AMAZING MAZE\n');
      var colStr = await engine.input('Number of columns (5-20): ');
      var cols = parseInt(colStr, 10);
      if (isNaN(cols) || cols < 5) cols = 10;
      if (cols > 20) cols = 20;
      var rowStr = await engine.input('Number of rows (5-20): ');
      var rows = parseInt(rowStr, 10);
      if (isNaN(rows) || rows < 5) rows = 10;
      if (rows > 20) rows = 20;

      var maze = makeMaze(cols, rows);
      engine.clear();
      engine.println(displayMaze(maze));
      engine.println('');

      var ans = await engine.input('Another maze? (Y/N): ');
      again = ans.trim().toUpperCase() === 'Y';
    }

    engine.end();
  };
})();
