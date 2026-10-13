function line(points){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke()}
function rect(x,y,w,h){ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h)}
function arch(x,y,w,h){ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x,y+w/2);ctx.arc(x+w/2,y+w/2,w/2,Math.PI,0);ctx.lineTo(x+w,y+h);ctx.stroke()}
function windows(x,y,n,w=13){for(let j=0;j<n;j++)arch(x+j*(w+10),y,w,26)}
function roof(x,y,w,h){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w/2,y-h);ctx.lineTo(x+w,y);ctx.closePath();ctx.fill();ctx.stroke()}
function landmark(kind,x,y,scale=1){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.strokeStyle='#514d44';ctx.fillStyle='#faf9f5';ctx.lineWidth=2;ctx.lineJoin='round';
 if(kind==='eiffel'){line([[-66,0],[-32,-85],[-8,-190],[0,-229],[8,-190],[32,-85],[66,0]]);line([[-48,-40],[48,-40]]);line([[-34,-87],[34,-87]]);line([[-17,-146],[17,-146]]);arch(-26,-45,52,45);for(let i=0;i<5;i++){let yy=-70-i*24,ww=28-i*4;line([[-ww,yy],[ww-3,yy-24]]);line([[ww,yy],[-ww+3,yy-24]])}}
 else if(kind==='mill'){rect(-38,-82,76,82);roof(-43,-82,86,52);line([[0,-109],[0,-229]]);line([[-64,-169],[64,-169]]);for(let i=0;i<4;i++){ctx.save();ctx.translate(0,-169);ctx.rotate(i*Math.PI/2+.35);rect(6,-10,64,15);for(let j=20;j<68;j+=12)line([[j,-10],[j,5]]);ctx.restore()}arch(-10,-34,20,34)}
 else if(kind==='bridge'||kind==='venice'){if(kind==='bridge'){for(let i=-85;i<90;i+=25)line([[i,-35],[i,15]]);rect(-96,-73,192,37);roof(-106,-73,212,28);for(let i=-85;i<90;i+=25)line([[i,-68],[i,-40]]);rect(40,-146,42,76);roof(35,-146,52,40)}else{ctx.beginPath();ctx.arc(0,16,91,Math.PI,0);ctx.stroke();ctx.beginPath();ctx.arc(0,25,65,Math.PI,0);ctx.stroke();line([[-105,-3],[105,-3]]);for(let i=-70;i<=70;i+=18){let yy=16-Math.sqrt(91*91-i*i);line([[i,yy],[i,yy+18]])}} 
 } else if(kind==='arena'){ctx.beginPath();ctx.ellipse(0,-40,94,27,0,0,2*Math.PI);ctx.fill();ctx.stroke();line([[-94,-40],[-94,0],[94,0],[94,-40]]);windows(-77,-29,7,11);ctx.beginPath();ctx.ellipse(0,-40,66,14,0,0,2*Math.PI);ctx.stroke()}
 else if(kind==='castle'||kind==='duomo'||kind==='guild'||kind==='palace'||kind==='domes'){let towers=kind==='duomo'?7:3;rect(-82,-65,164,65);for(let i=0;i<towers;i++){let xx=towers===7?-87+i*27:-72+i*57,hh=towers===7?100+Math.sin(i/6*Math.PI)*55:105+(i===1?57:0);rect(xx,-hh,25,hh);roof(xx-4,-hh,33,30);arch(xx+8,-hh+20,10,21)}windows(-55,-35,5,10);if(kind==='domes'){for(let i=-1;i<=1;i++){ctx.beginPath();ctx.arc(i*51,-82,28,Math.PI,0);ctx.stroke()}}}
 else if(kind==='home'){rect(-63,-70,126,70);roof(-83,-70,166,69);rect(25,-117,20,48);arch(-13,-42,26,42);rect(-44,-53,20,20);rect(25,-53,20,20);ctx.font='28px Georgia';ctx.fillStyle='#514d44';ctx.fillText('♡',-14,-91)}
 else if(kind==='lake'){line([[-105,0],[-75,-40],[-42,-8],[-7,-74],[34,-16],[69,-50],[110,0]]);rect(-22,-38,52,38);roof(-30,-38,68,26)}
 else{for(let i=-1;i<=1;i++){let xx=i*57-24,hh=78+(i===0?22:0);rect(xx,-hh,48,hh);roof(xx-6,-hh,60,kind==='alps'?20:35);windows(xx+9,-hh+17,2,8);if(kind==='timber'){line([[xx,-hh],[xx+48,0]]);line([[xx+48,-hh],[xx,0]])}if(kind==='canal'||kind==='harbour'){line([[xx,-hh-6],[xx+48,-hh-6]])}}if(kind==='alps'){rect(-20,-79,41,17);roof(-25,-79,51,14);for(let i=-18;i<20;i+=6)line([[i,-88],[i+4,-79]])}}
 ctx.restore()}

// Small original pixel character: light hair, light sweater, dark trousers, suitcase.
function pixelIra(x,y,flying){
 const pixels=[
 '       HHHHHH       ',
 '     HHHHHHHHH      ',
 '    HHHLLLLLHHH     ',
 '    HHLLLLLLLHH     ',
 '   HHLSSSSSSLLH     ',
 '   HHLSSSSKSSSH     ',
 '   HHLSSSSSSSS      ',
 '   HHLSSSSSSSK      ',
 '    HLLSSSSSS       ',
 '    HHHHSSSS        ',
 '   HHHLWWWWW        ',
 '  HHHWWWWWWWW       ',
 '  HHWWWGWWWWWW      ',
 '   HGWWGWWWWWWW     ',
 '    GWWGWWWWWWSS    ',
 '    GSSGWWWWWW S    ',
 '     S WWWWWWW      ',
 '     S DDDDDDD      ',
 '    KK DDDDDDD      ',
 '   KGGKDDDDDDD      ',
 '   KGGLDDD DDD      ',
 '   KGGLDD  DDD      ',
 '   KGGLDD   DD      ',
 '   KGGLDD   DDD     ',
 '   KGGKWW    WW     ',
 '    KK WWW    WWW   ',
 '       KKK    KKK   '
 ];
 const colors={H:'#77736b',L:'#ddd7c9',S:'#eee9dc',K:'#252421',W:'#fffdf7',G:'#a29d91',D:'#46443e'};
 ctx.save();ctx.translate(Math.round(x-40),Math.round(y-108));
 if(flying)ctx.rotate(-.06);const unit=4;
 pixels.forEach((row,yy)=>[...row].forEach((c,xx)=>{if(colors[c]){ctx.fillStyle=colors[c];ctx.fillRect(xx*unit,yy*unit,unit,unit)}}));ctx.restore();
}

