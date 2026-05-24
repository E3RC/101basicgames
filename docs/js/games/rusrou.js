(function(){
  var slug='rusrou';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Russian Roulette');
    engine.setInstructions('Russian Roulette. 6 chambers, 1 bullet. The cylinder is spun, then you pull the trigger. Press Enter to pull the trigger. Will you survive?');
    engine.println('R U S S I A N   R O U L E T T E');
    engine.println('');

    var playing = true;

    while (playing) {
      var chambers = [false, false, false, false, false, false];
      var bulletPos = RNG.int(0, 5);
      chambers[bulletPos] = true;

      RNG.shuffle(chambers);

      var currentChamber = 0;

      engine.println('There is 1 bullet in 6 chambers.');
      engine.println('The cylinder has been spun.');
      engine.println('');

      var spinAgain = await engine.input('Spin the cylinder before starting? (y/n): ');
      if (spinAgain.trim().toLowerCase() === 'y') {
        bulletPos = RNG.int(0, 5);
        chambers = [false, false, false, false, false, false];
        chambers[bulletPos] = true;
        engine.println('Cylinder spun!');
        engine.println('');
      }

      var alive = true;

      while (alive) {
        engine.println('You raise the gun to your head...');
        engine.println('');
        await engine.input('Press Enter to pull the trigger...');

        engine.println('');
        engine.println('You pull the trigger...');
        engine.println('');

        if (chambers[currentChamber]) {
          engine.println('BANG!');
          engine.println('');
          engine.println('You are dead.');
          engine.println('');
          alive = false;
        } else {
          engine.println('*click*');
          engine.println('Empty chamber. You live to see another day.');
          engine.println('');
          currentChamber++;

          if (currentChamber >= 6) {
            engine.println('All chambers are empty! You survived the round!');
            break;
          }

          var cont = await engine.input('Continue? (Press Enter to pull again, or q to quit): ');
          if (cont.trim().toLowerCase() === 'q') {
            alive = false;
            playing = false;
          }
        }
      }

      if (playing) {
        engine.println('');
        var again = await engine.input('Play another round? (y/n): ');
        if (again.trim().toLowerCase() !== 'y') playing = false;
      }
    }

    engine.println('Game over.');
    engine.end();
  };
})();
