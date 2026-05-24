(function(){
  var slug='3dplot';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('3D Plot');
    engine.setInstructions('ASCII art plot of z = sin(sqrt(x^2 + y^2)).');

    var width = 40;
    var height = 20;
    var chars = [' ', '.', ':', 'o', 'O', '@'];
    var output = '';

    for(var py = 0; py < height; py++){
      var line = '';
      for(var px = 0; px < width; px++){
        var x = (px / width) * 12 - 6;
        var y = (py / height) * 10 - 5;
        var z = Math.sin(Math.sqrt(x * x + y * y));
        var idx = Math.floor((z + 1) / 2 * (chars.length - 1));
        if(idx < 0) idx = 0;
        if(idx >= chars.length) idx = chars.length - 1;
        line += chars[idx];
      }
      output += line + '\n';
    }

    engine.print(output);
    engine.end();
  };
})();
