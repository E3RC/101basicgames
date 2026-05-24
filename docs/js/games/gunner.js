(function(){
  var slug='gunner';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Gunner');
    engine.setInstructions('Artillery game. Target at 1000-5000m. Set angle (1-89 degrees). Velocity 500 m/s. Hit within 50m to destroy. 10 shots.');

    var G = 9.8;
    var target = RNG.int(1000, 5000);
    var shots = 10;
    var hit = false;

    engine.clear();
    engine.println('GUNNER');
    engine.println('Target is at a random distance. You have ' + shots + ' shots.');
    engine.println('');

    for (var s = 1; s <= shots; s++) {
      engine.println('Shot ' + s + ' of ' + shots);
      var inp = await engine.input('Angle (1-89 degrees): ');
      var angle = parseFloat(inp);
      if (isNaN(angle) || angle <= 0 || angle >= 90) { engine.println('Invalid angle.'); s--; continue; }

      var radians = angle * Math.PI / 180;
      var velocity = 500;
      var range = velocity * velocity * Math.sin(2 * radians) / G;
      var diff = range - target;

      if (Math.abs(diff) <= 50) {
        engine.println('DIRECT HIT! Target destroyed at ' + Math.round(range) + 'm!');
        hit = true;
        break;
      } else if (diff > 0) {
        engine.println('Overshot by ' + Math.round(diff) + 'm (fired ' + Math.round(range) + 'm)');
      } else {
        engine.println('Undershot by ' + Math.round(Math.abs(diff)) + 'm (fired ' + Math.round(range) + 'm)');
      }
      engine.println('Target is ' + target + 'm away.');
      engine.println('');
    }

    if (!hit) {
      engine.clear();
      engine.println('OUT OF AMMO!');
      engine.println('Target was at ' + target + 'm.');
      engine.println('Target not destroyed.');
    } else {
      engine.println('Target eliminated in ' + s + ' shot(s)!');
    }
    engine.end();
  };
})();
