(function(){
  var slug='litqz';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('LitQZ');
    engine.setInstructions('Literature quiz. Answer questions about classic literature.');
    var qa=[
      {q:'Who wrote "Romeo and Juliet"?',a:['shakespeare','william shakespeare']},
      {q:'Who wrote "Moby Dick"?',a:['herman melville','melville']},
      {q:'Who wrote "1984"?',a:['george orwell','orwell']},
      {q:'Who wrote "The Great Gatsby"?',a:['f. scott fitzgerald','fitzgerald','scott fitzgerald']},
      {q:'Who wrote "Pride and Prejudice"?',a:['jane austen','austen']},
      {q:'Who wrote "To Kill a Mockingbird"?',a:['harper lee','lee']},
      {q:'Who wrote "The Catcher in the Rye"?',a:['j.d. salinger','salinger']},
      {q:'Who wrote "War and Peace"?',a:['leo tolstoy','tolstoy']},
      {q:'Who wrote "The Odyssey"?',a:['homer']},
      {q:'In "Moby Dick", what is the name of the captain?',a:['ahab','captain ahab']},
      {q:'In "Romeo and Juliet", what is Juliet\'s last name?',a:['capulet']},
      {q:'In "1984", who is the Big Brother figure?',a:['big brother']},
      {q:'Who wrote "The Hobbit"?',a:['j.r.r. tolkien','tolkien']},
      {q:'Who wrote "Dracula"?',a:['bram stoker','stoker']},
      {q:'Who wrote "Frankenstein"?',a:['mary shelley','shelley']},
      {q:'What is the title of the first Harry Potter book?',a:['harry potter and the sorcerer\'s stone','harry potter and the philosopher\'s stone','sorcerer\'s stone','philosopher\'s stone']},
      {q:'Who wrote "The Adventures of Tom Sawyer"?',a:['mark twain','twain','samuel clemens']},
      {q:'Who wrote "Crime and Punishment"?',a:['fyodor dostoevsky','dostoevsky']},
      {q:'Who wrote "The Picture of Dorian Gray"?',a:['oscar wilde','wilde']},
      {q:'Who wrote "Wuthering Heights"?',a:['emily bronte','bronte']},
      {q:'Who wrote "The Scarlet Letter"?',a:['nathaniel hawthorne','hawthorne']}
    ];
    RNG.shuffle(qa);
    var correct=0,total=20;
    for(var i=0;i<total;i++){
      engine.clear();
      engine.println('--- Question '+(i+1)+' of '+total+' ---');
      engine.println(qa[i].q);
      var ans=(await engine.input('Your answer: ')).trim().toLowerCase();
      var ok=false;
      for(var j=0;j<qa[i].a.length;j++){
        if(ans===qa[i].a[j].toLowerCase()){ok=true;break;}
      }
      if(ok){
        engine.println('Correct!');
        correct++;
      }else{
        engine.println('Incorrect. Answer: '+qa[i].a[0]);
      }
    }
    engine.println('');
    engine.println('Final: '+correct+'/'+total+' correct');
    engine.end();
  };
})();
