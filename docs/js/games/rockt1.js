(function(){
  var slug='rockt1';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Rocket I');
    engine.setInstructions('Lunar landing. Control descent with thrust. Land at <5m/s for safety.');
    var altitude=1000,velocity=-50,fuel=120,maxThrust=30;
    engine.clear();
    engine.println('=== LUNAR LANDING ===');
    engine.println('Altitude: '+altitude+'m  Velocity: '+velocity+'m/s  Fuel: '+fuel+'L');
    while(altitude>0){
      var thrust=parseInt(await engine.input('Thrust (0-'+maxThrust+'): '));
      if(isNaN(thrust)||thrust<0)thrust=0;
      if(thrust>maxThrust)thrust=maxThrust;
      if(thrust>fuel)thrust=fuel;
      fuel-=thrust;
      velocity=velocity+1.6-thrust;
      altitude+=velocity;
      if(altitude<0)altitude=0;
      engine.println('Alt:'+altitude.toFixed(1)+'m Vel:'+velocity.toFixed(1)+'m/s Fuel:'+fuel+'L');
      if(altitude<=0)break;
    }
    engine.println('');
    var vel=Math.abs(velocity);
    if(vel<5){
      engine.println('SAFE LANDING! Velocity: '+vel.toFixed(1)+'m/s');
    }else if(vel<15){
      engine.println('Rough landing. Velocity: '+vel.toFixed(1)+'m/s');
    }else{
      engine.println('CRASH! Velocity: '+vel.toFixed(1)+'m/s');
    }
    engine.end();
  };
})();
