(function(){
  var slug='boxing';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Boxing');
    engine.setInstructions('3-round boxing match. Choose jab, hook, uppercut, or block. Hook beats jab, uppercut beats hook, jab beats uppercut. Block reduces damage. Manage stamina!');

    function resolveRound(pMove, cMove, pStam, cStam) {
      var pDmg = 0, cDmg = 0;
      var pStamCost = pMove === 'block' ? 2 : 8;
      var cStamCost = cMove === 'block' ? 2 : 8;

      if (pMove === 'block') pStamCost = 2;
      if (cMove === 'block') cStamCost = 2;

      if (pMove === 'block' && cMove === 'block') { return {pDmg:0,cDmg:0,pStamCost:2,cStamCost:2}; }

      if ((pMove === 'hook' && cMove === 'jab') ||
          (pMove === 'uppercut' && cMove === 'hook') ||
          (pMove === 'jab' && cMove === 'uppercut')) {
        cDmg = 3 + (cMove === 'block' ? -2 : 0);
      } else if ((cMove === 'hook' && pMove === 'jab') ||
                 (cMove === 'uppercut' && pMove === 'hook') ||
                 (cMove === 'jab' && pMove === 'uppercut')) {
        pDmg = 3 + (pMove === 'block' ? -2 : 0);
      } else if (pMove === cMove) {
      } else if (pMove === 'block') {
        cDmg = 1;
      } else if (cMove === 'block') {
        pDmg = 1;
      } else {
        pDmg = 2; cDmg = 2;
      }

      if (pMove !== 'block') pStamCost = 8;
      if (cMove !== 'block') cStamCost = 8;
      if (pMove === 'jab') pStamCost = 5;
      if (cMove === 'jab') cStamCost = 5;

      return {pDmg:cDmg, cDmg:pDmg, pStamCost:pStamCost, cStamCost:cStamCost};
    }

    var pStamina = 100, cStamina = 100;
    var pDamage = 0, cDamage = 0;
    var pRounds = 0, cRounds = 0;

    for (var rd = 0; rd < 3; rd++) {
      engine.clear();
      engine.println('--- Round ' + (rd+1) + ' of 3 ---');
      engine.println('Your Stamina: ' + pStamina + '%  Opponent Stamina: ' + cStamina + '%');
      engine.println('Your Damage: ' + pDamage + '  Opponent Damage: ' + cDamage);
      engine.println('');

      var roundPDmg = 0, roundCDmg = 0;

      for (var exchange = 0; exchange < 5; exchange++) {
        if (pStamina <= 0 || cStamina <= 0) break;
        engine.println('Exchange ' + (exchange+1) + ':');
        var move = await engine.input('Your move (jab/hook/uppercut/block): ');
        move = move.trim().toLowerCase();
        if (['jab','hook','uppercut','block'].indexOf(move) === -1) { engine.println('Invalid.'); exchange--; continue; }

        var cMove = RNG.pick(['jab','jab','hook','hook','uppercut','uppercut','block','block','hook','uppercut']);
        engine.println('Computer uses: ' + cMove);

        var res = resolveRound(move, cMove, pStamina, cStamina);
        pStamina -= res.pStamCost;
        cStamina -= res.cStamCost;
        if (pStamina < 0) pStamina = 0;
        if (cStamina < 0) cStamina = 0;

        roundPDmg += res.pDmg;
        roundCDmg += res.cDmg;

        if (res.pDmg > 0) engine.println('You hit for ' + res.pDmg + ' damage!');
        if (res.cDmg > 0) engine.println('Computer hits for ' + res.cDmg + ' damage!');
        if (res.pDmg === 0 && res.cDmg === 0) engine.println('No damage.');
        engine.println('Stamina - You: ' + pStamina + '%  Computer: ' + cStamina + '%');
        engine.println('');
      }

      pDamage += roundPDmg;
      cDamage += roundCDmg;
      if (roundPDmg > roundCDmg) pRounds++;
      else if (roundCDmg > roundPDmg) cRounds++;
      engine.println('Round ' + (rd+1) + ' - You dealt ' + roundPDmg + ', Computer dealt ' + roundCDmg);
      if (rd < 2) await engine.input('Press Enter for next round...');
    }

    engine.clear();
    engine.println('=== FIGHT RESULT ===');
    engine.println('Total Damage - You: ' + pDamage + '  Computer: ' + cDamage);
    engine.println('Rounds - You: ' + pRounds + '  Computer: ' + cRounds);
    if (pRounds > cRounds) engine.println('YOU WIN by decision!');
    else if (cRounds > pRounds) engine.println('COMPUTER WINS by decision!');
    else if (pDamage < cDamage) engine.println('YOU WIN on damage!');
    else if (cDamage < pDamage) engine.println('COMPUTER WINS on damage!');
    else engine.println('DRAW!');
    engine.end();
  };
})();
