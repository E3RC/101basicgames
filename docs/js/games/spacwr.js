(function(){
  var slug='spacwr';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Space War');
    engine.setInstructions('Space battle on a 10x10 grid. Move, fire lasers, or evade. You are P (player), computer is C. Ships have shields (3). First to destroy the opponent wins.');

    var size = 10;
    var grid = Grid.make(size, size, '.');
    var pPos = {r: 0, c: 0};
    var cPos = {r: 9, c: 9};
    var pShield = 3, cShield = 3;
    grid[0][0] = 'P';
    grid[9][9] = 'C';

    function display() {
      var lines = ['  A B C D E F G H I J'];
      for (var r = 0; r < size; r++) {
        var l = (r + 1) + ' ';
        for (var c = 0; c < size; c++) l += grid[r][c] + ' ';
        lines.push(l);
      }
      return lines.join('\n');
    }

    function moveShip(pos, dr, dc) {
      var nr = pos.r + dr, nc = pos.c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] === '.') {
        grid[pos.r][pos.c] = '.';
        pos.r = nr; pos.c = nc;
        return true;
      }
      return false;
    }

    function fire(pos, dirR, dirC) {
      var r = pos.r + dirR, c = pos.c + dirC;
      while (r >= 0 && r < size && c >= 0 && c < size) {
        if (grid[r][c] === 'C') { return {hit: true, target: 'computer', r: r, c: c}; }
        if (grid[r][c] === 'P') { return {hit: true, target: 'player', r: r, c: c}; }
        if (grid[r][c] !== '.') break;
        r += dirR; c += dirC;
      }
      return {hit: false};
    }

    function countPieces(side) {
      var count = 0;
      for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
          if (side === 'player' && grid[r][c] === 'P') count++;
          if (side === 'computer' && grid[r][c] === 'C') count++;
        }
      }
      return count;
    }

    var gameOver = false;

    while (!gameOver) {
      engine.clear();
      engine.println('SPACE WAR');
      engine.println('Your shields: ' + pShield + '  Computer shields: ' + cShield);
      engine.println(display());
      engine.println('');

      engine.println('Your turn:');
      var action = await engine.input('Action (move/fire/evade): ');
      action = action.trim().toLowerCase();

      if (action === 'move') {
        var dir = await engine.input('Direction (N/S/E/W): ');
        var dr = 0, dc = 0;
        dir = dir.toUpperCase();
        if (dir === 'N') dr = -1;
        else if (dir === 'S') dr = 1;
        else if (dir === 'E') dc = 1;
        else if (dir === 'W') dc = -1;
        else { engine.println('Invalid.'); continue; }
        if (moveShip(pPos, dr, dc)) engine.println('Moved ' + dir);
        else engine.println('Can\'t move there.');
      } else if (action === 'fire') {
        var fdir = await engine.input('Fire direction (N/S/E/W): ');
        var fdr = 0, fdc = 0;
        fdir = fdir.toUpperCase();
        if (fdir === 'N') fdr = -1;
        else if (fdir === 'S') fdr = 1;
        else if (fdir === 'E') fdc = 1;
        else if (fdir === 'W') fdc = -1;
        else { engine.println('Invalid.'); continue; }
        var result = fire(pPos, fdr, fdc);
        if (result.hit && result.target === 'computer') {
          cShield--;
          engine.println('HIT! Computer shields: ' + cShield);
          if (cShield <= 0) { engine.println('Computer destroyed! YOU WIN!'); gameOver = true; break; }
        } else if (result.hit) { engine.println('Hit something.'); }
        else { engine.println('Miss.'); }
      } else if (action === 'evade') {
        pShield++;
        if (pShield > 5) pShield = 5;
        engine.println('Shields strengthened: ' + pShield);
      } else {
        engine.println('Invalid. Use move, fire, or evade.');
        continue;
      }

      var pCount = countPieces('player');
      var cCount = countPieces('computer');

      if (gameOver) break;

      engine.println('');
      engine.println('Computer\'s turn...');

      var cAction = RNG.pick(['move','move','move','fire','fire','evade']);
      if (cAction === 'move') {
        var cDirs = RNG.pick([[0,1],[0,-1],[1,0],[-1,0]]);
        if (moveShip(cPos, cDirs[0], cDirs[1])) engine.println('Computer moved.');
        else engine.println('Computer tried to move but couldn\'t.');
      } else if (cAction === 'fire') {
        var cDir = RNG.pick([[0,1],[0,-1],[1,0],[-1,0]]);
        var cResult = fire(cPos, cDir[0], cDir[1]);
        if (cResult.hit && cResult.target === 'player') {
          pShield--;
          engine.println('Computer HIT you! Your shields: ' + pShield);
          if (pShield <= 0) { engine.println('Your ship destroyed! COMPUTER WINS!'); gameOver = true; break; }
        } else { engine.println('Computer fired and missed.'); }
      } else {
        cShield++;
        if (cShield > 5) cShield = 5;
        engine.println('Computer reinforced shields: ' + cShield);
      }

      if (!gameOver) await engine.input('Press Enter for next turn...');
    }

    engine.end();
  };
})();
