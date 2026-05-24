(function(){
  var slug='rockt2';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Rocket II');
    engine.setInstructions('Advanced lunar landing. Control vertical and horizontal velocity. Must zero both.');
    var alt=1000,velV=-40,velH=30,fuel=150,maxThrust=25;
    var gravity=1.6;
    engine.clear();
    engine.println('=== LUNAR LANDING - ADVANCED ===');
    while(alt>0){
      engine.println('Alt:'+alt.toFixed(1)+'m  VV:'+velV.toFixed(1)+'  VH:'+velH.toFixed(1)+'  Fuel:'+fuel+'L');
      engine.println('Thrust controls: vertical (0-'+maxThrust+') and horizontal (-'+maxThrust+' to '+maxThrust+')');
      var tv=parseInt(await engine.input('Vertical thrust: '));
      if(isNaN(tv)||tv<0)tv=0;
      if(tv>maxThrust)tv=maxThrust;
      var th=parseInt(await engine.input('Horizontal thrust (-'+maxThrust+' to '+maxThrust+'): '));
      if(isNaN(th)||th<-maxThrust)th=-maxThrust;
      if(th>maxThrust)th=maxThrust;
      var used=Math.abs(tv)+Math.abs(th);
      if(used>fuel){
        engine.println('Not enough fuel!');
        continue;
      }
      fuel-=used;
      velV=velV+gravity-tv;
      velH=velH-th;
      alt+=velV;
      if(alt<0)alt=0;
      if(alt<=0)break;
    }
    engine.println('');
    var vv=Math.abs(velV),vh=Math.abs(velH);
    if(vv<5&&vh<5){
      engine.println('PERFECT LANDING! VV:'+vv.toFixed(1)+' VH:'+vh.toFixed(1));
    }else if(vv<15&&vh<15){
      engine.println('Rough landing. VV:'+vv.toFixed(1)+' VH:'+vh.toFixed(1));
    }else{
      engine.println('CRASH! VV:'+vv.toFixed(1)+' VH:'+vh.toFixed(1));
    }
    engine.end();
  };
})();
