var Deck = {
  suits: ['H','D','C','S'],
  rankName: function(r) { return {1:'Ace',11:'Jack',12:'Queen',13:'King'}[r]||String(r); },
  sym: {H:'\u2665',D:'\u2666',C:'\u2663',S:'\u2660'},
  create: function() { var c=[]; for(var r=1;r<=13;r++) for(var s=0;s<4;s++) c.push({rank:r,suit:this.suits[s]}); return c; },
  shuffle: function(d) { return RNG.shuffle(d); },
  deal: function(d,n) { return d.splice(0,n||1); },
  display: function(h) { return h.map(function(c){return Deck.rankName(c.rank)+Deck.sym[c.suit];}).join(' '); },
  bjVal: function(c) { return c.rank===1?11:(c.rank>10?10:c.rank); },
  handVal: function(h) { var t=0,a=0; for(var i=0;i<h.length;i++){t+=this.bjVal(h[i]);if(h[i].rank===1)a++;} while(t>21&&a>0){t-=10;a--;} return t; }
};
