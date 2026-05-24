(function(){
  var slug='boat';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Boat');
    engine.setInstructions('Navigate a boat across a river 10 cells wide. The current pushes you downstream. Set your angle (1-90 degrees) each turn. You have 15 moves to reach the other side. Avoid rocks or take damage. Three rock hits and you sink!');

    var RIVER_WIDTH = 10;
    var MAX_MOVES = 15;
    var MAX_HITS = 3;

    var boatCol = 0;
    var boatRow = 4;
    var moves = 0;
    var hits = 0;
    var rocks = [];

    function generateRocks() {
      rocks = [];
      for (var r = 1; r < RIVER_WIDTH; r++) {
        var numRocks = RNG.int(0, 2);
        for (var i = 0; i < numRocks; i++) {
          var c = RNG.int(0, 8);
          rocks.push({row: r, col: c});
        }
      }
    }

    function displayRiver() {
      var lines = [];
      lines.push('River (L=Left bank, R=Right bank, B=Boat, * = Rock)');
      lines.push('');
      var header = '   ';
      for (var c = 0; c < 9; c++) header += (c + 1) + ' ';
      lines.push(header);
      for (var r = 0; r < RIVER_WIDTH; r++) {
        var row = (r + 1) + '  ';
        if (r === boatRow) {
          for (var c = 0; c < 9; c++) {
            var isRock = false;
            for (var i = 0; i < rocks.length; i++) {
              if (rocks[i].row === r && rocks[i].col === c) { isRock = true; break; }
            }
            if (c === boatCol) row += 'B ';
            else if (isRock) row += '* ';
            else row += '. ';
          }
        } else {
          for (var c = 0; c < 9; c++) {
            var isRock = false;
            for (var i = 0; i < rocks.length; i++) {
              if (rocks[i].row === r && rocks[i].col === c) { isRock = true; break; }
            }
            row += isRock ? '* ' : '. ';
          }
        }
        row += '';
        lines.push(row);
      }
      lines.push('');
      lines.push('Moves: ' + moves + '/' + MAX_MOVES + '  Hits: ' + hits + '/' + MAX_HITS);
      return lines.join('\n');
    }

    function checkRock(r, c) {
      for (var i = 0; i < rocks.length; i++) {
        if (rocks[i].row === r && rocks[i].col === c) {
          rocks.splice(i, 1);
          return true;
        }
      }
      return false;
    }

    generateRocks();

    engine.clear();
    engine.println('BOAT');
    engine.println('');

    while (moves < MAX_MOVES && boatCol < RIVER_WIDTH) {
      if (boatCol >= RIVER_WIDTH) break;

      engine.println(displayRiver());
      engine.println('');

      if (boatCol >= RIVER_WIDTH) break;

      var angleStr = await engine.input('Enter angle (1-90 degrees, or 0 to quit): ');
      var angle = parseInt(angleStr, 10);
      if (isNaN(angle)) {
        engine.println('Enter a number between 1 and 90.');
        continue;
      }
      if (angle === 0) {
        engine.println('You gave up.');
        break;
      }
      if (angle < 1 || angle > 90) {
        engine.println('Angle must be 1-90.');
        continue;
      }

      moves++;

      var forward = Math.round((angle / 90) * 2);
      if (forward < 1) forward = 1;
      var drift = 3 - forward;

      boatCol += forward;
      boatRow += drift;

      if (boatRow < 0) boatRow = 0;
      if (boatRow > 8) boatRow = 8;

      if (boatCol >= RIVER_WIDTH) {
        engine.println('You reached the other side!');
        break;
      }

      if (checkRock(boatRow, boatCol)) {
        hits++;
        engine.println('CRASH! You hit a rock! (' + hits + '/' + MAX_HITS + ' hits)');
        if (hits >= MAX_HITS) {
          engine.println('Your boat is wrecked! GAME OVER.');
          break;
        }
      }

      var downstreamPush = RNG.int(0, 1);
      if (downstreamPush) {
        boatRow += 1;
        if (boatRow > 8) boatRow = 8;
        engine.println('The current pushes you downstream.');
        if (checkRock(boatRow, boatCol)) {
          hits++;
          engine.println('CRASH! You hit a rock from the current! (' + hits + '/' + MAX_HITS + ' hits)');
          if (hits >= MAX_HITS) {
            engine.println('Your boat is wrecked! GAME OVER.');
            break;
          }
        }
      }
    }

    if (boatCol >= RIVER_WIDTH && hits < MAX_HITS) {
      engine.println('');
      engine.println('YOU MADE IT ACROSS! Congratulations!');
    } else if (moves >= MAX_MOVES && boatCol < RIVER_WIDTH) {
      engine.println('');
      engine.println('Out of moves! You didn\'t reach the other side.');
    }

    engine.end();
  };
})();
