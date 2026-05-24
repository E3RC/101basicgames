(function(){
  var slug='target';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Target');
    engine.setInstructions('Shooting gallery. A target moves left and right. Press Enter to fire. Hit if target is within 3 positions of center. 10 shots. Score hits!');

    var shots = 10;
    var hits = 0;
    var width = 21;
    var center = Math.floor(width / 2);
    var pos = center;
    var dir = 1;
    var speed = 1;

    engine.clear();
    engine.println('TARGET');
    engine.println('Target moves left/right. Fire when it\'s near the center!');
    engine.println('You have ' + shots + ' shots.');
    engine.println('');

    for (var s = 1; s <= shots; s++) {
      pos += dir * speed;
      if (pos >= width) { pos = width - 1; dir = -1; }
      if (pos < 0) { pos = 0; dir = 1; }

      speed = RNG.int(1, 3);

      var display = '';
      for (var i = 0; i < width; i++) {
        display += i === pos ? 'T' : (i === center ? '|' : '-');
      }
      engine.println(display);

      var inp = await engine.input('FIRE! (Press Enter) ');

      var dist = Math.abs(pos - center);
      if (dist <= 3) {
        engine.println('HIT! (Target was ' + dist + ' from center)');
        hits++;
      } else {
        engine.println('MISS! (Target was ' + dist + ' from center)');
      }
      engine.println('Shots: ' + s + '/' + shots + '  Hits: ' + hits);
      engine.println('');
    }

    engine.clear();
    engine.println('=== RESULTS ===');
    engine.println('Hits: ' + hits + ' / ' + shots);
    var pct = Math.round(hits / shots * 100);
    engine.println('Accuracy: ' + pct + '%');
    if (pct >= 90) engine.println('Sharpshooter!');
    else if (pct >= 70) engine.println('Good shot!');
    else if (pct >= 50) engine.println('Not bad.');
    else engine.println('Keep practicing.');
    engine.end();
  };
})();
