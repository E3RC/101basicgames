(function(){
  var slug='animal';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Animal');
    engine.setInstructions('Think of an animal. The computer will try to guess it. Answer y/n.');

    var tree={q:'Does it live in water?',y:{q:'Does it have scales?',y:{animal:'fish'},n:{animal:'whale'}},
              n:{q:'Does it have fur?',y:{q:'Is it bigger than a cat?',y:{animal:'bear'},n:{animal:'rabbit'}},
                 n:{q:'Does it have feathers?',y:{animal:'eagle'},n:{animal:'snake'}}}};

    async function play(node,path){
      while(node.q){
        var ans=(await engine.input(node.q+' (y/n): ')).trim().toLowerCase();
        if(ans==='y'||ans==='yes'){
          if(node.y) node=node.y;
          else break;
        }else if(ans==='n'||ans==='no'){
          if(node.n) node=node.n;
          else break;
        }else{
          engine.println('Please answer y or n.');
        }
      }
      return node;
    }

    var again=true;
    while(again){
      engine.clear();
      engine.println('Think of an animal...');
      var leaf=await play(tree,'');

      if(leaf.animal){
        var ans=(await engine.input('Is it a '+leaf.animal+'? (y/n): ')).trim().toLowerCase();
        if(ans==='y'||ans==='yes'){
          engine.println('I win!');
        }else{
          var newAnimal=await engine.input('What animal were you thinking of? ');
          var newQ=await engine.input('What question distinguishes '+newAnimal+' from '+leaf.animal+'? ');
          var which=(await engine.input('For '+newAnimal+', what is the answer? (y/n): ')).trim().toLowerCase();
          var yn=(which==='y'||which==='yes');
          var newLeaf={animal:newAnimal};
          if(yn){
            leaf.q=newQ;
            leaf.y=newLeaf;
            leaf.n={animal:leaf.animal};
          }else{
            leaf.q=newQ;
            leaf.n=newLeaf;
            leaf.y={animal:leaf.animal};
          }
          delete leaf.animal;
          engine.println('Got it! Added a new animal.');
        }
      }else{
        engine.println('I couldn\'t figure it out!');
      }
      var againAns=(await engine.input('Play again? (y/n): ')).trim().toLowerCase();
      if(againAns!=='y'&&againAns!=='yes') again=false;
    }
    engine.end();
  };
})();
