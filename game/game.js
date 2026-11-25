/* NASGOR RUSH — Indonesian Street Food. All code written from scratch for this contest.
   No external assets: art via CSS/SVG/emoji, sound via WebAudio synthesis. */
'use strict';

/* ================= DATA ================= */
const INGREDIENTS = [
  {id:'rice',    name:'Nasi',        icon:'🍚'},
  {id:'egg',     name:'Telur',       icon:'🥚'},
  {id:'garlic',  name:'Bawang Putih',icon:'🧄'},
  {id:'shallot', name:'Bawang Merah',icon:'🧅'},
  {id:'chili',   name:'Cabai',       icon:'🌶️'},
  {id:'kecap',   name:'Kecap Manis', icon:'🍶'},
  {id:'salt',    name:'Garam',       icon:'🧂'},
  {id:'chicken', name:'Ayam',        icon:'🍗'},
  {id:'shrimp',  name:'Udang',       icon:'🦐'},
  {id:'onion',   name:'Daun Bawang', icon:'🌱'},
  {id:'cracker', name:'Kerupuk',     icon:'🍘'},
  {id:'friedegg',name:'Telur Ceplok',icon:'🍳'},
  {id:'cucumber',name:'Timun',       icon:'🥒'},
  {id:'tomato',  name:'Tomat',       icon:'🍅'},
];
const ING = Object.fromEntries(INGREDIENTS.map(i => [i.id, i]));

/* recipes: ingredients as multiset (egg x2 for telur) */
const RECIPES = [
  {id:'original', name:'Nasi Goreng Original', icon:'🍛', needs:['rice','egg','garlic','shallot','kecap'], points:100, coins:12, diff:1},
  {id:'pedas',    name:'Nasi Goreng Pedas',    icon:'🌶️', needs:['rice','egg','garlic','chili','kecap'],   points:120, coins:14, diff:1},
  {id:'ayam',     name:'Nasi Goreng Ayam',     icon:'🍗', needs:['rice','chicken','egg','garlic','kecap'],  points:140, coins:16, diff:2},
  {id:'seafood',  name:'Nasi Goreng Seafood',  icon:'🦐', needs:['rice','shrimp','egg','garlic','onion'],   points:150, coins:17, diff:2},
  {id:'spesial',  name:'Nasi Goreng Spesial',  icon:'⭐', needs:['rice','chicken','egg','chili','garlic','kecap'], points:170, coins:20, diff:3},
  {id:'kampung',  name:'Nasi Goreng Kampung',  icon:'🏡', needs:['rice','egg','shallot','garlic','chili','salt'], points:160, coins:19, diff:3},
  {id:'telur',    name:'Nasi Goreng Telur',    icon:'🍳', needs:['rice','egg','egg','garlic','kecap'],      points:130, coins:15, diff:2},
  {id:'komplit',  name:'Nasi Goreng Komplit',  icon:'👑', needs:['rice','chicken','shrimp','egg','chili','garlic','kecap'], points:200, coins:24, diff:4},
];
const RECIPE = Object.fromEntries(RECIPES.map(r => [r.id, r]));

/* customers: 8 characters, unlock progressively */
const CUSTOMERS = [
  {id:'andi',  name:'Andi',   type:'Karyawan Kantoran',  face:'🧑‍💼', skin:'#f2c89b', hair:'#2b2b2b', patience:1.0,  quote:'Lapar banget, nasgornya satu ya!', vip:false},
  {id:'sinta', name:'Sinta',  type:'Mahasiswi',          face:'👩‍🎓', skin:'#f7d7b0', hair:'#4a2c14', patience:1.1,  quote:'Yang pedes ya kak, biar melek!', vip:false},
  {id:'budi',  name:'Budi',   type:'Ojol',               face:'🛵',  skin:'#e8b88a', hair:'#1c1c1c', patience:0.85, quote:'Buruan ya, orderan numpuk nih!', vip:false},
  {id:'lucas', name:'Lucas',  type:'Turis',              face:'🧔',  skin:'#f2c89b', hair:'#8a5a2b', patience:0.9,  quote:'This nasi goreng is famous, yes?', vip:false},
  {id:'rudi',  name:'Rudi',   type:'Pekerja Shift Malam',face:'👷',  skin:'#d9a06b', hair:'#111111', patience:1.15, quote:'Habis lembur… nasgor obatnya.', vip:false},
  {id:'mega',  name:'Mega',   type:'Pecinta Kuliner',    face:'😋',  skin:'#f7d7b0', hair:'#3a1c0d', patience:0.95, quote:'Aku food vlogger, bikin yang terenak!', vip:false},
  {id:'sultan',name:'Sultan', type:'Food Critic VIP',    face:'🤴',  skin:'#f2c89b', hair:'#111111', patience:0.7,  quote:'Saya kritikus kuliner. Jangan kecewakan saya.', vip:true},
  {id:'nenek', name:'Nenek',  type:'Langganan Setia',    face:'👵',  skin:'#e8b88a', hair:'#e8e8e8', patience:1.3,  quote:'Nasgornya Raka selalu juara, nak.', vip:false},
];

const LEVELS = [
  {n:1,  name:'Pembukaan Warung',  target:300,  time:150, spawn:9, recipes:3, patience:1.0,  vip:0,    reward:1},
  {n:2,  name:'Mulai Ramai',       target:500,  time:150, spawn:8, recipes:3, patience:1.0,  vip:0,    reward:1},
  {n:3,  name:'Langganan Datang',   target:650,  time:160, spawn:8, recipes:5, patience:0.95, vip:0.05, reward:1},
  {n:4,  name:'Malam Makin Sibuk', target:800,  time:160, spawn:7, recipes:5, patience:0.95, vip:0.10, reward:1},
  {n:5,  name:'Rasa Makin Mantap', target:1000, time:170, spawn:7, recipes:6, patience:0.9,  vip:0.12, reward:1.1},
  {n:6,  name:'Antrean Panjang',   target:1200, time:170, spawn:6, recipes:6, patience:0.9,  vip:0.15, reward:1.1},
  {n:7,  name:'Ujian Kesabaran',   target:1400, time:180, spawn:6, recipes:7, patience:0.85, vip:0.18, reward:1.2},
  {n:8,  name:'RUSH HOUR 🔥',      target:1600, time:180, spawn:5, recipes:7, patience:0.85, vip:0.20, reward:1.25, boss:true},
  {n:9,  name:'Menuju Puncak',     target:1800, time:180, spawn:5, recipes:8, patience:0.8,  vip:0.25, reward:1.3},
  {n:10, name:'MIDNIGHT RUSH 🌙',  target:2000, time:200, spawn:4, recipes:8, patience:0.8,  vip:0.35, reward:1.5, boss:true, final:true},
];

const UPGRADES = [
  {id:'stove',    name:'Kompor Turbo',      icon:'🔥', desc:'Masak 12% lebih cepat per level.',        base:100, max:3},
  {id:'wok',      name:'Wok Baja Premium',  icon:'🍳', desc:'Zona PERFECT 8% lebih lebar per level.',  base:120, max:3},
  {id:'patience', name:'Kursi Nyaman',      icon:'🪑', desc:'Kesabaran pelanggan +12% per level.',      base:80,  max:3},
  {id:'prep',     name:'Meja Prep Rapi',    icon:'🔪', desc:'Skor tiap sajian +5% per level.',          base:90,  max:3},
  {id:'plates',   name:'Piring Emas',       icon:'🍽️', desc:'Koin tiap sajian +15% per level.',         base:110, max:3},
];

const ACHIEVEMENTS = [
  {id:'first-perfect', name:'Hidangan Perfect Pertama', icon:'✨', desc:'Sajikan 1 hidangan PERFECT.'},
  {id:'happy-10',      name:'10 Pelanggan Bahagia',     icon:'😊', desc:'Layani 10 pelanggan dengan benar.'},
  {id:'master-chef',   name:'Master Chef',              icon:'👨‍🍳', desc:'Selesaikan level 10 — Midnight Rush.'},
  {id:'no-burn',       name:'Tanpa Gosong',             icon:'🚫', desc:'Selesaikan 1 level tanpa ada yang gosong.'},
  {id:'combo-10',      name:'10 Perfect Beruntun',      icon:'🔥', desc:'10 pesanan PERFECT berturut-turut.'},
  {id:'speed-champ',   name:'Juara Masak Cepat',        icon:'⚡', desc:'Sajikan pesanan < 20 detik setelah datang.'},
];

