(function(){
  var slug='bug';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Bug');
    engine.setInstructions('Roll a die to draw a bug piece by piece. You must roll body (1) first, then head (2), then you can get eyes (3), legs (4), wings (5), and tail (6). Need: 1 body, 1 head, 2 eyes, 6 legs, 2 wings, 1 tail.');
    engine.println('B U G');
    engine.println('Roll the die to build your bug!');
    engine.println('');

    var parts = { body: 0, head: 0, eyes: 0, legs: 0, wings: 0, tail: 0 };
    var needs = { body: 1, head: 1, eyes: 2, legs: 6, wings: 2, tail: 1 };
    var totalNeeded = 13;
    var have = 0;

    function getBugArt() {
      var lines = [];
      lines.push('    .---.');
      if (parts.wings >= 2) {
        lines.push('   /     \\');
        lines.push('  | /~~~\\ |');
      } else if (parts.wings >= 1) {
        lines.push('   /     \\');
        lines.push('  | /~~~\\ |');
      } else {
        lines.push('   |     |');
        lines.push('  |  ~~~  |');
      }
      if (parts.head >= 1) {
        var eyesStr = '';
        if (parts.eyes >= 2) eyesStr = '@ @';
        else if (parts.eyes >= 1) eyesStr = 'o @';
        else eyesStr = 'o o';
        lines.push('  | ' + eyesStr + ' |');
      } else {
        lines.push('  |     |');
      }
      if (parts.body >= 1) {
        var legCount = Math.min(parts.legs, 6);
        var leftLegs = legCount > 3 ? 3 : legCount;
        var rightLegs = legCount > 3 ? legCount - 3 : 0;
        var lStr = '', rStr = '';
        for (var i = 0; i < leftLegs; i++) lStr += '/';
        for (var i = 0; i < rightLegs; i++) rStr += '\\';
        lines.push('  |' + lStr + '---' + rStr + '|');
        if (legCount > 3) {
          var lStr2 = '', rStr2 = '';
          var leftLegs2 = Math.min(legCount - 3, 3);
          for (var i = 0; i < leftLegs2; i++) lStr2 += '/';
          var rightLegs2 = legCount > 6 ? 6 - legCount + 3 : 3;
          for (var i = 0; i < Math.min(legCount - 3, 3); i++) rStr2 += '\\';
          lines.push('  |' + lStr2 + '---' + rStr2 + '|');
        }
      } else {
        lines.push('  |     |');
      }
      if (parts.tail >= 1) {
        lines.push('   \\___/~~');
      } else {
        lines.push('   \\___/');
      }
      return lines.join('\n');
    }

    while (have < totalNeeded) {
      engine.println('');
      engine.println('Parts needed:');
      engine.println('  Body: ' + parts.body + '/' + needs.body + '  Head: ' + parts.head + '/' + needs.head + '  Eyes: ' + parts.eyes + '/' + needs.eyes);
      engine.println('  Legs: ' + parts.legs + '/' + needs.legs + '  Wings: ' + parts.wings + '/' + needs.wings + '  Tail: ' + parts.tail + '/' + needs.tail);
      engine.println('');
      engine.println(getBugArt());
      engine.println('');

      var input = await engine.input('Press Enter to roll the die (or q to quit): ');
      if (input.trim().toLowerCase() === 'q') {
        engine.println('Quitter! Your bug is incomplete.');
        break;
      }

      var roll = Dice.roll(6);
      engine.println('You rolled a ' + roll + '!');

      var partNames = { 1: 'Body', 2: 'Head', 3: 'Eye', 4: 'Leg', 5: 'Wing', 6: 'Tail' };
      var added = false;

      if (roll === 1) {
        if (parts.body < needs.body) {
          parts.body++;
          have++;
          added = true;
        }
      } else if (roll === 2) {
        if (parts.body < 1) {
          engine.println('You need a Body first!');
        } else if (parts.head < needs.head) {
          parts.head++;
          have++;
          added = true;
        }
      } else if (roll === 3) {
        if (parts.head < 1) {
          engine.println('You need a Head first!');
        } else if (parts.eyes < needs.eyes) {
          parts.eyes++;
          have++;
          added = true;
        }
      } else if (roll === 4) {
        if (parts.body < 1) {
          engine.println('You need a Body first!');
        } else if (parts.legs < needs.legs) {
          parts.legs++;
          have++;
          added = true;
        }
      } else if (roll === 5) {
        if (parts.body < 1) {
          engine.println('You need a Body first!');
        } else if (parts.wings < needs.wings) {
          parts.wings++;
          have++;
          added = true;
        }
      } else if (roll === 6) {
        if (parts.body < 1) {
          engine.println('You need a Body first!');
        } else if (parts.tail < needs.tail) {
          parts.tail++;
          have++;
          added = true;
        }
      }

      if (added) {
        engine.println('You added a ' + partNames[roll] + '!');
      } else {
        engine.println('You already have enough ' + partNames[roll] + 's. Nothing added.');
      }
    }

    if (have >= totalNeeded) {
      engine.println('');
      engine.println('Your bug is complete!');
      engine.println('');
      engine.println(getBugArt());
      engine.println('');
      engine.println('Congratulations!');
    }

    engine.end();
  };
})();
