(function(){
  var slug='synonm';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Synonm');
    engine.setInstructions('Enter a synonym for the given word.');
    var pairs=[['quick','fast'],['big','large'],['happy','glad'],['sad','unhappy'],
      ['angry','mad'],['smart','intelligent'],['brave','courageous'],['rich','wealthy'],
      ['poor','needy'],['old','ancient'],['new','novel'],['strong','powerful'],
      ['weak','feeble'],['pretty','beautiful'],['ugly','hideous'],['thin','slender'],
      ['fat','obese'],['cold','chilly'],['hot','scorching'],['fast','speedy'],
      ['slow','sluggish'],['hard','difficult'],['easy','simple'],['bright','luminous'],
      ['dark','gloomy'],['noisy','loud'],['quiet','silent'],['start','begin'],
      ['end','finish'],['help','assist'],['think','ponder'],['show','display'],
      ['hide','conceal'],['buy','purchase'],['sell','vend']];
    RNG.shuffle(pairs);
    var correct=0,total=30;
    for(var i=0;i<total;i++){
      engine.clear();
      engine.println('--- Word '+(i+1)+' of '+total+' ---');
      var show=RNG.int(0,1);
      var word=pairs[i][show];
      var accept=pairs[i][1-show];
      engine.println('Word: '+word.toUpperCase());
      var ans=(await engine.input('Synonym: ')).trim().toLowerCase();
      if(ans===accept||ans===word){
        engine.println('Correct! ("'+accept+'" is a synonym)');
        correct++;
      }else{
        engine.println('Not quite. A synonym is: '+accept);
      }
    }
    engine.println('');
    engine.println('Final: '+correct+'/'+total+' correct');
    engine.end();
  };
})();