const DAILY_TYPES = [
  {id:'serve5',   desc:'Sajikan 5 pesanan hari ini',        target:5,   reward:100},
  {id:'perfect3', desc:'Masak 3 hidangan PERFECT hari ini', target:3,   reward:120},
  {id:'coins150', desc:'Kumpulkan 150 koin hari ini',       target:150, reward:100},
  {id:'noburn',   desc:'Selesaikan 1 level tanpa gosong',   target:1,   reward:150},
];

const EVENTS = [
  {id:'rush',   name:'RUSH HOUR!',       desc:'Pelanggan datang 2x lebih cepat (30 dtk)', dur:30},
  {id:'vip',    name:'PELANGGAN VIP!',   desc:'Pelanggan berikutnya adalah VIP — hadiah 2x!', dur:0},
  {id:'double', name:'KOİN GANDA!',      desc:'Koin 2x lipat selama 30 detik', dur:30},
  {id:'speed',  name:'MASAK KILAT!',     desc:'Waktu masak 2x lebih cepat (20 dtk)', dur:20},
];

/* story */
const STORY_INTRO = [
  {art:'🌃', speaker:'Narator', text:'Jakarta, jam 9 malam. Di sudut jalan yang ramai, sebuah warung kecil baru saja buka. Namanya… NASGOR RUSH.'},
  {art:'🧑‍🍳', speaker:'Raka', text:'Hari pertama jualan! Wok sudah panas, kecap sudah siap. Malam ini, warungku HARUS rame!'},
  {art:'👵', speaker:'Ibu Sari', text:'Raka, ingat pesan ibu: nasgor enak itu soal timing. Jangan gosong, jangan mentah. Pelanggan senang, rezeki lancar!'},
  {art:'🍳', speaker:'Raka', text:'Siap, Bu! Ayo masak — pelanggan pertama pasti datang sebentar lagi!'},
];
const STORY_LEVELS = {
  1:[{who:'🧑‍🍳', name:'Raka', text:'Level 1! Resep dasar dulu: Original, Pedas, dan Ayam. Pelan-pelan, yang penting enak!'}],
  3:[{who:'👵', name:'Ibu Sari', text:'Raka, langganan mulai datang! Resep baru kebuka: Seafood dan Spesial. Jangan lupa senyum ke pelanggan, ya.'},
     {who:'🧑‍🍳', name:'Raka', text:'Misi hari ini: layani 5 pelanggan! Kalau berhasil, Ibu traktir kopi.'}],
  5:[{who:'🧑', name:'Budi (Ojol)', text:'Bang Raka, warung lu viral di grup ojol! Hati-hati, kritikus kuliner katanya mau mampir…'},
     {who:'🧑‍🍳', name:'Raka', text:'Kritikus VIP?! Tenang — wokku sudah panas, resep Komplit sudah kebuka. Siap!'}],
  8:[{who:'📣', name:'Narator', text:'JAM RUSH HOUR! Jalanan macet, perut lapar, semua orang menuju warung Raka. Ini ujian sesungguhnya!'},
     {who:'🧑‍🍳', name:'Raka', text:'Semua datang barengan?! Oke… tarik napas. Satu wok, satu pesanan, satu perfect!'}],
  10:[{who:'🌙', name:'Narator', text:'Tengah malam. Lampu kota meredup, tapi warung Raka paling terang. Ini dia: MIDNIGHT RUSH — tantangan terakhir!'},
      {who:'👵', name:'Ibu Sari', text:'Raka… Ibu bangga. Dari warung kecil, sekarang semua orang antre. Tunjukkan mereka nasgor terbaik di kota!'}],
};
const STORY_ENDING = [
  {art:'🎆', speaker:'Narator', text:'MIDNIGHT RUSH BERHASIL! Antrean terakhir pulang dengan senyum. Warung kecil itu kini jadi legenda jalanan.'},
  {art:'🏆', speaker:'Raka', text:'Kita berhasil! Dari satu wok dan mimpi besar… jadi warung nasi goreng nomor satu di kota!'},
  {art:'👵', speaker:'Ibu Sari', text:'Itulah rahasianya, nak: masak pakai hati, sajikan pakai senyum. Besok buka lagi ya — pelanggan sudah antre dari subuh!'},
];
const STORY_MISSIONS = {
  3:{desc:'Misi cerita: layani 5 pelanggan di level ini', check:s=>s.served>=5, bonus:100},
  5:{desc:'Misi cerita: layani 1 pelanggan VIP', check:s=>s.vipServed>=1, bonus:150},
  8:{desc:'Misi cerita: selesaikan Rush Hour tanpa ada pelanggan kabur', check:s=>s.left===0, bonus:200},
  10:{desc:'Misi cerita: taklukkan Midnight Rush!', check:s=>true, bonus:300},
};

/* ================= SAVE ================= */
const SAVE_KEY = 'nasgor-rush-save-v1';
function defaultSave(){
  return {coins:0, unlockedLevel:1, bestScore:0, scores:[], achievements:{},
    upgrades:{stove:0,wok:0,patience:0,prep:0,plates:0},
    daily:{date:'', type:0, progress:0, done:false},
    totalServed:0, totalPerfect:0, bestCombo:0, perfectStreak:0,
    storySeen:{}, introSeen:false, gamesPlayed:0};
}
let S = defaultSave();
try{ const raw = localStorage.getItem(SAVE_KEY); if(raw){ const p = JSON.parse(raw); S = Object.assign(defaultSave(), p); S.upgrades = Object.assign(defaultSave().upgrades, p.upgrades||{}); S.achievements = p.achievements||{}; S.daily = Object.assign(defaultSave().daily, p.daily||{}); S.storySeen = p.storySeen||{}; } }catch(e){}
function persist(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){} }

