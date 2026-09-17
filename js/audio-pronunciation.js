(() => {
"use strict";
const player=document.getElementById("pronunciationPlayer");
const status=document.getElementById("audioStatus");
const buttons=[...document.querySelectorAll(".audio-icon-button[data-audio-src]")];
if(!player||!buttons.length)return;

let activeButton=null;

const setStatus=m=>{if(status)status.textContent=m||"";};

const resetButtons=()=>{
buttons.forEach(b=>{
b.classList.remove("playing");
b.setAttribute("aria-pressed","false");
});
activeButton=null;
};

const stopPlayer=()=>{
player.pause();
try{player.currentTime=0;}catch(_){}
};

const playButton=button=>{
const src=button.dataset.audioSrc||"";
const label=button.dataset.audioLabel||"izgovor";
if(!src)return;

if(activeButton===button&&!player.paused){
stopPlayer();
resetButtons();
setStatus("Reprodukcija je zaustavljena.");
return;
}

stopPlayer();
resetButtons();
player.src=src;

const p=player.play();

if(p&&typeof p.then==="function"){
p.then(()=>{
activeButton=button;
button.classList.add("playing");
button.setAttribute("aria-pressed","true");
setStatus("Reproducira se "+label+".");
}).catch(()=>{
resetButtons();
setStatus("Zvuk se nije mogao pokrenuti. Pokušajte ponovno.");
});
}else{
activeButton=button;
button.classList.add("playing");
button.setAttribute("aria-pressed","true");
setStatus("Reproducira se "+label+".");
}
};

buttons.forEach(b=>b.addEventListener("click",()=>playButton(b)));

player.addEventListener("ended",()=>{
resetButtons();
setStatus("");
});

player.addEventListener("error",()=>{
resetButtons();
setStatus("Zvuk se nije mogao učitati. Pokušajte ponovno.");
});
})();
