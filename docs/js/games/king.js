(function(){
  var slug='king';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('King');
    engine.setInstructions('You are the king of an island. Manage population, gold, army, and food. Set tax rate (1-50%), recruit army, distribute food. Handle random events like disease, revolt, trade ships, and barbarians. Survive 20 turns with population alive and gold above zero.');

    var population = 100;
    var gold = 500;
    var army = 20;
    var food = 500;
    var turn = 1;
    var maxTurns = 20;

    function displayStatus() {
      var lines = [];
      lines.push('Turn ' + turn + '/' + maxTurns);
      lines.push('Population: ' + population);
      lines.push('Gold: ' + gold);
      lines.push('Army: ' + army);
      lines.push('Food: ' + food);
      return lines.join('\n');
    }

    engine.clear();
    engine.println('KINGDOM SIMULATION');
    engine.println('');

    while (turn <= maxTurns) {
      engine.println(displayStatus());
      engine.println('');

      if (population <= 0) {
        engine.println('Your population has died out. GAME OVER.');
        break;
      }
      if (gold <= 0) {
        engine.println('You are bankrupt. GAME OVER.');
        break;
      }

      var taxInput = await engine.input('Set tax rate (1-50%): ');
      var taxRate = parseInt(taxInput, 10);
      if (isNaN(taxRate) || taxRate < 1 || taxRate > 50) { engine.println('Enter 1-50.'); continue; }

      var taxRevenue = Math.floor(population * taxRate / 10);
      gold += taxRevenue;
      engine.println('Collected $' + taxRevenue + ' in taxes.');

      var armyPayInput = await engine.input('Gold to pay army (0-' + gold + '): $');
      var armyPay = parseInt(armyPayInput, 10);
      if (isNaN(armyPay) || armyPay < 0 || armyPay > gold) { engine.println('Invalid amount.'); continue; }
      gold -= armyPay;
      if (armyPay < army * 2) {
        var deserters = Math.floor(army * 0.2);
        army -= deserters;
        engine.println(deserters + ' soldiers deserted due to low pay.');
      } else {
        var recruits = Math.floor(armyPay / 5);
        army += recruits;
        engine.println(recruits + ' new soldiers recruited.');
      }

      var foodDistInput = await engine.input('Food to distribute (0-' + food + '): ');
      var foodDist = parseInt(foodDistInput, 10);
      if (isNaN(foodDist) || foodDist < 0 || foodDist > food) { engine.println('Invalid amount.'); continue; }
      food -= foodDist;

      var needed = population * 3;
      if (foodDist < needed) {
        var starved = Math.floor((needed - foodDist) / 3);
        if (starved > population) starved = population;
        population -= starved;
        engine.println(starved + ' people starved!');
      } else {
        var growth = Math.floor(population * 0.05);
        population += growth;
        engine.println('Population grew by ' + growth + '.');
      }

      var eventRoll = RNG.int(1, 100);
      if (eventRoll <= 20) {
        var diseaseDeaths = Math.floor(population * RNG.int(5, 15) / 100);
        if (diseaseDeaths < 1) diseaseDeaths = 1;
        population -= diseaseDeaths;
        engine.println('Disease outbreak! ' + diseaseDeaths + ' people died.');
      } else if (eventRoll <= 35) {
        if (army > 0) {
          var revoltLoss = Math.floor(army * RNG.int(10, 30) / 100);
          if (revoltLoss < 1) revoltLoss = 1;
          army -= revoltLoss;
          gold -= RNG.int(20, 100);
          engine.println('A revolt! Lost ' + revoltLoss + ' soldiers and some gold.');
        }
      } else if (eventRoll <= 50) {
        var tradeGold = RNG.int(50, 200);
        gold += tradeGold;
        engine.println('A trade ship arrived! Gained $' + tradeGold + '.');
      } else if (eventRoll <= 65) {
        var barbarianArmy = RNG.int(10, 40);
        if (army >= barbarianArmy) {
          army -= Math.floor(barbarianArmy * 0.5);
          engine.println('Barbarians attacked! Your army defeated them. Lost some soldiers.');
        } else {
          var goldLost = Math.floor(gold * RNG.int(10, 30) / 100);
          gold -= goldLost;
          population -= Math.floor(population * 0.1);
          engine.println('Barbarians raided! Lost $' + goldLost + ' gold and people.');
        }
      } else {
        engine.println('A peaceful year.');
      }

      food += RNG.int(50, 150);
      if (food < 0) food = 0;
      if (gold < 0) gold = 0;

      turn++;
      engine.println('');
    }

    if (turn > maxTurns) {
      engine.println('');
      engine.println('--- Final Status ---');
      engine.println('Population: ' + population);
      engine.println('Gold: ' + gold);
      engine.println('Army: ' + army);
      engine.println('Food: ' + food);
      engine.println('');
      var score = population + gold + army * 2;
      engine.println('Score: ' + score);
      if (score > 500) engine.println('Your kingdom thrived! Long live the king!');
      else if (score > 200) engine.println('You managed adequately.');
      else engine.println('Your rule was troubled.');
    }

    engine.end();
  };
})();
