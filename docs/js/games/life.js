(function(){
  var slug='life';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Life');
    engine.setInstructions('Life insurance simulation. Manage clients, sell policies, handle claims.');
    var clients=[];
    for(var i=0;i<10;i++){
      clients.push({
        name:'Client'+(i+1),
        age:RNG.int(25,65),
        health:RNG.int(1,5),
        premium:0,
        active:true
      });
    }
    var profit=0,year=1;
    while(true){
      engine.clear();
      engine.println('=== Year '+year+' ===');
      engine.println('Profit: $'+profit.toFixed(2));
      engine.println('Active clients: '+clients.filter(function(c){return c.active;}).length);
      engine.println('');
      var newClients=RNG.int(1,3);
      for(var i=0;i<newClients;i++){
        var c={name:'New'+(clients.length+1),age:RNG.int(20,70),health:RNG.int(1,5),premium:0,active:true};
        c.premium=c.age*2-c.health*50;
        if(c.premium<50)c.premium=50;
        clients.push(c);
        profit+=c.premium;
        engine.println('New client: '+c.name+', age '+c.age+', premium $'+c.premium.toFixed(2));
      }
      for(var i=0;i<clients.length;i++){
        if(!clients[i].active) continue;
        var renewChance=0.7+(clients[i].health*0.05);
        if(Math.random()>renewChance){
          clients[i].active=false;
          engine.println(clients[i].name+' dropped coverage.');
        }else{
          profit+=clients[i].premium;
        }
      }
      for(var i=0;i<clients.length;i++){
        if(!clients[i].active) continue;
        var claimChance=0.05+(100-clients[i].age)*0.001;
        if(Math.random()<claimChance){
          var claim=clients[i].premium*RNG.int(5,20);
          profit-=claim;
          clients[i].active=false;
          engine.println('Claim: '+clients[i].name+' - $'+claim.toFixed(2));
        }
      }
      engine.println('Year '+year+' profit: $'+profit.toFixed(2));
      var cont=(await engine.input('Continue? (y/n): ')).trim().toLowerCase();
      if(cont!=='y'&&cont!=='yes') break;
      year++;
    }
    engine.println('Final profit: $'+profit.toFixed(2));
    engine.end();
  };
})();
