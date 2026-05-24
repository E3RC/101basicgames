(function(){
  var slug='horses';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Horses');
    engine.setInstructions('Horse racing betting. Pick a horse, place a bet, and watch the race!');
    var horses=[
      {name:'Thunder',speed:5,stamina:5},
      {name:'Lightning',speed:7,stamina:3},
      {name:'Storm',speed:4,stamina:7},
      {name:'Blaze',speed:6,stamina:4},
      {name:'Shadow',speed:3,stamina:8}
    ];
    var money=100,TRACK=50;
    for(var r=1;r<=5;r++){
      engine.clear();
      engine.println('=== Race '+r+' of 5 ===');
      engine.println('Money: $'+money);
      for(var i=0;i<horses.length;i++){
        var odds=6-horses[i].speed+horses[i].stamina;
        if(odds<1)odds=1;
        horses[i].odds=odds;
        engine.println((i+1)+') '+horses[i].name+' (speed:'+horses[i].speed+' stamina:'+horses[i].stamina+')');
      }
      var pick=parseInt(await engine.input('Pick a horse (1-5): '));
      if(isNaN(pick)||pick<1||pick>5){engine.println('Invalid.');r--;continue;}
      pick--;
      var bet=parseFloat(await engine.input('Bet $: '));
      if(isNaN(bet)||bet<=0||bet>money){engine.println('Invalid bet.');r--;continue;}
      money-=bet;
      var pos=[];
      for(var i=0;i<horses.length;i++) pos[i]=0;
      for(var step=0;step<50;step++){
        engine.clear();
        for(var i=0;i<horses.length;i++){
          pos[i]+=horses[i].speed*0.5+RNG.int(1,6)*0.5;
          if(pos[i]>TRACK)pos[i]=TRACK;
          var bar='';
          for(var p=0;p<Math.floor(pos[i]);p++)bar+='.';
          bar+='>'+horses[i].name.substring(0,8);
          engine.println(bar);
        }
        engine.println('');
        await new Promise(function(r){setTimeout(r,200);});
        var won=false;
        for(var i=0;i<horses.length;i++)if(pos[i]>=TRACK)won=true;
        if(won)break;
      }
      var winner=0;
      for(var i=0;i<horses.length;i++)if(pos[i]>pos[winner])winner=i;
      engine.println('Winner: '+horses[winner].name+'!');
      if(winner===pick){
        var payout=bet*horses[pick].odds;
        money+=payout;
        engine.println('You won $'+payout.toFixed(2)+'!');
      }else{
        engine.println('You lost $'+bet.toFixed(2));
      }
      engine.println('Balance: $'+money.toFixed(2));
      if(money<=0){engine.println('Broke!');break;}
      if(r<5)await engine.input('Press Enter for next race...');
    }
    engine.println('Final money: $'+money.toFixed(2));
    engine.end();
  };
})();
