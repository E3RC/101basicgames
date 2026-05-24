(function(){
  var slug='mathd';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('MathD');
    engine.setInstructions('Math with dice. Roll dice and answer math questions.');
    function diceFace(n){
      var dots=[['   ',' ● ','   '],['  ●','   ','●  '],['  ●',' ● ','●  '],
                ['● ●','   ','● ●'],['● ●',' ● ','● ●'],['● ●','● ●','● ●']];
      return '┌───┐\n'+dots[n-1][0]+'\n'+dots[n-1][1]+'\n'+dots[n-1][2]+'\n└───┘';
    }
    var correct=0,total=10;
    for(var i=0;i<total;i++){
      engine.clear();
      engine.println('--- Roll '+(i+1)+' of '+total+' ---');
      var d1=Dice.roll(6),d2=Dice.roll(6);
      var op=RNG.pick(['+','*']);
      var answer=op==='+'?d1+d2:d1*d2;
      engine.println('You rolled:');
      engine.print(diceFace(d1));
      engine.print(diceFace(d2));
      var resp=parseInt(await engine.input('What is '+d1+' '+op+' '+d2+'? '));
      if(isNaN(resp)){
        engine.println('Enter a number.');
        i--;
        continue;
      }
      if(resp===answer){
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
