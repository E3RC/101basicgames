(function(){
  var slug='bounce';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Bounce');
    engine.setInstructions('Watch a ball bounce across the screen. Set angle and speed.');
    var W=40,H=20;
    var angle=parseInt(await engine.input('Angle (1-90 degrees): '));
    if(isNaN(angle)||angle<1||angle>90) angle=45;
    var speed=parseInt(await engine.input('Speed (1-10): '));
    if(isNaN(speed)||speed<1||speed>10) speed=5;
    var rad=angle*Math.PI/180;
    var dx=Math.round(Math.cos(rad)*speed);
    var dy=-Math.round(Math.sin(rad)*speed);
    if(dx===0)dx=1;
    if(dy===0)dy=-1;
    var grid=[];
    for(var i=0;i<H;i++){grid[i]=[];for(var j=0;j<W;j++)grid[i][j]=' ';}
    var x=0,y=Math.floor(H/2);
    var bounceCount=0;

    engine.clear();
    while(bounceCount<100){
      grid[y][x]='.';
      var nx=x+dx,ny=y+dy;
      if(nx<0||nx>=W){dx=-dx;nx=x+dx;bounceCount++;}
      if(ny<0||ny>=H){dy=-dy;ny=y+dy;bounceCount++;}
      x=nx;y=ny;
      if(x<0)x=0;if(x>=W)x=W-1;
      if(y<0)y=0;if(y>=H)y=H-1;
    }
    engine.clear();
    for(var i=0;i<H;i++){
      engine.println('|'+grid[i].join('')+'|');
    }
    engine.println('Bounces: '+bounceCount);
    engine.end();
  };
})();
