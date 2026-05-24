(function(){
  var slug='wekday';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Weekday');
    engine.setInstructions('Enter a date and I\'ll tell you what day of the week it was or will be.');
    var dayNames=['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'];

    function zeller(q,m,y){
      if(m<3){m+=12;y--;}
      var K=y%100;
      var J=Math.floor(y/100);
      var h=(q+Math.floor(13*(m+1)/5)+K+Math.floor(K/4)+Math.floor(J/4)-2*J)%7;
      return ((h%7)+7)%7;
    }

    var again=true;
    while(again){
      engine.clear();
      var month=parseInt(await engine.input('Month (1-12): '));
      if(isNaN(month)||month<1||month>12){engine.println('Invalid month.');continue;}
      var day=parseInt(await engine.input('Day (1-31): '));
      if(isNaN(day)||day<1||day>31){engine.println('Invalid day.');continue;}
      var year=parseInt(await engine.input('Year (4-digit): '));
      if(isNaN(year)||year<1000||year>9999){engine.println('Invalid year.');continue;}
      var m=month,d=day,y=year;
      var idx=zeller(d,m,y);
      engine.println('');
      engine.println(month+'/'+day+'/'+year+' is a '+dayNames[idx]+'!');
      var resp=(await engine.input('Another date? (y/n): ')).trim().toLowerCase();
      if(resp!=='y'&&resp!=='yes') again=false;
    }
    engine.end();
  };
})();
