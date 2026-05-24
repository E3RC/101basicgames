(function(){
  var slug='tower';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Tower');
    engine.setInstructions('Move all disks from peg A to peg C. Rules: move one disk at a time, never place a larger disk on a smaller one.');
    engine.println('Towers of Hanoi');
    engine.println('Move all disks from peg A to peg C.');
    engine.println('Rules: move one disk at a time, never place larger on smaller.');
    engine.println('Example move: "A to C"');
    engine.println('');

    var pegs = { A: [4, 3, 2, 1], B: [], C: [] };
    var moves = 0;

    function displayTowers() {
      var lines = [];
      var maxHeight = 4;
      var pegNames = ['A', 'B', 'C'];
      for (var h = maxHeight - 1; h >= 0; h--) {
        var row = '  ';
        for (var p = 0; p < 3; p++) {
          var peg = pegNames[p];
          if (h < pegs[peg].length) {
            var d = pegs[peg][h];
            var bar = '';
            for (var i = 0; i < d; i++) bar += '*';
            bar = bar.padStart(4).padEnd(4);
            row += bar + '  ';
          } else {
            row += '  |    ';
          }
        }
        lines.push(row);
      }
      lines.push('  A      B      C');
      return lines.join('\n');
    }

    function isValidMove(from, to) {
      if (pegs[from].length === 0) return false;
      if (pegs[to].length > 0 && pegs[from][pegs[from].length - 1] > pegs[to][pegs[to].length - 1]) return false;
      return true;
    }

    while (pegs['C'].length < 4) {
      engine.clear();
      engine.println('Moves: ' + moves);
      engine.println('');
      engine.println(displayTowers());
      engine.println('');

      var input = await engine.input('Enter move (e.g. "A to C"): ');
      var parts = input.trim().toUpperCase().split(/\s+/);
      if (parts.length < 3) {
        engine.println('Format: FROM to TO');
        continue;
      }
      var from = parts[0];
      var to = parts[2];
      if ((from !== 'A' && from !== 'B' && from !== 'C') || (to !== 'A' && to !== 'B' && to !== 'C')) {
        engine.println('Use pegs A, B, or C.');
        continue;
      }
      if (from === to) {
        engine.println('From and to must be different.');
        continue;
      }
      if (!isValidMove(from, to)) {
        engine.println('Invalid move!');
        continue;
      }

      var disk = pegs[from].pop();
      pegs[to].push(disk);
      moves++;
    }

    engine.clear();
    engine.println(displayTowers());
    engine.println('');
    engine.println('You did it in ' + moves + ' moves!');
    if (moves === 15) engine.println('Perfect! The minimum is 15 moves.');
    engine.end();
  };
})();
