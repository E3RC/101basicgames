(function(){
  var slug='buzzwd';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Buzzword');
    engine.setInstructions('Generates corporate buzzword bingo phrases. Answer Y for another set.');

    var adjectives = ['Integrated', 'Total', 'Systematized', 'Parallel', 'Functional', 'Responsive', 'Digital', 'Optimal'];
    var nouns = ['Management', 'Options', 'Phasing', 'Capacity', 'Time-Phase', 'Solution', 'Policy', 'Design'];
    var verbs = ['Forecast', 'Monitor', 'Allocate', 'Program', 'Configure', 'Quantify', 'Synthesize', 'Maximize'];

    function makePhrase(){
      return RNG.pick(adjectives) + ' ' + RNG.pick(nouns) + ' ' + RNG.pick(verbs);
    }

    var again = 'Y';
    while(again === 'Y'){
      engine.println('');
      for(var i = 0; i < 5; i++){
        engine.println((i + 1) + '. ' + makePhrase());
      }
      engine.println('');
      again = await engine.input('Another set (Y/N)? ');
      again = again.toUpperCase();
    }

    engine.println('Goodbye!');
    engine.end();
  };
})();
