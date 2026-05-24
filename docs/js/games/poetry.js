(function(){
  var slug='poetry';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Poetry');
    engine.setInstructions('The computer generates random poetry. Answer Y to get another poem.');

    var articles = ['A', 'The'];
    var subjects = ['man', 'dog', 'bird', 'cat', 'tree'];
    var verbs = ['loves', 'hates', 'sees', 'knows', 'finds'];
    var objects = ['moon', 'sun', 'star', 'sky', 'sea'];

    function makeLine(){
      var art = RNG.pick(articles);
      var sub = RNG.pick(subjects);
      var vrb = RNG.pick(verbs);
      var obj = RNG.pick(objects);
      if(art === 'A' && /^[aeiou]/i.test(sub)) art = 'An';
      return art + ' ' + sub + ' ' + vrb + ' the ' + obj;
    }

    var again = 'Y';
    while(again === 'Y'){
      engine.println('');
      engine.println(makeLine());
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
