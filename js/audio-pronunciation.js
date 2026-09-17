(() => {
"use strict";
const player=document.getElementById("pronunciationPlayer");
const status=document.getElementById("audioStatus");
const buttons=[...document.querySelectorAll(".audio-icon-button[data-audio-src]")];
if(!player||!buttons.length)return;

let activeButton=null,requestId=0;
const warmed=new Set();
const setStatus=m=>{if(status)status.textContent=m||"";};
const resetButtons=()=>{buttons.forEach(b=>{b.classList.remove("playing");b.setAttribute("aria-pressed","false");});activeButton=null;};
const resetPlayer=()=>{player.pause();try{player.currentTime=0;}catch(_){}};
const markPlaying=(b,l)=>{activeButton=b;b.classList.add("playing");b.setAttribute("aria-pressed","true");setStatus("Reproducira se "+l+".");};
const delay=ms=>new Promise(r=>setTimeout(r,ms));

async function realPlay(button,label,id){
if(id!==requestId)return;
resetPlayer();player.muted=false;player.volume=1;
await delay(120);
if(id!==requestId)return;
try{
player.currentTime=0;
await player.play();
if(id===requestId)markPlaying(button,label);
}catch(_){
resetButtons();
setStatus("Zvuk se nije mogao pokrenuti. Pokušajte ponovno.");
}}

async function warmUp(button,label,id,src){
try{
setStatus("Priprema zvuka...");
player.src=src;player.preload="auto";player.muted=true;player.volume=0;
player.load();

await new Promise((resolve,reject)=>{
if(player.readyState>=3)return resolve();
const ready=()=>{cleanup();resolve();};
const fail=()=>{cleanup();reject();};
const cleanup=()=>{player.removeEventListener("canplay",ready);player.removeEventListener("error",fail);};
player.addEventListener("canplay",ready,{once:true});
player.addEventListener("error",fail,{once:true});
});

if(id!==requestId)return;
player.currentTime=0;
await player.play();
await delay(350);
if(id!==requestId)return;

player.pause();
player.currentTime=0;
player.muted=false;
player.volume=1;
warmed.add(src);

await delay(180);
await realPlay(button,label,id);

}catch(_){
player.muted=false;player.volume=1;
resetButtons();
setStatus("Zvuk se nije mogao pokrenuti. Pokušajte ponovno.");
}}

async function playButton(button){
const src=button.dataset.audioSrc||"";
const label=button.dataset.audioLabel||"izgovor";
if(!src)return;

if(activeButton===button&&!player.paused){
requestId++;
resetPlayer();resetButtons();
setStatus("Reprodukcija je zaustavljena.");
return;
}

const id=++requestId;
resetPlayer();resetButtons();
const absoluteSrc=new URL(src,document.baseURI).href;

if(player.currentSrc!==absoluteSrc){
player.src=absoluteSrc;
player.preload="auto";
player.load();
}

if(warmed.has(absoluteSrc)){
setStatus("Priprema zvuka...");
await realPlay(button,label,id);
}else{
await warmUp(button,label,id,absoluteSrc);
}}

buttons.forEach(b=>b.addEventListener("click",()=>playButton(b)));

player.addEventListener("ended",()=>{
resetButtons();
setStatus("");
});

player.addEventListener("error",()=>{
player.muted=false;
player.volume=1;
resetButtons();
setStatus("Zvuk se nije mogao učitati. Pokušajte ponovno.");
});
})();
