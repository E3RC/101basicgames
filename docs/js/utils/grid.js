var Grid = {
  make: function(r,c,f) { var g=[]; for(var i=0;i<(r||10);i++){g[i]=[];for(var j=0;j<(c||10);j++)g[i][j]=(f!==undefined)?f:' ';} return g; },
  clone: function(g) { return g.map(function(r){return r.slice();}); },
  inBounds: function(g,r,c) { return r>=0&&r<g.length&&c>=0&&c<g[0].length; },
  set: function(g,r,c,v) { if(this.inBounds(g,r,c)) g[r][c]=v; },
  get: function(g,r,c) { return this.inBounds(g,r,c)?g[r][c]:null; },
  parseCoord: function(s,rows,cols) {
    s=s.toUpperCase().trim(); var m=s.match(/^([A-Z])(\d+)$/)||s.match(/^(\d+)([A-Z])$/);
    if(!m) return null; var c=m[1].charCodeAt(0)-65,r=parseInt(m[2],10)-1;
    return (r>=0&&r<(rows||10)&&c>=0&&c<(cols||10))?{r:r,c:c}:null;
  },
  display: function(g,opts) {
    opts=opts||{}; var rows=g.length,cols=g[0].length,lines=[];
    if(opts.header!==false){var t='  ';for(var c=0;c<cols;c++)t+=' '+(opts.colLabels?opts.colLabels[c]:String.fromCharCode(65+c));lines.push(t);}
    for(var r=0;r<rows;r++){var l=(opts.labels!==false?(opts.rowLabels?opts.rowLabels[r]:String(r+1)):'');if(opts.labels!==false)l+=(r<9?' ':'');for(var c=0;c<cols;c++)l+=' '+g[r][c];lines.push(l);}
    return lines.join('\n');
  }
};
