(function(){
  var slug='chief';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Chief');
    engine.setInstructions('Arithmetic drill. Answer math problems. Choose difficulty 1-3.');
    var level=parseInt(await engine.input('Difficulty (1=Easy, 2=Medium, 3=Hard): '));
    if(isNaN(level)||level<1||level>3) level=1;
    var ops=['+','-','*'];
    var ranges=[{min:1,max:10},{min:1,max:25},{min:5,max:50}];
    var range=ranges[level-1];
    var correct=0,total=10;
    for(var i=0;i<total;i++){
      engine.clear();
      engine.println('--- Problem '+(i+1)+' of '+total+' ---');
      var a=RNG.int(range.min,range.max);
      var b=RNG.int(range.min,range.max);
      var op=RNG.pick(ops);
      if(op==='-'&&a<b){var t=a;a=b;b=t;}
      var answer;
      switch(op){
        case '+':answer=a+b;break;
        case '-':answer=a-b;break;
        case '*':answer=a*b;break;
      }
      var resp=await engine.input('What is '+a+' '+op+' '+b+'? ');
      var userAns=parseInt(resp);
      if(isNaN(userAns)){
        engine.println('Enter a number.');
        i--;
        continue;
      }
      if(userAns===answer){
        engine.println('Correct!');
        correct++;
      }else{
        engine.println('Incorrect. Answer: '+answer);
      }
    }
    engine.println('');
    engine.println('Final: '+correct+'/'+total+' correct');
    engine.end();
  };
})();
