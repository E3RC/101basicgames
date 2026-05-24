(function(){
  var slug='diamnd';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Diamond');
    engine.setInstructions('Enter a number between 1 and 15 to see a diamond pattern of that size.');

    var input = await engine.input('Enter a number (1-15)? ');
    var n = parseInt(input, 10);
    if(isNaN(n) || n < 1 || n > 15) n = 5;

    for(var i = 1; i <= n; i++){
      var line = '';
      for(var j = 0; j < n - i; j++) line += ' ';
      for(var j = 0; j < 2 * i - 1; j++) line += '*';
      engine.println(line);
    }
    for(var i = n - 1; i >= 1; i--){
      var line = '';
      for(var j = 0; j < n - i; j++) line += ' ';
      for(var j = 0; j < 2 * i - 1; j++) line += '*';
      engine.println(line);
    }

    engine.end();
  };
})();
