(function(){
  var slug='train';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Train');
    engine.setInstructions('Solve time-speed-distance train problems. Enter your answer in hours.');

    function makeProblem(){
      var t=RNG.int(0,3);
      if(t===0){
        var s1=RNG.int(30,80),s2=RNG.int(40,90),d=RNG.int(100,500);
        while(s2<=s1)s2=RNG.int(40,90);
        var meet=d/(s1+s2);
        return {q:'Train A leaves at '+s1+'mph and Train B leaves toward it at '+s2+'mph from '+d+' miles away. When do they meet? (hours)',a:Math.round(meet*10)/10};
      }else if(t===1){
        var s=RNG.int(30,70),d=RNG.int(100,400);
        var time=d/s;
        return {q:'A train travels at '+s+'mph for '+d+' miles. How long does it take? (hours)',a:Math.round(time*10)/10};
      }else if(t===2){
        var hours=RNG.int(1,6),s=RNG.int(30,80);
        return {q:'A train travels at '+s+'mph for '+hours+' hours. How far does it go? (miles)',a:s*hours};
      }else{
        var s1=RNG.int(40,70),dl=RNG.int(1,3);
        var s2=RNG.int(s1+10,s1+30);
        var catchTime=dl*s1/(s2-s1);
        return {q:'Train A leaves at '+s1+'mph. Train B leaves '+dl+' hours later at '+s2+'mph. When does B catch A? (hours after A left)',a:Math.round((dl+catchTime)*10)/10};
      }
    }

    var correct=0,total=8;
    for(var i=0;i<total;i++){
      engine.clear();
      engine.println('--- Problem '+(i+1)+' of '+total+' ---');
      var p=makeProblem();
      engine.println(p.q);
      var resp=parseFloat(await engine.input('Answer: '));
      if(isNaN(resp)){
        engine.println('Enter a number.');
        i--;
        continue;
      }
      if(Math.abs(resp-p.a)<0.15){
        engine.println('Correct!');
        correct++;
      }else{
        engine.println('Incorrect. Answer: '+p.a);
      }
    }
    engine.println('');
    engine.println('Final: '+correct+'/'+total+' correct');
    engine.end();
  };
})();
