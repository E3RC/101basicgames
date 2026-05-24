(function(){
  var slug='batnum';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Battle Number');
    engine.println('Battle Number - Two player number guessing battle!');
    engine.println('Both you and the computer pick secret 3-digit numbers.');
    engine.println('First to get 3 correct guesses wins!');
    engine.setInstructions('Compete against the computer. Each of you picks a secret 3-digit number. Guess the computer\'s number while it guesses yours. First to 3 correct guesses wins.');

    var digits = [0,1,2,3,4,5,6,7,8,9];
    RNG.shuffle(digits);
    var compSecret = digits.slice(0,3).join('');

    engine.println('Enter your secret 3-digit number (hidden):');
    var playerSecret = await engine.input('');
    while(!/^\d{3}$/.test(playerSecret)){
      engine.println('Please enter exactly 3 digits:');
      playerSecret = await engine.input('');
    }
    engine.clear();

    var playerScore = 0;
    var compScore = 0;
    var round = 1;
    var possible = [];
    for(var i=0;i<1000;i++){
      var s = i.toString();
      while(s.length<3) s='0'+s;
      possible.push(s);
    }

    while(playerScore < 3 && compScore < 3){
      engine.println('');
      engine.println('--- Round ' + round + ' ---');
      engine.println('Score - You: ' + playerScore + ', Computer: ' + compScore);

      var guess = await engine.input('Your guess: ');
      guess = guess.trim();
      if(!/^\d{3}$/.test(guess)){
        engine.println('Please enter a 3-digit number.');
        continue;
      }

      var pCorrect = 0;
      for(var i=0;i<3;i++){
        if(guess[i] === compSecret[i]) pCorrect++;
      }
      engine.println('You got ' + pCorrect + ' digit(s) correct.');

      var compGuess = possible[Math.floor(Math.random() * possible.length)];
      engine.println('Computer guesses: ' + compGuess);

      var cCorrect = 0;
      for(var i=0;i<3;i++){
        if(compGuess[i] === playerSecret[i]) cCorrect++;
      }
      engine.println('Computer got ' + cCorrect + ' digit(s) correct.');

      if(pCorrect === 3) playerScore++;
      if(cCorrect === 3) compScore++;
      round++;
    }

    engine.println('');
    if(playerScore >= 3 && compScore >= 3){
      engine.println('It\'s a tie!');
    } else if(playerScore >= 3){
      engine.println('You win!');
    } else {
      engine.println('Computer wins!');
    }
    engine.end();
  };
})();
