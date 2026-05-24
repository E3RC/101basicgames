(function(){
  var slug='change';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Change');
    engine.setInstructions('Practice making change. A customer pays with a bill. Enter the correct change due.');
    var correct=0,total=10,denoms=[0.01,0.05,0.10,0.25,0.50,1,2,5,10,20];
    for(var r=0;r<total;r++){
      engine.clear();
      engine.println('--- Round '+(r+1)+' of '+total+' ---');
      var price=RNG.int(50,999)/100;
      var billIdx=RNG.int(0,denoms.length-1);
      while(denoms[billIdx]<=price) billIdx=RNG.int(0,denoms.length-1);
      var bill=denoms[billIdx];
      var change=Math.round((bill-price)*100)/100;
      engine.println('Price: $'+price.toFixed(2));
      engine.println('Customer pays: $'+bill.toFixed(2));
      engine.println('');
      var ans=parseFloat(await engine.input('Enter change due: $'));
      if(isNaN(ans)){
        engine.println('Please enter a number.');
        r--;
        continue;
      }
      ans=Math.round(ans*100)/100;
      if(Math.abs(ans-change)<0.005){
        engine.println('Correct! The change is $'+change.toFixed(2));
        correct++;
      }else{
        engine.println('Incorrect. The correct change is $'+change.toFixed(2));
      }
    }
    engine.println('');
    engine.println('Final: '+correct+'/'+total+' correct ('+Math.round(correct/total*100)+'%)');
    engine.end();
  };
})();
