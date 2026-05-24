(function(){
  var slug='orbit';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Orbit');
    engine.setInstructions('Destroy an enemy satellite. Satellite orbits at known altitude. Set interceptor angle (0-360) and thrust. Satellite moves in circular orbit, interceptor in straight line. Intercept the path!');

    var orbitRadius = RNG.int(200, 500);
    var satSpeed = RNG.int(2, 5);
    var satAngle = RNG.int(0, 360);
    var time = 0;
    var maxTime = 50;
    var hit = false;

    engine.clear();
    engine.println('ORBIT');
    engine.println('Enemy satellite at altitude ' + orbitRadius + 'km, speed ' + satSpeed + ' deg/turn');
    engine.println('');

    var angInp = await engine.input('Interceptor launch angle (0-360 degrees): ');
    var angle = parseFloat(angInp);
    if (isNaN(angle) || angle < 0 || angle > 360) angle = 45;

    var thrInp = await engine.input('Interceptor thrust (1-10): ');
    var thrust = parseInt(thrInp, 10);
    if (isNaN(thrust) || thrust < 1 || thrust > 10) thrust = 5;

    var interceptorSpeed = thrust * 10;
    var interceptorAngleRad = angle * Math.PI / 180;

    engine.println('');
    engine.println('Launching interceptor at angle ' + angle + ' deg, thrust ' + thrust);
    engine.println('');

    for (var t = 1; t <= maxTime; t++) {
      satAngle = (satAngle + satSpeed) % 360;
      var satRad = satAngle * Math.PI / 180;
      var satX = Math.round(orbitRadius * Math.cos(satRad));
      var satY = Math.round(orbitRadius * Math.sin(satRad));

      var dist = interceptorSpeed * t;
      var intX = Math.round(dist * Math.cos(interceptorAngleRad));
      var intY = Math.round(dist * Math.sin(interceptorAngleRad));

      var dx = intX - satX;
      var dy = intY - satY;
      var sep = Math.round(Math.sqrt(dx * dx + dy * dy));

      engine.println('Time ' + t + ': Sat (' + satX + ',' + satY + ')  Int (' + intX + ',' + intY + ')  Separation: ' + sep + 'km');

      if (sep <= 15) {
        engine.println('');
        engine.println('*** DIRECT HIT! Satellite destroyed at time ' + t + '! ***');
        hit = true;
        break;
      }
    }

    if (!hit) {
      engine.println('');
      engine.println('Interceptor missed. Satellite continues orbiting.');
      engine.println('Target speed: ' + satSpeed + ' deg/turn, radius: ' + orbitRadius + 'km');
    }
    engine.end();
  };
})();
