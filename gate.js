(()=>{
const el=id=>document.getElementById(id);
el('unlock-form').addEventListener('submit',event=>{
 event.preventDefault();
 const code=el('secret-code').value.normalize('NFKC').replace(/\s/g,'').toUpperCase();
 if(code==='LOVE'){
  el('lock').hidden=true;el('intro').hidden=false;
  el('start').textContent='Boarding approved. Let’s go! →';el('start').focus({preventScroll:true});window.scrollTo(0,0);
 }else{
  el('lock-feedback').textContent=code?'The welcome crew says: nearly! Try the first letters. ♡':'Four little letters are missing. Take your time. ♡';
  el('secret-code').focus();
 }
});
el('code-hint').onclick=()=>el('hint-copy').hidden=false;
el('lost-ticket').onclick=()=>el('paper-copy').hidden=false;
})();
