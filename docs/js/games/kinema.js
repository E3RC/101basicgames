(function(){
  var slug='kinema';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Kinema');
    engine.setInstructions('Practice kinematics: distance = rate * time. Solve for the missing value.');
    var correct=0,total=10;
    for(var i=0;i<total;i++){
      engine.clear();
      engine.println('--- Problem '+(i+1)+' of '+total+' ---');
      var rate=RNG.int(10,120);
      var time=RNG.int(1,10);
      var dist=rate*time;
      var p=RNG.int(0,2);
      var q,ans;
      if(p===0){
        q='distance';
        ans=dist;
        engine.println('If speed='+rate+'mph and time='+time+'hr, what is the distance? (miles)');
      }else if(p===1){
        q='speed';
        ans=rate;
        engine.println('If distance='+dist+'mi and time='+time+'hr, what is the speed? (mph)');
      }else{
        q='time';
        ans=time;
        engine.println('If distance='+dist+'mi and speed='+rate+'mph, what is the time? (hours)');
      }
      var resp=parseFloat(await engine.input('Your answer: '));
      if(isNaN(resp)){
        engine.println('Enter a number.');
        i--;
        continue;
      }
      if(Math.abs(resp-ans)<0.1){
        engine.println('Correct!');
        correct++;
      }else{
        engine.println('Incorrect. Answer: '+ans);
      }
    }
    engine.println('');
    engine.println('Final: '+correct+'/'+total+' correct');
    engine.end();
  };
})();
