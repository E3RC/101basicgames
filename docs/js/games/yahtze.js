(function(){
  var slug='yahtze';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Yahtzee');
    engine.setInstructions('Simplified Yahtzee. 5 dice, 3 rolls per turn. Categories: Ones-Sixes (sum of matching dice), 3 of a Kind (sum), 4 of a Kind (sum), Full House (25), Small Straight (30), Large Straight (40), Yahtzee (50), Chance (sum). 13 rounds.');
    engine.println('Y A H T Z E E');
    engine.println('');

    var categories = [
      { name: 'Ones', id: 'ones', desc: 'Sum of all 1s' },
      { name: 'Twos', id: 'twos', desc: 'Sum of all 2s' },
      { name: 'Threes', id: 'threes', desc: 'Sum of all 3s' },
      { name: 'Fours', id: 'fours', desc: 'Sum of all 4s' },
      { name: 'Fives', id: 'fives', desc: 'Sum of all 5s' },
      { name: 'Sixes', id: 'sixes', desc: 'Sum of all 6s' },
      { name: '3 of a Kind', id: '3kind', desc: 'Sum of all dice' },
      { name: '4 of a Kind', id: '4kind', desc: 'Sum of all dice' },
      { name: 'Full House', id: 'fh', desc: '25 points' },
      { name: 'Small Straight', id: 'ss', desc: '30 points' },
      { name: 'Large Straight', id: 'ls', desc: '40 points' },
      { name: 'Yahtzee', id: 'yahtzee', desc: '50 points' },
      { name: 'Chance', id: 'chance', desc: 'Sum of all dice' }
    ];

    var scorecard = {};
    categories.forEach(function(c) { scorecard[c.id] = null; });

    function rollDice(count) {
      var d = [];
      for (var i = 0; i < count; i++) d.push(Dice.roll(6));
      return d;
    }

    function displayDice(dice) {
      return dice.map(function(d, i) { return (i + 1) + ':[' + d + ']'; }).join(' ');
    }

    function countVal(dice, val) {
      var c = 0;
      for (var i = 0; i < dice.length; i++) if (dice[i] === val) c++;
      return c;
    }

    function sumDice(dice) {
      var s = 0;
      for (var i = 0; i < dice.length; i++) s += dice[i];
      return s;
    }

    function scoreUpper(dice, val) {
      return countVal(dice, val) * val;
    }

    function hasNKind(dice, n) {
      var counts = {};
      for (var i = 0; i < dice.length; i++) {
        counts[dice[i]] = (counts[dice[i]] || 0) + 1;
      }
      for (var k in counts) if (counts[k] >= n) return true;
      return false;
    }

    function isFullHouse(dice) {
      var counts = {};
      for (var i = 0; i < dice.length; i++) counts[dice[i]] = (counts[dice[i]] || 0) + 1;
      var vals = Object.keys(counts).map(function(k) { return counts[k]; });
      return vals.length === 2 && (vals[0] === 2 && vals[1] === 3 || vals[0] === 3 && vals[1] === 2);
    }

    function isSmallStraight(dice) {
      var sorted = dice.slice().sort();
      var uniq = [];
      for (var i = 0; i < sorted.length; i++) {
        if (uniq.indexOf(sorted[i]) === -1) uniq.push(sorted[i]);
      }
      var s = uniq.join('');
      return s.indexOf('1234') !== -1 || s.indexOf('2345') !== -1 || s.indexOf('3456') !== -1;
    }

    function isLargeStraight(dice) {
      var sorted = dice.slice().sort().join('');
      return sorted === '12345' || sorted === '23456';
    }

    function isYahtzee(dice) {
      for (var i = 1; i < dice.length; i++) if (dice[i] !== dice[0]) return false;
      return true;
    }

    function calcScore(dice, catId) {
      if (catId === 'ones') return scoreUpper(dice, 1);
      if (catId === 'twos') return scoreUpper(dice, 2);
      if (catId === 'threes') return scoreUpper(dice, 3);
      if (catId === 'fours') return scoreUpper(dice, 4);
      if (catId === 'fives') return scoreUpper(dice, 5);
      if (catId === 'sixes') return scoreUpper(dice, 6);
      if (catId === '3kind') return hasNKind(dice, 3) ? sumDice(dice) : 0;
      if (catId === '4kind') return hasNKind(dice, 4) ? sumDice(dice) : 0;
      if (catId === 'fh') return isFullHouse(dice) ? 25 : 0;
      if (catId === 'ss') return isSmallStraight(dice) ? 30 : 0;
      if (catId === 'ls') return isLargeStraight(dice) ? 40 : 0;
      if (catId === 'yahtzee') return isYahtzee(dice) ? 50 : 0;
      if (catId === 'chance') return sumDice(dice);
      return 0;
    }

    function showScorecard() {
      engine.println('');
      engine.println('--- Scorecard ---');
      var total = 0;
      categories.forEach(function(c) {
        var val = scorecard[c.id];
        var str = val !== null ? val.toString() : '-';
        engine.println(c.name + ': ' + str);
        if (val !== null) total += val;
      });
      engine.println('Total: ' + total);
      engine.println('');
      return total;
    }

    for (var round = 0; round < 13; round++) {
      engine.println('--- Round ' + (round + 1) + ' of 13 ---');
      showScorecard();

      var dice = rollDice(5);
      engine.println('Your roll: ' + displayDice(dice));

      for (var reroll = 0; reroll < 2; reroll++) {
        var keepInput = await engine.input('Enter dice numbers to keep (e.g. 1 3 5) or "all" to keep all: ');
        keepInput = keepInput.trim();

        if (keepInput.toLowerCase() === 'all') {
          break;
        }

        var keepNums = keepInput.split(/\s+/).map(function(x) { return parseInt(x, 10); });
        var newDice = [];
        for (var i = 0; i < 5; i++) {
          if (keepNums.indexOf(i + 1) !== -1) {
            newDice.push(dice[i]);
          } else {
            newDice.push(Dice.roll(6));
          }
        }
        dice = newDice;
        engine.println('New roll: ' + displayDice(dice));
      }

      engine.println('');
      engine.println('Final dice: ' + displayDice(dice));
      engine.println('');

      var available = [];
      categories.forEach(function(c, idx) {
        if (scorecard[c.id] === null) {
          available.push((available.length + 1) + ' - ' + c.name + ' (' + calcScore(dice, c.id) + ' pts)');
        }
      });

      engine.println('Available categories:');
      available.forEach(function(a) { engine.println(a); });
      engine.println('');

      var catInput = await engine.input('Choose category to score: ');
      var catChoice = parseInt(catInput, 10) - 1;

      var availCats = categories.filter(function(c) { return scorecard[c.id] === null; });
      if (isNaN(catChoice) || catChoice < 0 || catChoice >= availCats.length) {
        catChoice = 0;
      }

      var chosen = availCats[catChoice];
      var sc = calcScore(dice, chosen.id);
      scorecard[chosen.id] = sc;
      engine.println(chosen.name + ' scored: ' + sc);
      engine.println('');
    }

    engine.println('=== FINAL SCORE ===');
    var finalTotal = showScorecard();
    engine.println('Game over! Your final score is ' + finalTotal + '.');
    engine.end();
  };
})();
