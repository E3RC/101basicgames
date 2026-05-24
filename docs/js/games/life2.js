(function(){
  var slug='life2';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Life-2');
    engine.setInstructions("Conway's Game of Life. Toggle cells on a 20x20 grid. Enter coordinates (e.g. E5). Enter 'go' to start simulation. Enter 'glider', 'blinker', 'block', 'beehive' for presets. Press Enter to advance generations.");

    var size = 20;
    var grid = Grid.make(size, size, '.');

    function displayGrid() {
      var lines = ['   A B C D E F G H I J K L M N O P Q R S T'];
      for (var r = 0; r < size; r++) {
        var l = (r+1 < 10 ? ' ' : '') + (r+1) + ' ';
        for (var c = 0; c < size; c++) l += grid[r][c] + ' ';
        lines.push(l);
      }
      return lines.join('\n');
    }

    function countNeighbors(r, c) {
      var n = 0;
      for (var dr = -1; dr <= 1; dr++) {
        for (var dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          var nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] === 'O') n++;
        }
      }
      return n;
    }

    function step() {
      var newGrid = Grid.make(size, size, '.');
      for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
          var n = countNeighbors(r, c);
          if (grid[r][c] === 'O') {
            if (n === 2 || n === 3) newGrid[r][c] = 'O';
          } else {
            if (n === 3) newGrid[r][c] = 'O';
          }
        }
      }
      grid = newGrid;
    }

    function placePattern(pattern, startR, startC) {
      for (var r = 0; r < pattern.length; r++) {
        for (var c = 0; c < pattern[r].length; c++) {
          var tr = startR + r, tc = startC + c;
          if (tr >= 0 && tr < size && tc >= 0 && tc < size) grid[tr][tc] = pattern[r][c] ? 'O' : '.';
        }
      }
    }

    var presets = {
      glider: [[0,1,0],[0,0,1],[1,1,1]],
      blinker: [[1,1,1]],
      block: [[1,1],[1,1]],
      beehive: [[0,1,1,0],[1,0,0,1]]
    };

    engine.clear();
    engine.println('LIFE-2: Conway\'s Game of Life');
    engine.println('Set initial pattern. Commands: coordinates to toggle, preset names, "clear", "go".');
    engine.println('');

    var settingUp = true;
    while (settingUp) {
      engine.println(displayGrid());
      engine.println('');
      var inp = await engine.input('Enter command: ');
      inp = inp.trim().toLowerCase();

      if (inp === 'go') {
        if (grid.some(function(row) { return row.some(function(c) { return c === 'O'; }); })) {
          settingUp = false;
        } else {
          engine.println('Grid is empty. Add some cells first.');
        }
        continue;
      }

      if (inp === 'clear') {
        grid = Grid.make(size, size, '.');
        engine.println('Grid cleared.');
        continue;
      }

      if (presets[inp]) {
        engine.clear();
        engine.println('Placement row (1-20):');
        var pr = await engine.input('');
        var prn = parseInt(pr, 10) - 1;
        if (isNaN(prn) || prn < 0 || prn >= size) { engine.println('Invalid row.'); continue; }
        var pc = await engine.input('Placement column (A-T): ');
        var pcn = pc.toUpperCase().charCodeAt(0) - 65;
        if (pcn < 0 || pcn >= size) { engine.println('Invalid column.'); continue; }
        placePattern(presets[inp], prn, pcn);
        continue;
      }

      var coord = Grid.parseCoord(inp, size, size);
      if (coord) {
        grid[coord.r][coord.c] = grid[coord.r][coord.c] === 'O' ? '.' : 'O';
        engine.println('Toggled ' + inp.toUpperCase());
      } else {
        engine.println('Invalid. Try coordinate (e.g. E5), preset, clear, or go.');
      }
    }

    engine.clear();
    engine.println('Simulation running. Press Enter to step, or type "quit".');
    var gen = 0;

    while (true) {
      engine.println('Generation ' + gen);
      engine.println(displayGrid());
      engine.println('');
      var cmd = await engine.input('');
      if (cmd.trim().toLowerCase() === 'quit') break;
      step();
      gen++;
      engine.clear();
    }

    engine.println('Simulation ended after ' + gen + ' generations.');
    engine.end();
  };
})();
