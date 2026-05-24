(function(){
  var slug='poet';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Poet');
    engine.setInstructions('The computer generates nature poems. Answer Y to get another.');

    var articles = ['The', 'A', 'An'];
    var adjectives = ['red', 'blue', 'green', 'bright', 'dark', 'soft'];
    var nouns = ['flower', 'cloud', 'river', 'mountain', 'ocean'];
    var verbs = ['flows', 'shines', 'drifts', 'blooms', 'sings'];

    function makeLine(){
      var art = RNG.pick(articles);
      var adj = RNG.pick(adjectives);
      var noun = RNG.pick(nouns);
      var vrb = RNG.pick(verbs);
      if(art === 'A' && /^[aeiou]/i.test(adj)) art = 'An';
      return art + ' ' + adj + ' ' + noun + ' ' + vrb;
    }

    var again = 'Y';
    while(again === 'Y'){
      engine.println('');
      engine.println(makeLine());
      engine.println(makeLine());
      engine.println(makeLine());
      engine.println('');
      again = await engine.input('Another poem (Y/N)? ');
      again = again.toUpperCase();
    }

    engine.println('Goodbye!');
    engine.end();
  };
})();
