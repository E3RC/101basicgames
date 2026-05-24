(function(){
  var slug='cube';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Cube');
    engine.setInstructions('A cube is shown unfolded. Opposite faces always sum to 7. Enter the missing numbers on the opposite faces.');

    var faces = [1, 2, 3, 4, 5, 6];
    RNG.shuffle(faces);
    var top = faces[0], bottom = 7 - top;
    var front = faces[1], back = 7 - front;
    var left = faces[2], right = 7 - left;

    var correct = 0;
    var net = '';
    net += '        +---+        \n';
    net += '        | ' + top + ' |        \n';
    net += '        +---+        \n';
    net += '+---+---+---+---+    \n';
    net += '| ' + left + ' | ' + front + ' | ' + right + ' | ' + back + ' |    \n';
    net += '+---+---+---+---+    \n';
    net += '        +---+        \n';
    net += '        | ? |        \n';
    net += '        +---+        \n';

    var questions = [
      { label: 'Bottom (opposite of top ' + top + ')', answer: bottom },
      { label: 'Back (opposite of front ' + front + ')', answer: back },
      { label: 'Right (opposite of left ' + left + ')', answer: right }
    ];

    engine.clear();
    engine.println('Here is the cube net:');
    engine.println('');
    engine.println(net);

    for (var i = 0; i < questions.length; i++) {
      engine.println('');
      var ans = await engine.input(questions[i].label + ': ');
      var num = parseInt(ans, 10);
      if (num === questions[i].answer) {
        engine.println('Correct!');
        correct++;
      } else {
        engine.println('Wrong. The answer is ' + questions[i].answer);
      }
    }

    engine.println('');
    engine.println('You got ' + correct + ' out of ' + questions.length + ' correct!');
    engine.end();
  };
})();
