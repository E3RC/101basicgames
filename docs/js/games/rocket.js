(function(){
  var slug='rocket';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Rocket');
    engine.setInstructions('Launch a rocket! Set fuel, burn rate, and angle. Goal: reach 100km altitude.');
    var fuel=parseFloat(await engine.input('Fuel (kg, 100-1000): '));
    if(isNaN(fuel)||fuel<100||fuel>1000)fuel=500;
    var burnRate=parseFloat(await engine.input('Burn rate (kg/s, 1-20): '));
    if(isNaN(burnRate)||burnRate<1||burnRate>20)burnRate=10;
    var angle=parseFloat(await engine.input('Launch angle (degrees, 60-90): '));
    if(isNaN(angle)||angle<60||angle>90)angle=80;
    var rad=angle*Math.PI/180;
    var altitude=0,velocity=0,mass=5000+fuel,dt=1,t=0;
    var gravity=9.81,thrust=2500;
    var maxAlt=0;

    while(t<120){
      engine.clear();
      engine.println('T+'+t.toFixed(0)+'s');
      engine.println('Altitude: '+altitude.toFixed(2)+'km');
      engine.println('Velocity: '+velocity.toFixed(2)+'m/s');
      engine.println('Fuel: '+fuel.toFixed(1)+'kg');
      if(fuel>0){
        var burn=Math.min(burnRate*dt,fuel);
        var thrustForce=thrust*burn/dt;
        var accel=thrustForce/mass-gravity;
        velocity+=accel*dt;
        fuel-=burn;
        mass-=burn;
      }else{
        velocity-=gravity*dt;
      }
      altitude+=velocity*dt/1000;
      if(altitude>maxAlt)maxAlt=altitude;
      if(altitude<0)altitude=0;
      if(altitude>=100){
        engine.println('REACHED ORBIT at '+t.toFixed(0)+' seconds!');
        break;
      }
      t+=dt;
      await new Promise(function(r){setTimeout(r,100);});
    }
    if(altitude<100)engine.println('Failed to reach orbit. Max altitude: '+maxAlt.toFixed(2)+'km');
    engine.end();
  };
})();
