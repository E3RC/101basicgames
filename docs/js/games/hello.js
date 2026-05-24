(function(){
  var slug='hello';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Hello');
    engine.setInstructions('Talk to the computer. It listens and responds. Say "goodbye" to end.');
    engine.println('Hello! I\'m Eliza. Tell me what\'s on your mind.');
    var keywords=[
      {words:['mother','father','sister','brother','parent','family'],resp:['Tell me more about your family.','How does that make you feel about your family?','Family relationships are important.']},
      {words:['hate','angry','mad'],resp:['Why do you feel that way?','What makes you so angry?','Can you tell me more about that?']},
      {words:['love'],resp:['Love is a complex emotion.','Tell me more about who you love.','How does love make you feel?']},
      {words:['sad','depressed','unhappy'],resp:['I\'m sorry you feel that way.','Why are you feeling sad?','Do you know what caused this feeling?']},
      {words:['happy','glad','great','wonderful'],resp:['I\'m glad to hear that!','Tell me what makes you happy.','Happiness is wonderful.']},
      {words:['dream','dreamed','dreamt'],resp:['What does that dream suggest to you?','Dreams can be revealing.','Tell me more about your dream.']},
      {words:['sorry','apologize'],resp:['No need to apologize.','Why do you feel sorry?','Apologies accepted.']},
      {words:['school','work','job','boss'],resp:['How is your work life?','Do you enjoy your job?','Tell me more about your career.']},
      {words:['friend','friends'],resp:['Tell me about your friends.','Are your friends supportive?','Friendships are valuable.']}
    ];
    var fallbacks=['I see.','Please go on.','That\'s interesting.','Tell me more.','Why do you say that?','How does that make you feel?'];
    var last='';
    while(true){
      var input=(await engine.input('> ')).trim().toLowerCase();
      if(input==='goodbye'||input==='bye'){engine.println('Goodbye! Take care.');break;}
      if(!input) input=last;
      last=input;
      var matched=false;
      for(var i=0;i<keywords.length;i++){
        for(var j=0;j<keywords[i].words.length;j++){
          if(input.indexOf(keywords[i].words[j])!==-1){
            engine.println(RNG.pick(keywords[i].resp));
            matched=true;
            break;
          }
        }
        if(matched) break;
      }
      if(!matched) engine.println(RNG.pick(fallbacks));
    }
    engine.end();
  };
})();
