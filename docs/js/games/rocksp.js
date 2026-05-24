(function(){
  var slug='rocksp';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Rock Scissors Paper');
    engine.setInstructions('Rock, Scissors, Paper. Best 3 out of 5 rounds. Rock beats Scissors, Scissors beats Paper, Paper beats Rock. Player vs Computer.');

    var WIN_SCORE = 3;
    var playerScore = 0;
    var compScore = 0;
    var round = 1;

    function getComputerChoice() {
      var choices = ['R', 'S', 'P'];
      return RNG.pick(choices);
    }

    function getResult(pChoice, cChoice) {
      if (pChoice === cChoice) return 'draw';
      if ((pChoice === 'R' && cChoice === 'S') ||
          (pChoice === 'S' && cChoice === 'P') ||
          (pChoice === 'P' && cChoice === 'R')) {
        return 'win';
      }
      return 'lose';
    }

    function choiceName(c) {
      if (c === 'R') return 'Rock';
      if (c === 'S') return 'Scissors';
      return 'Paper';
    }

    engine.clear();
    engine.println('ROCK, SCISSORS, PAPER');
    engine.println('');

    while (playerScore < WIN_SCORE && compScore < WIN_SCORE) {
      engine.println('--- Round ' + round + ' ---');
      engine.println('You: ' + playerScore + '  Computer: ' + compScore);
      engine.println('');

      var pChoice = await engine.input('Your choice (R)ock, (S)cissors, (P)aper: ');
      pChoice = pChoice.trim().toUpperCase();
      if (pChoice !== 'R' && pChoice !== 'S' && pChoice !== 'P') {
        engine.println('Enter R, S, or P.');
        continue;
      }

      var cChoice = getComputerChoice();
      engine.println('You chose: ' + choiceName(pChoice));
      engine.println('Computer chose: ' + choiceName(cChoice));

      var result = getResult(pChoice, cChoice);
      if (result === 'win') {
        engine.println('You win this round!');
        playerScore++;
      } else if (result === 'lose') {
        engine.println('Computer wins this round!');
        compScore++;
      } else {
        engine.println('Draw!');
      }

      round++;
      engine.println('');
    }

    engine.println('--- GAME OVER ---');
    engine.println('Final: You ' + playerScore + ' - ' + compScore + ' Computer');
    if (playerScore > compScore) {
      engine.println('YOU WIN THE SERIES!');
    } else {
      engine.println('COMPUTER WINS THE SERIES!');
    }

    engine.end();
  };
})();
