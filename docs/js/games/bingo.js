(function(){
  var slug='bingo';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Bingo');
    engine.setInstructions('Single-player BINGO. A 5x5 card is generated with numbers in the standard BINGO ranges. Press Enter to draw balls. Mark numbers that match. Get 5 in a row, column, or diagonal to win.');

    function generateCard() {
      var ranges = [
        {col: 'B', min: 1, max: 15},
        {col: 'I', min: 16, max: 30},
        {col: 'N', min: 31, max: 45},
        {col: 'G', min: 46, max: 60},
        {col: 'O', min: 61, max: 75}
      ];
      var card = [];
      for (var r = 0; r < 5; r++) {
        card[r] = [];
        for (var c = 0; c < 5; c++) {
          if (r === 2 && c === 2) {
            card[r][c] = {num: 'FREE', marked: true};
          } else {
            var used, n;
            do {
              n = RNG.int(ranges[c].min, ranges[c].max);
              used = false;
              for (var i = 0; i < r; i++) {
                if (card[i][c].num === n) { used = true; break; }
              }
            } while (used);
            card[r][c] = {num: n, marked: false};
          }
        }
      }
      return card;
    }

    function displayCard(card) {
      engine.println('  B    I    N    G    O');
      engine.println('------------------------');
      for (var r = 0; r < 5; r++) {
        var line = '';
        for (var c = 0; c < 5; c++) {
          var cell = card[r][c];
          var s;
          if (cell.marked) {
            s = cell.num === 'FREE' ? 'FREE' : cell.num;
            s = s.toString().padStart(2, ' ');
            line += '[' + s + '] ';
          } else {
            s = cell.num.toString().padStart(3, ' ');
            line += ' ' + s + '  ';
          }
        }
        engine.println(line);
      }
      engine.println('');
    }

    function checkBingo(card) {
      for (var r = 0; r < 5; r++) {
        if (card[r].every(function(c) { return c.marked; })) return true;
      }
      for (var c = 0; c < 5; c++) {
        var colAll = true;
        for (var r = 0; r < 5; r++) {
          if (!card[r][c].marked) { colAll = false; break; }
        }
        if (colAll) return true;
      }
      var d1 = true, d2 = true;
      for (var i = 0; i < 5; i++) {
        if (!card[i][i].marked) d1 = false;
        if (!card[i][4 - i].marked) d2 = false;
      }
      return d1 || d2;
    }

    var card = generateCard();
    var drawn = [];
    var drawCount = 0;

    engine.println('Your BINGO card:');
    engine.println('');
    displayCard(card);

    while (true) {
      var input = await engine.input('Press Enter to draw a ball (or q to quit): ');
      if (input.trim().toLowerCase() === 'q') {
        engine.println('Thanks for playing!');
        break;
      }

      if (drawn.length >= 75) {
        engine.println('All balls have been drawn!');
        break;
      }

      var ball;
      do {
        ball = RNG.int(1, 75);
      } while (drawn.indexOf(ball) !== -1);
      drawn.push(ball);
      drawCount++;

      var colNames = ['B','I','N','G','O'];
      var col = colNames[Math.min(4, Math.floor((ball - 1) / 15))];
      engine.println('Draw #' + drawCount + ': ' + col + '-' + ball + '!');

      var found = false;
      for (var r = 0; r < 5; r++) {
        for (var c = 0; c < 5; c++) {
          if (card[r][c].num === ball) {
            card[r][c].marked = true;
            found = true;
          }
        }
      }

      if (found) {
        engine.println('You have it!');
      } else {
        engine.println('Not on card.');
      }
      engine.println('');

      displayCard(card);

      if (checkBingo(card)) {
        engine.println('BINGO! You won in ' + drawCount + ' draws!');
        break;
      }
    }

    engine.end();
  };
})();
