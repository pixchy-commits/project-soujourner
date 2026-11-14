/* eslint-disable */
// @ts-nocheck
// PHASE 1: the original game logic, kept imperative on purpose so behaviour is identical.
// It only touches elements inside `root` and removes all its listeners in the returned function.
// Pure parts already live in src/lib/rover/*. Convert the rest to React piece by piece later.
import { LEVELS, levelProblems } from "@/lib/rover/levels";
import { DR, DC, blocked, atGoal, step, solve } from "@/lib/rover/solver";
import { drawTerrain, mulberry } from "@/lib/rover/terrain";
import type { RoverAssets } from "@/lib/rover/assets";

export type RoverOptions = {
  assets: RoverAssets;
  reducedMotion?: boolean;
  initialProgress?: Record<string, { stars: number; best: number }>;
  onProgress?: (progress: Record<string, { stars: number; best: number }>) => void;
  onComplete?: () => void;
};

export function createRoverEngine(root: HTMLElement, opts: RoverOptions): () => void {
  const cleanups: Array<() => void> = [];
  const on = (target: EventTarget, type: string, handler: any) => { target.addEventListener(type, handler); cleanups.push(() => target.removeEventListener(type, handler)); };
  let destroyed = false;

/* ================= Data & constants ================= */
const DNAME = ['NORTH','EAST','SOUTH','WEST'];
const $ = (s) => root.querySelector(s);
const ICON = {
  F:'<svg viewBox="0 0 40 40"><path d="M20 5 L33 19 H25 V35 H15 V19 H7 Z" fill="#fff" stroke="#1a2a55" stroke-width="2.5" stroke-linejoin="round"/></svg>',
  L:'<svg viewBox="0 0 40 40"><path d="M29 31 V20 A9 9 0 0 0 20 11 H15" fill="none" stroke="#1d0f3a" stroke-width="9" stroke-linecap="round"/><path d="M29 31 V20 A9 9 0 0 0 20 11 H15" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M17 3 L6 11 L17 19 Z" fill="#fff" stroke="#1d0f3a" stroke-width="2.5" stroke-linejoin="round"/></svg>',
  R:'<svg viewBox="0 0 40 40"><path d="M11 31 V20 A9 9 0 0 1 20 11 H25" fill="none" stroke="#1d0f3a" stroke-width="9" stroke-linecap="round"/><path d="M11 31 V20 A9 9 0 0 1 20 11 H25" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M23 3 L34 11 L23 19 Z" fill="#fff" stroke="#1d0f3a" stroke-width="2.5" stroke-linejoin="round"/></svg>'
};
const STAR = on => `<svg viewBox="0 0 24 24"><path d="M12 2.2l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17l-5.9 3.3 1.3-6.6L2.5 9.1l6.6-.8z" fill="${on?'#ffc93c':'rgba(58,28,18,.15)'}" stroke="#3a1c12" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
const MUSIC_ICON = on => `<svg viewBox="0 0 24 24" fill="none" stroke="#fbefd0" stroke-width="2.2" stroke-linecap="round"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5" fill="#fbefd0"/><circle cx="16.5" cy="16" r="2.5" fill="#fbefd0"/>${on?'':'<path d="M3 3l18 18" stroke="#fbefd0" stroke-width="2.4"/>'}</svg>`;

root.querySelectorAll('.cmd .ic').forEach(el=>el.innerHTML=ICON[el.parentElement.dataset.cmd]);
// PNG ASSETS — put your PNGs in an "assets" folder next to this HTML file.
// Use transparent PNGs for rocks, holes and rover. Leave a path empty for built-in artwork.
// The rover PNG must face UP (north); rotation is handled by the game.
// The terrain PNG should be a seamless, bird's-eye-view sand texture.
const ASSETS = Object.freeze({ ...opts.assets });

// Check optional images once and gracefully use the built-in art when absent.
const loadedAssets = Object.fromEntries(Object.keys(ASSETS).map(key => [key, false]));
const assetReady = Promise.all(Object.entries(ASSETS).map(([key, src]) => new Promise(resolve => {
  if (!src) return resolve();
  const image = new Image();
  image.onload = () => { loadedAssets[key] = true; resolve(); };
  image.onerror = () => resolve();
  image.src = src;
})));
function assetImage(key, className = "asset-image") {
  return loadedAssets[key] ? `<img class="${className}" src="${ASSETS[key]}" alt="" draggable="false">` : "";
}

if (levelProblems.length) { const d = $('#devNote'); d.textContent = 'Level check failed: ' + levelProblems.join(' · '); d.style.display = 'block'; console.error(levelProblems); }

/* ================= Persistence (best-effort) ================= */
const store = {
  get(k,def){ return k==='progress' ? (opts.initialProgress ?? def) : def; },
  set(k,v){ if(k==='progress') opts.onProgress?.(v); }
};
const settings = Object.assign({speed:'normal',sfx:'on',music:'off',grid:'soft'}, store.get('settings',{}));
let progress = store.get('progress',{}); // idx -> {stars,best}
let seenHowto = store.get('howto',false);

/* ================= Audio (synthesised, no files) ================= */
let AC=null, musicNodes=null;
function ac(){ if(!AC){ try{ AC=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } if(AC&&AC.state==='suspended') AC.resume(); return AC; }
function tone(f,dur,type='sine',vol=.12,when=0,f2){
  const a=ac(); if(!a) return; const t=a.currentTime+when, o=a.createOscillator(), g=a.createGain();
  o.type=type; o.frequency.setValueAtTime(f,t); if(f2) o.frequency.exponentialRampToValueAtTime(f2,t+dur);
  g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.015); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t+dur+.05);
}
function sfx(n,dur=.5){
  if(settings.sfx!=='on') return;
  const a=ac(); if(!a) return;
  if(n==='add') tone(660,.08,'triangle',.1);
  else if(n==='remove') tone(330,.09,'triangle',.08);
  else if(n==='deny') { tone(200,.12,'square',.05); tone(160,.14,'square',.05,.1); }
  else if(n==='turn') { tone(240,dur*.8,'square',.025,0,330); }
  else if(n==='move'){
    const t=a.currentTime, o=a.createOscillator(), f=a.createBiquadFilter(), g=a.createGain();
    o.type='sawtooth'; o.frequency.value=70; f.type='lowpass'; f.frequency.value=420;
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.06,t+.06); g.gain.setValueAtTime(.06,t+dur*.8); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(f).connect(g).connect(a.destination); o.start(t); o.stop(t+dur+.05);
  }
  else if(n==='bump'){ tone(140,.25,'sine',.25,0,45); tone(90,.18,'square',.04); }
  else if(n==='win'){ [523,659,784,1047].forEach((f,i)=>tone(f,.28,'triangle',.12,i*.11)); }
  else if(n==='fail'){ [392,330,262].forEach((f,i)=>tone(f,.22,'triangle',.08,i*.13)); }
  else if(n==='hint'){ tone(880,.12,'sine',.08); tone(1175,.16,'sine',.06,.08); }
  else if(n==='star'){ tone(1320,.15,'triangle',.08); }
}
function setMusic(on){
  settings.music=on?'on':'off'; store.set('settings',settings); paintMusic();
  const a=ac();
  if(on && a && !musicNodes){
    const master=a.createGain(); master.gain.value=0; master.connect(a.destination);
    master.gain.linearRampToValueAtTime(.05,a.currentTime+2);
    const lp=a.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=900; lp.connect(master);
    const oscs=[110,164.81,220.5,329.6].map((f,i)=>{ const o=a.createOscillator(); o.type=i%2?'triangle':'sine'; o.frequency.value=f; const g=a.createGain(); g.gain.value=i>1?.25:.5;
      const lfo=a.createOscillator(), lg=a.createGain(); lfo.frequency.value=.07+i*.05; lg.gain.value=.2; lfo.connect(lg).connect(g.gain); lfo.start();
      o.connect(g).connect(lp); o.start(); return [o,lfo]; });
    musicNodes={master,oscs};
  } else if(!on && musicNodes && a){
    const m=musicNodes; musicNodes=null; m.master.gain.cancelScheduledValues(a.currentTime); m.master.gain.setValueAtTime(m.master.gain.value,a.currentTime);
    m.master.gain.linearRampToValueAtTime(0,a.currentTime+.6); setTimeout(()=>m.oscs.flat().forEach(o=>{try{o.stop()}catch(e){}}),800);
  }
}
function paintMusic(){ const on=settings.music==='on'; $('#musicGame').innerHTML=MUSIC_ICON(on); }
paintMusic();

