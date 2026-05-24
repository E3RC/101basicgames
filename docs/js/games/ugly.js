(function(){
  var slug='ugly';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Ugly');
    engine.setInstructions('The computer generates random ASCII "art". Answer Y for another.');

    var chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    var width = 40;
    var height = 20;

    var again = 'Y';
    while(again === 'Y'){
      engine.println('');
      for(var y = 0; y < height; y++){
        var line = '';
        for(var x = 0; x < width; x++){
          line += RNG.pick(chars);
        }
        engine.println(line);
      }
      engine.println('');
      again = await engine.input('Another (Y/N)? ');
      again = again.toUpperCase();
    }

    engine.println('Goodbye!');
    engine.end();
  };
})();
