(function(){
  var slug='dogs';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Dogs');
    engine.setInstructions('Bet on greyhound races. You have $100. Place win bets. 5 races.');
    var dogs=[
      {name:'Grey Ghost',odds:3},
      {name:'Fast Flash',odds:5},
      {name:'Midnight Runner',odds:2},
      {name:'Silver Streak',odds:4},
      {name:'Thunder Paws',odds:6},
      {name:'Blazing Star',odds:8}
    ];
    var money=100;
    for(var r=1;r<=5;r++){
      engine.clear();
      engine.println('=== Race '+r+' of 5 ===');
      engine.println('Money: $'+money);
      for(var i=0;i<dogs.length;i++)engine.println((i+1)+') '+dogs[i].name+' (odds '+dogs[i].odds+'/1)');
      var pick=parseInt(await engine.input('Pick a dog (1-6): '));
      if(isNaN(pick)||pick<1||pick>6){engine.println('Invalid.');r--;continue;}
      pick--;
      var bet=parseFloat(await engine.input('Bet $: '));
      if(isNaN(bet)||bet<=0||bet>money){engine.println('Invalid bet.');r--;continue;}
      money-=bet;
      var totalChance=dogs.reduce(function(s,d){return s+d.odds;},0);
      var roll=RNG.int(1,totalChance);
      var cum=0,winner=0;
      for(var i=0;i<dogs.length;i++){cum+=dogs[i].odds;if(roll<=cum){winner=i;break;}}
      engine.println('Winner: '+dogs[winner].name+'!');
      if(winner===pick){
        var payout=bet*dogs[pick].odds;
        money+=payout;
        engine.println('You won $'+payout.toFixed(2)+'!');
      }else{
        engine.println('You lost $'+bet.toFixed(2));
      }
      engine.println('New balance: $'+money.toFixed(2));
      if(money<=0){engine.println('You\'re broke!');break;}
      if(r<5)await engine.input('Press Enter for next race...');
    }
    engine.println('Final money: $'+money.toFixed(2));
    engine.end();
  };
})();
