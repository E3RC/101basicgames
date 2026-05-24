(function(){
  var slug='mnoply';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Monopoly');
    engine.setInstructions('Simplified Monopoly. 2-4 players. Roll dice to move. Buy properties. Pay rent. Pass GO collect $200. Last player with money wins or most money after 20 rounds.');

    var propertyNames = [
      'Mediterranean Ave', 'Baltic Ave', 'Oriental Ave', 'Vermont Ave', 'Connecticut Ave',
      'St. Charles Pl', 'States Ave', 'Virginia Ave', 'Pennsylvania Ave', 'North Carolina Ave',
      'Pacific Ave', 'Marvin Gardens', 'Park Place', 'Boardwalk'
    ];
    var propertyValues = [60, 60, 100, 100, 120, 140, 140, 160, 180, 200, 220, 240, 350, 400];

    var numPlayers = 0;
    while (numPlayers < 2 || numPlayers > 4) {
      var np = await engine.input('Number of players (2-4): ');
      numPlayers = parseInt(np, 10);
      if (isNaN(numPlayers) || numPlayers < 2 || numPlayers > 4) engine.println('Enter 2-4.');
    }

    var players = [];
    for (var i = 0; i < numPlayers; i++) {
      players.push({
        name: i === 0 ? 'You' : 'CPU ' + i,
        money: 1500,
        pos: 0,
        properties: [],
        isHuman: i === 0,
        bankrupt: false
      });
    }

    function boardPos(name) { return propertyNames.indexOf(name); }

    function showStatus() {
      var lines = [];
      for (var i = 0; i < players.length; i++) {
        var p = players[i];
        if (p.bankrupt) continue;
        lines.push(p.name + ': $' + p.money + ' Pos:' + p.pos + ' Props:' + p.properties.length);
      }
      return lines.join('\n');
    }

    function ownedBy(propIdx) {
      for (var j = 0; j < players.length; j++) {
        if (!players[j].bankrupt && players[j].properties.indexOf(propIdx) !== -1) return j;
      }
      return -1;
    }

    var rounds = 0;
    var gameOver = false;

    while (!gameOver && rounds < 20) {
      engine.clear();
      engine.println('--- Round ' + (rounds + 1) + ' ---');
      engine.println(showStatus());
      engine.println('');

      for (var pIdx = 0; pIdx < players.length; pIdx++) {
        var pl = players[pIdx];
        if (pl.bankrupt) continue;

        engine.println(pl.name + '\'s turn.');
        if (!pl.isHuman) engine.println('Press Enter to continue...');
        await engine.input('');

        var roll = Dice.sum(2, 6);
        engine.println(pl.name + ' rolled ' + roll);

        pl.pos = (pl.pos + roll) % 40;

        if (pl.pos < roll) {
          pl.money += 200;
          engine.println(pl.name + ' passed GO! +$200');
        }

        if (pl.pos < propertyNames.length) {
          var propIdx = pl.pos;
          var owner = ownedBy(propIdx);

          if (owner === -1) {
            var val = propertyValues[propIdx];
            if (pl.isHuman) {
              var ans = await engine.input('Buy ' + propertyNames[propIdx] + ' for $' + val + '? (y/n): ');
              if (ans.trim().toLowerCase() === 'y' && pl.money >= val) {
                pl.money -= val;
                pl.properties.push(propIdx);
                engine.println('You bought ' + propertyNames[propIdx]);
              } else {
                engine.println('Passed on property.');
              }
            } else {
              if (pl.money >= val && RNG.int(1,100) <= 60) {
                pl.money -= val;
                pl.properties.push(propIdx);
                engine.println(pl.name + ' bought ' + propertyNames[propIdx]);
              } else {
                engine.println(pl.name + ' passed on property.');
              }
            }
          } else if (owner !== pIdx) {
            var rent = Math.floor(propertyValues[propIdx] / 10);
            pl.money -= rent;
            players[owner].money += rent;
            engine.println(pl.name + ' pays $' + rent + ' rent to ' + players[owner].name);
            if (pl.money <= 0) {
              engine.println(pl.name + ' is bankrupt!');
              pl.bankrupt = true;
            }
          } else {
            engine.println(pl.name + ' owns this property.');
          }
        } else {
          engine.println('Free parking.');
        }

        engine.println(pl.name + ' now has $' + pl.money);
        engine.println('');
      }

      var active = players.filter(function(p) { return !p.bankrupt; });
      if (active.length <= 1) gameOver = true;
      rounds++;
    }

    engine.clear();
    engine.println('=== GAME OVER ===');
    var sorted = players.slice().sort(function(a, b) { return b.money - a.money; });
    for (var s = 0; s < sorted.length; s++) {
      engine.println((s + 1) + '. ' + sorted[s].name + ' - $' + sorted[s].money);
    }
    engine.println('');
    if (sorted[0].isHuman) engine.println('YOU WIN!');
    else engine.println(sorted[0].name + ' wins!');
    engine.end();
  };
})();
