(function(){
  var slug='battle';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Battle');
    engine.setInstructions('Battle simulation. Deploy armies on a 5x5 territory grid. Attack adjacent territories to capture them. Roll dice based on troop count (max 3 attacker, max 2 defender). Higher dice wins; defender wins ties. Winner loses troops equal to loser\'s dice count. Capture all 25 territories to win.');

    var TERRITORIES = 25;
    var board = Grid.make(5, 5, {owner: 0, troops: 1});

    function initBoard() {
      for (var r = 0; r < 5; r++) {
        for (var c = 0; c < 5; c++) {
          board[r][c] = {owner: 0, troops: RNG.int(1, 9)};
        }
      }
      board[0][0].owner = 1;
      board[0][0].troops = RNG.int(5, 15);
      board[4][4].owner = 2;
      board[4][4].troops = RNG.int(5, 15);
    }

    function getNeighbors(r, c) {
      var n = [];
      if (r > 0) n.push({r: r-1, c: c});
      if (r < 4) n.push({r: r+1, c: c});
      if (c > 0) n.push({r: r, c: c-1});
      if (c < 4) n.push({r: r, c: c+1});
      return n;
    }

    function displayBoard() {
      var lines = [];
      lines.push('     Territories');
      var header = '    ';
      for (var c = 0; c < 5; c++) header += ' ' + String.fromCharCode(65 + c) + '    ';
      lines.push(header);
      for (var r = 0; r < 5; r++) {
        var row = (r + 1) + '  ';
        for (var c = 0; c < 5; c++) {
          var t = board[r][c];
          var sym = t.owner === 0 ? '-' : (t.owner === 1 ? 'Y' : 'C');
          var s = sym + String(t.troops);
          while (s.length < 5) s = ' ' + s;
          row += s;
        }
        lines.push(row);
      }
      lines.push('Y=You, C=Computer, -=Neutral');
      return lines.join('\n');
    }

    function countTerritories(owner) {
      var count = 0;
      for (var r = 0; r < 5; r++) {
        for (var c = 0; c < 5; c++) {
          if (board[r][c].owner === owner) count++;
        }
      }
      return count;
    }

    function rollDice(num) {
      var rolls = [];
      for (var i = 0; i < num; i++) rolls.push(Dice.roll(6));
      rolls.sort(function(a,b){return b-a;});
      return rolls;
    }

    function resolveBattle(attTroops, defTroops) {
      var aDice = Math.min(attTroops - 1, 3);
      var dDice = Math.min(defTroops, 2);
      var aRolls = rollDice(aDice);
      var dRolls = rollDice(dDice);
      var minPairs = Math.min(aDice, dDice);
      var aLoss = 0, dLoss = 0;
      for (var i = 0; i < minPairs; i++) {
        if (aRolls[i] > dRolls[i]) {
          dLoss++;
        } else {
          aLoss++;
        }
      }
      return {aRolls: aRolls, dRolls: dRolls, aLoss: aLoss, dLoss: dLoss};
    }

    function computerTurn() {
      var moves = [];
      for (var r = 0; r < 5; r++) {
        for (var c = 0; c < 5; c++) {
          if (board[r][c].owner !== 2 || board[r][c].troops <= 1) continue;
          var neighbors = getNeighbors(r, c);
          for (var i = 0; i < neighbors.length; i++) {
            var t = board[neighbors[i].r][neighbors[i].c];
            if (t.owner !== 2) {
              moves.push({fromR: r, fromC: c, toR: neighbors[i].r, toC: neighbors[i].c});
            }
          }
        }
      }
      if (moves.length === 0) return null;
      RNG.shuffle(moves);
      return moves[0];
    }

    initBoard();

    engine.clear();
    engine.println('BATTLE');
    engine.println('');

    while (true) {
      engine.println(displayBoard());
      engine.println('You control ' + countTerritories(1) + ' territories.');
      engine.println('Computer controls ' + countTerritories(2) + ' territories.');
      engine.println('');

      if (countTerritories(2) === 0) {
        engine.println('You captured all enemy territories! YOU WIN!');
        break;
      }
      if (countTerritories(1) === 0) {
        engine.println('All your territories captured! YOU LOSE!');
        break;
      }

      var fromInput = await engine.input('Your attack FROM (e.g. A1): ');
      var fromCoord = Grid.parseCoord(fromInput, 5, 5);
      if (!fromCoord) {
        engine.println('Invalid coordinate.');
        continue;
      }
      var fromTerritory = board[fromCoord.r][fromCoord.c];
      if (fromTerritory.owner !== 1) {
        engine.println('That is not your territory.');
        continue;
      }
      if (fromTerritory.troops <= 1) {
        engine.println('You need at least 2 troops to attack.');
        continue;
      }

      var toInput = await engine.input('Attack TO (e.g. A2): ');
      var toCoord = Grid.parseCoord(toInput, 5, 5);
      if (!toCoord) {
        engine.println('Invalid coordinate.');
        continue;
      }
      var toTerritory = board[toCoord.r][toCoord.c];
      if (toTerritory.owner === 1) {
        engine.println('That is your own territory.');
        continue;
      }

      var neighbors = getNeighbors(fromCoord.r, fromCoord.c);
      var isNeighbor = false;
      for (var i = 0; i < neighbors.length; i++) {
        if (neighbors[i].r === toCoord.r && neighbors[i].c === toCoord.c) {
          isNeighbor = true;
          break;
        }
      }
      if (!isNeighbor) {
        engine.println('Territories are not adjacent.');
        continue;
      }

      var result = resolveBattle(fromTerritory.troops, toTerritory.troops);
      engine.println('You roll: [' + result.aRolls.join(', ') + ']');
      engine.println('Defender rolls: [' + result.dRolls.join(', ') + ']');
      engine.println('You lose ' + result.aLoss + ' troops. Defender loses ' + result.dLoss + ' troops.');

      fromTerritory.troops -= result.aLoss;
      toTerritory.troops -= result.dLoss;

      if (toTerritory.troops <= 0) {
        engine.println('You captured the territory!');
        toTerritory.owner = 1;
        if (fromTerritory.troops > 1) {
          toTerritory.troops = Math.floor(fromTerritory.troops / 2);
          fromTerritory.troops = Math.ceil(fromTerritory.troops / 2);
        } else {
          toTerritory.troops = 1;
        }
      } else if (fromTerritory.troops <= 0) {
        engine.println('Your attacking force was destroyed!');
      }

      engine.println('');

      var cmove = computerTurn();
      if (cmove) {
        var fromT = board[cmove.fromR][cmove.fromC];
        var toT = board[cmove.toR][cmove.toC];
        engine.println('Computer attacks from ' + String.fromCharCode(65 + cmove.fromC) + (cmove.fromR + 1) + ' to ' + String.fromCharCode(65 + cmove.toC) + (cmove.toR + 1));
        var cres = resolveBattle(fromT.troops, toT.troops);
        engine.println('Computer rolls: [' + cres.aRolls.join(', ') + ']');
        engine.println('Defender rolls: [' + cres.dRolls.join(', ') + ']');
        engine.println('Computer loses ' + cres.aLoss + '. Defender loses ' + cres.dLoss + '.');
        fromT.troops -= cres.aLoss;
        toT.troops -= cres.dLoss;
        if (toT.troops <= 0) {
          engine.println('Computer captured the territory!');
          toT.owner = 2;
          if (fromT.troops > 1) {
            toT.troops = Math.floor(fromT.troops / 2);
            fromT.troops = Math.ceil(fromT.troops / 2);
          } else {
            toT.troops = 1;
          }
        } else if (fromT.troops <= 0) {
          engine.println('Computer\'s attacking force was destroyed!');
        }
      } else {
        engine.println('Computer has no viable attacks.');
      }
      engine.println('');
    }

    engine.end();
  };
})();
