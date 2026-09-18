const state={cat:null,task:0,score:0,sound:true,animations:true};
const data={
 numbers:{title:"Zahlen",icon:"🔢",level:"Sehr leicht"},
 colors:{title:"Farben",icon:"🎨",level:"Sehr leicht"},
 shapes:{title:"Formen",icon:"🔷",level:"Sehr leicht"},
 halves:{title:"Bilder & Zuordnen",icon:"🧩",level:"Sehr leicht"},
 animals:{title:"Tiere",icon:"🐶",level:"Sehr leicht"},
 tracing:{title:"Nachspuren",icon:"✏️",level:"Sehr leicht"}
};
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function show(id){$$(".view").forEach(x=>x.classList.add("hidden"));$(id).classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"})}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function renderHome(){show("#home")}
function start(cat){
 state.cat=cat;state.task=0;state.score=0;
 $("#activityTitle").textContent=data[cat].title;$("#activityIcon").textContent=data[cat].icon;$("#levelLabel").textContent=data[cat].level;
 show("#activity");newTask();
}
function answer(btn,ok){
 $$(".option").forEach(b=>b.disabled=true);
 btn.classList.add(ok?"correct":"wrong");
 if(ok){state.score++;$("#feedback").textContent="🎉 Super! Das hast du geschafft!";beep(660)}
 else{$("#feedback").textContent="🙂 Versuch es noch einmal.";beep(220)}
 $("#nextBtn").classList.remove("hidden");
}
function newTask(){
 state.task++;$("#counter").textContent=`Aufgabe ${state.task}`;
 $("#feedback").textContent="";$("#nextBtn").classList.add("hidden");
 const area=$("#taskArea"), cat=state.cat; area.innerHTML="";
 if(cat==="numbers") numberTask(area);
 if(cat==="colors") colorTask(area);
 if(cat==="shapes") shapeTask(area);
 if(cat==="halves") halvesTask(area);
 if(cat==="animals") animalTask(area);
 if(cat==="tracing") tracingTask(area);
}
function numberTask(area){
 const n=Math.floor(Math.random()*10), vals=shuffle([n,(n+1)%10,(n+2)%10]);
 $("#instruction").textContent=`Finde die Zahl ${n}.`;
 area.innerHTML=`<div class="options">${vals.map(v=>`<button class="option">${v}</button>`).join("")}</div>`;
 $$(".option").forEach(b=>b.onclick=()=>answer(b,+b.textContent===n));
}
function colorTask(area){
 const items=[["rot","red"],["blau","blueDot"],["gelb","yellowDot"],["grün","greenDot"],["lila","purpleDot"]];
 const pick=items[Math.floor(Math.random()*items.length)], vals=shuffle(items);
 $("#instruction").textContent=`Finde ${pick[0]}.`;
 area.innerHTML=`<div class="options">${vals.map(x=>`<button class="option"><span class="color-dot ${x[1]}"></span></button>`).join("")}</div>`;
 $$(".option").forEach((b,i)=>b.onclick=()=>answer(b,vals[i][0]===pick[0]));
}
function shapeTask(area){
 const items=[["Kreis","circle"],["Quadrat","square"],["Dreieck","triangle"]],pick=items[Math.floor(Math.random()*3)],vals=shuffle(items);
 $("#instruction").textContent=`Finde den ${pick[0]}.`;
 area.innerHTML=`<div class="options">${vals.map(x=>`<button class="option"><span class="shape ${x[1]}"></span></button>`).join("")}</div>`;
 $$(".option").forEach((b,i)=>b.onclick=()=>answer(b,vals[i][0]===pick[0]));
}
const pictures=["🚚","🏠","🏍️","🍎","🦁","🐭","🚗","🚌","✈️","🍌","🌳","🐶","🐱","🐰"];
function halvesTask(area){
 const p=pictures[Math.floor(Math.random()*pictures.length)], vals=shuffle([p,...shuffle(pictures.filter(x=>x!==p)).slice(0,2)]);
 $("#instruction").textContent="Finde die passende Bildhälfte.";
 area.innerHTML=`<div class="match-row"><div class="half">${p}</div><div class="small-options options">${vals.map(x=>`<button class="option">${x}</button>`).join("")}</div></div>`;
 $$(".option").forEach(b=>b.onclick=()=>answer(b,b.textContent===p));
}
function animalTask(area){
 const animals=[["Hund","🐶"],["Katze","🐱"],["Maus","🐭"],["Löwe","🦁"],["Hase","🐰"],["Frosch","🐸"]];
 const pick=animals[Math.floor(Math.random()*animals.length)],vals=shuffle(animals);
 $("#instruction").textContent=`Finde den ${pick[0]}.`;
 area.innerHTML=`<div class="options">${vals.map(x=>`<button class="option animal">${x[1]}</button>`).join("")}</div>`;
 $$(".option").forEach((b,i)=>b.onclick=()=>answer(b,vals[i][0]===pick[0]));
}
function tracingTask(area){
 const n=Math.floor(Math.random()*10);
 $("#instruction").textContent=`Fahre die Zahl ${n} mit dem Finger oder der Maus nach.`;
 area.innerHTML=`<div class="trace-wrap"><div class="trace-num" aria-label="Zahl zum Nachspuren">${n}</div></div><div class="options trace-options"><button class="option" id="traceDone">✓ Geschafft</button></div>`;
 $("#traceDone").onclick=()=>{state.score++;$("#feedback").textContent="⭐ Toll nachgespurt!";$("#nextBtn").classList.remove("hidden");beep(660)};
}
function beep(freq){if(!state.sound)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.connect(g);g.connect(c.destination);g.gain.value=.035;o.start();o.stop(c.currentTime+.08)}catch(e){}}
$$(".category").forEach(b=>b.onclick=()=>start(b.dataset.cat));
$("#backBtn").onclick=renderHome;$("#continueBtn").onclick=()=>start(["numbers","colors","shapes","halves","animals","tracing"][Math.floor(Math.random()*6)]);
$("#nextBtn").onclick=newTask;
$("#settingsBtn").onclick=()=>show("#settings");$("#settingsBack").onclick=renderHome;
$("#soundToggle").onchange=e=>state.sound=e.target.checked;
$("#animToggle").onchange=e=>{state.animations=e.target.checked;document.body.classList.toggle("noanim",!state.animations)};
$("#resetBtn").onclick=()=>{state.score=0;state.task=0;alert("Der Fortschritt wurde zurückgesetzt.")};