/* ================= Game state ================= */
const G = { L:null, program:[], running:false, runId:0, rover:null, rot:0, hint:0, S:64, chipState:{}, errIdx:-1 };
const speedK = () => ({slow:1.5,normal:1,fast:.55})[settings.speed]||1;
const sleep = ms => new Promise(r=>setTimeout(r,ms));
function tween(ms,fn){ return new Promise(res=>{ const t0=performance.now(); const f=now=>{ const t=Math.min(1,(now-t0)/ms); fn(t); if(t<1) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); }); }
const ease = t => t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

/* ================= Screens ================= */
function show(id){ root.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id)); if(id==='game') requestAnimationFrame(layoutBoard); }
function openOv(id){ $('#'+id).classList.add('on'); }
function closeOv(id){ $('#'+id).classList.remove('on'); }




$('#musicGame').onclick=()=>setMusic(settings.music!=='on');
$('#homeBtn').onclick=()=>startLevel(0);
$('#missionsBtn').onclick=()=>{ cancelRun(); renderReports(); show('reports'); };
$('#setBtn').onclick=openSettings;
$('#repBack').onclick=()=>startLevel(0);
$('#howtoGo').onclick=()=>{ closeOv('howto'); seenHowto=true; store.set('howto',true); };

/* ---- Settings ---- */
function openSettings(){ paintSettings(); openOv('settings'); }
function paintSettings(){ root.querySelectorAll('.seg').forEach(seg=>seg.querySelectorAll('button').forEach(b=>b.classList.toggle('on',settings[seg.dataset.set]===b.dataset.v))); }
root.querySelectorAll('.seg').forEach(seg=>seg.addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b) return; const k=seg.dataset.set;
  if(k==='music') setMusic(b.dataset.v==='on'); else { settings[k]=b.dataset.v; store.set('settings',settings); }
  if(k==='grid'&&G.L) drawGrid(); if(k==='sfx') sfx('add'); paintSettings();
}));
$('#setClose').onclick=$('#setDone').onclick=()=>closeOv('settings');
let eraseArm=false;
$('#resetProg').onclick=e=>{ if(!eraseArm){ eraseArm=true; e.target.textContent='Tap again to erase'; setTimeout(()=>{eraseArm=false;e.target.textContent='Erase stars';},3000); return; }
  progress={}; store.set('progress',progress); eraseArm=false; e.target.textContent='Erased ✓'; };

