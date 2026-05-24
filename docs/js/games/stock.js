(function(){
  var slug='stock';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Stock');
    engine.setInstructions('Stock market simulation. 5 stocks, 20 weeks. Buy low, sell high!');
    var stocks=[
      {name:'ACME',price:50,shares:0},
      {name:'GLOBAL',price:30,shares:0},
      {name:'TECH',price:80,shares:0},
      {name:'ENERGY',price:45,shares:0},
      {name:'HEALTH',price:60,shares:0}
    ];
    var cash=10000;
    for(var w=1;w<=20;w++){
      engine.clear();
      engine.println('=== Week '+w+' of 20 ===');
      engine.println('Cash: $'+cash.toFixed(2));
      for(var i=0;i<stocks.length;i++){
        var change=RNG.int(-8,9);
        stocks[i].price+=change;
        if(stocks[i].price<5)stocks[i].price=5;
        engine.println((i+1)+') '+stocks[i].name+' $'+stocks[i].price.toFixed(2)+' (shares:'+stocks[i].shares+')');
      }
      var total=cash;
      for(var i=0;i<stocks.length;i++) total+=stocks[i].shares*stocks[i].price;
      engine.println('Portfolio: $'+total.toFixed(2));
      var act=(await engine.input('Action: stock# buy/sell amount (e.g. "1 buy 10") or "pass": ')).trim().toLowerCase();
      if(act==='pass') continue;
      var parts=act.split(/\s+/);
      if(parts.length<3){engine.println('Format: # buy/sell QTY');w--;continue;}
      var si=parseInt(parts[0])-1;
      if(isNaN(si)||si<0||si>=stocks.length){engine.println('Invalid stock.');w--;continue;}
      var qty=parseInt(parts[2]);
      if(isNaN(qty)||qty<=0){engine.println('Invalid quantity.');w--;continue;}
      if(parts[1]==='buy'){
        var cost=qty*stocks[si].price;
        if(cost>cash){engine.println('Not enough cash!');w--;continue;}
        cash-=cost;
        stocks[si].shares+=qty;
        engine.println('Bought '+qty+' shares of '+stocks[si].name);
      }else if(parts[1]==='sell'){
        if(qty>stocks[si].shares){engine.println('Not enough shares!');w--;continue;}
        cash+=qty*stocks[si].price;
        stocks[si].shares-=qty;
        engine.println('Sold '+qty+' shares of '+stocks[si].name);
      }else{engine.println('Use buy or sell.');w--;}
    }
    var total=cash;
    for(var i=0;i<stocks.length;i++) total+=stocks[i].shares*stocks[i].price;
    engine.println('');
    engine.println('Final portfolio: $'+total.toFixed(2));
    engine.println('Profit/Loss: $'+(total-10000).toFixed(2));
    engine.end();
  };
})();
