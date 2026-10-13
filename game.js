'use strict';
const $=s=>document.getElementById(s),canvas=$('game'),ctx=canvas.getContext('2d');
const route=STOPS.filter(s=>s.optional!=='hague'),keys={left:false,right:false};
let index=0,mode='intro',frame=0,last=0,time=0,camera=0,platforms=[],hearts=[],secret=null,particles=[],player,checkpoint,assist=false,ground=null,visited={},score={},toast=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const themes={lake:'boat',bridge:'crumble',timber:'crumble',eiffel:'lift',guild:'bounce',canal:'boat',harbour:'boat',mill:'wind',castle:'bounce',alps:'wind',arena:'crumble',venice:'boat',domes:'lift',duomo:'roof',home:'bounce'};
const tips={roof:'Collect 3 hearts, then find my letter. You can jump twice!',boat:'The boats move! Ride one, then leap to the next roof.',crumble:'Striped rooftops wobble and fall. Keep those little feet moving!',lift:'The little lifts go up and down. Catch a ride.',bounce:'Spring platforms give you a BIG hop. Try the high star!',wind:'Watch the wind. It nudges you in the air. You have a second jump!'};
let theme='roof';
try{const s=JSON.parse(localStorage.getItem('irochka-platformer-v2'));if(s&&Number.isInteger(s.index)){index=Math.max(0,Math.min(s.index,route.length-1));visited=s.visited||{};score=s.score||{};if(index)$('start').textContent='Continue the adventure →'}}catch{}
function save(){try{localStorage.setItem('irochka-platformer-v2',JSON.stringify({index,visited,score}))}catch{}}
function message(s){$('hint').textContent=s;toast=4}
function setup(){theme=themes[route[index].landmark]||'roof';time=0;camera=0;assist=false;ground=null;particles=[];toast=0;
 const ys=[470,416,350,408,330,394,470],xs=[0,190,365,540,715,900,1080];
 platforms=xs.map((x,i)=>({x,baseX:x,y:ys[i],baseY:ys[i],w:i===0?155:i===6?240:126,type:i===0||i===6?'solid':theme==='boat'&&i%2?'boat':theme==='lift'&&i%2?'lift':theme==='bounce'&&i===2?'bounce':theme==='crumble'&&i%2?'crumble':'solid',crack:0,hidden:0,dx:0,dy:0}));
 hearts=[1,3,5].map(i=>({platform:i,taken:false}));secret={x:778,y:173,taken:false};checkpoint={x:70,y:470};player={x:70,y:470,vx:0,vy:0,jumps:0,face:1};mode='play';keys.left=keys.right=false;
 $('intro').hidden=true;$('finish').hidden=true;$('play').hidden=false;$('controls').hidden=false;$('landed').hidden=true;
 $('chapter-label').textContent=`CHAPTER ${index+1} / ${route.length} · ${route[index].date}`;$('city-title').textContent=route[index].name;$('city-caption').textContent=route[index].caption;$('mechanic').textContent={roof:'Rooftop ramble',boat:'Catch a boat',lift:'Going up!',bounce:'Spring surprise',wind:'A little windy',crumble:'Wobbly rooftops'}[theme];$('pause').textContent='Pause';$('hint').textContent=tips[theme];hud();renderRoute();save();
}
function hud(){$('hearts').textContent=hearts.map(h=>h.taken?'♥':'♡').join(' ') + (secret?.taken?'  ★':'  ☆')}
function renderRoute(){$('route').innerHTML=route.map((s,i)=>`<li class="${visited[i]?'done':''} ${i===index?'current':''}">${visited[i]?'✓ ':''}${s.name}</li>`).join('')}
$('start').onclick=()=>{setup();last=0;cancelAnimationFrame(frame);frame=requestAnimationFrame(tick);window.scrollTo(0,0)};
function jump(){if(mode!=='play'||player.jumps>=2)return;player.vy=player.jumps===0?-530:-485;player.jumps++;ground=null;burst(player.x,player.y,7);}
function hold(id,key){const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();keys[key]=true;b.setPointerCapture(e.pointerId)});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys[key]=false)}
hold('left','left');hold('right','right');$('jump').addEventListener('pointerdown',e=>{e.preventDefault();jump()});
window.addEventListener('keydown',e=>{if($('play').hidden)return;if(['ArrowLeft','ArrowRight','ArrowUp','Space','KeyA','KeyD','KeyW','KeyP','Escape'].includes(e.code))e.preventDefault();if(['ArrowLeft','KeyA'].includes(e.code))keys.left=true;if(['ArrowRight','KeyD'].includes(e.code))keys.right=true;if(!e.repeat&&['ArrowUp','Space','KeyW'].includes(e.code))jump();if(!e.repeat&&['KeyP','Escape'].includes(e.code))pause()});
window.addEventListener('keyup',e=>{if(['ArrowLeft','KeyA'].includes(e.code))keys.left=false;if(['ArrowRight','KeyD'].includes(e.code))keys.right=false});
function pause(){if(mode==='play'){mode='paused';keys.left=keys.right=false;$('pause').textContent='Resume'}else if(mode==='paused'){mode='play';$('pause').textContent='Pause'}}
$('pause').onclick=pause;window.addEventListener('blur',()=>{keys.left=keys.right=false;if(mode==='play')pause()});
$('gentle').onclick=()=>{if(mode!=='play')return;assist=true;message('I’ve put a little bridge underneath you. Keep going, love.');};
function burst(x,y,n){for(let i=0;i<n;i++)particles.push({x,y,vx:Math.cos(i*2.4)*55,vy:-35-Math.sin(i*2.4)*50,life:.65})}
function reset(){player={x:checkpoint.x,y:checkpoint.y,vx:0,vy:0,jumps:0,face:1};ground=null;platforms.forEach(p=>{p.hidden=0;p.crack=0});message('Caught you. Your hearts are safe. Let’s try from here. ♡')}
function complete(){mode='landed';visited[index]=true;score[index]={hearts:3,star:secret.taken};save();keys.left=keys.right=false;$('controls').hidden=true;$('landed').hidden=false;$('memory').textContent=route[index].memory;$('next').textContent=index===route.length-1?'Open your welcome-home letter ♡':'Pack this memory. Next stop →';message(secret.taken?'Three hearts AND the secret star. Look at you!':'A little memory, safely packed.');renderRoute();$('next').focus({preventScroll:true})}
$('next').onclick=()=>{if(index===route.length-1){finish();return}index++;setup()};
function finish(){mode='finished';$('play').hidden=true;$('finish').hidden=false;$('memory-book').innerHTML=route.map((s,i)=>`<article class="memory-card"><span>${s.date} · ${score[i]?.star?'★ SECRET FOUND':'♥ ♥ ♥'}</span><h3>${s.name}</h3><p>${s.memory}</p></article>`).join('');window.scrollTo(0,0)}
$('replay').onclick=()=>{index=0;score={};visited={};save();$('finish').hidden=true;$('intro').hidden=false;$('start').textContent='One more adventure →';mode='intro'};
function update(dt){time+=dt;toast=Math.max(0,toast-dt);
 for(const p of platforms){let ox=p.x,oy=p.y;p.x=p.baseX+(p.type==='boat'?Math.sin(time*1.15+p.baseX)*30:0);p.y=p.baseY+(p.type==='lift'?Math.sin(time*1.3+p.baseX)*35:0);p.dx=p.x-ox;p.dy=p.y-oy;if(p.hidden>0){p.hidden-=dt;p.crack=0}}
 if(ground&&!ground.hidden){player.x+=ground.dx;player.y+=ground.dy}
 const previousY=player.y;player.vx=((keys.right?1:0)-(keys.left?1:0))*255;if(player.vx)player.face=Math.sign(player.vx);
 const wind=theme==='wind'&&!ground?Math.sin(time*.9)*65:0;player.x=Math.max(15,Math.min(1280,player.x+(player.vx+wind)*dt));player.vy+=1320*dt;player.y+=player.vy*dt;ground=null;
 for(const p of platforms){if(p.hidden>0)continue;if(player.vy>=0&&previousY<=p.y+Math.max(5,p.dy)&&player.y>=p.y&&player.x+13>p.x&&player.x-13<p.x+p.w){player.y=p.y;player.vy=0;player.jumps=0;ground=p;if(p.type==='bounce'){player.vy=-700;player.jumps=1;ground=null;burst(player.x,p.y,12)}if(p===platforms[3])checkpoint={x:p.x+64,y:p.y};break}}
 for(const p of platforms){if(p===ground&&p.type==='crumble'){p.crack+=dt;if(p.crack>.65){p.hidden=2.3;ground=null}}else if(!p.hidden)p.crack=Math.max(0,p.crack-dt)}
 if(assist&&player.y>=490&&player.vy>=0){player.y=490;player.vy=0;player.jumps=0}
 for(const h of hearts){const p=platforms[h.platform];if(!h.taken&&Math.hypot(player.x-(p.x+p.w/2),player.y-35-(p.y-42))<43){h.taken=true;burst(p.x+p.w/2,p.y-42,12);hud();save()}}
 if(!secret.taken&&Math.hypot(player.x-secret.x,player.y-35-secret.y)<40){secret.taken=true;burst(secret.x,secret.y,18);hud();message('Secret found! One extra cuddle has been added to your luggage.');}
 if(player.y>660)reset();
 if(player.x>1190&&player.y>390){if(hearts.every(h=>h.taken))complete();else if(!toast)message('My letter is waiting. Can you find the three little hearts first?')}
 camera=Math.max(0,Math.min(640,player.x-225));particles=particles.filter(p=>p.life>0);for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt}
}
function draw(){ctx.clearRect(0,0,720,500);ctx.fillStyle='#faf9f5';ctx.fillRect(0,0,720,500);ctx.imageSmoothingEnabled=false;
 ctx.save();ctx.translate(-camera*.25,0);ctx.strokeStyle='#ded9ce';ctx.lineWidth=1;
 for(let i=0;i<28;i++){let x=(i*139)%950,y=25+(i*43)%200;line([[x-3,y],[x+3,y]]);line([[x,y-3],[x,y+3]])}
 ctx.globalAlpha=.33;landmark(route[index].landmark,510,390,1.55);landmark(route[index].landmark,70,425,.65);ctx.globalAlpha=1;ctx.restore();
 ctx.save();ctx.translate(-camera,0);
 for(let i=0;i<35;i++){ctx.strokeStyle='#dcd7ca';const x=i*42;line([[x,493],[x+22,493]])}
 if(assist){ctx.strokeStyle='#918877';ctx.setLineDash([5,5]);line([[0,493],[1320,493]]);ctx.setLineDash([])}
 for(const p of platforms){if(p.hidden>0)continue;ctx.fillStyle=p.type==='bounce'?'#61594c':'#e1dbcf';ctx.strokeStyle='#61594c';ctx.lineWidth=2;rect(p.x,p.y,p.w,12);if(p.type==='boat'){line([[p.x-8,p.y+12],[p.x+9,p.y+29],[p.x+p.w-9,p.y+29],[p.x+p.w+8,p.y+12]]);line([[p.x+p.w-18,p.y],[p.x+p.w-18,p.y-32]])}else if(p.type==='crumble'){for(let x=p.x+7;x<p.x+p.w;x+=17)line([[x,p.y+1],[x-5,p.y+11]]);if(p.crack)line([[p.x+40,p.y],[p.x+50,p.y+8],[p.x+60,p.y+2],[p.x+70,p.y+12]])}else if(p.type==='bounce'){ctx.fillStyle='#fffdf8';ctx.font='bold 15px monospace';ctx.fillText('↑ ↑ ↑',p.x+33,p.y+11)}else if(p.type==='lift'){ctx.strokeStyle='#b7afa0';line([[p.x+8,p.y],[p.x+8,65]]);line([[p.x+p.w-8,p.y],[p.x+p.w-8,65]])}else{ctx.fillStyle='#eee9df';ctx.fillRect(p.x+4,p.y+14,p.w-8,600-p.y);ctx.fillStyle='#c7bfb0';for(let x=p.x+19;x<p.x+p.w-10;x+=26)ctx.fillRect(x,p.y+30,10,18)}}
 ctx.textAlign='center';ctx.font='27px Georgia';for(const h of hearts){if(h.taken)continue;const p=platforms[h.platform];ctx.fillStyle='#51493d';ctx.fillText('♥',p.x+p.w/2,p.y-34+Math.sin(time*3)*3)}
 if(!secret.taken){ctx.fillStyle='#51493d';ctx.font='31px Georgia';ctx.fillText('☆',secret.x,secret.y+10+(reduced?0:Math.sin(time*2)*4))}
 ctx.fillStyle='#51493d';ctx.font='34px Georgia';ctx.fillText('✉',1220,427);ctx.font='12px monospace';ctx.fillText('FOR YOU',1220,445);
 if(index===route.length-1){dog(1150,470,false);dog(1260,470,true)}
 ctx.save();ctx.translate(player.x,player.y);ctx.scale(player.face*.68,.68);pixelIra(0,0,!ground);ctx.restore();
 for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/.65);ctx.fillStyle='#827661';ctx.fillRect(p.x-2,p.y-2,4,4)}ctx.globalAlpha=1;ctx.restore();
 if(theme==='wind'){ctx.fillStyle='#827967';ctx.font='15px monospace';ctx.textAlign='right';ctx.fillText(Math.sin(time*.9)>0?'WIND →':'← WIND',695,28)}
 if(mode==='paused'){ctx.fillStyle='#faf9f5dc';ctx.fillRect(0,0,720,500);ctx.fillStyle='#51493d';ctx.font='30px Georgia';ctx.textAlign='center';ctx.fillText('A little breather. ♡',360,220);ctx.font='16px Georgia';ctx.fillText('Tap Resume when you’re ready.',360,253)}
 ctx.textAlign='left';}
function dog(x,y,dark){ctx.fillStyle=dark?'#403c36':'#a9a08f';ctx.fillRect(x-17,y-23,30,17);ctx.fillRect(x+8,y-34,16,18);ctx.fillRect(x+9,y-39,6,8);ctx.fillRect(x+21,y-36,5,9);ctx.fillRect(x-15,y-8,6,8);ctx.fillRect(x+5,y-8,6,8);ctx.fillRect(x-23,y-30+(Math.floor(time*6)%2)*4,9,15);ctx.fillStyle='#faf9f5';ctx.fillRect(x+15,y-32,5,18);ctx.fillRect(x-2,y-20,12,9)}
function tick(t){const dt=last?Math.min((t-last)/1000,.033):0;last=t;if(mode==='play')update(dt);if(['play','paused','landed'].includes(mode))draw();frame=requestAnimationFrame(tick)}