/* ---- Reports ---- */
function renderReports(){
  let total=0;
  $('#repList').innerHTML=LEVELS.map((L,i)=>{ const p=progress[i]; total+=p?p.stars:0;
    return `<div class="rep panel"><div class="sol">SOL<b>${L.sol}</b></div>
      <div><h3>${L.title}</h3><p>${p?`Reached ${L.featureName||L.targetName} · best program ${p.best} blocks (shortest: ${L.optimal})`:`${L.cols}×${L.rows} grid · up to ${L.maxBlocks} blocks · not attempted`}</p></div>
      <div class="st">${[1,2,3].map(n=>STAR(p&&p.stars>=n)).join('')}</div>
      <button class="ci-btn small" data-go="${i}">${p?'Replay':'Play'}</button></div>`; }).join('');
  $('#repTotal').textContent=`${total} / ${LEVELS.length*3} stars collected`;
  $('#repList').querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>startLevel(+b.dataset.go));
}

/* ================= Level start ================= */
function startLevel(i){
  cancelRun();
  const L=G.L=LEVELS[i];
  G.program=[]; G.hint=0; G.errIdx=-1; G.chipState={};
  G.rover={...L.start}; G.rot=L.start.d*90;
  $('#mSol').textContent='SOL '+L.sol;
  $('#mTitle').textContent=L.title;
  $('#mObj').innerHTML=`<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="none" stroke="#3a1c12" stroke-width="3.5"/><circle cx="20" cy="20" r="7" fill="none" stroke="#3fa9a3" stroke-width="3.5"/>${L.face>=0?`<path d="M20 1 L26 9 H14Z" fill="#ffd84d" stroke="#3a1c12" stroke-width="1.6" transform="rotate(${L.face*90} 20 20)"/>`:''}</svg><span>${L.objective}</span>`;
  $('#mBest').textContent=L.optimal;
  $('#gridSize').textContent=`${L.cols} × ${L.rows} · max ${L.maxBlocks} blocks`;
  show('game');
  layoutBoard();
  renderSeq(); renderHintDots();
  setFeedback('info', `<b>Tip:</b> ${L.tip}`);
  // Start immediately: no introduction overlay.
}

