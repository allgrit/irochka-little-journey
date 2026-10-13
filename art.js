function line(points){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke()}
function rect(x,y,w,h){ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h)}
function poly(points,fill='#ddd'){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.stroke()}
function label(s,x,y){ctx.fillStyle='#fff';const w=s.length*7.3+20;ctx.fillRect(x-8,y-15,w,22);ctx.fillStyle='#444';ctx.font='12px monospace';ctx.fillText(s,x,y)}
function windows(x,y,cols,rows,dx=20,dy=26){ctx.fillStyle='#777';for(let j=0;j<rows;j++)for(let i=0;i<cols;i++)ctx.fillRect(x+i*dx,y+j*dy,8,13)}
function arch(x,y,w,h){ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x,y+w/2);ctx.arc(x+w/2,y+w/2,w/2,Math.PI,0);ctx.lineTo(x+w,y+h);ctx.stroke()}
function drawBackdrop(kind,t){
 ctx.save();ctx.fillStyle='#fff';ctx.fillRect(0,0,720,500);ctx.lineWidth=2;ctx.strokeStyle='#ccc';
 for(let i=0;i<12;i++){let x=27+i*63,y=25+(i%4)*22;line([[x-3,y],[x+3,y]]);line([[x,y-3],[x,y+3]])}
 if(kind==='bridge'){
  ctx.strokeStyle='#aaa';poly([[0,210],[90,115],[160,195],[270,82],[400,217],[490,139],[620,219],[720,129],[720,370],[0,370]],'#eee');
  ctx.fillStyle='#eee';ctx.fillRect(0,365,720,135);ctx.strokeStyle='#666';
  // Lucerne's octagonal water tower with its steep tiled roof.
  poly([[475,182],[505,161],[553,161],[580,182],[580,355],[475,355]],'#ccc');poly([[465,182],[529,79],[590,182]],'#555');
  line([[505,180],[505,353]]);line([[553,180],[553,353]]);windows(492,219,3,3,26,37);
  // Long diagonal covered timber bridge, visibly spanning the water.
  poly([[15,325],[410,242],[470,274],[58,365]],'#bbb');poly([[4,323],[407,228],[482,265],[71,354]],'#555');
  ctx.fillStyle='#fff';for(let x=48;x<441;x+=38){let y=342-(x-48)*.217;ctx.fillRect(x,y,6,49);ctx.strokeStyle='#888';line([[x,y+49],[x+24,y+43]])}
  ctx.strokeStyle='#bbb';for(let x=0;x<720;x+=60)line([[x,463+(x%5)],[x+35,463+(x%5)]]);
  label('LUCERNE · CHAPEL BRIDGE',25,117);
 }else if(kind==='eiffel'){
  ctx.fillStyle='#eee';ctx.fillRect(0,427,720,73);ctx.strokeStyle='#aaa';for(let x=20;x<710;x+=48){ctx.fillStyle='#eee';rect(x,376-(x%3)*12,36,52);poly([[x-3,376-(x%3)*12],[x+18,361-(x%3)*12],[x+39,376-(x%3)*12]],'#ddd')}
  ctx.strokeStyle='#555';ctx.lineWidth=4;
  // Broad curved feet, three decks, lattice and antenna: Eiffel Tower.
  poly([[232,427],[283,315],[312,190],[337,68],[342,32],[348,68],[373,190],[402,315],[453,427],[407,427],[365,335],[320,335],[280,427]],'#e2e2e2');
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(343,431,64,Math.PI,0);ctx.fill();ctx.stroke();
  for(const [y,w]of[[323,116],[206,76],[122,34]]){ctx.fillStyle='#888';rect(343-w/2,y,w,10)}
  ctx.lineWidth=2;for(let k=0;k<7;k++){let y=306-k*28,w=47-k*5;line([[343-w,y],[343+w-5,y-25]]);line([[343+w,y],[343-w+5,y-25]])}
  label('PARIS · LA TOUR EIFFEL',438,57);
 }else if(kind==='mill'){
  ctx.fillStyle='#e9e9e9';ctx.fillRect(0,390,720,110);ctx.strokeStyle='#888';
  // Distinct narrow canal houses, stepped and bell gables.
  for(let i=0;i<4;i++){const x=26+i*77,top=215+(i%2)*30;ctx.fillStyle=i%2?'#ddd':'#bbb';rect(x,top,65,180);poly([[x-4,top],[x+4,top-14],[x+4,top-24],[x+17,top-24],[x+17,top-39],[x+30,top-39],[x+30,top-53],[x+43,top-39],[x+43,top-24],[x+58,top-24],[x+58,top-12],[x+69,top]],'#777');windows(x+12,top+17,2,5,27,30)}
  ctx.strokeStyle='#555';poly([[478,436],[498,307],[544,253],[588,308],[608,436]],'#bbb');poly([[487,310],[544,252],[597,310]],'#555');ctx.fillStyle='#eee';rect(509,369,64,67);windows(523,383,2,1,26,24);
  ctx.save();ctx.translate(556,280);ctx.rotate(t*.85);ctx.strokeStyle='#888';ctx.lineWidth=6;
  for(let k=0;k<4;k++){ctx.save();ctx.rotate(k*Math.PI/2);line([[0,0],[116,0]]);ctx.lineWidth=1;ctx.fillStyle='#ddd';rect(24,-19,93,25);for(let j=30;j<114;j+=12)line([[j,-19],[j,6]]);ctx.restore()}
  ctx.restore();ctx.fillStyle='#555';ctx.fillRect(550,274,12,12);
  label('AMSTERDAM + ZAANSE SCHANS',25,100);
 }else if(kind==='alps'){
  ctx.strokeStyle='#888';poly([[0,311],[143,57],[307,309],[465,32],[720,313],[720,455],[0,455]],'#bbb');poly([[65,187],[143,57],[221,186],[174,157],[139,189],[109,154]],'#fff');poly([[369,156],[465,32],[562,154],[509,126],[467,174],[416,127]],'#fff');
  ctx.strokeStyle='#aaa';poly([[0,355],[294,162],[506,355],[665,231],[720,361],[720,455],[0,455]],'#e8e8e8');
  // Golden Roof: projecting bay and tiled canopy below the Nordkette.
  ctx.strokeStyle='#666';ctx.fillStyle='#ddd';rect(38,316,127,116);poly([[29,316],[101,267],[174,316]],'#777');windows(52,333,4,3,27,26);ctx.fillStyle='#bbb';rect(60,353,83,41);poly([[53,353],[68,338],[136,338],[152,353]],'#777');for(let x=68;x<137;x+=10)line([[x,338],[x+8,353]]);
  ctx.strokeStyle='#555';ctx.lineWidth=2;line([[155,230],[570,112]]);line([[155,230],[155,433]]);line([[570,112],[570,289]]);
  label('INNSBRUCK · NORDKETTE',24,34);
 }else if(kind==='venice'){
  ctx.fillStyle='#eee';ctx.fillRect(0,294,720,206);ctx.strokeStyle='#bbb';for(let i=0;i<28;i++){const x=(i*83+t*14)%780-40,y=315+(i%7)*25;line([[x,y],[x+35,y]])}
  ctx.strokeStyle='#666';ctx.fillStyle='#ddd';rect(21,178,151,150);windows(36,198,5,3,27,32);poly([[14,178],[92,151],[179,178]],'#888');
  // San Marco's slender campanile, belfry and pyramidal spire.
  ctx.fillStyle='#c7c7c7';rect(587,106,47,213);ctx.fillStyle='#eee';rect(579,71,63,48);windows(586,83,3,1,17,22);poly([[574,73],[610,24],[646,73]],'#555');ctx.strokeStyle='#aaa';for(let y=127;y<290;y+=30)line([[592,y],[630,y]]);
  // Rialto: single high arch, central portico and stepped shop rows.
  ctx.strokeStyle='#555';ctx.lineWidth=3;poly([[145,306],[215,245],[334,195],[451,242],[526,306]],'#ccc');
  ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(204,308);ctx.bezierCurveTo(253,225,410,225,468,308);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#eee';rect(304,178,61,46);poly([[295,178],[334,153],[374,178]],'#999');arch(319,187,30,34);for(let x=186;x<285;x+=24)arch(x,278-(x-186)*.43,15,19);for(let x=382;x<488;x+=24)arch(x,224+(x-382)*.46,15,19);
  label('VENEZIA · RIALTO + SAN MARCO',23,65);
 }else{
  ctx.fillStyle='#eee';ctx.fillRect(0,430,720,70);ctx.strokeStyle='#555';ctx.lineWidth=3;ctx.fillStyle='#e5e5e5';rect(441,208,251,222);poly([[417,208],[568,86],[710,208]],'#777');ctx.fillStyle='#bbb';rect(629,96,29,78);ctx.fillStyle='#fff';rect(466,251,53,64);rect(596,251,53,64);line([[492,251],[492,315]]);line([[466,281],[519,281]]);line([[622,251],[622,315]]);line([[596,281],[649,281]]);ctx.fillStyle='#777';rect(538,320,58,110);ctx.fillStyle='#fff';ctx.fillRect(583,376,5,5);ctx.font='42px Georgia';ctx.fillStyle='#fff';ctx.fillText('♥',547,215);
  label('HOME · YOUR HUG IS READY',29,55);
  // Sasha waits by the door, with his familiar planet jumper.
  ctx.fillStyle='#333';ctx.fillRect(615,337,22,23);ctx.fillStyle='#eee';ctx.fillRect(620,344,15,17);ctx.fillStyle='#666';ctx.fillRect(608,361,35,42);ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(625,380,9,5,-.3,0,Math.PI*2);ctx.strokeStyle='#fff';ctx.stroke();ctx.fillStyle='#333';ctx.fillRect(610,403,11,27);ctx.fillRect(631,403,11,27);
 }
 ctx.restore();
}
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
 const colors={H:'#777',L:'#ddd',S:'#eee',K:'#222',W:'#fff',G:'#aaa',D:'#444'};
 ctx.save();ctx.translate(Math.round(x-40),Math.round(y-108));
 if(flying)ctx.rotate(-.06);const unit=4;
 pixels.forEach((row,yy)=>[...row].forEach((c,xx)=>{if(colors[c]){ctx.fillStyle=colors[c];ctx.fillRect(xx*unit,yy*unit,unit,unit)}}));ctx.restore();
}

