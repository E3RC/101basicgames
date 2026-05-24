(function(){
  var slug='hmrabi';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Hammurabi');
    engine.setInstructions('You govern ancient Sumeria for 10 years. Manage population, land, and grain. Buy/sell land, feed your people, plant seed for harvest. Rats may eat your grain. Keep your people fed to avoid starvation. Score based on population growth and acres per person.');

    var population = 100;
    var acres = 1000;
    var grain = 2800;
    var year = 1;
    var totalDeaths = 0;
    var totalStarved = 0;

    function displayStatus() {
      var lines = [];
      lines.push('Year ' + year + ' of 10');
      lines.push('Population: ' + population);
      lines.push('Acres of land: ' + acres);
      lines.push('Bushels of grain: ' + grain);
      if (year > 1) {
        lines.push('Starved this year: ' + totalStarved);
      }
      return lines.join('\n');
    }

    engine.clear();
    engine.println('HAMMURABI (The Sumer Game)');
    engine.println('');

    while (year <= 10) {
      engine.println(displayStatus());
      engine.println('');

      var landPrice = RNG.int(17, 26);
      engine.println('Land costs ' + landPrice + ' bushels per acre.');

      var buyInput = await engine.input('How many acres to BUY (0 if none): ');
      var buyAcres = parseInt(buyInput, 10);
      if (isNaN(buyAcres) || buyAcres < 0) { engine.println('Enter a valid number.'); continue; }
      if (buyAcres * landPrice > grain) {
        engine.println('You don\'t have that much grain!');
        continue;
      }

      grain -= buyAcres * landPrice;
      acres += buyAcres;

      var sellInput = await engine.input('How many acres to SELL (0 if none): ');
      var sellAcres = parseInt(sellInput, 10);
      if (isNaN(sellAcres) || sellAcres < 0 || sellAcres > acres) {
        engine.println('Enter a valid number (0-' + acres + ').');
        continue;
      }

      grain += sellAcres * landPrice;
      acres -= sellAcres;

      var feedInput = await engine.input('How many bushels to feed your people: ');
      var feedGrain = parseInt(feedInput, 10);
      if (isNaN(feedGrain) || feedGrain < 0 || feedGrain > grain) {
        engine.println('Enter a valid number (0-' + grain + ').');
        continue;
      }

      grain -= feedGrain;

      var plantInput = await engine.input('How many acres to plant with seed: ');
      var plantAcres = parseInt(plantInput, 10);
      if (isNaN(plantAcres) || plantAcres < 0 || plantAcres > acres) {
        engine.println('Enter a valid number (0-' + acres + ').');
        continue;
      }
      var maxPlant = Math.min(grain, population * 10);
      if (plantAcres > maxPlant) {
        engine.println('You only have enough seed for ' + maxPlant + ' acres.');
        continue;
      }

      grain -= plantAcres;

      var harvest = 0;
      if (plantAcres > 0) {
        harvest = plantAcres * RNG.int(1, 6);
        grain += harvest;
      }

      var rats = RNG.int(0, Math.floor(grain * 0.1));
      grain -= rats;

      var needed = population * 20;
      var starved = 0;
      if (feedGrain < needed) {
        starved = Math.floor((needed - feedGrain) / 20);
        if (starved > population) starved = population;
        population -= starved;
        totalStarved += starved;
        totalDeaths += starved;
      }

      var immigrants = 0;
      if (starved === 0) {
        immigrants = Math.floor((20 * acres + grain) / (100 * population) + 1);
        if (immigrants < 0) immigrants = 0;
        population += immigrants;
      }

      var plague = RNG.int(1, 100) <= 15;
      if (plague) {
        var half = Math.floor(population / 2);
        population -= half;
        engine.println('A plague killed half the population! (' + half + ' people)');
      }

      engine.println('');
      if (starved > 0) {
        engine.println(starved + ' people starved this year.');
      }
      if (harvest > 0) {
        engine.println('Harvest yielded ' + harvest + ' bushels.');
      }
      if (rats > 0) {
        engine.println('Rats ate ' + rats + ' bushels of grain.');
      }
      if (immigrants > 0 && starved === 0) {
        engine.println(immigrants + ' people immigrated to Sumeria.');
      }
      engine.println('');

      if (population <= 0) {
        engine.println('Your population has died out. Game over.');
        break;
      }

      if (starved > Math.floor(population * 0.45)) {
        engine.println('Too many people starved! The people overthrew you!');
        break;
      }

      year++;

      if (year > 10) {
        engine.println('');
        engine.println('--- Final Score ---');
        var acresPerPerson = Math.round(acres / population);
        var score = (acresPerPerson * population) - totalDeaths;
        engine.println('Population: ' + population);
        engine.println('Acres per person: ' + acresPerPerson);
        engine.println('Total starved: ' + totalStarved);
        engine.println('Score: ' + score);
        if (score > 2000) engine.println('Excellent! You are a great ruler!');
        else if (score > 1000) engine.println('Good. Your people respect you.');
        else engine.println('You could do better.');
      }
    }

    engine.end();
  };
})();
