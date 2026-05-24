(function(){
  var slug='furs';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Fur Trading');
    engine.setInstructions('Fur Trading Simulation. Travel between 3 towns buying and selling beaver, fox, and bear pelts. Start with $500. Each town has different buy/sell prices that fluctuate. Travel costs $50 per trip. Survive 20 turns and maximize your wealth.');

    var TOWNS = ['Fort William', 'Moose Factory', 'York Factory'];
    var FURS = ['Beaver', 'Fox', 'Bear'];
    var MAX_TURNS = 20;
    var TRAVEL_COST = 50;

    var currentTown = 0;
    var money = 500;
    var turn = 0;
    var inventory = [0, 0, 0];

    var prices = [];

    function generatePrices() {
      prices = [];
      for (var t = 0; t < 3; t++) {
        var townPrices = [];
        for (var f = 0; f < 3; f++) {
          townPrices.push({
            buy: RNG.int(10, 60),
            sell: RNG.int(5, 50)
          });
        }
        prices.push(townPrices);
      }
    }

    function fluctuatePrices() {
      for (var t = 0; t < 3; t++) {
        for (var f = 0; f < 3; f++) {
          var change = RNG.int(-10, 10);
          prices[t][f].buy = Math.max(1, prices[t][f].buy + change);
          prices[t][f].sell = Math.max(1, prices[t][f].sell + change);
          if (prices[t][f].sell > prices[t][f].buy) {
            prices[t][f].sell = prices[t][f].buy - 1;
          }
        }
      }
    }

    function status() {
      var lines = [];
      lines.push('Turn ' + turn + '/' + MAX_TURNS + ' | Location: ' + TOWNS[currentTown]);
      lines.push('Money: $' + money);
      lines.push('Inventory: Beaver=' + inventory[0] + ' Fox=' + inventory[1] + ' Bear=' + inventory[2]);
      lines.push('');
      lines.push('Current Prices:');
      lines.push('  Fur       Buy    Sell');
      for (var f = 0; f < 3; f++) {
        var p = prices[currentTown][f];
        var name = FURS[f];
        while (name.length < 8) name += ' ';
        lines.push('  ' + name + '$' + p.buy + '    $' + p.sell);
      }
      return lines.join('\n');
    }

    generatePrices();

    engine.clear();
    engine.println('FUR TRADING SIMULATION');
    engine.println('');

    while (turn < MAX_TURNS) {
      engine.println(status());
      engine.println('');
      engine.println('Actions: (B)uy, (S)ell, (T)ravel to next town, (Q)uit');
      var action = await engine.input('What do you do? ');
      action = action.trim().toUpperCase();

      if (action === 'B') {
        var furInput = await engine.input('Buy which fur? (B)eaver, (F)ox, (R)ear: ');
        furInput = furInput.trim().toUpperCase();
        var furIdx = -1;
        if (furInput === 'B') furIdx = 0;
        else if (furInput === 'F') furIdx = 1;
        else if (furInput === 'R') furIdx = 2;
        else { engine.println('Invalid fur.'); continue; }

        var price = prices[currentTown][furIdx].buy;
        var maxCanBuy = Math.floor(money / price);
        if (maxCanBuy === 0) { engine.println('You don\'t have enough money.'); continue; }

        var qtyInput = await engine.input('How many (1-' + maxCanBuy + ')? ');
        var qty = parseInt(qtyInput, 10);
        if (isNaN(qty) || qty < 1 || qty > maxCanBuy) { engine.println('Invalid quantity.'); continue; }

        money -= qty * price;
        inventory[furIdx] += qty;
        engine.println('Bought ' + qty + ' ' + FURS[furIdx] + ' for $' + (qty * price));
      } else if (action === 'S') {
        var furInput = await engine.input('Sell which fur? (B)eaver, (F)ox, (R)ear: ');
        furInput = furInput.trim().toUpperCase();
        var furIdx = -1;
        if (furInput === 'B') furIdx = 0;
        else if (furInput === 'F') furIdx = 1;
        else if (furInput === 'R') furIdx = 2;
        else { engine.println('Invalid fur.'); continue; }

        if (inventory[furIdx] === 0) { engine.println('You don\'t have any ' + FURS[furIdx] + ' to sell.'); continue; }

        var qtyInput = await engine.input('How many (1-' + inventory[furIdx] + ')? ');
        var qty = parseInt(qtyInput, 10);
        if (isNaN(qty) || qty < 1 || qty > inventory[furIdx]) { engine.println('Invalid quantity.'); continue; }

        var price = prices[currentTown][furIdx].sell;
        money += qty * price;
        inventory[furIdx] -= qty;
        engine.println('Sold ' + qty + ' ' + FURS[furIdx] + ' for $' + (qty * price));
      } else if (action === 'T') {
        if (money < TRAVEL_COST) { engine.println('You need $' + TRAVEL_COST + ' to travel.'); continue; }
        money -= TRAVEL_COST;
        currentTown = (currentTown + 1) % 3;
        turn++;
        fluctuatePrices();
        engine.println('Traveled to ' + TOWNS[currentTown] + ' ($' + TRAVEL_COST + ')');
      } else if (action === 'Q') {
        engine.println('You quit. Final wealth: $' + money);
        break;
      } else {
        engine.println('Enter B, S, T, or Q.');
      }
    }

    if (turn >= MAX_TURNS) {
      engine.println('');
      engine.println('20 turns completed!');
    }

    var totalWealth = money;
    for (var f = 0; f < 3; f++) {
      if (prices[currentTown]) totalWealth += inventory[f] * prices[currentTown][f].sell;
    }
    engine.println('Final wealth (including inventory value): $' + totalWealth);
    engine.println('Starting wealth: $500');
    engine.println('Profit: $' + (totalWealth - 500));

    engine.end();
  };
})();
