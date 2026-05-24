(function(){
  var slug='banner';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Banner');
    engine.setInstructions('Enter a message (up to 20 characters) and the computer prints it as a large banner.');

    var letters = {
      'A': ['  *  ', ' * * ', '*****', '*   *', '*   *'],
      'B': ['**** ', '*   *', '**** ', '*   *', '**** '],
      'C': [' ****', '*    ', '*    ', '*    ', ' ****'],
      'D': ['**** ', '*   *', '*   *', '*   *', '**** '],
      'E': ['*****', '*    ', '**** ', '*    ', '*****'],
      'F': ['*****', '*    ', '**** ', '*    ', '*    '],
      'G': [' ****', '*    ', '*  **', '*   *', ' ****'],
      'H': ['*   *', '*   *', '*****', '*   *', '*   *'],
      'I': ['*****', '  *  ', '  *  ', '  *  ', '*****'],
      'J': ['  ***', '   * ', '   * ', '*  * ', ' **  '],
      'K': ['*   *', '*  * ', '***  ', '*  * ', '*   *'],
      'L': ['*    ', '*    ', '*    ', '*    ', '*****'],
      'M': ['*   *', '** **', '* * *', '*   *', '*   *'],
      'N': ['*   *', '**  *', '* * *', '*  **', '*   *'],
      'O': [' *** ', '*   *', '*   *', '*   *', ' *** '],
      'P': ['**** ', '*   *', '**** ', '*    ', '*    '],
      'Q': [' *** ', '*   *', '* * *', '*  * ', ' *** '],
      'R': ['**** ', '*   *', '**** ', '*  * ', '*   *'],
      'S': [' ****', '*    ', ' *** ', '    *', '**** '],
      'T': ['*****', '  *  ', '  *  ', '  *  ', '  *  '],
      'U': ['*   *', '*   *', '*   *', '*   *', ' *** '],
      'V': ['*   *', '*   *', ' * * ', ' * * ', '  *  '],
      'W': ['*   *', '*   *', '* * *', '** **', '*   *'],
      'X': ['*   *', ' * * ', '  *  ', ' * * ', '*   *'],
      'Y': ['*   *', ' * * ', '  *  ', '  *  ', '  *  '],
      'Z': ['*****', '   * ', '  *  ', ' *   ', '*****'],
      ' ': ['     ', '     ', '     ', '     ', '     ']
    };

    var msg = await engine.input('Enter message (up to 20 chars): ');
    msg = msg.toUpperCase().substring(0, 20);

    engine.println('');
    for(var row = 0; row < 5; row++){
      var line = '';
      for(var i = 0; i < msg.length; i++){
        var ch = msg[i];
        var glyph = letters[ch] || letters[' '];
        line += glyph[row] + '  ';
      }
      engine.println(line);
    }
    engine.println('');

    engine.end();
  };
})();