/* ================= Board rendering ================= */
function layoutBoard(){
  const L=G.L; if(!L||!$('#game').classList.contains('on')) return;
  const wrap=$('#mapWrap'), W=Math.max(0,wrap.clientWidth-28), H=Math.max(0,wrap.clientHeight-28);
  const S=G.S=Math.max(24,Math.min(180,Math.floor(Math.min(W/L.cols,H/L.rows))));
  const bw=L.cols*S, bh=L.rows*S, M=Math.round(S*.42);
  const board=$('#board'); board.style.width=bw+'px'; board.style.height=bh+'px';
  const dpr=Math.min(2,window.devicePixelRatio||1);
  const tc=$('#terrain'); tc.width=(bw+2*M)*dpr; tc.height=(bh+2*M)*dpr; Object.assign(tc.style,{left:-M+'px',top:-M+'px',width:bw+2*M+'px',height:bh+2*M+'px'});
  drawTerrain(tc,dpr,M,L);
  // A top-down PNG is drawn above the procedural terrain, but below the grid.
  // Using the canvas preserves the existing board dimensions and coordinate system.
  if (loadedAssets.background) drawTerrainImage(tc,dpr);
  const tr=$('#tracks'); tr.width=bw*dpr; tr.height=bh*dpr; tr.style.width=bw+'px'; tr.style.height=bh+'px';
  tr.getContext('2d').setTransform(dpr,0,0,dpr,0,0);
  drawGrid(); drawObjects(); buildRover(); placeRover(); drawCompass(); renderHintMarks();
}
let terrainImage = null;
function drawTerrainImage(cv,dpr) {
  if (!terrainImage) {
    terrainImage = new Image();
    terrainImage.onload = () => { if (G.L && !G.running) layoutBoard(); };
    terrainImage.src = ASSETS.background;
    return;
  }
  if (!terrainImage.complete || !terrainImage.naturalWidth) return;
  const ctx=cv.getContext('2d');
  ctx.save();
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.drawImage(terrainImage,0,0,cv.width/dpr,cv.height/dpr);
  ctx.restore();
}
function drawGrid(){
  const L=G.L,S=G.S,svg=$('#gridSvg'),bw=L.cols*S,bh=L.rows*S, bold=settings.grid==='bold';
  svg.setAttribute('width',bw); svg.setAttribute('height',bh); svg.setAttribute('viewBox',`0 0 ${bw} ${bh}`);
  const gap=Math.max(3,Math.min(8,S*.055));
  let cells='';
  for(let r=0;r<L.rows;r++) for(let c=0;c<L.cols;c++){
    cells+=`<rect x="${c*S+gap}" y="${r*S+gap}" width="${S-2*gap}" height="${S-2*gap}" rx="${Math.min(18,S*.17)}" fill="rgba(255,244,222,.045)" stroke="rgba(255,239,212,${bold?.92:.73})" stroke-width="${bold?2.8:2.1}"/>`;
  }
  svg.innerHTML=cells;
}
function rockSVG(rnd,id,big){
  const n=9, pts=[]; for(let i=0;i<n;i++){ const a=i/n*Math.PI*2+rnd()*.3, rr=(big?40:33)+rnd()*(big?7:9); pts.push([50+Math.cos(a)*rr, 52+Math.sin(a)*rr*.82]); }
  const path=pts.map((p,i)=>{ const q=pts[(i+1)%n], m=[(p[0]+q[0])/2,(p[1]+q[1])/2]; return (i?'':`M${((pts[n-1][0]+p[0])/2).toFixed(1)} ${((pts[n-1][1]+p[1])/2).toFixed(1)} `)+`Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`; }).join(' ')+'Z';
  const hx=40+rnd()*6, hy=40+rnd()*4;
  return `<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><radialGradient id="rg${id}" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="${big?'#b9775a':'#a5634a'}"/><stop offset=".55" stop-color="#6b3324"/><stop offset="1" stop-color="#3b1a10"/></radialGradient></defs>
    <ellipse cx="57" cy="66" rx="${big?44:38}" ry="${big?26:22}" fill="rgba(45,14,5,.45)"/>
    <path d="${path}" fill="url(#rg${id})" stroke="#2e140b" stroke-width="2.4"/>
    <ellipse cx="${hx}" cy="${hy}" rx="${big?16:12}" ry="${big?9:7}" fill="rgba(255,214,170,.28)" transform="rotate(-20 ${hx} ${hy})"/>
    <path d="M${50+rnd()*8} ${48+rnd()*6} l${8+rnd()*8} ${6+rnd()*6} m-4 -3 l${-3-rnd()*5} ${7+rnd()*5}" stroke="rgba(40,14,6,.55)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    ${big?'<circle cx="62" cy="40" r="3" fill="rgba(40,14,6,.4)"/><circle cx="34" cy="60" r="2.4" fill="rgba(40,14,6,.4)"/>':''}</svg>`;
}
function drawObjects(){
  const L=G.L,S=G.S, rnd=mulberry(L.seed); let h='';
  L.holes.forEach(key=>{ const [r,c]=key.split(',').map(Number);
    h+=`<div class="sinkhole ${loadedAssets.hole?'with-image':''}" data-k="${key}" style="left:${c*S+S*.08}px;top:${r*S+S*.08}px;width:${S*.84}px;height:${S*.84}px">${assetImage('hole') || '<span></span>'}</div>`;
  });
  L.rocks.forEach((t,key)=>{ const [r,c]=key.split(',').map(Number), big=t==='Y', sz=big?S*1.04:S*(.82+rnd()*.12);
    h+=`<div class="rock" data-k="${key}" style="left:${c*S+(S-sz)/2}px;top:${r*S+(S-sz)/2}px;width:${sz}px;height:${sz}px">${assetImage('rock') || rockSVG(rnd,key.replace(',','_'),big)}${big?`<div class="tag rockTag">${L.featureName}</div>`:''}</div>`; });
  const t=L.target;
  h+=`<div class="target" style="left:${t.c*S}px;top:${t.r*S}px;width:${S}px;height:${S}px"><div class="ring"></div><div class="ring r2"></div>
    ${L.face>=0?`<div class="faceArrow" style="transform:rotate(${L.face*90}deg)"><svg width="${S*.5}" height="${S*.5}" viewBox="0 0 20 20"><path d="M10 1 L17 10 H13 V18 H7 V10 H3Z" fill="#ffd84d" stroke="#3a1c12" stroke-width="1.6" stroke-linejoin="round" opacity=".9"/></svg></div>`:''}
    <div class="tag">⚑ ${L.targetName}</div></div>`;
  $('#objs').innerHTML=h;
}
function buildRover(){
  const S=G.S, el=$('#rover'); el.style.width=el.style.height=S+'px';
  if (loadedAssets.rover) {
    el.innerHTML=assetImage('rover','rover-image') + '<svg class="chev" viewBox="0 0 20 16"><path d="M10 1 L19 15 H1Z" fill="#ffd84d" stroke="#3a1c12" stroke-width="2"/></svg>';
    return;
  }
  const wheel=(x,y,side)=>`<g><rect x="${x}" y="${y}" width="13" height="19" rx="3.5" fill="#d9772b" stroke="#3a1c12" stroke-width="2"/>
    <clipPath id="wc${x}${y}"><rect x="${x+1}" y="${y+1}" width="11" height="17" rx="3"/></clipPath>
    <g clip-path="url(#wc${x}${y})"><g class="tread ${side}">${[-5,0,5,10,15,20].map(o=>`<rect x="${x}" y="${y+o}" width="13" height="2" fill="#8a3f14"/>`).join('')}</g></g>
    <rect x="${x+4.5}" y="${y+7}" width="4" height="5" rx="1" fill="#9aa3b5" stroke="#3a1c12" stroke-width="1"/></g>`;
  el.innerHTML=`<svg class="body" viewBox="0 0 100 100">
    <g stroke="#3a2622" stroke-width="3.5" stroke-linecap="round"><path d="M16 23 L24 34 L16 51 M16 51 L24 62 L16 79"/><path d="M84 23 L76 34 L84 51 M84 51 L76 62 L84 79"/></g>
    ${wheel(4,14,'L')}${wheel(4,42,'L')}${wheel(4,70,'L')}${wheel(83,14,'R')}${wheel(83,42,'R')}${wheel(83,70,'R')}
    <rect x="23" y="20" width="54" height="64" rx="6" fill="#eadbb8" stroke="#3a1c12" stroke-width="2.5"/>
    <rect x="20" y="25" width="60" height="48" rx="3" fill="#8c2f1c" stroke="#3a1c12" stroke-width="2.2"/>
    <g stroke="rgba(255,205,170,.38)" stroke-width="1">${[30,40,50,60,70].map(x=>`<line x1="${x}" y1="26" x2="${x}" y2="72"/>`).join('')}${[34,43,52,61,70].map(y=>`<line x1="21" y1="${y}" x2="79" y2="${y}"/>`).join('')}</g>
    <rect x="22" y="74" width="10" height="4" fill="#4fb3ad"/><rect x="68" y="74" width="10" height="4" fill="#4fb3ad"/><rect x="45" y="21" width="10" height="3" fill="#4fb3ad"/>
    <rect x="33" y="11" width="34" height="10" rx="3" fill="#2f3a5c" stroke="#3a1c12" stroke-width="2"/>
    <circle cx="42" cy="16" r="3" fill="#9fd3e0"/><circle cx="58" cy="16" r="3" fill="#9fd3e0"/>
    <line x1="30" y1="80" x2="22" y2="90" stroke="#3a1c12" stroke-width="2.5"/><circle cx="21" cy="91" r="4" fill="#efe2c4" stroke="#3a1c12" stroke-width="2"/>
  </svg><svg class="chev" viewBox="0 0 20 16"><path d="M10 1 L19 15 H1Z" fill="#ffd84d" stroke="#3a1c12" stroke-width="2" stroke-linejoin="round"/></svg>`;
}
function placeRover(x,y){ // x,y in cell units (fractional during animation)
  const S=G.S; if(x===undefined){ x=G.rover.c; y=G.rover.r; }
  $('#rover').style.transform=`translate(${x*S}px,${y*S}px) rotate(${G.rot}deg)`;
  updateFacing();
}
function drawCompass(){
  $('#compass').innerHTML=`<circle cx="50" cy="50" r="46" fill="#fff8e6" stroke="#3a1c12" stroke-width="3"/><circle cx="50" cy="50" r="36" fill="none" stroke="rgba(58,28,18,.2)" stroke-width="2" stroke-dasharray="3 4"/>
    <g font-family="Oswald" font-weight="700" font-size="13" fill="#3a1c12" text-anchor="middle"><text x="50" y="17">N</text><text x="88" y="55">E</text><text x="50" y="94">S</text><text x="12" y="55">W</text></g>
    <g id="needle"><path d="M50 22 L62 52 H38Z" fill="#ffd84d" stroke="#3a1c12" stroke-width="2.4" stroke-linejoin="round"/><circle cx="50" cy="56" r="10" fill="#3a1c12"/><circle cx="50" cy="56" r="4" fill="#fbefd0"/></g>`;
  updateFacing();
}
function updateFacing(){
  const n=$('#needle'); if(n) n.setAttribute('transform',`rotate(${G.rot} 50 50)`);
  const d=((Math.round(G.rot/90)%4)+4)%4; $('#facingTxt').textContent=DNAME[d]; const faceLabel=$('#rvFacingDisplay'); if(faceLabel) faceLabel.textContent=['up','right','down','left'][d];
}

