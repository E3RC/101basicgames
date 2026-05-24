(function(){
  var slug='salvo1';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Salvo I');
    engine.setInstructions('Quick Battleship on a 6x6 grid. Place 3 ships: Battleship(3), Cruiser(2), Destroyer(2). Take turns firing at coordinates. Hit=H, Miss=M. First to sink all opponent ships wins.');

    var SIZE = 6;
    var SHIPS = [
      {name: 'Battleship', size: 3},
      {name: 'Cruiser', size: 2},
      {name: 'Destroyer', size: 2}
    ];

    var playerGrid, compGrid;
    var compShots;
    var playerShips = [], compShips = [];

    function initGrids() {
      playerGrid = Grid.make(SIZE, SIZE, '.');
      compGrid = Grid.make(SIZE, SIZE, '.');
      compShots = Grid.make(SIZE, SIZE, '.');
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
      if (shots[r][c] !== '.') return 'already';
      if (grid[r][c] === '.') {
        grid[r][c] = 'M';
        shots[r][c] = 'M';
        return 'miss';
      }
      grid[r][c] = 'H';
      shots[r][c] = 'H';
      return 'hit';
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
      return 'Your Ships:\n' + Grid.display(playerGrid);
    }

    function displayShotGrid() {
      return 'Shots at Computer:\n' + Grid.display(compShots);
    }

    function computerFire() {
      for (var r = 0; r < SIZE; r++) {
        for (var c = 0; c < SIZE; c++) {
          if (compShots[r][c] === 'H') {
            var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
            RNG.shuffle(dirs);
            for (var d = 0; d < dirs.length; d++) {
              var nr = r + dirs[d][0], nc = c + dirs[d][1];
              if (Grid.inBounds(compShots, nr, nc) && compShots[nr][nc] === '.') {
                return {r: nr, c: nc};
              }
            }
          }
        }
      }
      var available = [];
      for (var r = 0; r < SIZE; r++) {
        for (var c = 0; c < SIZE; c++) {
          if (compShots[r][c] === '.') available.push({r: r, c: c});
        }
      }
      return RNG.pick(available);
    }

    initGrids();
    placeShipsRandom(compGrid, SHIPS);
    playerShips = SHIPS.map(function(s){return {name:s.name,size:s.size};});
    compShips = SHIPS.map(function(s){return {name:s.name,size:s.size};});

    engine.clear();
    engine.println('SALVO I (Quick Battleship)');
    engine.println('');
    engine.println('6x6 grid. Ships: Battleship(3), Cruiser(2), Destroyer(2)');
    engine.println('');

    initGrids();

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
          engine.println('Cannot place there.');
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
        } else {
          engine.println('Miss.');
        }
        playerTurn = false;
      } else {
        var shot = computerFire();
        var coordStr = String.fromCharCode(65 + shot.c) + (shot.r + 1);
        engine.println('Computer fires at ' + coordStr);
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
        await engine.input('Press Enter to continue...');
      }
    }

    engine.end();
  };
})();
