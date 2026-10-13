'use strict';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d');
const route=STOPS,keys={left:false,right:false,jump:false};
let index=0,mode='intro',time=0,last=0,frame=0,player,platforms=[],ground=null,items=[],dogs=[],particles=[],visited={},score={},assist=false,falls=0,boatWave=0,ride=0,bridgeSteps=new Set(),goalNudge=false;
const heldPointers={left:new Set(),right:new Set(),jump:new Set()};
function clearInput(){keys.left=keys.right=keys.jump=false;for(const key of Object.keys(heldPointers)){heldPointers[key].clear();$(key).classList.remove('held')}}
try{const s=JSON.parse(localStorage.getItem('irochka-short-journey-v1'));if(s&&Number.isInteger(s.index)){index=Math.max(0,Math.min(s.index,5));visited=s.visited||{};score=s.score||{};if(index)$('start').textContent='Continue our little journey →'}}catch{}
function save(){try{localStorage.setItem('irochka-short-journey-v1',JSON.stringify({index,visited,score}))}catch{}}
function message(s){$('hint').textContent=s}
function platform(x,y,w,type='solid',extra={}){return {x,y,w,type,bx:x,by:y,dx:0,dy:0,crack:0,hidden:0,...extra}}
function setup(){mode='gate';clearInput();window.ticketGate(index,setupUnlocked)}
function setupUnlocked(){
 time=0;assist=false;falls=0;boatWave=0;ride=0;bridgeSteps=new Set();goalNudge=false;ground=null;particles=[];dogs=[];player={x:42,y:420,vx:0,vy:0,jumps:0,face:1};
 items=[{x:350,y:323,taken:false}];
 if(index===0)platforms=[platform(0,430,130),...Array.from({length:5},(_,i)=>platform(155+i*90,410-i*12,70,'crumble')),platform(620,350,100)];
 if(index===1){platforms=[platform(0,430,170),platform(230,425,124,'lift'),platform(495,215,225)];items=[{x:286,y:154,taken:false}]}
 if(index===2){platforms=[platform(0,430,135),platform(170,390,100,'boat',{phase:0}),platform(345,330,100,'boat',{phase:2}),platform(515,265,92,'wheel',{phase:0}),platform(515,265,92,'wheel',{phase:Math.PI}),platform(622,225,98)];items=[{x:500,y:170,taken:false}]}
 if(index===3){platforms=[platform(0,430,160),platform(170,310,135,'cable'),platform(595,255,125)];items=[{x:420,y:205,taken:false}]}
 if(index===4){platforms=[];player={x:150,y:405,vx:0,vy:0,jumps:0,face:1};items=[{x:165,y:70,taken:false},{x:545,y:-120,taken:false},{x:330,y:-310,taken:false}]}
 if(index===5){platforms=[platform(0,430,720)];items=[];dogs=[{x:270,y:430,phase:0,caught:false},{x:510,y:430,phase:2.2,caught:false}]}
 mode='play';$('lock').hidden=true;$('intro').hidden=true;$('finish').hidden=true;$('play').hidden=false;$('controls').hidden=false;$('landed').hidden=true;
 $('chapter-label').textContent=`MEMORY ${index+1} / 6 · ${route[index].date}`;$('city-title').textContent=route[index].name;$('city-caption').textContent=route[index].caption;$('mechanic').textContent=route[index].mechanic;$('pause').textContent='Pause';$('jump').textContent=index===4?'Hop the waves ↑':index===3?'Jump / hold to float ↑':'Jump ↑';message(route[index].hint);hud();renderRoute();save();window.scrollTo(0,0);
}
function mechanicReady(){return assist||index===0&&bridgeSteps.size>=2||index===1&&ride>=.8||index===2&&ride>=.65||index===3&&ride>=1.1||index>=4}
function hud(){const n=index===5?dogs.filter(d=>d.caught).length:items.filter(i=>i.taken).length,total=index===5?2:items.length;$('hearts').textContent=index===5?`${n} / 2 fluffy hugs`:index===4?`${n} / 3 love letters`:n?(mechanicReady()?'♥ Safely packed':(index===0?'♥ Two bridge planks':'♥ Now catch a ride')):'♡ One little heart'}
function renderRoute(){$('route').innerHTML=route.map((s,i)=>`<li class="${visited[i]?'done':''} ${i===index?'current':''}">${visited[i]?'✓ ':''}${s.name}</li>`).join('')}
$('start').onclick=()=>{setup();last=0;cancelAnimationFrame(frame);frame=requestAnimationFrame(tick)};
function jump(){if(mode!=='play')return;if(index===4){if(player.y>=404)player.vy=-340;return}if(player.jumps>=2)return;player.vy=player.jumps===0?-510:-460;player.jumps++;ground=null;burst(player.x,player.y,5)}
function bindHold(id,key){const b=$(id),held=heldPointers[key];b.addEventListener('pointerdown',e=>{e.preventDefault();if(mode!=='play')return;held.add(e.pointerId);keys[key]=true;b.classList.add('held');b.setPointerCapture(e.pointerId);if(key==='jump')jump()});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,e=>{held.delete(e.pointerId);keys[key]=held.size>0;b.classList.toggle('held',keys[key])})}
bindHold('left','left');bindHold('right','right');bindHold('jump','jump');
window.addEventListener('keydown',e=>{if($('play').hidden)return;if(['ArrowLeft','ArrowRight','ArrowUp','Space','KeyA','KeyD','KeyW','KeyP','Escape'].includes(e.code))e.preventDefault();if(['ArrowLeft','KeyA'].includes(e.code))keys.left=true;if(['ArrowRight','KeyD'].includes(e.code))keys.right=true;if(['ArrowUp','Space','KeyW'].includes(e.code)){keys.jump=true;if(!e.repeat)jump()}if(!e.repeat&&['KeyP','Escape'].includes(e.code))pause()});
window.addEventListener('keyup',e=>{if(['ArrowLeft','KeyA'].includes(e.code))keys.left=false;if(['ArrowRight','KeyD'].includes(e.code))keys.right=false;if(['ArrowUp','Space','KeyW'].includes(e.code))keys.jump=false});
function pause(){if(mode==='play'){mode='paused';clearInput();$('pause').textContent='Resume'}else if(mode==='paused'){mode='play';$('pause').textContent='Pause'}}
$('pause').onclick=pause;function suspend(){clearInput();if(mode==='play')pause()}window.addEventListener('blur',suspend);window.addEventListener('pagehide',suspend);document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend()});
$('gentle').onclick=()=>{if(mode!=='play')return;assist=true;items.forEach(i=>i.taken=true);dogs.forEach(d=>d.caught=true);hud();message('I have packed the keepsake and made you a little path. Come to the right, love.');if(index===4)complete()};
function burst(x,y,n){for(let i=0;i<n;i++)particles.push({x,y,vx:Math.cos(i*2.4)*55,vy:-35-Math.sin(i*2.4)*50,life:.6})}
function reset(){falls++;player={x:42,y:420,vx:0,vy:0,jumps:0,face:1};ground=null;platforms.forEach(p=>{p.hidden=0;p.crack=0});message(falls>1?'I can make you a little path. Tap “Sasha, give me a hand”.':'Caught you. Your keepsake is safe. Another little try? ♡')}
function complete(){if(mode!=='play')return;mode='landed';visited[index]=true;score[index]=true;save();clearInput();$('controls').hidden=true;$('landed').hidden=false;$('memory').textContent=route[index].memory;$('next').textContent=index===5?'Open your welcome-home letter ♡':'Pack this memory. Next stop →';renderRoute();$('next').focus({preventScroll:true});burst(player.x,player.y-35,16)}
$('next').onclick=()=>{if(index===5){finish();return}index++;save();setup()};
function finish(){mode='finished';$('play').hidden=true;$('finish').hidden=false;$('memory-book').innerHTML=route.map(s=>`<article class="memory-card"><span>${s.date} · ♥ SAFELY PACKED</span><h3>${s.name}</h3><p>${s.memory}</p></article>`).join('');window.scrollTo(0,0)}
function restartWithRiddles(){index=0;score={};visited={};clearInput();save();$('finish').hidden=true;$('intro').hidden=true;$('play').hidden=true;$('start').textContent='Let’s take the scenic way home →';mode='gate';window.resetTicketPuzzles()}
$('replay').onclick=restartWithRiddles;$('restart-riddles').onclick=restartWithRiddles;
function update(dt){
 time+=dt;particles=particles.filter(p=>p.life>0);for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt}
 if(index===4){updateGondola(dt);return}
 for(const p of platforms){const ox=p.x,oy=p.y;if(p.type==='lift')p.y=310+115*Math.cos(time*1.15);if(p.type==='boat'){p.x=p.bx+Math.sin(time*1.3+p.phase)*45;p.y=p.by+Math.sin(time*2+p.phase)*9}if(p.type==='wheel'){p.x=510+Math.cos(time*.85+p.phase)*78;p.y=280+Math.sin(time*.85+p.phase)*85}if(p.type==='cable'){const t=(1-Math.cos(time*.65))/2;p.x=155+t*365;p.y=325-t*100}p.dx=p.x-ox;p.dy=p.y-oy;if(p.hidden>0){p.hidden-=dt;p.crack=0}}
 if(ground&&!ground.hidden){player.x+=ground.dx;player.y+=ground.dy}
 const previousY=player.y;player.vx=((keys.right?1:0)-(keys.left?1:0))*290;if(player.vx)player.face=Math.sign(player.vx);player.x=Math.max(18,Math.min(702,player.x+player.vx*dt));player.vy+=1150*dt;if(index===3&&keys.jump&&player.vy>70)player.vy=70;player.y+=player.vy*dt;ground=null;
 for(const p of platforms){if(p.hidden>0)continue;if(player.vy>=0&&previousY<=p.y+Math.max(5,p.dy)&&player.y>=p.y&&player.x+11>p.x&&player.x-11<p.x+p.w){player.y=p.y;player.vy=0;player.jumps=0;ground=p;break}}
 for(const p of platforms){if(p===ground&&p.type==='crumble'&&!assist){p.crack+=dt;if(p.crack>.62){p.hidden=2.2;ground=null}}else if(!p.hidden)p.crack=Math.max(0,p.crack-dt)}
 if(ground){if(index===0&&ground.type==='crumble')bridgeSteps.add(platforms.indexOf(ground));if((index===1&&ground.type==='lift')||(index===2&&ground.type==='wheel')||(index===3&&ground.type==='cable'))ride+=dt;hud()}
 if(assist){const floor=430-player.x*.27;if(player.y>=floor&&player.vy>=0){player.y=floor;player.vy=0;player.jumps=0}}
 for(const item of items)if(!item.taken&&Math.hypot(player.x-item.x,player.y-28-item.y)<42){item.taken=true;burst(item.x,item.y,12);hud();message(mechanicReady()?'One little memory, safely packed. Your letter is just ahead. ♡':'Heart found! Now enjoy the little ride before my letter. ♡')}
 for(const d of dogs){if(!d.caught){d.x=(d.phase?500:260)+Math.sin(time*1.7+d.phase)*72;if(Math.abs(player.x-d.x)<35&&player.y>370){d.caught=true;burst(d.x,390,12);hud()}}else d.x+=(player.x-(d.phase?48:83)-d.x)*Math.min(1,dt*4)}
 if(player.y>560)reset();const ready=(index===5?dogs.every(d=>d.caught):items.every(i=>i.taken))&&mechanicReady();if(player.x>645&&!ready&&!goalNudge){goalNudge=true;message(items.some(i=>!i.taken)?'One little heart is still waiting for you. ♡':index===0?'Try two of the wooden bridge planks before coming home.':index<4?'There is one little ride still waiting. Hop onto the moving platform.':'Two fluffy inspectors need their hugs first.')} if(player.x>660&&player.y<(index===0?380:index===1?245:index===2?255:index===3?290:450)&&ready)complete();
}
function updateGondola(dt){
 player.x=Math.max(70,Math.min(650,player.x+((keys.right?1:0)-(keys.left?1:0))*320*dt));player.vy+=1050*dt;player.y=Math.min(405,player.y+player.vy*dt);if(player.y===405)player.vy=0;
 for(const item of items){if(item.taken)continue;item.y+=82*dt;if(Math.abs(player.x-item.x)<54&&Math.abs(player.y-22-item.y)<53){item.taken=true;burst(item.x,item.y,12);hud()}else if(item.y>470)item.y=-120}
 boatWave+=dt;if(boatWave>3.2){boatWave=0;if(player.y>390){player.x=Math.max(70,Math.min(650,player.x+28));message('A little ripple! Hop over the next one, or simply steer back.')}}
 if(items.every(i=>i.taken))complete();
}
function draw(){
 ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,720,500);drawBackdrop(route[index].landmark,time);
 if(index!==4){
 if(assist){ctx.strokeStyle='#777';ctx.setLineDash([6,4]);line([[0,430],[720,235]]);ctx.setLineDash([])}
 for(const p of platforms){if(p.hidden>0)continue;ctx.fillStyle=p.type==='crumble'?'#777':'#444';ctx.strokeStyle='#111';ctx.lineWidth=2;rect(p.x,p.y,p.w,12);
 if(p.type==='crumble'){for(let x=p.x+7;x<p.x+p.w;x+=13){ctx.strokeStyle=p.crack?'#fff':'#222';line([[x,p.y+1],[x+3,p.y+10]])}}
 if(p.type==='lift'){ctx.fillStyle='#eee';for(let x=p.x+5;x<p.x+p.w;x+=17)ctx.fillRect(x,p.y+2,7,7);ctx.strokeStyle='#555';line([[p.x+8,p.y],[p.x+8,70],[p.x+p.w-8,70],[p.x+p.w-8,p.y]])}
 if(p.type==='boat'){ctx.fillStyle='#222';ctx.beginPath();ctx.moveTo(p.x-8,p.y+9);ctx.lineTo(p.x+12,p.y+28);ctx.lineTo(p.x+p.w-12,p.y+28);ctx.lineTo(p.x+p.w+8,p.y+9);ctx.closePath();ctx.fill()}
 if(p.type==='cable'){ctx.fillStyle='#eee';ctx.strokeStyle='#222';rect(p.x+10,p.y-60,p.w-20,60);rect(p.x+20,p.y-51,p.w-40,28);line([[p.x+p.w/2,p.y-60],[p.x+p.w/2,p.y-95]]);ctx.font='12px monospace';ctx.fillStyle='#111';ctx.fillText('IRA EXPRESS',p.x+22,p.y-7)}
 }
 const goalY=[310,175,185,215,0,357][index];ctx.fillStyle='#fff';ctx.strokeStyle='#111';ctx.lineWidth=2;rect(656,goalY,40,27);line([[656,goalY],[676,goalY+15],[696,goalY]]);
 }
 for(const item of items){if(item.taken)continue;const y=item.y+(index===4?0:Math.sin(time*3)*4);ctx.fillStyle='#fff';ctx.strokeStyle='#111';ctx.lineWidth=2;
 if(index===4){rect(item.x-17,y-12,34,24);line([[item.x-17,y-12],[item.x,y+1],[item.x+17,y-12]])}else{ctx.font='bold 31px Georgia';ctx.strokeText('♥',item.x-13,y+10);ctx.fillStyle='#111';ctx.fillText('♥',item.x-13,y+10)}}
 if(index===4){ctx.save();ctx.translate(player.x,player.y);ctx.fillStyle='#111';ctx.beginPath();ctx.moveTo(-58,0);ctx.quadraticCurveTo(0,38,58,0);ctx.lineTo(42,20);ctx.quadraticCurveTo(0,43,-43,20);ctx.closePath();ctx.fill();ctx.strokeStyle='#111';ctx.lineWidth=4;line([[38,-4],[58,33]]);ctx.scale(.48,.48);pixelIra(0,0,false);ctx.restore();ctx.strokeStyle='#777';ctx.lineWidth=3;const wy=360+(boatWave/3.2)*70;for(let x=35;x<720;x+=130){line([[x,wy],[x+15,wy-5],[x+30,wy],[x+45,wy-5]])}}
 else{for(const d of dogs)drawDog(d.x,d.y,d.phase>0,d.caught);ctx.save();ctx.translate(player.x,player.y);ctx.scale(player.face*.5,.5);pixelIra(0,0,!ground);ctx.restore()}
 for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/.6);ctx.fillStyle='#444';ctx.fillRect(p.x-2,p.y-2,4,4)}ctx.globalAlpha=1;
 if(mode==='paused'){ctx.fillStyle='#ffffffe6';ctx.fillRect(0,0,720,500);ctx.fillStyle='#222';ctx.font='bold 25px monospace';ctx.textAlign='center';ctx.fillText('A little breather. ♡',360,245);ctx.textAlign='left'}
}
function drawDog(x,y,eyva,caught){ctx.save();ctx.translate(x,y);ctx.fillStyle=eyva?'#a0a0a0':'#c0c0c0';ctx.fillRect(-23,-30,40,23);ctx.fillRect(12,-43,24,24);ctx.fillRect(13,-48,8,10);ctx.fillRect(31,-46,7,12);ctx.fillRect(-20,-8,7,8);ctx.fillRect(10,-8,7,8);ctx.fillRect(-32,-35+Math.sin(time*9)*5,12,21);ctx.fillStyle='#444';for(const [a,b,w,h]of[[-18,-29,8,7],[-4,-24,7,8],[15,-42,6,7],[30,-37,6,5]])ctx.fillRect(a,b,w,h);ctx.fillStyle='#fff';ctx.fillRect(22,-42,6,22);ctx.fillRect(1,-25,13,15);ctx.fillStyle='#ddd';ctx.fillRect(30,-36,4,4);if(caught){ctx.font='20px Georgia';ctx.fillStyle='#222';ctx.fillText('♥',-7,-51)}ctx.restore()}
function tick(t){const dt=last?Math.min((t-last)/1000,.033):0;last=t;if(mode==='play')update(dt);if(['play','paused','landed'].includes(mode))draw();frame=requestAnimationFrame(tick)}
