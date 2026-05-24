(function(){
  var slug='reverse';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Reverse');
    engine.setInstructions('Reverse the order of the first N numbers. Goal: sort the numbers 1-9 in ascending order.');

    engine.println('Reverse - A Game of Ordering Numbers');
    engine.println('');
    engine.println('The numbers 1-9 are in a random order.');
    engine.println('You may reverse the order of the first N numbers.');
    engine.println('Try to sort them in increasing order (1,2,3,...,9).');
    engine.println('');

    var list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    do {
      RNG.shuffle(list);
    } while (list[0] === 1);

    var moves = 0;

    function isSorted() {
      for (var i = 0; i < 9; i++) {
        if (list[i] !== i + 1) return false;
      }
      return true;
    }

    while (!isSorted()) {
      engine.println('Current: ' + list.join(' '));
      var input = await engine.input('Reverse first how many? (2-9): ');
      var n = parseInt(input, 10);
      if (isNaN(n) || n < 2 || n > 9) {
        engine.println('Please enter 2 through 9.');
        continue;
      }

      for (var i = 0; i < Math.floor(n / 2); i++) {
        var tmp = list[i];
        list[i] = list[n - 1 - i];
        list[n - 1 - i] = tmp;
      }
      moves++;
    }

    engine.println('Final: ' + list.join(' '));
    engine.println('You did it in ' + moves + ' reversal(s)!');
    engine.end();
  };
})();