/* ================= Program editing ================= */
function renderSeq(){
  const L=G.L, seq=$('#seq'); if(!L) return;
  seq.classList.toggle('locked',G.running);
  let h=''; for(let i=0;i<L.maxBlocks;i++){
    const c=G.program[i], st=G.chipState[i]||'';
    h+=`<div class="slot" data-i="${i}">${c?`<div class="chip ${c} ${st} ${G.errIdx===i?'error':''}" draggable="${!G.running}" data-i="${i}" title="${({F:'Move Forward',L:'Rotate Left',R:'Rotate Right'})[c]}">
      <span class="n">${i+1}</span>${ICON[c]}
      <button class="x" data-act="del" aria-label="Remove block ${i+1}">✕</button>
      ${i>0?`<button class="mv l" data-act="left" aria-label="Move block earlier">‹</button>`:''}${i<G.program.length-1?`<button class="mv r" data-act="right" aria-label="Move block later">›</button>`:''}
    </div>`:i+1}</div>`; }
  seq.innerHTML=h;
  const n=G.program.length, full=n>=L.maxBlocks;
  $('#countTxt').textContent=`${n} / ${L.maxBlocks}`; $('#mBlocks').textContent=`${n}/${L.maxBlocks}`;
  const bf=$('#barFill'); bf.style.width=(n/L.maxBlocks*100)+'%'; bf.classList.toggle('full',full);
  root.querySelectorAll('.cmd').forEach(b=>b.setAttribute('aria-disabled',String(G.running||full)));
  $('#runBtn').disabled=G.running; $('#runBtn').textContent=G.running?'Running…':'▶ Run';
  $('#clearBtn').disabled=G.running||!n;
}
function edited(){ G.errIdx=-1; G.chipState={}; clearFx(); if(G.L) resetRover(); renderSeq(); }
function addCmd(c,at){
  if(G.running) return;
  if(G.program.length>=G.L.maxBlocks){ sfx('deny'); const ct=$('#counter'); ct.classList.remove('shake'); void ct.offsetWidth; ct.classList.add('shake');
    setFeedback('warn','No blocks left! Can you find a shorter solution?'); return; }
  if(at===undefined||at>G.program.length) at=G.program.length;
  G.program.splice(at,0,c); sfx('add'); edited();
}
function delCmd(i){ if(G.running) return; G.program.splice(i,1); sfx('remove'); edited(); }
function moveCmd(from,to){ if(G.running||from===to) return; to=Math.max(0,Math.min(G.program.length-1,to)); const [c]=G.program.splice(from,1); G.program.splice(to,0,c); sfx('add'); edited(); }
$('#palette').addEventListener('click',e=>{ const b=e.target.closest('.cmd'); if(b){ ac(); addCmd(b.dataset.cmd); } });
$('#seq').addEventListener('click',e=>{ const b=e.target.closest('[data-act]'); if(!b) return; const i=+b.closest('.chip').dataset.i;
  if(b.dataset.act==='del') delCmd(i); else moveCmd(i, i+(b.dataset.act==='left'?-1:1)); });
