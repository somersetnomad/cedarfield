/* Cedarfield After Dark — app shell: state, routing, spoiler guard, rooms, ledger, satchel, secrets, narrator. */
(function(){
const $ = (s, el) => (el||document).querySelector(s), $$ = (s, el) => Array.from((el||document).querySelectorAll(s));
const esc = s => String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
CF.esc = esc; CF.$ = $; CF.$$ = $$;
CF.CH = CF.CH || {};

/* ---------- State (localStorage, guarded) ---------- */
const KEY = 'cedarfield.v1';
const blank = { ch: 1, ticks: {}, notes: {}, keys: {}, curios: {}, open: {}, done: {}, vals: {}, theme: 'auto', said: {}, seen: {} };
let S;
try { S = Object.assign({}, blank, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch(e) { S = Object.assign({}, blank); }
CF.S = S;
let saveT;
CF.save = function(){ clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {} }, 150); };
CF.has = k => !!S.open[k.replace('open_','')];

/* ---------- Chapter loading ---------- */
const loading = {};
CF.load = function(n){
  if (CF.CH[n]) return Promise.resolve(CF.CH[n]);
  if (loading[n]) return loading[n];
  return loading[n] = new Promise(res => { const s = document.createElement('script'); s.src = 'content/chapter-' + String(n).padStart(2,'0') + '.js';
    s.onload = () => res(CF.CH[n] || null); s.onerror = () => res(null); document.head.appendChild(s); });
};
CF.loadUpTo = n => Promise.all(Array.from({length:n}, (_,i) => CF.load(i+1))).then(a => a.filter(Boolean));
CF.title = n => (CF.CHAPTERS[n-1] || [n,'Chapter '+n])[1];

/* ---------- Progress maths ---------- */
const tk = (c, r, i) => 'c'+c+':'+r+':'+i;
CF.tk = tk;
CF.cellPct = (c, r) => { let n = 0; for (let i = 0; i < 9; i++) if (S.ticks[tk(c,r,i)]) n++; return n/9; };
CF.roomPct = r => { let n=0, t=0; for (let c=1;c<=S.ch;c++){ t+=9; for(let i=0;i<9;i++) if(S.ticks[tk(c,r,i)]) n++; } return t? n/t : 0; };
CF.tickCount = () => Object.keys(S.ticks).filter(k => S.ticks[k]).length;

/* ---------- Theme ---------- */
function applyTheme(){ const r = document.documentElement; if (S.theme === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', S.theme);
  const b = $('#themeBtn'); if (b) b.textContent = {auto:'Theme: auto', light:'Theme: day', dark:'Theme: night'}[S.theme]; }

/* ---------- Narrator: Dot ---------- */
let dotTimer;
CF.dot = function(text, opts){
  opts = opts || {};
  const box = $('#dot'), msg = $('#dotMsg');
  msg.textContent = text; box.classList.add('open'); box.setAttribute('aria-hidden','false');
  clearTimeout(dotTimer); if (!opts.stay) dotTimer = setTimeout(() => box.classList.remove('open'), 14000);
};
function dotSpeak(){
  const t = $('#dotMsg').textContent; if (!('speechSynthesis' in window) || !t) return;
  speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.rate = 0.95; u.pitch = 0.9;
  const v = speechSynthesis.getVoices().find(v => /en-(US|GB)/.test(v.lang) && /female|samantha|victoria|zira|karen|serena|moira/i.test(v.name)) || speechSynthesis.getVoices().find(v => /^en/.test(v.lang));
  if (v) u.voice = v; speechSynthesis.speak(u);
}
function dotMilestone(){ const n = CF.tickCount(); CF.DOT.progress.forEach(([at, line]) => { if (n >= at && !S.said['p'+at]) { S.said['p'+at] = 1; CF.save(); CF.dot(line); } }); }
CF.dotMilestone = dotMilestone;

/* ---------- Answers (hashed) ---------- */
const norm = s => String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').trim();
CF.check = (h, a) => (CF.ANSWERS[h] || []).includes(norm(a));

/* ---------- Curios & keys ---------- */
function takeCurio(room){
  if (S.curios[room]) { CF.dot('Already in your satchel: ' + CF.CURIOS[room][0] + '.'); return; }
  S.curios[room] = 1; CF.save(); renderSatchel();
  const n = Object.keys(S.curios).length;
  CF.dot('You picked up ' + CF.CURIOS[room][0].replace(/^A /,'a ') + '. ' + CF.CURIOS[room][1] + ' (' + n + ' of 10 curios.)');
  if (n >= 10 && !S.keys.woods) CF.dot('All ten curios. Somewhere off the driveway a path has opened, if you have read far enough.', {stay:true});
}
function giveKey(k){ if (S.keys[k]) return; S.keys[k] = 1; S.open[k] = 1; CF.save(); renderSatchel(); CF.dot(CF.DOT.keyfound + ' (' + CF.SECRETS[k].key + '.)'); }
function renderSatchel(){
  const el = $('#satchelBody'); if (!el) return;
  const keys = Object.keys(CF.SECRETS).map(k => `<li class="${S.keys[k]?'got':''}"><span class="kicon" aria-hidden="true"></span>${S.keys[k] ? `<a href="#/secret/${k}">${esc(CF.SECRETS[k].key)}</a> <small>opens ${esc(CF.SECRETS[k].name)}</small>` : '<span>Empty hook</span>'}</li>`).join('');
  const cur = CF.STUDY_ROOMS.concat(['hall']).map(r => `<li class="${S.curios[r]?'got':''}">${S.curios[r] ? `<strong>${esc(CF.CURIOS[r][0])}</strong><small>${esc(CF.CURIOS[r][1])}</small>` : `<span>Something in the ${esc(CF.ROOMS[r].short)} painting</span>`}</li>`).join('');
  el.innerHTML = `<h3>Keys <small>${Object.keys(S.keys).length} of 7</small></h3><ul class="keys">${keys}</ul><h3>Curios <small>${Object.keys(S.curios).length} of 11</small></h3><ul class="curios">${cur}</ul>
    <p class="fine">Ten curios (any ten) open the Woods Trail once you reach chapter 55. All seven keys open the Stranger’s Dossier.</p>`;
  const c = $('#satchelCount'); if (c) c.textContent = Object.keys(S.keys).length + ' keys · ' + Object.keys(S.curios).length + ' curios';
}
CF.renderSatchel = renderSatchel;

/* ---------- Views ---------- */
const main = () => $('#main');
function setTitle(t){ document.title = t ? t + ' — Cedarfield After Dark' : 'Cedarfield After Dark'; }

function chapterPicker(cur, room){
  const opts = Array.from({length:S.ch}, (_,i) => `<option value="${i+1}" ${i+1===cur?'selected':''}>Chapter ${i+1}: ${esc(CF.title(i+1))}</option>`).join('');
  return `<div class="chpick"><button class="btn ghost" data-nav="${cur-1}" ${cur<=1?'disabled':''} aria-label="Previous chapter">‹</button>
    <label><span class="sr">Chapter</span><select data-chsel="${room}">${opts}</select></label>
    <button class="btn ghost" data-nav="${cur+1}" ${cur>=S.ch?'disabled':''} aria-label="Next chapter">›</button></div>`;
}

function doors(room){
  const nb = CF.LINKS[room].map(r => `<a class="door" href="#/room/${r}"><span class="dname">${esc(CF.ROOMS[r].name)}</span><span class="dsub">${esc(CF.ROOMS[r].subject)}</span></a>`).join('');
  const sec = Object.keys(CF.SECRETS).filter(k => CF.SECRETS[k].where === room);
  const sd = sec.map(k => {
    const s = CF.SECRETS[k];
    if (S.ch < s.minCh) return `<div class="door locked"><span class="dname">A locked door</span><span class="dsub">Keep reading. Something here opens later.</span></div>`;
    if (S.open[k]) return `<a class="door secret" href="#/secret/${k}"><span class="dname">${esc(s.name)}</span><span class="dsub">Unlocked</span></a>`;
    if (s.curios) return `<div class="door locked riddle"><span class="dname">A path into the trees</span><span class="dsub">${esc(s.riddle)}</span><button class="btn" data-woods="1">Try the path</button></div>`;
    return `<form class="door locked riddle" data-riddle="${k}"><span class="dname">A door with a riddle</span><span class="dsub">${esc(s.riddle)}</span>
      <label><span class="sr">Your answer</span><input name="a" autocomplete="off" placeholder="Your answer"></label><button class="btn">Try the door</button><button type="button" class="btn ghost" data-hint="${k}">Hint</button><output></output></form>`;
  }).join('');
  return `<section class="doors" aria-label="Doors"><h2>Doors from here</h2><div class="doorgrid">${nb}${sd}</div></section>`;
}

function banner(room){
  return `<figure class="banner enter-${room}" aria-describedby="cap-${room}">${CF.art.scene(room)}<figcaption id="cap-${room}">${esc(CF.ROOMS[room] ? CF.ROOMS[room].caption : '')}</figcaption></figure>`;
}

/* Hall: map, ledger, chapter setter, satchel, PDF link */
function viewHall(){
  setTitle('');
  const R = CF.ROOMS.hall;
  const grid = (() => {
    const head = CF.STUDY_ROOMS.map(r => `<th scope="col"><a href="#/room/${r}" title="${esc(CF.ROOMS[r].name)}">${esc(CF.ROOMS[r].short)}</a></th>`).join('');
    let rows = '';
    for (let c = 1; c <= 56; c++) {
      const vis = c <= S.ch;
      rows += `<tr class="${vis?'':'future'}"><th scope="row">${vis ? `<a href="#/chapter/${c}"><span class="cn">${c}</span> ${esc(CF.title(c))}</a>` : `<span class="cn">${c}</span> <span class="hidden-t">not yet</span>`}</th>` +
        CF.STUDY_ROOMS.map(r => { const p = vis ? CF.cellPct(c, r) : 0; return `<td>${vis ? `<a class="cell" href="#/room/${r}/${c}" style="--p:${p.toFixed(2)}" aria-label="Chapter ${c}, ${esc(CF.ROOMS[r].short)}: ${Math.round(p*9)} of 9 activities ticked"></a>` : '<span class="cell off"></span>'}</td>`; }).join('') + '</tr>';
    }
    return `<div class="ledgerwrap"><table class="ledger"><caption>Your ledger: each square is one room for one chapter, darker as you tick off its nine activities.</caption><thead><tr><th scope="col">Chapter</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
  })();
  const pips = Array.from({length:56}, (_,i) => `<span class="pip ${S.done[i+1]?'done':''} ${i+1<=S.ch?'reached':''}" title="Chapter ${i+1}"></span>`).join('');
  main().innerHTML = `${banner('hall')}
  <header class="roomhead"><h1>${esc(R.name)}</h1><p class="sub">${esc(R.blurb)}</p></header>
  <section class="intro panel">
    <p><strong>Cedarfield After Dark</strong> is a free, fan-made companion for adults reading Harlan Coben’s <cite>The Stranger</cite> on their own or with a book club. Use it alongside your own copy. The novel is in copyright, so nothing here quotes it; passages are pointed to by chapter and scene.</p>
    <div class="setch"><label for="chset">I have read up to chapter</label> <input id="chset" type="number" min="1" max="56" value="${S.ch}"> <button class="btn" id="chsetBtn">Set</button>
    <span class="fine">Everything after your chapter stays hidden.</span></div>
    <div class="pips" aria-label="Chapters reached and finished">${pips}</div>
    <p class="actions"><a class="btn" href="#/chapter/${S.ch}">Open chapter ${S.ch}</a> <a class="btn ghost" href="companion-guide.pdf" download>Download the printable guide (PDF)</a> <a class="btn ghost" href="#/howto">How to use this site</a></p>
  </section>
  <section class="mapsec"><h2>The town</h2><p class="fine">Every lit building is a room. Brighter windows mean more of that room is done.</p>${CF.art.map({roomPct: CF.roomPct, has: CF.has})}</section>
  <section class="panel"><h2>Ledger</h2>${grid}</section>
  <section class="panel satchel-inline"><h2>Your satchel</h2><div id="satchelBody"></div></section>
  ${doors('hall')}`;
  renderSatchel();
}

function viewHowto(){
  setTitle('How to use');
  main().innerHTML = `<header class="roomhead"><h1>How to use Cedarfield After Dark</h1></header><section class="panel prose">
  <p>Set your chapter in the Legion Hall. Everything after it stays face-down: summaries, questions, map pins, secret rooms. Move the marker as you read.</p>
  <p>Each chapter has a <a href="#/chapter/${S.ch}">chapter page</a> with a fresh summary, a scene list, thirty discussion questions (six marked for book clubs), three close-reading exercises, three essay or writing prompts, nine further readings and six cross-room projects with checklists.</p>
  <p>Each of the ten rooms looks at the same chapter from one angle. In every room you get a short reading of the chapter from that angle, nine activities of fifteen to sixty minutes, and six interactive tools. Tick activities off and your ledger fills in.</p>
  <p>Look closely at every painting. Something small in each one can be picked up. Some rooms have doors with riddles. Seven keys open the last room, which turns your notes into a printable commonplace book.</p>
  <p>Sound is off until you turn it on. Dot, who tends the Legion bar, will pipe up now and then; press <em>Read aloud</em> to hear her.</p>
  <p>Your progress lives only in this browser. Nothing is sent anywhere. Clearing your browser data clears it, so export your commonplace book now and then.</p>
  <p>Close-reading citations name the chapter and the scene, and sometimes where in the chapter it falls (opening, middle, close), because page numbers differ between editions.</p>
  <p class="fine">${esc(CF.BOOK.copyright)} This site is not affiliated with the author, publisher or any adaptation.</p></section>`;
}

async function viewChapter(n){
  n = Math.max(1, Math.min(56, n|0));
  if (n > S.ch) { main().innerHTML = `<section class="panel"><h1>Chapter ${n}</h1><p>${esc(CF.DOT.spoiler)}</p><p><a class="btn" href="#/">Back to the Legion Hall</a></p></section>`; CF.dot(CF.DOT.spoiler); return; }
  main().innerHTML = `<p class="loading">Turning the page…</p>`;
  const d = await CF.load(n);
  if (!d) { main().innerHTML = `<section class="panel"><h1>Chapter ${n}: ${esc(CF.title(n))}</h1><p>This chapter’s pages haven’t been written into the ledger yet.</p></section>`; return; }
  setTitle('Chapter ' + n);
  const q = d.questions.map((x,i) => `<li class="${x[1]?'club':''}">${esc(x[0])}${x[1]?' <span class="tag">Book club</span>':''}</li>`).join('');
  const close = d.close.map((c,i) => `<article class="close"><h3>Exercise ${i+1}: ${esc(c.focus)}</h3><p class="cite">Find it: ${esc(c.cite)}</p><ol>${c.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p class="ask">${esc(c.ask)}</p></article>`).join('');
  const projects = d.projects.map((p,i) => `<article class="project"><h3>${esc(p.t)}</h3><p class="fine">Rooms: ${p.rooms.map(r=>`<a href="#/room/${r}/${n}">${esc(CF.ROOMS[r].short)}</a>`).join(', ')}</p><ul class="checks">${p.steps.map((s,j)=>{ const k='p'+n+':'+i+':'+j; return `<li><label><input type="checkbox" data-pk="${k}" ${S.ticks[k]?'checked':''}> ${esc(s)}</label></li>`; }).join('')}</ul></article>`).join('');
  const reading = d.reading.map(([id, why]) => { const b = CF.BANK[id]; return b ? `<li><cite>${esc(b[0])}</cite> by ${esc(b[1])} (${esc(b[2])}). ${esc(why)}</li>` : ''; }).join('');
  const rooms = CF.STUDY_ROOMS.map(r => `<a class="roomchip" href="#/room/${r}/${n}" style="--p:${CF.cellPct(n,r).toFixed(2)}"><strong>${esc(CF.ROOMS[r].short)}</strong><span>${esc(CF.ROOMS[r].subject)}</span></a>`).join('');
  main().innerHTML = `<header class="roomhead chapterhead"><p class="kick">Chapter ${n} of 56 · told through ${esc(d.pov)}</p><h1>${esc(d.title)}</h1>${chapterPicker(n,'chapter')}</header>
  <div class="chapcols">
  <section class="panel prose"><h2>What happens</h2>${d.summary.map(p=>`<p>${esc(p)}</p>`).join('')}
    <h3>Scene by scene</h3><ol class="beats">${d.beats.map(b=>`<li>${esc(b)}</li>`).join('')}</ol>
    <h3>Who’s here</h3><dl class="cast">${d.cast.map(([a,b])=>`<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl>
    <p><label class="donebox"><input type="checkbox" id="chDone" ${S.done[n]?'checked':''}> I’ve finished this chapter</label></p></section>
  <section class="panel"><h2>This chapter, room by room</h2><div class="roomchips">${rooms}</div></section>
  </div>
  <section class="panel"><h2>Thirty questions</h2><p class="fine">Six are marked for book clubs: they open up disagreement. The rest move from what happened, to how it’s written, to what it means.</p><ol class="questions">${q}</ol></section>
  <section class="panel"><h2>Close reading</h2>${close}</section>
  <section class="panel"><h2>Essay and writing prompts</h2><ol class="prompts">${d.prompts.map(p=>`<li>${esc(p)}</li>`).join('')}</ol></section>
  <section class="panel"><h2>Further reading</h2><ul class="reading">${reading}</ul></section>
  <section class="panel"><h2>Cross-room projects</h2><div class="projects">${projects}</div></section>
  <p class="actions"><button class="btn ghost" onclick="window.print()">Print this chapter plan</button></p>`;
}

async function viewRoom(room, n){
  const R = CF.ROOMS[room]; if (!R) return viewHall();
  if (room === 'hall') return viewHall();
  n = n ? Math.min(n|0, S.ch) : (S.lastCh && S.lastCh <= S.ch ? S.lastCh : S.ch);
  S.lastCh = n; CF.save();
  setTitle(R.name);
  main().innerHTML = `${banner(room)}<header class="roomhead"><p class="kick">${esc(R.subject)}</p><h1>${esc(R.name)}</h1><p class="sub">${esc(R.blurb)}</p>${chapterPicker(n, room)}</header><div id="roombody"><p class="loading">Turning the page…</p></div>${doors(room)}`;
  const d = await CF.load(n);
  const body = $('#roombody'); if (!body) return;
  if (!d) { body.innerHTML = `<section class="panel"><p>Chapter ${n}’s pages for this room aren’t in the ledger yet.</p></section>`; return; }
  const acts = (d.acts[room] || []).map((a,i) => { const k = tk(n,room,i), nk = 'an:'+k;
    return `<li class="act ${S.ticks[k]?'ticked':''}"><label class="tickrow"><input type="checkbox" data-tk="${k}" ${S.ticks[k]?'checked':''}><span class="atitle">${esc(a[0])}</span><span class="mins">${esc(a[2]||30)} min</span></label><p>${esc(a[1])}</p>
      <details><summary>Notes</summary><textarea data-note="${nk}" rows="3" aria-label="Notes for ${esc(a[0])}">${esc(S.notes[nk]||'')}</textarea></details></li>`; }).join('');
  const tools = (CF.TOOLS[room] || []).map((t,i) => `<details class="tool" data-tool="${room}:${i}"><summary><span class="tname">${esc(t.name)}</span><span class="tdesc">${esc(t.desc)}</span></summary><div class="toolbody"></div></details>`).join('');
  body.innerHTML = `<section class="panel lens"><h2>Chapter ${n} from the ${esc(R.short)}</h2><p>${esc(d.lenses[room]||'')}</p><p class="fine"><a href="#/chapter/${n}">Summary, questions and projects for chapter ${n}</a></p></section>
    <section class="panel"><h2>Nine activities</h2><p class="fine">Tick them off as you go; your ledger fills in. Each takes 15 to 60 minutes.</p><ol class="acts">${acts}</ol></section>
    <section class="panel"><h2>Tools</h2><div class="tools">${tools}</div></section>`;
  CF.ctx = { ch: n, d, room };
}

async function viewSecret(k){
  const s = CF.SECRETS[k];
  if (!s || !S.open[k]) { main().innerHTML = `<section class="panel"><h1>Locked</h1><p>That door is still shut.</p><p><a class="btn" href="#/">Back to the hall</a></p></section>`; return; }
  setTitle(s.name);
  main().innerHTML = `<figure class="banner enter-secret">${CF.art.scene(k)}<figcaption>${esc(s.name)}</figcaption></figure><header class="roomhead"><p class="kick">Secret room</p><h1>${esc(s.name)}</h1></header><div id="secretbody"></div>
    <section class="doors"><h2>Way out</h2><div class="doorgrid"><a class="door" href="#/room/${s.where}"><span class="dname">${esc(CF.ROOMS[s.where].name)}</span></a><a class="door" href="#/"><span class="dname">American Legion Hall</span></a>${Object.keys(S.keys).length>=7?'<a class="door secret" href="#/dossier"><span class="dname">The Stranger’s Dossier</span></a>':''}</div></section>`;
  CF.SECRET_VIEWS[k]($('#secretbody'));
}

function viewDossier(){
  if (Object.keys(S.keys).length < 7) { main().innerHTML = `<section class="panel"><h1>The Stranger’s Dossier</h1><p>The folder is sealed with seven locks. You hold ${Object.keys(S.keys).length}.</p><p><a class="btn" href="#/">Back</a></p></section>`; return; }
  setTitle('The Stranger’s Dossier');
  if (!S.said.finale) { S.said.finale = 1; CF.save(); CF.dot(CF.DOT.finale, {stay:true}); }
  main().innerHTML = `<figure class="banner enter-secret">${CF.art.scene('dossier')}<figcaption>A manila folder under a desk lamp. Everything you noticed is inside.</figcaption></figure>
  <header class="roomhead"><p class="kick">The last room</p><h1>The Stranger’s Dossier</h1><p class="sub">The stranger kept files on other people’s secrets. This one is yours, and only you hold it. It gathers every note, journal entry, rating and draft you have written here into a commonplace book you can print or keep.</p></header>
  <section class="panel"><p class="actions"><button class="btn" id="cpOpen">Open my commonplace book</button> <button class="btn ghost" id="cpTxt">Download as a text file</button></p></section>
  <div id="cpPreview"></div>`;
  $('#cpPreview').innerHTML = CF.commonplace();
}

CF.commonplace = function(){
  const S2 = S, out = [];
  const label = k => { let m;
    if ((m = k.match(/^an:c(\d+):(\w+):(\d+)$/))) { const d = CF.CH[m[1]]; const a = d && d.acts[m[2]] && d.acts[m[2]][m[3]]; return `Chapter ${m[1]} · ${CF.ROOMS[m[2]].short} · ${a ? a[0] : 'Activity'}`; }
    if ((m = k.match(/^(\w+):c(\d+):?(.*)$/))) return `Chapter ${m[2]} · ${m[1].replace(/_/g,' ')}${m[3]?' · '+m[3].replace(/_/g,' '):''}`;
    return k.replace(/_/g,' '); };
  Object.keys(S2.notes).filter(k => String(S2.notes[k]).trim()).sort((a,b)=>{ const na=+(a.match(/c(\d+)/)||[0,999])[1], nb=+(b.match(/c(\d+)/)||[0,999])[1]; return na-nb || a.localeCompare(b); })
    .forEach(k => out.push(`<article class="cpentry"><h3>${esc(label(k))}</h3>${String(S2.notes[k]).split(/\n{2,}/).map(p=>`<p>${esc(p)}</p>`).join('')}</article>`));
  const ticks = CF.tickCount();
  return `<section class="panel commonplace"><h2>My commonplace book</h2><p class="fine">Reader of <cite>The Stranger</cite>, up to chapter ${S2.ch}. ${ticks} activities ticked. ${Object.keys(S2.curios).length} curios, ${Object.keys(S2.keys).length} keys.</p>${out.join('') || '<p>No notes yet. Write in any room and they will gather here.</p>'}</section>`;
};
function commonplaceText(){
  const tmp = document.createElement('div'); tmp.innerHTML = CF.commonplace();
  return $$('h2,h3,p', tmp).map(e => (e.tagName==='H3'?'\n## ':e.tagName==='H2'?'# ':'') + e.textContent).join('\n');
}
function openCommonplace(){
  const w = window.open('', '_blank'); if (!w) { CF.dot('Your browser blocked the new window. Use the text download instead.'); return; }
  w.document.write(`<!doctype html><meta charset="utf-8"><title>My commonplace book: The Stranger</title><link rel="stylesheet" href="${location.href.replace(/#.*$/,'').replace(/[^/]*$/,'')}css/style.css"><body class="cpwin"><main>${CF.commonplace()}<p><button onclick="print()">Print</button></p></main></body>`);
  w.document.close();
}

/* ---------- Router ---------- */
async function route(){
  const h = location.hash.replace(/^#\/?/, '').split('/');
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  let room = 'hall';
  if (h[0] === 'room') { room = h[1] || 'hall'; await viewRoom(room, h[2] ? +h[2] : 0); }
  else if (h[0] === 'chapter') { room = 'hall'; await viewChapter(+h[1] || S.ch); }
  else if (h[0] === 'secret') { room = h[1]; await viewSecret(h[1]); }
  else if (h[0] === 'dossier') { room = 'dossier'; viewDossier(); }
  else if (h[0] === 'howto') viewHowto();
  else viewHall();
  CF.audio.play(room);
  const m = main(); m.focus({preventScroll:true}); window.scrollTo(0,0);
  $$('.navrooms a').forEach(a => a.classList.toggle('here', a.getAttribute('href') === '#/room/'+room || (room==='hall' && a.getAttribute('href')==='#/')));
  if (h[0] === 'room' && CF.DOT.rooms[room] && !S.seen[room]) { S.seen[room] = 1; CF.save(); CF.dot(CF.DOT.rooms[room]); }
}
CF.route = route;

/* ---------- Events ---------- */
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.tk) { S.ticks[t.dataset.tk] = t.checked ? 1 : 0; if (!t.checked) delete S.ticks[t.dataset.tk]; t.closest('.act').classList.toggle('ticked', t.checked); CF.save(); dotMilestone(); }
  else if (t.dataset.pk) { if (t.checked) S.ticks[t.dataset.pk] = 1; else delete S.ticks[t.dataset.pk]; CF.save(); }
  else if (t.dataset.chsel) { const r = t.dataset.chsel; location.hash = r === 'chapter' ? '#/chapter/' + t.value : '#/room/' + r + '/' + t.value; }
  else if (t.id === 'chDone') { const n = +location.hash.split('/')[2]; if (t.checked) S.done[n] = 1; else delete S.done[n]; CF.save(); }
  else if (t.id === 'vol') { CF.audio.setVol(+t.value); }
});
document.addEventListener('input', e => { const t = e.target; if (t.dataset.note) { S.notes[t.dataset.note] = t.value; CF.save(); } });
document.addEventListener('click', e => {
  const t = e.target.closest('button, a, [data-curio]'); if (!t) return;
  if (t.dataset.curio) { e.preventDefault(); takeCurio(t.dataset.curio); return; }
  if (t.dataset.nav) { const n = +t.dataset.nav; const h = location.hash.split('/'); location.hash = h[1]==='chapter' ? '#/chapter/'+n : '#/room/'+(h[2]||'hall')+'/'+n; return; }
  if (t.id === 'chsetBtn') { const v = Math.max(1, Math.min(56, +$('#chset').value || 1)); const was = S.ch; S.ch = v; CF.save(); viewHall();
    CF.dot(v > was ? 'Chapter ' + v + '. ' + (v===56 ? 'All the way to the end. Some doors only open now.' : 'Ledger updated. I won’t say a word about what comes next.') : 'Marker moved back to chapter ' + v + '. Later pages are face-down again.'); return; }
  if (t.dataset.hint) { CF.dot(CF.SECRETS[t.dataset.hint].hint); return; }
  if (t.dataset.woods) { if (Object.keys(S.curios).length >= 10) { giveKey('woods'); location.hash = '#/secret/woods'; } else CF.dot('The brambles close in. You need ten curios in your satchel; you have ' + Object.keys(S.curios).length + '.'); return; }
  if (t.id === 'soundBtn') { const on = CF.audio.toggle(); t.setAttribute('aria-pressed', on); t.textContent = on ? 'Sound on' : 'Sound off'; $('#volWrap').hidden = !on; return; }
  if (t.id === 'themeBtn') { S.theme = {auto:'dark', dark:'light', light:'auto'}[S.theme]; CF.save(); applyTheme(); return; }
  if (t.id === 'satchelBtn') { const d = $('#satchelDrawer'); const open = d.hidden; d.hidden = !open; t.setAttribute('aria-expanded', open); renderSatchel(); if (open) $('#satchelDrawer .close').focus(); return; }
  if (t.classList.contains('close') && t.closest('#satchelDrawer')) { $('#satchelDrawer').hidden = true; $('#satchelBtn').setAttribute('aria-expanded','false'); return; }
  if (t.id === 'dotSpeak') { dotSpeak(); return; }
  if (t.id === 'dotMore') { const pool = CF.DOT.greet.concat(CF.DOT.secret); CF.dot(pool[Math.floor(Math.random()*pool.length)]); return; }
  if (t.id === 'dotHide') { $('#dot').classList.remove('open'); return; }
  if (t.id === 'dotBtn') { const b = $('#dot'); if (b.classList.contains('open')) b.classList.remove('open'); else CF.dot($('#dotMsg').textContent || CF.DOT.greet[0]); return; }
  if (t.id === 'cpOpen') { openCommonplace(); return; }
  if (t.id === 'cpTxt') { const blob = new Blob([commonplaceText()], {type:'text/plain'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'my-commonplace-book-the-stranger.txt'; a.click(); return; }
});
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset && e.target.dataset.curio) { e.preventDefault(); takeCurio(e.target.dataset.curio); } if (e.key === 'Escape') { const d = $('#satchelDrawer'); if (d && !d.hidden) { d.hidden = true; $('#satchelBtn').focus(); } } });
document.addEventListener('submit', e => {
  const f = e.target; if (!f.dataset.riddle) return; e.preventDefault();
  const k = f.dataset.riddle, ok = CF.check(CF.SECRETS[k].hash, f.a.value);
  const o = f.querySelector('output');
  if (ok) { giveKey(k); o.textContent = 'The lock turns.'; setTimeout(() => location.hash = '#/secret/' + k, 700); }
  else { o.textContent = 'Not that. The door stays shut.'; f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); }
});
document.addEventListener('toggle', e => {
  const d = e.target; if (!d.dataset || !d.dataset.tool || !d.open) return;
  const body = d.querySelector('.toolbody'); if (body.dataset.ready) return; body.dataset.ready = 1;
  const [room, i] = d.dataset.tool.split(':'); const tool = CF.TOOLS[room][+i];
  try { tool.render(body, CF.ctx); } catch(err) { body.innerHTML = '<p>This tool could not open.</p>'; console.error(err); }
}, true);

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', () => {
  applyTheme(); renderSatchel();
  if (!S.said.hello) { S.said.hello = 1; CF.save(); setTimeout(() => CF.dot(CF.DOT.greet[0]), 900); }
  else setTimeout(() => CF.dot(CF.DOT.greet[1 + Math.floor(Math.random()*2)]), 1200);
  route();
});
})();
