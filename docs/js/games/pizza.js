(function(){
  var slug='pizza';
  if(!window.GameImplementations) window.GameImplementations={};
  GameImplementations[slug]=async function(engine){
    engine.start('Pizza');
    engine.setInstructions('Pizza delivery! Navigate the 5x5 grid. Go to shop, pick up pizza, deliver to customer. N/S/E/W to move.');
    var places=[
      {name:'Pizza Shop',x:2,y:2,type:'shop'},
      {name:"Alice's House",x:0,y:0,type:'home'},
      {name:"Bob's House",x:4,y:0,type:'home'},
      {name:"Carol's House",x:0,y:4,type:'home'},
      {name:"Dave's House",x:4,y:4,type:'home'},
      {name:"Eve's House",x:2,y:0,type:'home'},
      {name:"Frank's House",x:0,y:2,type:'home'},
      {name:"Grace's House",x:4,y:2,type:'home'},
      {name:"Henry's House",x:2,y:4,type:'home'}
    ];
    var orders=[];
    for(var i=1;i<places.length;i++) orders.push(i);
    RNG.shuffle(orders);
    var px=2,py=2,score=0,time=5,delivered=0;
    var hasPizza=false,currentOrder=-1;

    function showMap(){
      engine.clear();
      for(var y=0;y<5;y++){
        var row='';
        for(var x=0;x<5;x++){
          var chr='.';
          if(x===px&&y===py) chr='@';
          else{
            for(var p=0;p<places.length;p++){
              if(places[p].x===x&&places[p].y===y){
                if(p===0) chr='S';
                else if(orders.indexOf(p)>-1&&orders.indexOf(p)>=delivered) chr='H';
              }
            }
          }
          row+=chr+' ';
        }
        engine.println(row);
      }
      engine.println('Time left: '+time+'min  Score: '+score);
      engine.println('Location: '+px+','+py);
    }

    while(time>0&&delivered<orders.length){
      showMap();
      var orderIdx=orders[delivered];
      engine.println('Deliver to: '+places[orderIdx].name);
      if(!hasPizza&&px===2&&py===2){
        hasPizza=true;
        currentOrder=orderIdx;
        engine.println('Picked up pizza!');
        await engine.input('Press Enter...');
        continue;
      }
      if(hasPizza&&px===places[orderIdx].x&&py===places[orderIdx].y){
        engine.println('Delivered to '+places[orderIdx].name+'!');
        hasPizza=false;
        delivered++;
        score+=10;
        time--;
        await engine.input('Press Enter...');
        continue;
      }
      var move=(await engine.input('Move (N/S/E/W): ')).trim().toUpperCase();
      if(move==='N'&&py>0){py--;time--;}
      else if(move==='S'&&py<4){py++;time--;}
      else if(move==='E'&&px<4){px++;time--;}
      else if(move==='W'&&px>0){px--;time--;}
      else engine.println('Can\'t go that way!');
    }
    engine.clear();
    engine.println('Game over! Deliveries: '+delivered+'/'+(orders.length));
    engine.println('Score: '+score);
    engine.end();
  };
})();
