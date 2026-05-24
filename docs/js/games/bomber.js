(function(){
  var slug='bomber';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Bomber');
    engine.setInstructions('Bombing mission. Fly over a 10-cell target area. Drop bombs on columns 1-10. 3 hidden targets. 10 bombs. Direct hit destroys, near miss damages.');

    var gridSize = 10;
    var targets = [];
    while (targets.length < 3) {
      var t = RNG.int(1, gridSize);
      if (targets.indexOf(t) === -1) targets.push(t);
    }

    var bombs = 10;
    var hits = 0;
    var damages = 0;
    var results = {};
    for (var i = 1; i <= gridSize; i++) results[i] = '.';

    engine.clear();
    engine.println('BOMBING MISSION');
    engine.println('3 targets hidden in columns 1-10. You have ' + bombs + ' bombs.');
    engine.println('');

    for (var b = 0; b < bombs; b++) {
      engine.println('Bomb ' + (b + 1) + ' of ' + bombs);
      var display = '';
      for (var x = 1; x <= gridSize; x++) display += results[x] + ' ';
      engine.println(display);
      engine.println('');

      var inp = await engine.input('Drop bomb on column (1-10): ');
      var col = parseInt(inp, 10);
      if (isNaN(col) || col < 1 || col > gridSize) { engine.println('Invalid column.'); b--; continue; }

      if (targets.indexOf(col) !== -1) {
        if (results[col] === 'X') {
          engine.println('Already destroyed.');
        } else {
          engine.println('DIRECT HIT! Target destroyed!');
          results[col] = 'X';
          hits++;
        }
      } else if (targets.indexOf(col - 1) !== -1 || targets.indexOf(col + 1) !== -1) {
        engine.println('Near miss! Target damaged.');
        if (results[col] !== 'X' && results[col] !== '#') { results[col] = '#'; damages++; }
      } else {
        engine.println('Miss.');
        results[col] = 'O';
      }

      engine.println('');
      if (hits === 3) {
        engine.println('All targets destroyed!');
        break;
      }
    }

    engine.clear();
    engine.println('=== MISSION RESULTS ===');
    for (var x2 = 1; x2 <= gridSize; x2++) engine.print(results[x2] + ' ');
    engine.println('');
    engine.println('Targets were at: ' + targets.join(', '));
    engine.println('Direct hits: ' + hits + '  Near misses: ' + damages);
    if (hits === 3) engine.println('PERFECT MISSION!');
    else engine.println('Mission complete.');
    engine.end();
  };
})();
