(function(){
  var slug='canam';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Can-Am');
    engine.setInstructions('Can-Am road race. Choose a car and strategy. 20 turns. Accelerate, hold, or coast.');
    var cars=[
      {name:'Ferrari',speed:0,maxSpeed:180,accel:15,handling:8},
      {name:'Porsche',speed:0,maxSpeed:170,accel:13,handling:9},
      {name:'McLaren',speed:0,maxSpeed:175,accel:14,handling:7}
    ];
    engine.println('Choose your car:');
    for(var i=0;i<cars.length;i++)engine.println((i+1)+') '+cars[i].name+' (max:'+cars[i].maxSpeed+' accel:'+cars[i].accel+' handling:'+cars[i].handling+')');
    var choice=parseInt(await engine.input('Enter number: '));
    if(isNaN(choice)||choice<1||choice>3) choice=1;
    var player=cars[choice-1];
    var opponents=[];
    for(var i=0;i<cars.length;i++)if(i!==choice-1)opponents.push({...cars[i]});
    var posP=0,posO=[0,0];

    for(var turn=1;turn<=20;turn++){
      engine.clear();
      engine.println('=== Turn '+turn+' of 20 ===');
      engine.println('Your speed: '+player.speed+' Position: '+posP.toFixed(1)+'km');
      var act=(await engine.input('Action: accelerate (a), hold (h), coast (c): ')).trim().toLowerCase();
      if(act==='a'){
        player.speed=Math.min(player.speed+player.accel,player.maxSpeed);
      }else if(act==='c'){
        player.speed=Math.max(0,player.speed-10);
      }
      posP+=player.speed/10;

      for(var o=0;o<opponents.length;o++){
        var r=RNG.int(0,2);
        if(r===0) opponents[o].speed=Math.min(opponents[o].speed+opponents[o].accel,opponents[o].maxSpeed);
        else if(r===2) opponents[o].speed=Math.max(0,opponents[o].speed-8);
        posO[o]+=opponents[o].speed/10;
      }

      for(var o=0;o<opponents.length;o++){
        engine.println(opponents[o].name+': speed='+opponents[o].speed+' pos='+posO[o].toFixed(1)+'km');
      }
      engine.println('Your position: '+posP.toFixed(1)+'km');
    }
    var bestP=posP,bestName='You';
    for(var o=0;o<opponents.length;o++){
      if(posO[o]>bestP){bestP=posO[o];bestName=opponents[o].name;}
    }
    engine.println('');
    if(bestName==='You') engine.println('You won the race!');
    else engine.println(bestName+' wins!');
    engine.println('Final positions: You='+posP.toFixed(1)+'km');
    engine.end();
  };
})();
