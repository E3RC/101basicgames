(function(){
  var slug='number';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Number');
    engine.setInstructions('Find the next number in the sequence.');
    var patterns=[
      function(){var s=RNG.int(1,5),d=RNG.int(1,10);return {seq:[s,s+d,s+2*d,s+3*d],ans:s+4*d};},
      function(){var s=RNG.int(2,5),r=RNG.int(2,5);return {seq:[s,s*r,s*r*r,s*r*r*r],ans:s*r*r*r*r};},
      function(){var s=RNG.int(1,10);return {seq:[s*s,(s+1)*(s+1),(s+2)*(s+2),(s+3)*(s+3)],ans:(s+4)*(s+4)};},
      function(){var s=RNG.int(1,5),d=RNG.int(1,5);return {seq:[s,s+d,s+2*d,s+4*d],ans:s+7*d};},
      function(){var n=RNG.int(2,8);return {seq:[1,n,1,n,1,n,1],ans:n};}
    ];
    var correct=0,total=10;
    for(var i=0;i<total;i++){
      engine.clear();
      engine.println('--- Sequence '+(i+1)+' of '+total+' ---');
      var p=RNG.pick(patterns);
      var data=p();
      engine.println('Sequence: '+data.seq.join(', ')+', ?');
      var ans=parseInt(await engine.input('Next number: '));
      if(isNaN(ans)){
        engine.println('Enter a number.');
        i--;
        continue;
      }
      if(ans===data.ans){
        engine.println('Correct!');
        correct++;
      }else{
        engine.println('Incorrect. Next number: '+data.ans);
      }
    }
    engine.println('');
    engine.println('Final: '+correct+'/'+total+' correct');
    engine.end();
  };
})();
