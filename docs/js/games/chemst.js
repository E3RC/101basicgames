(function(){
  var slug='chemst';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Chemist');
    engine.setInstructions('Dilute kryptocyanic acid. Pour between beakers to get exactly 6ml of acid into a beaker. Enter "A to B", "A to C", etc.');

    var beakers=[{label:'A',acid:9,water:0,cap:9},
                 {label:'B',acid:0,water:7,cap:7},
                 {label:'C',acid:0,water:0,cap:5},
                 {label:'D',acid:0,water:0,cap:3}];
    var pours=0;

    function show(){
      engine.clear();
      engine.println('=== Beakers ===');
      for(var i=0;i<beakers.length;i++){
        var b=beakers[i];
        var total=b.acid+b.water;
        engine.println(b.label+': '+b.acid+'ml acid + '+b.water+'ml water = '+total+'/'+b.cap+'ml');
      }
      engine.println('');
    }

    function checkWin(){
      for(var i=0;i<beakers.length;i++){
        if(beakers[i].acid===6) return beakers[i].label;
      }
      return null;
    }

    function getBeaker(label){
      for(var i=0;i<beakers.length;i++){
        if(beakers[i].label===label.toUpperCase()) return beakers[i];
      }
      return null;
    }

    function pour(src,dst){
      var space=dst.cap-(dst.acid+dst.water);
      if(space<=0) return 'Destination is full!';
      if(src.acid+src.water===0) return 'Source is empty!';
      var totalMove=Math.min(src.acid+src.water,space);
      var ratio=src.acid/(src.acid+src.water);
      var acidMove=Math.round(totalMove*ratio);
      var waterMove=totalMove-acidMove;
      if(src.acid<acidMove){acidMove=src.acid;waterMove=totalMove-acidMove;}
      if(src.water<waterMove){waterMove=src.water;acidMove=totalMove-waterMove;}
      src.acid-=acidMove;
      src.water-=waterMove;
      dst.acid+=acidMove;
      dst.water+=waterMove;
      pours++;
      return 'Poured '+totalMove+'ml ('+acidMove+'ml acid, '+waterMove+'ml water).';
    }

    show();
    while(true){
      var win=checkWin();
      if(win){
        engine.println('You got 6ml of acid in beaker '+win+'!');
        engine.println('Total pours: '+pours);
        break;
      }
      var inp=(await engine.input('Pour (e.g. "A to C") or QUIT: ')).trim();
      if(inp.toUpperCase()==='QUIT'){
        engine.println('You gave up. Game over.');
        break;
      }
      var parts=inp.split(/\s+to\s+/i);
      if(parts.length!==2){
        engine.println('Format: SOURCE to DEST (e.g. "A to C")');
        continue;
      }
      var src=getBeaker(parts[0].trim());
      var dst=getBeaker(parts[1].trim());
      if(!src||!dst){
        engine.println('Invalid beaker. Use A, B, C, or D.');
        continue;
      }
      if(src.label===dst.label){
        engine.println('Cannot pour into itself.');
        continue;
      }
      var msg=pour(src,dst);
      show();
      engine.println(msg);
      engine.println('Pours: '+pours);
    }
    engine.end();
  };
})();
