(function(){
  var slug='calndr';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Calendar');
    engine.setInstructions('Enter a month and year to display a calendar.');

    function zeller(q,m,y){
      if(m<3){m+=12;y--;}
      var K=y%100;
      var J=Math.floor(y/100);
      var h=(q+Math.floor(13*(m+1)/5)+K+Math.floor(K/4)+Math.floor(J/4)-2*J)%7;
      return ((h%7)+7)%7;
    }

    function daysInMonth(m,y){
      return new Date(y,m,0).getDate();
    }

    var again=true;
    while(again){
      engine.clear();
      var month=parseInt(await engine.input('Month (1-12): '));
      if(isNaN(month)||month<1||month>12){engine.println('Invalid.');continue;}
      var year=parseInt(await engine.input('Year (4-digit): '));
      if(isNaN(year)||year<1000||year>9999){engine.println('Invalid.');continue;}

      var monthNames=['','January','February','March','April','May','June','July','August','September','October','November','December'];
      var days=daysInMonth(month,year);
      var firstDay=zeller(1,month,year);
      engine.println('');
      engine.println(monthNames[month]+' '+year);
      engine.println('Su Mo Tu We Th Fr Sa');
      var row='';
      for(var i=0;i<firstDay;i++) row+='   ';
      for(var d=1;d<=days;d++){
        row+=(d<10?' ':'')+d+' ';
        if((firstDay+d)%7===0||d===days){
          engine.println(row);
          row='';
        }
      }
      var resp=(await engine.input('Another month? (y/n): ')).trim().toLowerCase();
      if(resp!=='y'&&resp!=='yes') again=false;
    }
    engine.end();
  };
})();
