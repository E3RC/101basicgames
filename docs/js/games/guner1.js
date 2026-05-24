(function(){
  var slug='guner1';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Gunner II');
    engine.setInstructions('Advanced artillery. Target has X,Y coords (100-900). Set angle (1-89), velocity (100-500), direction (0-360 deg from north). Wind affects shot. 15 shots.');

    var G = 9.8;
    var targetX = RNG.int(100, 900);
    var targetY = RNG.int(100, 900);
    var windX = RNG.int(-10, 10);
    var windY = RNG.int(-10, 10);
    var shots = 15;
    var hit = false;

    engine.clear();
    engine.println('GUNNER II');
    engine.println('Target at unknown coordinates. Wind is active.');
    engine.println('You have ' + shots + ' shots.');
    engine.println('');

    for (var s = 1; s <= shots; s++) {
      engine.println('Shot ' + s + ' of ' + shots);
      var aInp = await engine.input('Angle (1-89 degrees): ');
      var angle = parseFloat(aInp);
      if (isNaN(angle) || angle <= 0 || angle >= 90) { engine.println('Invalid.'); s--; continue; }

      var vInp = await engine.input('Velocity (100-500 m/s): ');
      var velocity = parseFloat(vInp);
      if (isNaN(velocity) || velocity < 100 || velocity > 500) { engine.println('Invalid.'); s--; continue; }

      var dInp = await engine.input('Direction (0-360 degrees from north): ');
      var dir = parseFloat(dInp);
      if (isNaN(dir) || dir < 0 || dir > 360) { engine.println('Invalid.'); s--; continue; }

      var rad = angle * Math.PI / 180;
      var dirRad = dir * Math.PI / 180;
      var v0 = velocity;

      var t = 2 * v0 * Math.sin(rad) / G;
      var dist = v0 * Math.cos(rad) * t;

      var impactX = Math.round(dist * Math.sin(dirRad)) + windX * 5;
      var impactY = Math.round(dist * Math.cos(dirRad)) + windY * 5;

      var dx = impactX - targetX;
      var dy = impactY - targetY;
      var distToTarget = Math.round(Math.sqrt(dx * dx + dy * dy));

      if (distToTarget <= 20) {
        engine.println('DIRECT HIT! Target destroyed!');
        engine.println('Impact at (' + impactX + ',' + impactY + ')');
        hit = true;
        break;
      } else {
        engine.println('Impact at (' + impactX + ',' + impactY + ')');
        engine.println('Miss X: ' + dx + 'm, Miss Y: ' + dy + 'm  (distance: ' + distToTarget + 'm)');
        engine.println('');
      }
    }

    if (!hit) {
      engine.clear();
      engine.println('OUT OF AMMO!');
      engine.println('Target was at (' + targetX + ',' + targetY + ')');
    } else {
      engine.println('Target destroyed in ' + s + ' shot(s)!');
    }
    engine.end();
  };
})();