// drag & drop (palette → slot inserts; chip → slot reorders)
on(document,'dragstart',e=>{ if(G.running){ e.preventDefault(); return; }
  const p=e.target.closest&&e.target.closest('.cmd'), ch=e.target.closest&&e.target.closest('.chip');
  if(p) e.dataTransfer.setData('text/plain','new:'+p.dataset.cmd); else if(ch) e.dataTransfer.setData('text/plain','move:'+ch.dataset.i); });
$('#seq').addEventListener('dragover',e=>{ const s=e.target.closest('.slot'); if(!s) return; e.preventDefault(); root.querySelectorAll('.slot.over').forEach(x=>x.classList.remove('over')); s.classList.add('over'); });
$('#seq').addEventListener('dragleave',e=>{ const s=e.target.closest('.slot'); if(s) s.classList.remove('over'); });
$('#seq').addEventListener('drop',e=>{ const s=e.target.closest('.slot'); if(!s) return; e.preventDefault(); s.classList.remove('over');
  const d=e.dataTransfer.getData('text/plain'), i=+s.dataset.i;
  if(d.startsWith('new:')) addCmd(d.slice(4),i); else if(d.startsWith('move:')) moveCmd(+d.slice(5),i); });
$('#clearBtn').onclick=()=>{ if(G.running||!G.program.length) return; G.program=[]; sfx('remove'); edited(); setFeedback('info','Program cleared. Plan your route and add new blocks!'); };
$('#runBtn').onclick=()=>run();
$('#resetBtn').onclick=()=>{ cancelRun(); resetRover(); clearFx(); G.chipState={}; G.errIdx=-1; renderSeq(); setFeedback('info','Rover is back at the start. Ready when you are!'); };
on(document,'keydown',e=>{
  if(!$('#game').classList.contains('on')||root.querySelector('.overlay.on')) return;
  const map={ArrowUp:'F',ArrowLeft:'L',ArrowRight:'R'};
  if(map[e.key]){ e.preventDefault(); ac(); addCmd(map[e.key]); }
  else if(e.key==='Backspace'&&G.program.length){ e.preventDefault(); delCmd(G.program.length-1); }
  else if(e.key==='Enter'&&!e.target.closest('button')){ e.preventDefault(); run(); }
  else if(e.key==='r'||e.key==='R'){ $('#resetBtn').click(); }
});

