(()=>{
const el=id=>document.getElementById(id);
const puzzles=[
 {code:'LOVE',title:'Almost home, Irochka.',label:'01 / THE LETTER',copy:'Four lines in your letter. Four first steps. One word.',hint:'Read the first letter of each of the four lines, from top to bottom.',paper:'Look how far your little feet have been.\nOne more adventure waits beyond this gate.\nVery soon, I’ll hold you close again.\nEvery road feels warmer with you.'},
 {code:'12',title:'Paw inspection!',label:'02 / THE WELCOME CREW',copy:'Our two fluffy inspectors left prints all over your ticket. How many pawprints can you find?',hint:'Count every pawprint on the whole open sheet, including the two large stamps under our portraits. Noses and stars do not count.',paper:'There are ten small pawprints scattered over the sheet and two large paw stamps underneath our portraits.'},
 {code:'HOME',title:'One last little clue.',label:'03 / OUR DESTINATION',copy:'Find the honey jar on your ticket. Take away a few letters, then add a little “me”. Where are we going?',hint:'Name the picture in English: HONEY. The three marks after it mean remove the last three letters. Then add ME.',paper:'A jar of honey, followed by three apostrophes, then + ME.'}
];
let current=0,after=()=>{el('intro').hidden=false;el('start').focus({preventScroll:true})};
const solved=new Set();
try{JSON.parse(localStorage.getItem('irochka-puzzles-v1')||'[]').forEach(x=>{if(Number.isInteger(x)&&x>=0&&x<3)solved.add(x)})}catch{}
function show(n,done){
 if(solved.has(n)){done();return}
 current=n;after=done;const p=puzzles[n];
 el('lock').hidden=false;el('intro').hidden=true;el('play').hidden=true;el('finish').hidden=true;
 el('lock-title').textContent=p.title;el('lock-label').textContent=p.label;el('lock-copy').textContent=p.copy;
 el('hint-copy').textContent=p.hint;el('hint-copy').hidden=true;el('paper-copy').textContent=p.paper;el('paper-copy').hidden=true;
 el('secret-code').value='';el('secret-code').placeholder=n===1?'?':'_ _ _ _';el('secret-code').inputMode=n===1?'numeric':'text';
 el('lock-feedback').textContent='Take your time, love. Your journey is saved.';window.scrollTo(0,0);
}
window.ticketGate=(stage,done)=>{
 const required=stage>=5?[0,1,2]:stage>=2?[0,1]:[0];
 const next=required.find(n=>!solved.has(n));if(next===undefined){done();return}show(next,()=>window.ticketGate(stage,done));
};
el('unlock-form').addEventListener('submit',event=>{
 event.preventDefault();const raw=el('secret-code').value.normalize('NFKC').replace(/\s/g,'').toUpperCase();
 const code=current===1&&/^\d+$/.test(raw)?String(Number(raw)):raw;
 if(code===puzzles[current].code){solved.add(current);try{localStorage.setItem('irochka-puzzles-v1',JSON.stringify([...solved]))}catch{}el('secret-code').blur();el('lock').hidden=true;after()}
 else{el('lock-feedback').textContent='Not quite yet. Try again, or ask me for a tiny hint. ♡';el('secret-code').focus()}
});
el('code-hint').onclick=()=>el('hint-copy').hidden=false;el('lost-ticket').onclick=()=>el('paper-copy').hidden=false;
show(0,()=>{el('lock').hidden=true;el('intro').hidden=false});
})();
