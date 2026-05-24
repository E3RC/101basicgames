(function(){
  var slug='bull';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Bull');
    engine.setInstructions('Stock market simulation. Start with $10,000. Buy and sell shares over 10 rounds.');
    var cash=10000,shares=0,price=50;
    for(var r=1;r<=10;r++){
      engine.clear();
      price+=RNG.int(-5,6)+2;
      if(price<5)price=5;
      engine.println('=== Round '+r+' of 10 ===');
      engine.println('Cash: $'+cash.toFixed(2)+'  Shares: '+shares+'  Price: $'+price.toFixed(2));
      engine.println('Portfolio: $'+(cash+shares*price).toFixed(2));
      var action=(await engine.input('Buy (b NUMBER), Sell (s NUMBER), or Pass (p): ')).trim().toLowerCase();
      if(action==='p'||action==='pass') continue;
      var parts=action.split(/\s+/);
      var type=parts[0],num=parseInt(parts[1]);
      if(isNaN(num)||num<=0){engine.println('Invalid.');r--;continue;}
      if(type==='b'||type==='buy'){
        var cost=num*price;
        if(cost>cash){engine.println('Not enough cash!');r--;continue;}
        cash-=cost;
        shares+=num;
        engine.println('Bought '+num+' shares at $'+price.toFixed(2));
      }else if(type==='s'||type==='sell'){
        if(num>shares){engine.println('Not enough shares!');r--;continue;}
        cash+=num*price;
        shares-=num;
        engine.println('Sold '+num+' shares at $'+price.toFixed(2));
      }else{engine.println('Invalid.');r--;continue;}
    }
    var total=cash+shares*price;
    engine.println('');
    engine.println('Final: Cash $'+cash.toFixed(2)+', Shares '+shares);
    engine.println('Total value: $'+total.toFixed(2));
    engine.println('Profit/Loss: $'+(total-10000).toFixed(2));
    engine.end();
  };
})();