/* ================= Feedback & hints ================= */
function setFeedback(type,html){
  const f=$('#feedback'); f.className='feedback '+type; f.querySelector('.fi').textContent=({info:'i',ok:'✓',warn:'!',err:'✕'})[type];
  $('#fbText').innerHTML=html; f.classList.remove('pop'); void f.offsetWidth; f.classList.add('pop');
}
function renderHintDots(){ root.querySelectorAll('#hintDots i').forEach((d,i)=>d.classList.toggle('on',i<G.hint)); $('#hintBtn').disabled=G.hint>=3&&false; }
let hintMarks=[];
function renderHintMarks(){ const S=G.S; $('#marks').innerHTML=hintMarks.map(m=>`<div class="cellMark ${m.cls}" ${m.n?`data-n="${m.n}"`:''} style="left:${m.c*S+4}px;top:${m.r*S+4}px;width:${S-8}px;height:${S-8}px"></div>`).join(''); }
function clearFx(){ hintMarks=[]; renderHintMarks(); root.querySelectorAll('.rock.hit').forEach(r=>r.classList.remove('hit')); }
function computeHintBase(){
  const L=G.L, max=L.maxBlocks; let s={...L.start}, k=0, base={k:0,s:{...L.start}};
  for(let i=0;i<G.program.length;i++){
    if(atGoal(L,s)) break;
    const n=step(s,G.program[i]); if(G.program[i]==='F'&&blocked(L,n.r,n.c)) break;
    s=n; const rest=solve(L,s); if(rest&&i+1+rest.length<=max) base={k:i+1,s:{...s}};
  }
  return {...base, rest:solve(L,base.s)};
}
$('#hintBtn').onclick=()=>{
  if(G.running) return; ac();
  G.hint=Math.min(3,G.hint+1); renderHintDots(); sfx('hint');
  const {k,s,rest}=computeHintBase(), L=G.L;
  const pre = k<G.program.length ? `Blocks after <b>#${k}</b> take Sojourner off course — try removing them. ` : '';
  if(!rest||!rest.length){ setFeedback('ok','Your program already reaches the target — press <b>Run Program</b>!'); return; }
  // cells visited by the remaining route
  const cells=[]; let t={...s}; rest.forEach(c=>{ t=step(t,c); if(c==='F') cells.push({r:t.r,c:t.c}); });
  if(G.hint===1){
    hintMarks=cells.length?[{...cells[0],cls:'hint-cell'}]:[];
    setFeedback('info',pre+(cells.length?'Hint 1: Drive toward the <b>glowing cell</b>. Which way does the rover need to face to get there?':`Hint 1: You're on the spot — now turn to face ${DNAME[L.face]}.`));
  } else if(G.hint===2){
    hintMarks=cells.slice(0,3).map((c,i)=>({...c,cls:i?'hint-path n1':'hint-cell n1',n:i+1}));
    setFeedback('info',pre+'Hint 2: Follow the <b>numbered cells</b> — that’s the next part of a good route.');
  } else {
    hintMarks=cells.slice(0,3).map((c,i)=>({...c,cls:i?'hint-path n1':'hint-cell n1',n:i+1}));
    const next=rest.slice(0,3);
    setFeedback('info',pre+`Hint 3: Try adding <span class="miniChips">${next.map(c=>`<span class="${c}">${ICON[c].replace('<svg','<svg width="18" height="18"')}</span>`).join('')}</span> ${k<G.program.length?`after block #${k}`:'next'}.`);
  }
  renderHintMarks();
};

/* ================= Execution ================= */
function resetRover(){ G.rover={...G.L.start}; G.rot=G.L.start.d*90; const tr=$('#tracks'); tr.getContext('2d').clearRect(0,0,tr.width,tr.height); $('#rover').className=''; placeRover(); }
function cancelRun(){ G.runId++; G.running=false; $('#rover').className=''; if(G.L) renderSeq(); }
function markChip(i,st){ G.chipState[i]=st; const ch=root.querySelector(`.chip[data-i="${i}"]`); if(ch){ ch.classList.remove('running','done'); if(st) ch.classList.add(st); } }
function trackSeg(x0,y0,x1,y1){
  const S=G.S, ctx=$('#tracks').getContext('2d'), dx=x1-x0, dy=y1-y0, len=Math.hypot(dx,dy)||1, px=-dy/len, py=dx/len;
  ctx.strokeStyle='rgba(80,28,12,.38)'; ctx.lineWidth=Math.max(3,S*.09); ctx.lineCap='butt'; ctx.setLineDash([S*.05,S*.035]);
  [-1,1].forEach(sd=>{ ctx.beginPath(); ctx.moveTo((x0+.5)*S+px*sd*S*.3,(y0+.5)*S+py*sd*S*.3); ctx.lineTo((x1+.5)*S+px*sd*S*.3,(y1+.5)*S+py*sd*S*.3); ctx.stroke(); });
  ctx.setLineDash([]);
}
function dust(x,y,d){
  const S=G.S, fx=$('#fx');
  for(let i=0;i<2;i++){ const p=document.createElement('div'); p.className='dust'; const sz=S*(.18+Math.random()*.18);
    const bx=(x+.5-DC[d]*.42+(Math.random()-.5)*.5)*S, by=(y+.5-DR[d]*.42+(Math.random()-.5)*.5)*S;
    Object.assign(p.style,{width:sz+'px',height:sz+'px',left:bx-sz/2+'px',top:by-sz/2+'px'}); fx.appendChild(p);
    p.animate([{opacity:.9,transform:'scale(.5)'},{opacity:0,transform:`translate(${(-DC[d]+(Math.random()-.5))*S*.4}px,${(-DR[d]+(Math.random()-.5))*S*.4}px) scale(1.8)`}],{duration:700,easing:'ease-out'}).onfinish=()=>p.remove(); }
}
async function animMove(id){
  const from={...G.rover}, to=step(from,'F'), ms=650*speedK(), el=$('#rover'); el.className='driving'; sfx('move',ms/1000);
  let lx=from.c, ly=from.r, lastDust=0;
  await tween(ms,t=>{ if(id!==G.runId) return; const e=ease(t), x=from.c+(to.c-from.c)*e, y=from.r+(to.r-from.r)*e; placeRover(x,y);
    trackSeg(lx,ly,x,y); lx=x; ly=y; if(t-lastDust>.18){ lastDust=t; dust(x,y,from.d); } });
  el.className=''; if(id===G.runId) G.rover=to;
}
async function animRotate(id,dir){
  const ms=420*speedK(), r0=G.rot, el=$('#rover'); el.className=dir>0?'turnR':'turnL'; sfx('turn',ms/1000);
  await tween(ms,t=>{ if(id!==G.runId) return; G.rot=r0+90*dir*ease(t); placeRover(); });
  el.className=''; if(id===G.runId){ G.rot=r0+90*dir; G.rover.d=(G.rover.d+(dir>0?1:3))%4; placeRover(); }
}
async function animBump(id){
  const s=G.rover, ms=380*speedK(); sfx('bump');
  await tween(ms,t=>{ if(id!==G.runId) return; const k=Math.sin(t*Math.PI)*.26; placeRover(s.c+DC[s.d]*k, s.r+DR[s.d]*k); });
  placeRover(); const b=$('#board'); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
}
function edgeWarn(s){
  const S=G.S,L=G.L,e=document.createElement('div'); e.className='edgeWarn';
  const th=6, st=e.style;
  if(s.d===0) Object.assign(st,{left:s.c*S+'px',top:-th/2+'px',width:S+'px',height:th+'px'});
  if(s.d===2) Object.assign(st,{left:s.c*S+'px',top:L.rows*S-th/2+'px',width:S+'px',height:th+'px'});
  if(s.d===3) Object.assign(st,{left:-th/2+'px',top:s.r*S+'px',width:th+'px',height:S+'px'});
  if(s.d===1) Object.assign(st,{left:L.cols*S-th/2+'px',top:s.r*S+'px',width:th+'px',height:S+'px'});
  $('#fx').appendChild(e); setTimeout(()=>e.remove(),2300);
}
async function run(){
  if(G.running) return; ac();
  const L=G.L;
  if(!G.program.length){ setFeedback('info','Your program is empty. Click a command block to add it first!'); sfx('deny'); return; }
  const id=++G.runId; G.running=true; G.errIdx=-1; G.chipState={}; clearFx(); resetRover(); renderSeq();
  setFeedback('info','Program uploading to Mars… Sojourner is driving!');
  await sleep(250);
  for(let i=0;i<G.program.length;i++){
    if(id!==G.runId) return;
    markChip(i,'running'); const cmd=G.program[i];
    if(cmd==='F'){
      const n=step(G.rover,'F');
      if(blocked(L,n.r,n.c)){
        await animBump(id); if(id!==G.runId) return;
        const off=n.r<0||n.c<0||n.r>=L.rows||n.c>=L.cols;
        const hole=L.holes.has(n.r+','+n.c);
        if(off) edgeWarn(G.rover); else if(hole) root.querySelector(`.sinkhole[data-k="${n.r},${n.c}"]`)?.classList.add('hit'); else root.querySelector(`.rock[data-k="${n.r},${n.c}"]`)?.classList.add('hit');
        G.errIdx=i; markChip(i,''); finishRun(); sfx('fail');
        for(let j=i+1;j<G.program.length;j++) G.chipState[j]='unused';
        renderSeq();
        setFeedback('err', off ? `You've reached the edge of the exploration area. Block <b>#${i+1}</b> would drive off the map.` : hole ? `Danger: sinkhole! Block <b>#${i+1}</b> would enter a hole. Find another route.` : `Obstacle detected! Block <b>#${i+1}</b> drives into a rock. Try changing your route.`);
        return;
      }
      await animMove(id);
    } else await animRotate(id, cmd==='R'?1:-1);
    if(id!==G.runId) return;
    markChip(i,'done');
    if(atGoal(L,G.rover)){ for(let j=i+1;j<G.program.length;j++) G.chipState[j]='unused'; finishRun(); renderSeq(); return success(i+1); }
    await sleep(200*speedK());
  }
  finishRun(); renderSeq(); sfx('fail');
  if(G.rover.r===L.target.r&&G.rover.c===L.target.c) setFeedback('warn',`You're at the target! Now face the instrument toward the rock — turn to face <b>${DNAME[L.face]}</b>.`);
  else setFeedback('warn','Almost there! Can you add or change a command?');
}
function finishRun(){ G.running=false; $('#rover').className=''; }
function success(executed){
  const L=G.L, used=G.program.length;
  const stars = used<=L.optimal?3: used<=L.recommended?2:1;
  sfx('win');
  const prev=progress[L.idx]; progress[L.idx]={stars:Math.max(stars,prev?prev.stars:0),best:Math.min(used,prev?prev.best:99)}; store.set('progress',progress);
  setFeedback('ok','Mission Complete! Great job!');
  G.hint=0; renderHintDots();
  $('#resTitle').textContent='Mission Complete!';
  $('#resSub').textContent=`Sojourner reached ${L.featureName||L.targetName}. Great job, engineer!`;
  $('#resStars').innerHTML=[1,2,3].map(n=>`<span class="s" style="animation-delay:${.25+n*.22}s">${STAR(stars>=n)}</span>`).join('');
  [1,2,3].forEach(n=>{ if(stars>=n) setTimeout(()=>sfx('star'),(250+n*220)); });
  $('#resUsed').textContent=used; $('#resBest').textContent=L.optimal;
  const unused=used-executed;
  $('#resTip').textContent = stars===3 ? 'Perfect program — the shortest route possible! ⭐' :
    unused>0 ? `Sojourner arrived before the last ${unused} block${unused>1?'s':''} ran — remove them for more stars.` :
    `Can you find a route that uses only ${L.optimal} blocks? Fewer turns help!`;
  $('#resNext').textContent = L.idx<LEVELS.length-1 ? 'Next Mission ▶' : 'Continue ▶';
  setTimeout(()=>openOv('result'),450);
}
$('#resRetry').onclick=()=>{ closeOv('result'); setFeedback('info','Edit your program and press Run to try for more stars.'); };
$('#resNext').onclick=()=>{ closeOv('result'); const L=G.L; if(L.idx<LEVELS.length-1) startLevel(L.idx+1); else if(opts.onComplete) opts.onComplete(); else { renderReports(); show('reports'); } };

let rz; on(window,'resize',()=>{ clearTimeout(rz); rz=setTimeout(()=>{ if(!G.running) layoutBoard(); },120); });
if (opts.reducedMotion) settings.speed = 'fast';
assetReady.then(() => { if (!destroyed) startLevel(0); });

  return function destroy() {
    destroyed = true;
    cleanups.forEach((f) => f());
    clearTimeout(rz);
    cancelRun();
    try { AC && AC.close(); } catch (err) {}
  };
}
