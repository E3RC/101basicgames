(function(){
  var slug='civilw';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Civil War');
    engine.setInstructions('Civil War Battle Simulation. You command Union forces against the Confederates on a 5x10 grid. Move troops, attack, or retreat each turn. Capture the enemy HQ (E) to win. Lose if your HQ (H) is captured or all troops eliminated. Combat is resolved by strength comparison plus random factor.');

    var ROWS = 5, COLS = 10;

    var board = Grid.make(ROWS, COLS, null);

    function initBoard() {
      for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
          board[r][c] = null;
        }
      }

      board[2][0] = {type: 'H', owner: 'U', strength: 10};
      board[2][9] = {type: 'H', owner: 'C', strength: 10};

      board[0][0] = {type: 'T', owner: 'U', strength: 8};
      board[1][0] = {type: 'T', owner: 'U', strength: 6};
      board[3][0] = {type: 'T', owner: 'U', strength: 6};
      board[4][0] = {type: 'T', owner: 'U', strength: 8};

      board[0][9] = {type: 'T', owner: 'C', strength: 8};
      board[1][9] = {type: 'T', owner: 'C', strength: 6};
      board[3][9] = {type: 'T', owner: 'C', strength: 6};
      board[4][9] = {type: 'T', owner: 'C', strength: 8};

      for (var i = 0; i < 4; i++) {
        var placed = false;
        while (!placed) {
          var r = RNG.int(1, 3);
          var c = RNG.int(2, 7);
          if (!board[r][c]) {
            board[r][c] = {type: 'T', owner: 'C', strength: RNG.int(3, 7)};
            placed = true;
          }
        }
      }
    }

    function displayBoard() {
      var lines = [];
      var header = '   ';
      for (var c = 0; c < COLS; c++) header += String.fromCharCode(65 + c) + ' ';
      lines.push(header);
      for (var r = 0; r < ROWS; r++) {
        var row = (r + 1) + '  ';
        for (var c = 0; c < COLS; c++) {
          var t = board[r][c];
          if (!t) { row += '. '; continue; }
          var sym;
          if (t.type === 'H') sym = t.owner === 'U' ? 'H' : 'E';
          else sym = t.owner === 'U' ? 'U' : 'C';
          row += sym + ' ';
        }
        lines.push(row);
      }
      lines.push('H=Union HQ, E=Enemy HQ, U=Union, C=Confederate');
      return lines.join('\n');
    }

    function getTroops(owner) {
      var count = 0;
      var hasHQ = false;
      for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
          if (board[r][c] && board[r][c].owner === owner) {
            count++;
            if (board[r][c].type === 'H') hasHQ = true;
          }
        }
      }
      return {count: count, hasHQ: hasHQ};
    }

    function getMoves(r, c) {
      var moves = [];
      var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
      for (var i = 0; i < dirs.length; i++) {
        var nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !board[nr][nc]) {
          moves.push({r: nr, c: nc});
        }
      }
      return moves;
    }

    function getAdjacentEnemies(r, c, owner) {
      var enemies = [];
      var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
      for (var i = 0; i < dirs.length; i++) {
        var nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] && board[nr][nc].owner !== owner) {
          enemies.push({r: nr, c: nc, troop: board[nr][nc]});
        }
      }
      return enemies;
    }

    function computerTurn() {
      var moves = [];
      for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
          if (!board[r][c] || board[r][c].owner !== 'C') continue;
          var enemies = getAdjacentEnemies(r, c, 'C');
          if (enemies.length > 0) {
            moves.push({action: 'attack', fromR: r, fromC: c, target: RNG.pick(enemies)});
          }
          var adj = getMoves(r, c);
          if (adj.length > 0) {
            var target = RNG.pick(adj);
            moves.push({action: 'move', fromR: r, fromC: c, toR: target.r, toC: target.c});
          }
        }
      }
      if (moves.length === 0) return null;
      RNG.shuffle(moves);
      return moves[0];
    }

    initBoard();

    engine.clear();
    engine.println('CIVIL WAR BATTLE');
    engine.println('');

    while (true) {
      engine.println(displayBoard());
      engine.println('');

      var unionInfo = getTroops('U');
      var confInfo = getTroops('C');
      engine.println('Union troops: ' + unionInfo.count + ' | Confederate troops: ' + confInfo.count);
      engine.println('');

      if (!unionInfo.hasHQ) {
        engine.println('Your HQ has been captured! YOU LOSE!');
        break;
      }
      if (!confInfo.hasHQ) {
        engine.println('Enemy HQ captured! YOU WIN!');
        break;
      }
      if (unionInfo.count === 0) {
        engine.println('All Union troops eliminated! YOU LOSE!');
        break;
      }
      if (confInfo.count === 0) {
        engine.println('All Confederate troops eliminated! YOU WIN!');
        break;
      }

      var action = await engine.input('Your move (M=move, A=attack, R=retreat): ');
      action = action.trim().toUpperCase();

      if (action === 'M') {
        var fromInput = await engine.input('Move FROM (e.g. A1): ');
        var fromCoord = Grid.parseCoord(fromInput, ROWS, COLS);
        if (!fromCoord) { engine.println('Invalid coordinate.'); continue; }
        var troop = board[fromCoord.r][fromCoord.c];
        if (!troop || troop.owner !== 'U') { engine.println('No Union troop there.'); continue; }
        var adj = getMoves(fromCoord.r, fromCoord.c);
        if (adj.length === 0) { engine.println('No available moves from there.'); continue; }
        var toInput = await engine.input('Move TO (e.g. B1): ');
        var toCoord = Grid.parseCoord(toInput, ROWS, COLS);
        if (!toCoord) { engine.println('Invalid coordinate.'); continue; }
        var valid = false;
        for (var i = 0; i < adj.length; i++) {
          if (adj[i].r === toCoord.r && adj[i].c === toCoord.c) { valid = true; break; }
        }
        if (!valid) { engine.println('Not a valid adjacent empty square.'); continue; }
        board[toCoord.r][toCoord.c] = troop;
        board[fromCoord.r][fromCoord.c] = null;
        engine.println('Moved to ' + toInput.toUpperCase());
      } else if (action === 'A') {
        var fromInput = await engine.input('Attack FROM (e.g. A1): ');
        var fromCoord = Grid.parseCoord(fromInput, ROWS, COLS);
        if (!fromCoord) { engine.println('Invalid coordinate.'); continue; }
        var troop = board[fromCoord.r][fromCoord.c];
        if (!troop || troop.owner !== 'U') { engine.println('No Union troop there.'); continue; }
        var enemies = getAdjacentEnemies(fromCoord.r, fromCoord.c, 'U');
        if (enemies.length === 0) { engine.println('No adjacent enemies.'); continue; }
        var toInput = await engine.input('Attack TARGET (e.g. B1): ');
        var toCoord = Grid.parseCoord(toInput, ROWS, COLS);
        if (!toCoord) { engine.println('Invalid coordinate.'); continue; }
        var target = null;
        for (var i = 0; i < enemies.length; i++) {
          if (enemies[i].r === toCoord.r && enemies[i].c === toCoord.c) { target = enemies[i]; break; }
        }
        if (!target) { engine.println('Not an adjacent enemy.'); continue; }

        var atkPower = troop.strength + Dice.roll(6);
        var defPower = target.troop.strength + Dice.roll(6);
        engine.println('Union attacks with power ' + atkPower + ' vs Confederate power ' + defPower);
        if (atkPower > defPower) {
          engine.println('Union wins! Enemy eliminated.');
          board[toCoord.r][toCoord.c] = null;
          if (fromCoord.r !== toCoord.r || fromCoord.c !== toCoord.c) {
            board[toCoord.r][toCoord.c] = troop;
            board[fromCoord.r][fromCoord.c] = null;
          }
        } else if (atkPower < defPower) {
          engine.println('Confederate wins! Your troop is eliminated.');
          board[fromCoord.r][fromCoord.c] = null;
        } else {
          engine.println('Draw! Both forces weakened.');
          troop.strength = Math.max(1, troop.strength - 1);
          target.troop.strength = Math.max(1, target.troop.strength - 1);
        }
      } else if (action === 'R') {
        var fromInput = await engine.input('Retreat FROM (e.g. A1): ');
        var fromCoord = Grid.parseCoord(fromInput, ROWS, COLS);
        if (!fromCoord) { engine.println('Invalid coordinate.'); continue; }
        var troop = board[fromCoord.r][fromCoord.c];
        if (!troop || troop.owner !== 'U') { engine.println('No Union troop there.'); continue; }

        var retreatDir = await engine.input('Retreat direction (U=up, D=down, L=left, R=right): ');
        retreatDir = retreatDir.trim().toUpperCase();
        var dr = 0, dc = 0;
        if (retreatDir === 'U') dr = -1;
        else if (retreatDir === 'D') dr = 1;
        else if (retreatDir === 'L') dc = -1;
        else if (retreatDir === 'R') dc = 1;
        else { engine.println('Invalid direction.'); continue; }
        var nr = fromCoord.r + dr, nc = fromCoord.c + dc;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) { engine.println('Cannot retreat off the board.'); continue; }
        if (board[nr][nc]) { engine.println('That square is occupied.'); continue; }
        board[nr][nc] = troop;
        board[fromCoord.r][fromCoord.c] = null;
        engine.println('Retreated successfully.');
      } else {
        engine.println('Enter M, A, or R.');
        continue;
      }

      var cmove = computerTurn();
      if (cmove) {
        if (cmove.action === 'attack') {
          var atkPower = board[cmove.fromR][cmove.fromC].strength + Dice.roll(6);
          var defPower = cmove.target.troop.strength + Dice.roll(6);
          engine.println('Confederate attacks from ' + String.fromCharCode(65 + cmove.fromC) + (cmove.fromR + 1) + ' with power ' + atkPower + ' vs Union power ' + defPower);
          if (atkPower > defPower) {
            engine.println('Confederate wins! Union troop eliminated.');
            board[cmove.target.r][cmove.target.c] = null;
          } else if (atkPower < defPower) {
            engine.println('Union holds! Confederate troop eliminated.');
            board[cmove.fromR][cmove.fromC] = null;
          } else {
            engine.println('Draw! Both weakened.');
            board[cmove.fromR][cmove.fromC].strength = Math.max(1, board[cmove.fromR][cmove.fromC].strength - 1);
            cmove.target.troop.strength = Math.max(1, cmove.target.troop.strength - 1);
          }
        } else if (cmove.action === 'move') {
          engine.println('Confederate moves from ' + String.fromCharCode(65 + cmove.fromC) + (cmove.fromR + 1) + ' to ' + String.fromCharCode(65 + cmove.toC) + (cmove.toR + 1));
          board[cmove.toR][cmove.toC] = board[cmove.fromR][cmove.fromC];
          board[cmove.fromR][cmove.fromC] = null;
        }
      } else {
        engine.println('Computer has no available moves.');
      }
      engine.println('');
    }

    engine.end();
  };
})();
