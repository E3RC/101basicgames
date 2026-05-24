(function(){
  var slug='splat';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Splat');
    engine.setInstructions('Jump from a plane! Decide when to open parachute (altitude 500-5000m). Free fall at 9.8m/s^2, terminal velocity 54m/s. Open too late (<100m) = SPLAT! Land <5m/s for safe landing.');

    var G = 9.8;
    var terminalV = 54;
    var startAlt = RNG.int(2000, 5000);
    var altitude = startAlt;
    var velocity = 0;
    var chuteOpen = false;
    var splat = false;

    engine.clear();
    engine.println('SPLAT - Parachute Jump');
    engine.println('Starting altitude: ' + altitude + 'm');
    engine.println('');

    while (altitude > 0) {
      engine.println('Altitude: ' + Math.round(altitude) + 'm  Velocity: ' + velocity.toFixed(1) + 'm/s  Chute: ' + (chuteOpen ? 'OPEN' : 'CLOSED'));
      engine.println('');

      if (!chuteOpen) {
        var inp = await engine.input('Open parachute at altitude (0 = never)? ');
        var openAlt = parseFloat(inp);
        if (isNaN(openAlt)) { engine.println('Enter a number.'); continue; }

        if (openAlt > 0 && openAlt <= altitude) {
          if (openAlt < 100) {
            engine.println('TOO LOW! You splattered! SPLAT!');
            splat = true;
            break;
          }
          chuteOpen = true;
          engine.println('Parachute opened at ' + Math.round(openAlt) + 'm!');
          continue;
        }

        velocity += G;
        if (velocity > terminalV) velocity = terminalV;
        altitude -= velocity;
      } else {
        velocity = Math.max(5, velocity * 0.85);
        if (velocity < 1) velocity = 1;
        altitude -= velocity;

        if (altitude <= 0) {
          altitude = 0;
          if (velocity <= 5) {
            engine.println('SAFE LANDING! Velocity: ' + velocity.toFixed(1) + 'm/s');
          } else {
            engine.println('HARD LANDING! Velocity: ' + velocity.toFixed(1) + 'm/s - You might be hurt!');
          }
          break;
        }
      }
    }

    if (!splat && altitude <= 0) {
      if (velocity <= 5) {
        engine.println('');
        engine.println('Perfect landing! You survived!');
      } else {
        engine.println('');
        engine.println('You survived but with injuries.');
      }
    } else if (splat) {
      engine.println('You should have opened the chute sooner!');
    }

    var score = 0;
    if (!splat) {
      score = Math.round((startAlt - altitude) * (chuteOpen ? 10 : 0) / (velocity + 1));
      if (velocity <= 5) score += 500;
      if (score < 0) score = 0;
      engine.println('Score: ' + score);
    } else {
      engine.println('Score: 0 - SPLAT!');
    }
    engine.end();
  };
})();
