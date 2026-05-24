var Dice = {
  roll: function(sides) { return RNG.int(1, sides || 6); },
  multi: function(count, sides) { var r=[]; for(var i=0;i<(count||2);i++) r.push(this.roll(sides||6)); return r; },
  sum: function(count, sides) { var t=0; for(var i=0;i<(count||2);i++) t+=this.roll(sides||6); return t; }
};
