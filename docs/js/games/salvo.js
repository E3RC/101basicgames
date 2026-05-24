(function(){
  var slug='salvo';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Salvo');
    engine.setInstructions('Battleship on an 8x8 grid. Place 5 ships: Carrier(5), Battleship(4), Cruiser(3), Sub(2), Destroyer(1). Take turns firing at coordinates. Hit=H, Miss=M. First to sink all opponent ships wins.');

    var SIZE = 8;
    var SHIPS = [
      {name: 'Carrier', size: 5},
      {name: 'Battleship', size: 4},
      {name: 'Cruiser', size: 3},
      {name: 'Sub', size: 2},
      {name: 'Destroyer', size: 1}
    ];

    var playerGrid, compGrid;
    var playerShots, compShots;
    var playerShips, compShips;

    function initGrids() {
      playerGrid = Grid.make(SIZE, SIZE, '.');
      compGrid = Grid.make(SIZE, SIZE, '.');
      playerShots = Grid.make(SIZE, SIZE, '.');
      compShots = Grid.make(SIZE, SIZE, '.');
      playerShips = [];
      compShips = [];
    }

    function canPlace(grid, ship, r, c, vertical) {
      for (var i = 0; i < ship.size; i++) {
        var nr = vertical ? r + i : r;
        var nc = vertical ? c : c + i;
        if (!Grid.inBounds(grid, nr, nc) || grid[nr][nc] !== '.') return false;
      }
      return true;
    }

    function placeShip(grid, ship, r, c, vertical) {
      for (var i = 0; i < ship.size; i++) {
        var nr = vertical ? r + i : r;
        var nc = vertical ? c : c + i;
        grid[nr][nc] = ship.name[0];
      }
    }

    function placeShipsRandom(grid, ships) {
      for (var i = 0; i < ships.length; i++) {
        var placed = false;
        while (!placed) {
          var r = RNG.int(0, SIZE - 1);
          var c = RNG.int(0, SIZE - 1);
          var v = RNG.int(0, 1) === 0;
          if (canPlace(grid, ships[i], r, c, v)) {
            placeShip(grid, ships[i], r, c, v);
            ships[i].r = r;
            ships[i].c = c;
            ships[i].vertical = v;
            placed = true;
          }
        }
      }
    }

    function fire(grid, shots, r, c) {
      if (grid[r][c] === '.') {
        grid[r][c] = 'M';
        shots[r][c] = 'M';
        return 'miss';
      } else if (grid[r][c] !== 'M' && grid[r][c] !== 'H') {
        grid[r][c] = 'H';
        shots[r][c] = 'H';
        return 'hit';
      }
      return 'already';
    }

    function isShipSunk(grid, ship) {
      for (var i = 0; i < ship.size; i++) {
        var nr = ship.vertical ? ship.r + i : ship.r;
        var nc = ship.vertical ? ship.c : ship.c + i;
        if (grid[nr][nc] === ship.name[0]) return false;
      }
      return true;
    }

    function allSunk(grid, ships) {
      for (var i = 0; i < ships.length; i++) {
        if (!isShipSunk(grid, ships[i])) return false;
      }
      return true;
    }

    function displayPlayerGrid() {
      var lines = [];
      lines.push('Your Ships:');
      lines.push(Grid.display(playerGrid));
      return lines.join('\n');
    }

    function displayShotGrid() {
      var lines = [];
      lines.push('Shots at Computer:');
      lines.push(Grid.display(compShots));
      return lines.join('\n');
    }

    function getShotCoords() {
      var shots = [];
      for (var r = 0; r < SIZE; r++) {
        for (var c = 0; c < SIZE; c++) {
          if (compGrid[r][c] === '.' || compGrid[r][c] === 'H') {
            shots.push({r: r, c: c});
          }
        }
      }
      return shots;
    }

    function computerFire() {
      var available = getShotCoords();
      RNG.shuffle(available);

      for (var i = 0; i < available.length; i++) {
        var coord = available[i];
        if (compGrid[coord.r][coord.c] === 'H') {
          var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
          RNG.shuffle(dirs);
          for (var d = 0; d < dirs.length; d++) {
            var nr = coord.r + dirs[d][0], nc = coord.c + dirs[d][1];
            if (Grid.inBounds(compGrid, nr, nc) && compGrid[nr][nc] === '.') {
              return {r: nr, c: nc, display: String.fromCharCode(65 + nc) + (nr + 1)};
            }
          }
        }
      }

      for (var i = 0; i < available.length; i++) {
        var coord = available[i];
        if (playerGrid[coord.r][coord.c] === '.' || playerGrid[coord.r][coord.c] !== 'H') {
          return {r: coord.r, c: coord.c, display: String.fromCharCode(65 + coord.c) + (coord.r + 1)};
        }
      }

      var coord = available[0];
      return {r: coord.r, c: coord.c, display: String.fromCharCode(65 + coord.c) + (coord.r + 1)};
    }

    initGrids();
    placeShipsRandom(playerGrid, SHIPS);
    placeShipsRandom(compGrid, SHIPS);
    playerShips = SHIPS.map(function(s){return {name:s.name,size:s.size,r:s.r,c:s.c,vertical:s.vertical};});
    compShips = SHIPS.map(function(s){return {name:s.name,size:s.size,r:s.r,c:s.c,vertical:s.vertical};});

    engine.clear();
    engine.println('SALVO (Battleship)');
    engine.println('');

    engine.println('Place your ships on the 8x8 grid (A1-H8).');
    engine.println('');

    initGrids();

    var coordMap = {};
    for (var i = 0; i < SHIPS.length; i++) {
      var ship = SHIPS[i];
      engine.println('Place your ' + ship.name + ' (size ' + ship.size + '):');
      while (true) {
        var startInput = await engine.input('Starting coordinate (e.g. A1): ');
        var startCoord = Grid.parseCoord(startInput, SIZE, SIZE);
        if (!startCoord) { engine.println('Invalid coordinate.'); continue; }
        var dirInput = await engine.input('Direction (H=horizontal, V=vertical): ');
        dirInput = dirInput.trim().toUpperCase();
        var vert = dirInput === 'V';
        if (dirInput !== 'H' && dirInput !== 'V') { engine.println('Enter H or V.'); continue; }
        if (!canPlace(playerGrid, ship, startCoord.r, startCoord.c, vert)) {
          engine.println('Cannot place there (out of bounds or overlap).');
          continue;
        }
        placeShip(playerGrid, ship, startCoord.r, startCoord.c, vert);
        ship.r = startCoord.r;
        ship.c = startCoord.c;
        ship.vertical = vert;
        break;
      }
    }

    var playerTurn = true;

    while (true) {
      engine.clear();
      engine.println(displayPlayerGrid());
      engine.println('');
      engine.println(displayShotGrid());
      engine.println('');

      if (allSunk(compGrid, SHIPS)) {
        engine.println('You sank all enemy ships! YOU WIN!');
        break;
      }
      if (allSunk(playerGrid, SHIPS)) {
        engine.println('All your ships were sunk! YOU LOSE!');
        break;
      }

      if (playerTurn) {
        var input = await engine.input('Your shot (e.g. A1): ');
        var coord = Grid.parseCoord(input, SIZE, SIZE);
        if (!coord) { engine.println('Invalid coordinate.'); continue; }
        if (compShots[coord.r][coord.c] !== '.') {
          engine.println('Already fired there.');
          continue;
        }
        var result = fire(compGrid, compShots, coord.r, coord.c);
        if (result === 'hit') {
          engine.println('HIT!');
          for (var i = 0; i < SHIPS.length; i++) {
            if (isShipSunk(compGrid, SHIPS[i])) {
              engine.println('You sank their ' + SHIPS[i].name + '!');
            }
          }
        } else if (result === 'miss') {
          engine.println('Miss.');
        }
        playerTurn = false;
      } else {
        var shot = computerFire();
        engine.println('Computer fires at ' + shot.display);
        var result = fire(playerGrid, compShots, shot.r, shot.c);
        if (result === 'hit') {
          engine.println('Computer HIT your ship!');
          for (var i = 0; i < SHIPS.length; i++) {
            if (isShipSunk(playerGrid, SHIPS[i])) {
              engine.println('Computer sank your ' + SHIPS[i].name + '!');
            }
          }
        } else {
          engine.println('Computer missed.');
        }
        playerTurn = true;
      }
      if (playerTurn) {
        var cont = await engine.input('Press Enter to continue...');
      }
    }

    engine.end();
  };
})();