/* daily challenge (deterministic per date) */
function todayStr(){ const d = new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function dailyDef(){
  const t = todayStr();
  if(S.daily.date !== t){
    let h = 0; for(const c of t) h = (h*31 + c.charCodeAt(0)) % 997;
    S.daily = {date:t, type:h % DAILY_TYPES.length, progress:0, done:false};
    persist();
  }
  return DAILY_TYPES[S.daily.type];
}
function dailyProgress(kind, n){
  const d = dailyDef();
  if(S.daily.done) return;
  if(kind==='serve' && d.id==='serve5') S.daily.progress += n;
  if(kind==='perfect' && d.id==='perfect3') S.daily.progress += n;
  if(kind==='coins' && d.id==='coins150') S.daily.progress += n;
  if(kind==='noburn' && d.id==='noburn') S.daily.progress += n;
  if(S.daily.progress >= d.target){
    S.daily.progress = d.target; S.daily.done = true;
    S.coins += d.reward; persist();
    toast('🎉 Tantangan harian selesai! +'+d.reward+' koin', true);
    sfx('win');
  } else persist();
}

/* ================= AUDIO (WebAudio synth) ================= */
let AC = null, musicTimer = null, sizzleNodes = null;
let soundOn = true, musicOn = true;
try{ soundOn = localStorage.getItem('nasgor-sound') !== 'off'; musicOn = localStorage.getItem('nasgor-music') !== 'off'; }catch(e){}
function ac(){
  if(!AC){ try{ AC = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return null; } }
  if(AC && AC.state === 'suspended') AC.resume();
  return AC;
}
function tone(freq, dur, type, vol, when){
  if(!soundOn) return;
  const a = ac(); if(!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type||'sine'; o.frequency.value = freq;
  const t0 = a.currentTime + (when||0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol||0.15, t0+0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
  o.connect(g); g.connect(a.destination);
  o.start(t0); o.stop(t0+dur+0.05);
}
function sfx(name){
  if(!soundOn) return;
  try{
    if(name==='click') tone(660, .07, 'square', .08);
    else if(name==='add'){ tone(520,.06,'triangle',.12); tone(780,.06,'triangle',.1,.05); }
    else if(name==='ding'){ tone(880,.12,'sine',.18); tone(1318,.18,'sine',.14,.08); }
    else if(name==='coin'){ tone(988,.08,'square',.1); tone(1319,.14,'square',.1,.07); }
    else if(name==='success'){ [523,659,784,1047].forEach((f,i)=>tone(f,.16,'triangle',.15,i*.09)); }
    else if(name==='fail'){ tone(220,.25,'sawtooth',.12); tone(180,.3,'sawtooth',.1,.1); }
    else if(name==='win'){ [523,659,784,1047,1319].forEach((f,i)=>tone(f,.2,'triangle',.16,i*.1)); }
    else if(name==='pop'){ tone(440,.05,'sine',.12); tone(880,.09,'sine',.12,.04); }
    else if(name==='burn'){ tone(160,.4,'sawtooth',.14); }
  }catch(e){}
}
function startSizzle(){
  if(!soundOn) return; const a = ac(); if(!a) return; stopSizzle();
  const len = a.sampleRate * 1, buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
  for(let i=0;i<len;i++) d[i] = (Math.random()*2-1) * 0.5;
  const src = a.createBufferSource(); src.buffer = buf; src.loop = true;
  const f = a.createBiquadFilter(); f.type='highpass'; f.frequency.value = 2500;
  const g = a.createGain(); g.gain.value = 0.05;
  src.connect(f); f.connect(g); g.connect(a.destination); src.start();
  sizzleNodes = {src, g};
}
function stopSizzle(){ if(sizzleNodes){ try{ sizzleNodes.src.stop(); }catch(e){} sizzleNodes = null; } }
/* simple upbeat night-street melody loop */
const MELODY = [523,659,784,880,784,659,587,523, 440,523,659,784,659,523,587,659];
function startMusic(){
  if(!musicOn || musicTimer) return;
  let i = 0;
  musicTimer = setInterval(()=>{
    if(!musicOn || !soundOn) return;
    tone(MELODY[i % MELODY.length], .22, 'triangle', .05);
    if(i % 4 === 0) tone(131, .4, 'sine', .07);
    i++;
  }, 260);
}
function stopMusic(){ if(musicTimer){ clearInterval(musicTimer); musicTimer = null; } }

/* ================= HELPERS ================= */
const $ = id => document.getElementById(id);
function toast(msg, gold){
  const t = document.createElement('div');
  t.className = 'toast' + (gold ? ' gold' : '');
  t.textContent = msg;
  $('toasts').appendChild(t);
  setTimeout(()=>{ t.classList.add('out'); setTimeout(()=>t.remove(), 450); }, 3400);
}
function floater(text, cls, x, y){
  const f = document.createElement('div');
  f.className = 'floater' + (cls ? ' '+cls : '');
  f.textContent = text;
  f.style.left = (x ?? (window.innerWidth/2 + (Math.random()*120-60))) + 'px';
  f.style.top = (y ?? 200) + 'px';
  $('floaters').appendChild(f);
  setTimeout(()=>f.remove(), 1500);
}
function shakeScreen(){ const a = $('app'); a.classList.remove('shake'); void a.offsetWidth; a.classList.add('shake'); }
function coinFly(fromEl){
  const target = $('hud-coins');
  if(!fromEl || !target || !$('screen-game').classList.contains('active')) return;
  const r = fromEl.getBoundingClientRect(), tr = target.getBoundingClientRect();
  for(let i=0;i<3;i++){
    const c = document.createElement('div');
    c.className = 'coin-fly'; c.textContent = '🪙';
    c.style.left = (r.left + r.width/2 + i*8 - 8) + 'px';
    c.style.top = (r.top + r.height/2) + 'px';
    document.body.appendChild(c);
    requestAnimationFrame(()=>{ c.style.left = (tr.left + 10) + 'px'; c.style.top = (tr.top + 8) + 'px'; c.style.transform = 'scale(.4)'; c.style.opacity = '.2'; });
    setTimeout(()=>c.remove(), 900);
  }
}
function confetti(){
  for(let i=0;i<70;i++){
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random()*100 + 'vw';
    c.style.background = ['#ffd34d','#e63946','#7bc043','#19c3e6','#ff7b1c'][i%5];
    c.style.animationDuration = (2 + Math.random()*2) + 's';
    c.style.animationDelay = (Math.random()*0.8) + 's';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(), 5200);
  }
}
function multisetEqual(a, b){
  if(a.length !== b.length) return false;
  const ca = {}, cb = {};
  a.forEach(x => ca[x] = (ca[x]||0)+1);
  b.forEach(x => cb[x] = (cb[x]||0)+1);
  return Object.keys(ca).every(k => ca[k] === cb[k]);
}
function matchRecipe(ids){ return RECIPES.find(r => multisetEqual(ids, r.needs)) || null; }
function qualityOf(progress, wokBonus){
  const lo = 45 - (wokBonus||0), hi = 85 + (wokBonus||0);
  if(progress < lo) return 'undercooked';
  if(progress <= hi) return 'perfect';
  return 'burned';
}

/* ================= GAME STATE ================= */
const G = {
  screen:'menu', level:1, score:0, timeLeft:0, combo:0, bestComboRun:0,
  wok:[], cooking:false, cookProgress:0, cookDur:9, plate:null,
  customers:[], spawnIn:5, nextEventIn:40, event:null, eventLeft:0,
  paused:false, presenting:false, over:false,
  stats:{served:0, perfect:0, burned:0, wrong:0, left:0, vipServed:0, perfectStreak:0},
  custSeq:0, tickN:0,
};
let tickTimer = null;

function upg(id){ return S.upgrades[id] || 0; }
function cookDuration(){
  let d = 9 * (1 - 0.12 * upg('stove'));
  if(G.event && G.event.id === 'speed') d *= 0.5;
  return d;
}
function perfectWindow(){ return 8 * upg('wok'); } /* widened % each side */
function unlockedRecipes(level){ return RECIPES.slice(0, LEVELS[level-1].recipes); }
function unlockedCustomers(){
  const list = CUSTOMERS.slice(0, 6);
  if(S.unlockedLevel >= 5) list.push(CUSTOMERS[6]);
  if(S.unlockedLevel >= 8) list.push(CUSTOMERS[7]);
  return list;
}
function decorations(){
  $('decor-banner').classList.toggle('hidden', S.unlockedLevel < 3);
  $('decor-plant').classList.toggle('hidden', S.unlockedLevel < 5);
}

/* ================= SCREENS ================= */
function showScreen(name){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $('screen-' + name).classList.add('active');
  G.screen = name;
  if(name === 'menu') renderMenu();
}
function openOverlay(html){ $('overlay-card').innerHTML = html; $('overlay').classList.remove('hidden'); }
function closeOverlay(){ $('overlay').classList.add('hidden'); $('overlay-card').innerHTML = ''; if(G.screen === 'menu') renderMenu(); }
$('overlay').addEventListener('click', e => { if(e.target.id === 'overlay' && !G.presenting) closeOverlay(); });

function renderMenu(){
  $('menu-coins').textContent = S.coins;
  $('menu-level').textContent = S.unlockedLevel;
  $('menu-best').textContent = S.bestScore;
  $('menu-served').textContent = S.totalServed;
  const got = ACHIEVEMENTS.filter(a => S.achievements[a.id]).length;
  $('ach-count').textContent = got + '/' + ACHIEVEMENTS.length;
  const d = dailyDef();
  $('daily-desc').textContent = d.desc + ' (hadiah +' + d.reward + ' 🪙)';
  $('daily-progress').textContent = S.daily.done ? '✅ SELESAI!' : ('Progress: ' + S.daily.progress + ' / ' + d.target);
  $('btn-sound').textContent = soundOn ? '🔊 SUARA: ON' : '🔇 SUARA: OFF';
  decorations();
}

/* ================= CUSTOMER FACES (SVG, mood-aware) ================= */
function faceSVG(c, mood){
  const mouth = mood==='happy' ? 'M18 36 Q26 44 34 36' : mood==='angry' ? 'M18 40 Q26 32 34 40' : mood==='sad' ? 'M18 40 Q26 34 34 40' : 'M19 38 Q26 41 33 38';
  const eyes = mood==='happy' ? 'M15 26 Q18 22 21 26 M31 26 Q34 22 37 26' : '';
  const brows = mood==='angry' ? '<path d="M13 21 L22 24 M39 21 L30 24" stroke="#5a3a1a" stroke-width="2.5" stroke-linecap="round"/>' : '';
  const hair = c.id==='nenek' ? '<path d="M10 22 Q12 8 26 8 Q40 8 42 22 Q38 14 26 14 Q14 14 10 22" fill="#e8e8e8"/>'
    : c.id==='sultan' ? '<path d="M10 24 Q10 6 26 6 Q42 6 42 24 L38 18 Q26 10 14 18 Z" fill="#111"/><path d="M18 4 L22 10 L26 3 L30 10 L34 4" fill="#ffd34d"/>'
    : '<path d="M10 24 Q10 6 26 6 Q42 6 42 24 Q40 14 26 13 Q12 14 10 24" fill="' + c.hair + '"/>';
  return '<svg class="cust-face" viewBox="0 0 52 52" aria-hidden="true">'
    + '<circle cx="26" cy="27" r="21" fill="' + c.skin + '" stroke="#8a5a2a" stroke-width="2"/>'
    + hair
    + (eyes ? '<path d="' + eyes + '" stroke="#222" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
            : '<circle cx="18" cy="26" r="2.6" fill="#222"/><circle cx="34" cy="26" r="2.6" fill="#222"/>')
    + brows
    + '<path d="' + mouth + '" stroke="#7a2a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
    + '</svg>';
}

/* ================= DISH RENDERING (dynamic plating) ================= */
function dishHTML(recipe, quality){
  const needs = recipe.needs || [];
  const hasEgg = needs.includes('egg') || needs.includes('friedegg');
  const hasKecap = needs.includes('kecap');
  const cls = quality === 'perfect' ? '' : quality === 'burned' ? 'burnt' : 'pale';
  let h = '<div class="dish">';
  h += '<div class="steam">♨️</div>';
  if(quality === 'perfect'){
    h += '<span class="sparkle" style="left:6px;top:0">✨</span><span class="sparkle" style="right:4px;top:14px">✨</span><span class="sparkle" style="left:26px;bottom:0">⭐</span>';
  }
  h += '<div class="rice ' + cls + '"></div>';
  if(hasKecap) h += '<div class="sauce"></div>';
  if(hasEgg) h += '<div class="egg"></div>';
  h += '<div class="kerupuk k1"></div><div class="kerupuk k2"></div>';
  h += '<div class="cucumber"></div><div class="cucumber c2"></div>';
  h += '<div class="onion">🌿&nbsp;🌿&nbsp;🌿</div>';
  h += '</div>';
  return h;
}

/* ================= MODALS ================= */
function openHowTo(){
  sfx('click');
  openOverlay('<h2>❓ CARA MAIN</h2>'
    + '<ol><li><b>Baca pesanan</b> pelanggan di papan order — perhatikan resep &amp; kesabarannya.</li>'
    + '<li><b>Klik bahan</b> di meja sesuai resep (urutan bebas).</li>'
    + '<li>Tekan <b>🔥 MASAK</b>, tunggu bar masak masuk zona hijau <b>PERFECT</b>, lalu tekan <b>🍛 ANGKAT</b>.</li>'
    + '<li>Tekan <b>🍽️ SAJIKAN</b> — hidangan otomatis ke pelanggan yang pesanannya cocok.</li>'
    + '<li>Perfect + cepat = skor besar &amp; combo naik. Gosong = reset &amp; mulai lagi!</li></ol>'
    + '<h3>⌨️ Shortcut</h3><p>Angka <b>1–9, 0</b> pilih bahan • <b>Spasi</b> Masak/Angkat • <b>S</b> Sajikan • <b>P</b> Jeda • <b>R</b> Reset</p>'
    + '<h3>💡 Tips</h3><p>Belanja upgrade di menu utama pakai koin. VIP bayar 2x lipat tapi sabarnya tipis. Event acak bisa bantu — atau bikin panik!</p>'
    + '<div class="modal-btns"><button class="btn btn-primary" onclick="closeOverlay()">MENGERTI!</button></div>');
}
function openUpgrades(){
  sfx('click');
  let h = '<h2>🔧 UPGRADE DAPUR</h2><p style="text-align:center">Koin kamu: <b style="color:#ffd34d">' + S.coins + ' 🪙</b> — upgrade langsung berefek di gameplay!</p>';
  UPGRADES.forEach(u => {
    const lvl = upg(u.id), cost = u.base * (lvl + 1), maxed = lvl >= u.max;
    h += '<div class="upg-row"><div class="ic">' + u.icon + '</div><div style="flex:1"><div class="t">' + u.name + ' <span class="lvl">' + '★'.repeat(lvl) + '☆'.repeat(u.max - lvl) + '</span></div><div class="d">' + u.desc + '</div></div>'
      + (maxed ? '<b style="color:#7dff9b">MAX</b>' : '<button class="btn btn-small" data-upg="' + u.id + '" ' + (S.coins < cost ? 'disabled' : '') + '>BELI ' + cost + ' 🪙</button>') + '</div>';
  });
  h += '<div class="modal-btns"><button class="btn" onclick="closeOverlay()">TUTUP</button></div>';
  openOverlay(h);
  document.querySelectorAll('[data-upg]').forEach(b => b.addEventListener('click', () => buyUpgrade(b.dataset.upg)));
}
function buyUpgrade(id){
  const u = UPGRADES.find(x => x.id === id);
  const lvl = upg(id), cost = u.base * (lvl + 1);
  if(lvl >= u.max || S.coins < cost){ sfx('fail'); return; }
  S.coins -= cost; S.upgrades[id] = lvl + 1; persist();
  sfx('success'); toast('✅ ' + u.name + ' naik ke level ' + (lvl + 1) + '!', true);
  openUpgrades();
}
function openAchievements(){
  sfx('click');
  let h = '<h2>🏆 PRESTASI</h2>';
  ACHIEVEMENTS.forEach(a => {
    const got = !!S.achievements[a.id];
    h += '<div class="ach-row' + (got ? '' : ' locked') + '"><div class="ic">' + (got ? a.icon : '🔒') + '</div><div><div class="t">' + a.name + '</div><div class="d">' + a.desc + '</div></div><div class="st">' + (got ? '✅' : '—') + '</div></div>';
  });
  h += '<p style="text-align:center;font-size:13px;color:#d9c9a8">Prestasi tersimpan otomatis di perangkat ini.</p>';
  h += '<div class="modal-btns"><button class="btn" onclick="closeOverlay()">TUTUP</button></div>';
  openOverlay(h);
}
function openScores(){
  sfx('click');
  let h = '<h2>⭐ SKOR TERBAIK</h2>';
  if(!S.scores.length) h += '<p style="text-align:center">Belum ada skor. Mainkan level pertamamu!</p>';
  else S.scores.forEach((s, i) => {
    h += '<div class="score-row' + (i === 0 ? ' me' : '') + '"><span>#' + (i + 1) + ' — Level ' + s.level + ' • ' + s.date + '</span><b>' + s.score + '</b></div>';
  });
  h += '<p style="text-align:center;font-size:13px;color:#d9c9a8">Peringkat lokal tersimpan di perangkat ini (top 5).</p>';
  h += '<div class="modal-btns"><button class="btn" onclick="closeOverlay()">TUTUP</button></div>';
  openOverlay(h);
}
function openChallenge(){
  sfx('click');
  const d = dailyDef();
  openOverlay('<h2>📅 TANTANGAN HARIAN</h2>'
    + '<p style="text-align:center;font-size:17px">' + d.desc + '</p>'
    + '<p style="text-align:center">Progress: <b>' + S.daily.progress + ' / ' + d.target + '</b> ' + (S.daily.done ? '✅ SELESAI' : '') + '</p>'
    + '<p style="text-align:center">Hadiah: <b style="color:#ffd34d">+' + d.reward + ' 🪙</b> (otomatis saat selesai)</p>'
    + '<p style="text-align:center;font-size:13px;color:#d9c9a8">Tantangan baru tiap hari, ditentukan dari tanggal — sama untuk semua pemain hari ini.</p>'
    + '<div class="modal-btns"><button class="btn btn-primary" onclick="closeOverlay();startLevel(S.unlockedLevel)">MAIN SEKARANG</button><button class="btn" onclick="closeOverlay()">TUTUP</button></div>');
}
function unlockAchievement(id){
  if(S.achievements[id]) return;
  const a = ACHIEVEMENTS.find(x => x.id === id);
  S.achievements[id] = true; persist();
  toast('🏆 Prestasi: ' + a.name + '!', true);
  sfx('win');
}
function checkAchievements(){
  if(G.stats.perfect >= 1) unlockAchievement('first-perfect');
  if(S.totalServed >= 10) unlockAchievement('happy-10');
  if(G.stats.perfectStreak >= 10) unlockAchievement('combo-10');
}

/* ================= LEVEL FLOW ================= */
function startLevel(n, skipStory){
  const L = LEVELS[n - 1];
  if(!L) return;
  if(!skipStory && S.storySeen['L' + n] !== true && STORY_LEVELS[n]){
    S.storySeen['L' + n] = true; persist();
    showDialogue(STORY_LEVELS[n], () => actuallyStartLevel(n));
    return;
  }
  actuallyStartLevel(n);
}
function actuallyStartLevel(n){
  const L = LEVELS[n - 1];
  G.level = n; G.score = 0; G.timeLeft = L.time; G.combo = 0; G.bestComboRun = 0;
  G.wok = []; G.cooking = false; G.cookProgress = 0; G.plate = null;
  G.customers = []; G.spawnIn = 2; G.nextEventIn = 35 + Math.random() * 20; G.event = null; G.eventLeft = 0;
  G.paused = false; G.presenting = false; G.over = false;
  G.stats = {served:0, perfect:0, burned:0, wrong:0, left:0, vipServed:0, perfectStreak:0};
  closeOverlay();
  showScreen('game');
  $('hud-target').textContent = L.target;
  $('hud-level').textContent = n + (L.boss ? ' 👑' : '');
  $('hud-event').hidden = true;
  $('event-banner').classList.add('hidden');
  document.title = 'NASGOR RUSH — Level ' + n + ': ' + L.name;
  buildIngredients();
  renderWok(); renderPlate(); renderCustomers(); updateHUD();
  toast('🍳 Level ' + n + ': ' + L.name + ' — target ' + L.target + ' skor!');
  sfx('ding');
  startMusic();
  if(tickTimer) clearInterval(tickTimer);
  tickTimer = setInterval(tick, 250);
  spawnCustomer(true);
}
function stopTick(){ if(tickTimer){ clearInterval(tickTimer); tickTimer = null; } stopSizzle(); }

/* ================= CUSTOMERS ================= */
function spawnCustomer(force){
  const L = LEVELS[G.level - 1];
  if(G.customers.length >= 3 || G.over) return;
  const pool = unlockedCustomers();
  const isVip = Math.random() < L.vip || (G.event && G.event.id === 'vip' && !G.customers.some(c => c.vip));
  let c;
  if(isVip){
    c = Object.assign({}, CUSTOMERS[6]);
  } else {
    const avail = pool.filter(p => !p.vip);
    c = Object.assign({}, avail[Math.floor(Math.random() * avail.length)]);
  }
  const recipes = unlockedRecipes(G.level);
  const recipe = recipes[Math.floor(Math.random() * recipes.length)];
  const basePatience = (c.vip ? 26 : 38) * c.patience * L.patience * (1 + 0.12 * upg('patience'));
  G.custSeq++;
  G.customers.push({
    seq:G.custSeq, def:c, recipe, patience:basePatience, maxPatience:basePatience,
    mood:'normal', arrivedAt:Date.now(), vip:!!c.vip, leaving:false,
  });
  sfx('pop');
  renderCustomers();
}
function renderCustomers(){
  const wrap = $('customers');
  wrap.innerHTML = '';
  $('no-customers').style.display = G.customers.length ? 'none' : 'block';
  $('board-count').textContent = G.customers.length ? '(' + G.customers.length + '/3)' : '';
  G.customers.forEach(c => {
    const pct = Math.max(0, c.patience / c.maxPatience * 100);
    const urgent = pct < 30;
    const div = document.createElement('div');
    div.className = 'customer' + (urgent ? ' urgent' : '') + (c.vip ? ' vip' : '') + (c.leaving ? ' leaving' : '');
    div.dataset.seq = c.seq;
    const moodIcon = c.mood === 'happy' ? '😄' : c.mood === 'angry' ? '😠' : c.mood === 'sad' ? '😞' : '🙂';
    div.innerHTML = '<div class="cust-mood">' + moodIcon + '</div>'
      + '<div class="cust-head">' + faceSVG(c.def, c.mood)
      + '<div><div class="cust-name">' + c.def.name + ' <span class="cust-type">• ' + c.def.type + '</span></div>'
      + '<div class="cust-dish">' + c.recipe.icon + ' ' + c.recipe.name + '</div></div></div>'
      + '<div class="cust-recipe">' + c.recipe.needs.map(id => '<span class="chip">' + ING[id].icon + ' ' + ING[id].name + '</span>').join('') + '</div>'
      + '<div class="cust-patience' + (urgent ? ' low' : '') + '"><div style="width:' + pct + '%"></div></div>'
      + '<div class="cust-quote">“' + c.def.quote + '”</div>';
    wrap.appendChild(div);
  });
}

/* ================= INGREDIENTS ================= */
function buildIngredients(){
  const wrap = $('ingredients');
  wrap.innerHTML = '';
  INGREDIENTS.forEach((ing, i) => {
    const b = document.createElement('button');
    b.className = 'ing'; b.dataset.id = ing.id; b.dataset.idx = i;
    b.innerHTML = '<span class="ic">' + ing.icon + '</span><span class="nm">' + ing.name + '</span><span class="ct">tekan ' + ((i + 1) % 10) + '</span>';
    b.addEventListener('click', () => addIngredient(ing.id, b));
    wrap.appendChild(b);
  });
}
function addIngredient(id, btn){
  if(G.paused || G.over || G.presenting) return;
  if(G.cooking){ toast('⏳ Lagi masak! Tunggu selesai dulu.'); return; }
  if(G.plate){ toast('🍽️ Piring masih terisi — sajikan dulu!'); return; }
  if(G.wok.length >= 8){ toast('Wok penuh (max 8 bahan)!'); shakeScreen(); return; }
  G.wok.push(id);
  sfx('add');
  if(btn){ btn.classList.remove('bounce'); void btn.offsetWidth; btn.classList.add('bounce'); }
  const wok = $('wok');
  wok.classList.remove('shake'); void wok.offsetWidth; wok.classList.add('shake');
  renderWok();
}
function renderWok(){
  const wrap = $('wok-contents');
  if(!G.wok.length){ wrap.innerHTML = '<span class="empty">Belum ada bahan — klik bahan di meja bawah.</span>'; }
  else wrap.innerHTML = G.wok.map(id => '<span class="chip">' + ING[id].icon + ' ' + ING[id].name + '</span>').join('');
  const counts = {};
  G.wok.forEach(id => counts[id] = (counts[id]||0)+1);
  $('wok-food').innerHTML = G.wok.slice(0, 8).map(id => '<span class="food-bit">' + ING[id].icon + '</span>').join('');
  const match = matchRecipe(G.wok);
  const status = $('cook-status');
  if(G.cooking){
    /* status updated by tick */
  } else if(!G.wok.length){
    status.textContent = 'Wok kosong — pilih bahan dulu!'; status.className = 'cook-status';
  } else if(match){
    status.textContent = '✅ Resep cocok: ' + match.name + ' — siap dimasak!'; status.className = 'cook-status perfect';
  } else {
    status.textContent = '🤔 Kombinasi ini bukan resep yang dikenal…'; status.className = 'cook-status';
  }
  $('btn-cook').disabled = !G.wok.length || G.cooking || G.paused || G.over || G.presenting || !!G.plate;
  $('btn-plate').disabled = !G.cooking && G.cookProgress <= 0 || G.paused || G.over || G.presenting;
  $('btn-reset').disabled = G.paused || G.over || G.presenting;
  updateCookBar();
}
function updateCookBar(){
  $('cook-fill').style.width = Math.min(100, G.cookProgress) + '%';
  const zone = $('cook-perfect-zone');
  const lo = 45 - perfectWindow(), hi = 85 + perfectWindow();
  zone.style.left = Math.max(0, lo) + '%';
  zone.style.width = Math.max(0, hi - lo) + '%';
}

/* ================= COOKING ================= */
function startCook(){
  if(!G.wok.length || G.cooking || G.plate) return;
  G.cooking = true; G.cookProgress = 0; G.cookDur = cookDuration();
  $('stove').classList.add('cooking'); $('wok').classList.add('cooking');
  startSizzle();
  sfx('ding');
  renderWok();
}
function stopCookBurned(){
  G.cooking = false;
  $('stove').classList.remove('cooking'); $('wok').classList.remove('cooking');
  stopSizzle();
  G.stats.burned++; G.stats.perfectStreak = 0;
  sfx('burn'); shakeScreen();
  toast('🔥 GOSONG! Angkat & reset, mulai lagi.', false);
  floater('GOSONG!', 'red');
  renderWok();
  const status = $('cook-status');
  status.textContent = '🔥 GOSONG! Tekan ANGKAT lalu RESET, atau RESET langsung.';
  status.className = 'cook-status burned';
}
function plateDish(){
  if(!G.cooking && G.cookProgress <= 0) return;
  const wasCooking = G.cooking;
  G.cooking = false;
  $('stove').classList.remove('cooking'); $('wok').classList.remove('cooking');
  stopSizzle();
  const recipe = matchRecipe(G.wok);
  const quality = qualityOf(G.cookProgress, perfectWindow());
  G.plate = {recipe: recipe || {id:'mystery', name:'Nasgor Misterius', icon:'❓', points:40, coins:4, needs:[]}, quality, progress:G.cookProgress};
  G.wok = []; G.cookProgress = 0;
  if(quality === 'perfect'){ sfx('ding'); floater('PERFECT! ✨', 'green'); }
  else if(quality === 'burned'){ sfx('burn'); G.stats.burned++; G.stats.perfectStreak = 0; }
  else sfx('pop');
  renderWok(); renderPlate();
}
function renderPlate(){
  const dish = $('plate-dish'), info = $('plate-info'), plate = $('plate');
  plate.classList.remove('perfect-glow');
  if(!G.plate){
    dish.innerHTML = '<span class="plate-empty">Piring kosong</span>';
    info.textContent = 'Belum ada hidangan di piring.';
    $('btn-serve').disabled = true;
    return;
  }
  const p = G.plate;
  dish.innerHTML = dishHTML(p.recipe, p.quality);
  const qLabel = p.quality === 'perfect' ? '✨ PERFECT!' : p.quality === 'burned' ? '🔥 Gosong' : '😐 Kurang Matang';
  info.innerHTML = '<b>' + p.recipe.icon + ' ' + p.recipe.name + '</b> — ' + qLabel;
  if(p.quality === 'perfect') plate.classList.add('perfect-glow');
  $('btn-serve').disabled = G.paused || G.over || G.presenting;
}
function resetWok(){
  if(G.cooking){ G.cooking = false; $('stove').classList.remove('cooking'); $('wok').classList.remove('cooking'); stopSizzle(); }
  G.wok = []; G.plate = null; G.cookProgress = 0;
  sfx('click');
  renderWok(); renderPlate();
}

/* ================= SERVING & SCORING ================= */
function serveDish(){
  if(!G.plate || G.paused || G.over || G.presenting) return;
  const p = G.plate;
  const match = G.customers.filter(c => !c.leaving && c.recipe.id === p.recipe.id)
    .sort((a, b) => a.patience - b.patience)[0];
  if(!match){
    /* wrong serve */
    G.stats.wrong++; G.combo = 0; G.stats.perfectStreak = 0;
    sfx('fail'); shakeScreen();
    floater('SALAH PESANAN! −25', 'red');
    G.score = Math.max(0, G.score - 25);
    G.plate = null;
    toast('😞 Tidak ada yang pesan hidangan ini. −25 skor, combo hilang!');
    renderPlate(); updateHUD(); checkAchievements();
    return;
  }
  const L = LEVELS[G.level - 1];
  const patienceFrac = match.patience / match.maxPatience;
  let pts = p.recipe.points;
  if(p.quality === 'perfect') pts = Math.round(pts * 1.5);
  else if(p.quality === 'undercooked') pts = Math.round(pts * 0.5);
  else if(p.quality === 'burned') pts = Math.round(pts * 0.25);
  const fastBonus = p.quality !== 'burned' ? Math.round(patienceFrac * 40) : 0;
  pts += fastBonus;
  const comboMult = 1 + Math.min(2, G.combo * 0.25);
  pts = Math.round(pts * comboMult * (1 + 0.05 * upg('prep')) * L.reward * (match.vip ? 2 : 1));
  let coins = Math.round(pts / 12) + p.recipe.coins;
  coins = Math.round(coins * (1 + 0.15 * upg('plates')) * (G.event && G.event.id === 'double' ? 2 : 1) * (match.vip ? 1.5 : 1));
  G.score += pts; S.coins += coins;
  G.stats.served++; S.totalServed++;
  if(p.quality === 'perfect'){ G.stats.perfect++; S.totalPerfect++; G.stats.perfectStreak++; G.combo++; }
  else { G.combo = p.quality === 'burned' ? 0 : G.combo; G.stats.perfectStreak = 0; }
  if(match.vip) G.stats.vipServed++;
  G.bestComboRun = Math.max(G.bestComboRun, G.combo);
  S.bestCombo = Math.max(S.bestCombo, G.combo);
  const servedIn = (Date.now() - match.arrivedAt) / 1000;
  if(servedIn <= 20) unlockAchievement('speed-champ');
  match.mood = p.quality === 'burned' ? 'sad' : 'happy';
  const card = document.querySelector('.customer[data-seq="' + match.seq + '"]');
  if(card) coinFly(card);
  sfx(p.quality === 'perfect' ? 'success' : 'coin');
  floater('+' + pts + ' 🎉', p.quality === 'perfect' ? 'green' : '', window.innerWidth / 2, 180);
  if(p.quality === 'perfect' && G.combo >= 2) toast('🔥 COMBO x' + (1 + Math.min(2, G.combo * 0.25)).toFixed(2).replace(/\.?0+$/, '') + ' — ' + G.combo + ' perfect beruntun!', true);
  G.customers = G.customers.filter(c => c.seq !== match.seq);
  G.plate = null;
  dailyProgress('serve', 1);
  if(p.quality === 'perfect') dailyProgress('perfect', 1);
  dailyProgress('coins', coins);
  persist();
  renderCustomers(); renderPlate(); updateHUD(); checkAchievements();
  /* food presentation close-up (pauses the clock briefly) */
  showShowcase(match, p, pts, coins);
}
function showShowcase(customer, plate, pts, coins){
  G.presenting = true;
  const q = plate.quality;
  const qText = q === 'perfect' ? '✨ PERFECT! ✨' : q === 'burned' ? '🔥 Gosong…' : '😐 Kurang Matang';
  const qCls = q === 'perfect' ? 'perfect' : q === 'burned' ? 'burned' : '';
  const say = q === 'perfect' ? '“ENAK BANGET! Ini nasgor terenak se-kota!”'
    : q === 'burned' ? '“Aduh… gosong, Mas. Lain kali hati-hati ya.”'
    : '“Hmm, nasinya masih agak keras… tapi lumayan.”';
  openOverlay('<div class="showcase"><h2>🍽️ HIDANGAN SELESAI!</h2>'
    + '<div class="plate-big' + (q === 'perfect' ? ' gold' : '') + '">' + dishHTML(plate.recipe, q) + '</div>'
    + '<div class="dish-name">' + plate.recipe.icon + ' ' + plate.recipe.name + '</div>'
    + '<div class="quality ' + qCls + '">' + qText + '</div>'
    + '<p style="margin-top:6px">' + customer.def.name + ' (' + customer.def.type + '): ' + say + '</p>'
    + '<p style="color:#ffd34d;font-weight:900;font-size:18px">+' + pts + ' skor &nbsp;•&nbsp; +' + coins + ' 🪙</p>'
    + '<div class="modal-btns"><button class="btn btn-primary" id="btn-showcase-ok">LANJUT MASAK →</button></div></div>');
  const close = () => { closeOverlay(); G.presenting = false; maybeLevelComplete(); };
  $('btn-showcase-ok').addEventListener('click', () => { sfx('click'); close(); });
  setTimeout(() => { if(G.presenting){ close(); } }, 2600);
  if(q === 'perfect') confettiLite();
}
function confettiLite(){ for(let i=0;i<24;i++){ const c=document.createElement('div'); c.className='confetti'; c.style.left=(30+Math.random()*40)+'vw'; c.style.background=['#ffd34d','#7dff9b','#19c3e6'][i%3]; c.style.animationDuration=(1.5+Math.random())+'s'; document.body.appendChild(c); setTimeout(()=>c.remove(),3200); } }

/* ================= EVENTS ================= */
function startRandomEvent(){
  const pool = EVENTS.filter(e => !(G.event && e.id === G.event.id));
  const ev = pool[Math.floor(Math.random() * pool.length)];
  G.event = ev; G.eventLeft = ev.dur;
  if(ev.id === 'vip') G.eventLeft = 0;
  const b = $('event-banner');
  b.textContent = '⚡ ' + ev.name + ' — ' + ev.desc;
  b.classList.remove('hidden');
  $('hud-event').hidden = false;
  $('hud-event-name').textContent = ev.name;
  sfx('win');
  toast('⚡ EVENT: ' + ev.name, true);
  if(ev.id === 'vip'){ setTimeout(() => { if(!G.over) spawnCustomer(true); }, 1200); endEventSoon(); }
  setTimeout(() => { b.classList.add('hidden'); }, 5000);
}
function endEventSoon(){ setTimeout(() => { if(G.event && G.event.id === 'vip'){ G.event = null; $('hud-event').hidden = true; } }, 4000); }

/* ================= TICK (250ms) ================= */
function tick(){
  if(G.paused || G.over || G.presenting) return;
  G.tickN++;
  const L = LEVELS[G.level - 1];
  /* level timer */
  G.timeLeft = Math.max(0, G.timeLeft - 0.25);
  /* cooking progress */
  if(G.cooking){
    G.cookProgress += 100 * 0.25 / G.cookDur;
    if(G.cookProgress >= 100){ G.cookProgress = 100; updateCookBar(); stopCookBurned(); }
    else {
      const q = qualityOf(G.cookProgress, perfectWindow());
      const st = $('cook-status');
      if(q === 'undercooked'){ st.textContent = '🍳 Memasak… masih mentah (' + Math.round(G.cookProgress) + '%)'; st.className = 'cook-status'; }
      else if(q === 'perfect'){ st.textContent = '✨ PERFECT! Angkat sekarang! (' + Math.round(G.cookProgress) + '%)'; st.className = 'cook-status perfect'; }
      else { st.textContent = '⚠️ Hampir gosong! (' + Math.round(G.cookProgress) + '%)'; st.className = 'cook-status burned'; }
      updateCookBar();
    }
  }
  /* customers patience */
  let changed = false;
  G.customers.forEach(c => { c.patience -= 0.25; if(c.patience <= 0 && !c.leaving){ c.leaving = true; changed = true; } });
  G.customers = G.customers.filter(c => {
    if(c.leaving){ G.stats.left++; G.combo = 0; G.stats.perfectStreak = 0; c.mood = 'angry'; return false; }
    return true;
  });
  if(changed){ sfx('fail'); toast('😠 Pelanggan kabur karena kelamaan! Combo hilang.'); renderCustomers(); }
  else if(G.tickN % 4 === 0) renderCustomers();
  /* spawn */
  G.spawnIn -= 0.25;
  if(G.spawnIn <= 0){
    spawnCustomer();
    let interval = L.spawn;
    if(G.event && G.event.id === 'rush') interval /= 2;
    G.spawnIn = interval * (0.85 + Math.random() * 0.3);
  }
  /* random events */
  if(!G.event){
    G.nextEventIn -= 0.25;
    if(G.nextEventIn <= 0){ startRandomEvent(); G.nextEventIn = 45 + Math.random() * 30; }
  } else if(G.event.dur > 0){
    G.eventLeft -= 0.25;
    $('hud-event-time').textContent = Math.ceil(G.eventLeft) + ' dtk';
    if(G.eventLeft <= 0){ G.event = null; $('hud-event').hidden = true; toast('Event selesai.'); }
  }
  /* HUD */
  updateHUD();
  /* time up */
  if(G.timeLeft <= 0){ levelComplete(G.score >= L.target); }
}
function updateHUD(){
  $('hud-score').textContent = G.score;
  $('hud-coins').textContent = S.coins;
  $('hud-time').textContent = Math.ceil(G.timeLeft);
  $('hud-time').parentElement.style.color = G.timeLeft < 20 ? '#ff8a8a' : '';
  const comboEl = $('hud-combo');
  if(G.combo >= 2){ comboEl.hidden = false; $('hud-combo-n').textContent = (1 + Math.min(2, G.combo * 0.25)).toFixed(2).replace(/\.?0+$/, ''); }
  else comboEl.hidden = true;
}
function maybeLevelComplete(){
  if(G.over) return;
  const L = LEVELS[G.level - 1];
  if(G.score >= L.target) levelComplete(true);
}

/* ================= LEVEL END ================= */
function levelComplete(win){
  if(G.over) return;
  G.over = true; stopTick();
  const L = LEVELS[G.level - 1];
  const acc = G.stats.served ? Math.round((G.stats.served - G.stats.wrong) / Math.max(1, G.stats.served) * 100) : 100;
  const mission = STORY_MISSIONS[G.level];
  let missionDone = false, missionBonus = 0;
  if(win && mission && mission.check(G.stats)){ missionDone = true; missionBonus = mission.bonus; S.coins += missionBonus; }
  if(win){
    if(G.stats.burned === 0){ unlockAchievement('no-burn'); dailyProgress('noburn', 1); }
    if(G.level === 10) unlockAchievement('master-chef');
    S.unlockedLevel = Math.max(S.unlockedLevel, Math.min(10, G.level + 1));
    S.bestScore = Math.max(S.bestScore, G.score);
    S.scores.push({score:G.score, level:G.level, date:todayStr()});
    S.scores.sort((a, b) => b.score - a.score); S.scores = S.scores.slice(0, 5);
    S.gamesPlayed++;
    persist();
    sfx('win');
    if(G.level === 10){ confetti(); showEnding(); return; }
  } else sfx('fail');
  const title = win ? '🎉 LEVEL ' + G.level + ' SELESAI!' : '😢 WAKTU HABIS — LEVEL GAGAL';
  const sub = win ? L.name + ' berhasil ditaklukkan!' : 'Target ' + L.target + ' skor belum tercapai. Coba lagi!';
  openOverlay('<h2>' + title + '</h2><p style="text-align:center">' + sub + '</p>'
    + (mission ? '<p style="text-align:center;font-size:14px;color:#ffd34d">📖 ' + mission.desc + (missionDone ? ' — ✅ BERHASIL! +' + missionBonus + ' 🪙' : ' — ❌ belum berhasil') + '</p>' : '')
    + '<div class="stat-grid">'
    + '<div class="stat"><b>' + G.score + '</b><span>Skor (target ' + L.target + ')</span></div>'
    + '<div class="stat"><b>' + S.coins + ' 🪙</b><span>Total Koin</span></div>'
    + '<div class="stat"><b>' + G.stats.served + '</b><span>Pesanan Selesai</span></div>'
    + '<div class="stat"><b>' + acc + '%</b><span>Akurasi</span></div>'
    + '<div class="stat"><b>' + G.stats.perfect + '</b><span>Perfect</span></div>'
    + '<div class="stat"><b>' + G.stats.burned + '</b><span>Gosong</span></div></div>'
    + '<div class="modal-btns">'
    + (win && G.level < 10 ? '<button class="btn btn-primary" id="btn-next">LEVEL ' + (G.level + 1) + ' →</button>' : '')
    + (win && G.level === 10 ? '' : '<button class="btn" id="btn-retry">🔄 ULANGI LEVEL</button>')
    + '<button class="btn" id="btn-tomenu">🏠 MENU</button></div>');
  const next = $('btn-next'); if(next) next.addEventListener('click', () => { sfx('click'); startLevel(G.level + 1); });
  $('btn-retry').addEventListener('click', () => { sfx('click'); startLevel(G.level); });
  $('btn-tomenu').addEventListener('click', () => { sfx('click'); showScreen('menu'); });
}

/* ================= STORY MODE ================= */
function showDialogue(lines, done){
  let i = 0;
  const render = () => {
    const l = lines[i];
    openOverlay('<div class="story-scene"><h2>📖 CERITA</h2>'
      + '<div class="dialogue"><div class="portrait">' + l.who + '</div>'
      + '<div class="story-text" style="flex:1"><span class="story-speaker">' + l.name + ':</span><br>' + l.text + '</div></div>'
      + '<div class="modal-btns"><button class="btn btn-primary" id="btn-dlg-next">' + (i < lines.length - 1 ? 'LANJUT →' : 'MULAI MASAK! 🍳') + '</button>'
      + '<button class="btn" id="btn-dlg-skip">LEWATI ⏭️</button></div></div>');
    $('btn-dlg-next').addEventListener('click', () => { sfx('click'); i++; if(i >= lines.length){ closeOverlay(); done(); } else render(); });
    $('btn-dlg-skip').addEventListener('click', () => { sfx('click'); closeOverlay(); done(); });
  };
  render();
}
function storyIntro(done){
  let i = 0;
  const render = () => {
    const s = STORY_INTRO[i];
    openOverlay('<div class="story-scene"><h2>📖 NASGOR RUSH — Cerita</h2>'
      + '<div class="story-art">' + s.art + '</div>'
      + '<div class="story-text"><span class="story-speaker">' + s.speaker + ':</span><br>' + s.text + '</div>'
      + '<p style="font-size:13px;color:#d9c9a8;margin-top:8px">Panel ' + (i + 1) + ' / ' + STORY_INTRO.length + '</p>'
      + '<div class="modal-btns"><button class="btn btn-primary" id="btn-story-next">' + (i < STORY_INTRO.length - 1 ? 'LANJUT →' : 'MULAI BERJUALAN! 🍳') + '</button>'
      + '<button class="btn" id="btn-story-skip">LEWATI ⏭️</button></div></div>');
    $('btn-story-next').addEventListener('click', () => { sfx('click'); i++; if(i >= STORY_INTRO.length){ closeOverlay(); S.introSeen = true; persist(); done(); } else render(); });
    $('btn-story-skip').addEventListener('click', () => { sfx('click'); closeOverlay(); S.introSeen = true; persist(); done(); });
  };
  render();
}
function showEnding(){
  let i = 0;
  confetti();
  const render = () => {
    const s = STORY_ENDING[i];
    openOverlay('<div class="story-scene"><h2>🏆 AKHIR CERITA — WARUNG LEGENDA!</h2>'
      + '<div class="story-art">' + s.art + '</div>'
      + '<div class="story-text"><span class="story-speaker">' + s.speaker + ':</span><br>' + s.text + '</div>'
      + '<div class="modal-btns"><button class="btn btn-primary" id="btn-end-next">' + (i < STORY_ENDING.length - 1 ? 'LANJUT →' : 'KEMBALI KE MENU 🏠') + '</button></div></div>');
    $('btn-end-next').addEventListener('click', () => { sfx('click'); i++; if(i >= STORY_ENDING.length){ closeOverlay(); showScreen('menu'); } else render(); });
  };
  render();
}

/* ================= PAUSE ================= */
function togglePause(force){
  if(G.screen !== 'game' || G.over) return;
  G.paused = force !== undefined ? force : !G.paused;
  if(G.cooking){ if(G.paused) stopSizzle(); else startSizzle(); }
  if(G.paused){
    openOverlay('<h2>⏸ JEDA</h2><p style="text-align:center">Istirahat sebentar, wok-nya nungguin.</p>'
      + '<div class="modal-btns"><button class="btn btn-primary" id="btn-resume">▶️ LANJUT</button>'
      + '<button class="btn" id="btn-restart">🔄 ULANG LEVEL</button>'
      + '<button class="btn" id="btn-quit">🏠 MENU</button></div>');
    $('btn-resume').addEventListener('click', () => { sfx('click'); closeOverlay(); G.paused = false; });
    $('btn-restart').addEventListener('click', () => { sfx('click'); startLevel(G.level, true); });
    $('btn-quit').addEventListener('click', () => { sfx('click'); stopTick(); showScreen('menu'); });
  } else closeOverlay();
}

/* ================= PARTICLES (steam / fire / smoke) ================= */
const fxCanvas = $('fx'), fxCtx = fxCanvas.getContext('2d');
const particles = [];
function spawnParticle(){
  const kind = Math.random();
  particles.push({
    x: 60 + Math.random() * 240, y: 150,
    vx: (Math.random() - 0.5) * 0.6, vy: -(0.6 + Math.random() * 1.1),
    r: 3 + Math.random() * 7, life: 1,
    kind: G.cooking && kind < 0.25 ? 'fire' : kind < 0.6 ? 'steam' : 'smoke',
  });
  if(particles.length > 90) particles.shift();
}
function fxLoop(){
  requestAnimationFrame(fxLoop);
  if(G.screen !== 'game') return;
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  const active = G.cooking || (G.plate && G.plate.quality !== 'burned');
  if(active && Math.random() < 0.5) spawnParticle();
  for(let i = particles.length - 1; i >= 0; i--){
    const p = particles[i];
    p.x += p.vx + Math.sin(p.y * 0.05) * 0.4; p.y += p.vy; p.life -= 0.012;
    if(p.life <= 0 || p.y < 0){ particles.splice(i, 1); continue; }
    fxCtx.globalAlpha = Math.max(0, p.life * (p.kind === 'steam' ? 0.5 : 0.7));
    fxCtx.fillStyle = p.kind === 'fire' ? '#ff9a1c' : p.kind === 'steam' ? '#ffffff' : '#9a9a9a';
    fxCtx.beginPath(); fxCtx.arc(p.x, p.y, p.r * (1.6 - p.life * 0.6), 0, Math.PI * 2); fxCtx.fill();
  }
  fxCtx.globalAlpha = 1;
}
fxLoop();

/* ================= INPUT ================= */
$('btn-play').addEventListener('click', () => {
  sfx('click');
  const go = () => startLevel(S.unlockedLevel);
  if(!S.introSeen) storyIntro(go); else go();
});
$('btn-story').addEventListener('click', () => { sfx('click'); storyIntro(() => startLevel(S.unlockedLevel)); });
$('btn-howto').addEventListener('click', openHowTo);
$('btn-upgrades').addEventListener('click', openUpgrades);
$('btn-achievements').addEventListener('click', openAchievements);
$('btn-challenge').addEventListener('click', openChallenge);
$('btn-scores').addEventListener('click', openScores);
$('btn-sound').addEventListener('click', () => {
  soundOn = !soundOn;
  try{ localStorage.setItem('nasgor-sound', soundOn ? 'on' : 'off'); }catch(e){}
  if(!soundOn) stopSizzle();
  renderMenu(); sfx('click');
});
$('btn-pause').addEventListener('click', () => { sfx('click'); togglePause(); });
$('btn-music').addEventListener('click', () => {
  musicOn = !musicOn;
  try{ localStorage.setItem('nasgor-music', musicOn ? 'on' : 'off'); }catch(e){}
  if(musicOn) startMusic(); else stopMusic();
  $('btn-music').textContent = musicOn ? '🎵' : '🔇';
  toast(musicOn ? '🎵 Musik ON' : '🎵 Musik OFF');
});
$('btn-sfx').addEventListener('click', () => {
  soundOn = !soundOn;
  try{ localStorage.setItem('nasgor-sound', soundOn ? 'on' : 'off'); }catch(e){}
  $('btn-sfx').textContent = soundOn ? '🔊' : '🔇';
  toast(soundOn ? '🔊 SFX ON' : '🔊 SFX OFF');
});
$('btn-cook').addEventListener('click', () => { if(!G.cooking) startCook(); });
$('btn-plate').addEventListener('click', () => { plateDish(); });
$('btn-serve').addEventListener('click', () => { serveDish(); });
$('btn-reset').addEventListener('click', () => { resetWok(); });
document.addEventListener('keydown', e => {
  if(G.screen !== 'game') return;
  if(e.key === 'p' || e.key === 'P' || e.key === 'Escape'){ togglePause(); return; }
  if(G.paused || G.over || G.presenting) return;
  if(e.key === ' '){ e.preventDefault(); if(G.cooking || G.cookProgress > 0) plateDish(); else startCook(); }
  else if(e.key === 's' || e.key === 'S'){ serveDish(); }
  else if(e.key === 'r' || e.key === 'R'){ resetWok(); }
  else {
    const idx = ['1','2','3','4','5','6','7','8','9','0'].indexOf(e.key);
    if(idx >= 0 && INGREDIENTS[idx]){
      const btn = document.querySelector('.ing[data-idx="' + idx + '"]');
      addIngredient(INGREDIENTS[idx].id, btn);
    }
  }
});

/* ================= INIT ================= */
$('btn-music').textContent = musicOn ? '🎵' : '🔇';
$('btn-sfx').textContent = soundOn ? '🔊' : '🔇';
renderMenu();
document.documentElement.setAttribute('data-shot-ready', 'true');

/* debug / test hook (drives the real game logic, no fake state) */
window.NASGOR = {
  get state(){ return {screen:G.screen, level:G.level, score:G.score, coins:S.coins, timeLeft:G.timeLeft,
    combo:G.combo, wok:G.wok.slice(), cooking:G.cooking, cookProgress:G.cookProgress,
    plate:G.plate ? {recipe:G.plate.recipe.id, quality:G.plate.quality} : null,
    customers:G.customers.map(c => ({name:c.def.name, recipe:c.recipe.id, patience:Math.round(c.patience), vip:c.vip})),
    event:G.event ? G.event.id : null, paused:G.paused, over:G.over, save:S}; },
  get recipes(){ return RECIPES; },
  get levels(){ return LEVELS; },
  startLevel, serveDish, resetWok, startCook, plateDish, addIngredient,
  debug:{
    setTime(s){ G.timeLeft = s; },
    setScore(s){ G.score = s; },
    addCoins(n){ S.coins += n; persist(); updateHUD(); },
    forceEvent(id){ const ev = EVENTS.find(e => e.id === id); if(ev){ G.event = ev; G.eventLeft = ev.dur; } },
  },
};
