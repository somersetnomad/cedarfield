/* Sixty interactive tools: six per room. Everything saves to this browser only. */
(function(){
const esc = s => CF.esc(s), S = () => CF.S;
const note = (key, ph, rows) => `<textarea data-note="${key}" rows="${rows||5}" placeholder="${esc(ph||'Write here')}" aria-label="${esc(ph||'Notes')}">${esc(S().notes[key]||'')}</textarea>`;
const val = (k, d) => (S().vals[k] == null ? d : S().vals[k]);
const setVal = (k, v) => { S().vals[k] = v; CF.save(); };
function bars(vals, max, opts){ opts = opts||{}; if (!vals.some(v=>v!=null)) return '<p class="fine empty">Nothing rated yet. Move a slider to start the chart.</p>'; const n = vals.length, W = 560, H = opts.h||120, bw = W/Math.max(n,1);
  return `<svg viewBox="0 0 ${W} ${H+18}" class="chart" role="img" aria-label="${esc(opts.label||'Chart')}">${vals.map((v,i)=>{ const h = v==null?0:(v/max)*H; return `<rect x="${(i*bw+1).toFixed(1)}" y="${(H-h).toFixed(1)}" width="${Math.max(bw-2,1).toFixed(1)}" height="${h.toFixed(1)}" class="${v==null?'nil':'bar'}"><title>${esc((opts.lab?opts.lab(i):'Chapter '+(i+1)))}: ${v==null?'not rated':v}</title></rect>`; }).join('')}
    <line x1="0" y1="${H}" x2="${W}" y2="${H}" class="axis"/>${n>1?`<text x="0" y="${H+14}" class="axt">${opts.first||1}</text><text x="${W}" y="${H+14}" text-anchor="end" class="axt">${opts.last||n}</text>`:''}</svg>`; }
function lines(series, n, max, opts){ opts=opts||{}; if (!series.some(s=>s.vals.some(v=>v!=null))) return '<p class="fine empty">Nothing rated yet. Move a slider to start the chart.</p>'; const W=560, H=140; const x = i => n<=1? W/2 : i*(W/(n-1));
  return `<svg viewBox="0 0 ${W} ${H+30}" class="chart" role="img" aria-label="${esc(opts.label||'Line chart')}">${series.map(s=>{ const pts = s.vals.map((v,i)=>v==null?null:[x(i), H - v/max*H]).filter(Boolean); return `<polyline points="${pts.map(p=>p.map(q=>q.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${s.color}" stroke-width="2.5"/>${pts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="${s.color}"/>`).join('')}`; }).join('')}
  <line x1="0" y1="${H}" x2="${W}" y2="${H}" class="axis"/>${series.length>1?series.map((s,i)=>`<g transform="translate(${i*140} ${H+24})"><rect width="10" height="10" y="-9" fill="${s.color}"/><text x="14" class="axt">${esc(s.name)}</text></g>`).join(''):''}</svg>`; }
CF.charts = { bars, lines };
function chips(key, tags, labelFn){ const cur = S().vals[key] || {}; return `<div class="chips" data-chips="${key}">${tags.map(t=>`<button type="button" class="chip ${cur[t]?'on':''}" data-chip="${t}" aria-pressed="${!!cur[t]}">${esc(labelFn?labelFn(t):t)}</button>`).join('')}</div>`; }
document.addEventListener('click', e => { const b = e.target.closest('[data-chip]'); if (!b) return; const wrap = b.closest('[data-chips]'); const k = wrap.dataset.chips; const cur = S().vals[k] || {}; cur[b.dataset.chip] = !cur[b.dataset.chip]; if (!cur[b.dataset.chip]) delete cur[b.dataset.chip]; S().vals[k] = cur; CF.save(); b.classList.toggle('on'); b.setAttribute('aria-pressed', !!cur[b.dataset.chip]); if (wrap._after) wrap._after(); });
function slider(key, min, max, step, def, label, ends){ const v = val(key, def); return `<div class="slider"><label><span>${esc(label)}</span><input type="range" min="${min}" max="${max}" step="${step||1}" value="${v}" data-val="${key}" aria-label="${esc(label)}"><output>${v}</output></label>${ends?`<div class="ends"><span>${esc(ends[0])}</span><span>${esc(ends[1])}</span></div>`:''}</div>`; }
document.addEventListener('input', e => { const t = e.target; if (t.dataset && t.dataset.val) { setVal(t.dataset.val, +t.value); const o = t.parentNode.querySelector('output'); if (o) o.textContent = t.value; const host = t.closest('[data-redraw]'); if (host && host._redraw) host._redraw(); } });
function quiz(el, items, key){
  let i = 0, score = 0; const draw = () => {
    if (i >= items.length) { el.innerHTML = `<p class="score">You got ${score} of ${items.length}.</p><button class="btn ghost">Try again</button>`; el.querySelector('button').onclick = () => { i = 0; score = 0; draw(); }; if (key) setVal(key, score); return; }
    const [q, opts, a] = items[i];
    el.innerHTML = `<p class="qcount">Question ${i+1} of ${items.length}</p><p class="qq">${esc(q)}</p><div class="qopts">${opts.map((o,j)=>`<button class="btn ghost" data-j="${j}">${esc(o)}</button>`).join('')}</div><p class="qfb" aria-live="polite"></p>`;
    el.querySelectorAll('[data-j]').forEach(b => b.onclick = () => { const j = +b.dataset.j; el.querySelectorAll('[data-j]').forEach(x => x.disabled = true); b.classList.add(j===a?'right':'wrong'); el.querySelectorAll('[data-j]')[a].classList.add('right');
      if (j===a) score++; el.querySelector('.qfb').textContent = j===a ? 'Right.' : 'Not quite: ' + opts[a] + '.'; setTimeout(() => { i++; draw(); }, 1400); });
  }; draw();
}
CF.quiz = quiz;
const upTo = () => CF.loadUpTo(S().ch);
const chLab = i => 'Chapter ' + (i+1) + ': ' + CF.title(i+1);
const timerHTML = secs => `<div class="timer" data-secs="${secs}"><output>${Math.floor(secs/60)}:00</output> <button class="btn ghost" data-timer="start">Start</button> <button class="btn ghost" data-timer="reset">Reset</button></div>`;
document.addEventListener('click', e => { const b = e.target.closest('[data-timer]'); if (!b) return; const w = b.closest('.timer'); const o = w.querySelector('output');
  if (b.dataset.timer === 'reset') { clearInterval(w._t); w._left = +w.dataset.secs; o.textContent = fmt(w._left); w.querySelector('[data-timer=start]').textContent = 'Start'; return; }
  if (w._t && w._run) { clearInterval(w._t); w._run = false; b.textContent = 'Resume'; return; }
  w._left = w._left == null ? +w.dataset.secs : w._left; w._run = true; b.textContent = 'Pause';
  w._t = setInterval(() => { w._left--; o.textContent = fmt(Math.max(0,w._left)); if (w._left <= 0) { clearInterval(w._t); w._run = false; b.textContent = 'Start'; w._left = null; ding(); } }, 1000); });
const fmt = s => Math.floor(s/60) + ':' + String(s%60).padStart(2,'0');
function ding(){ try { const C = window.AudioContext||window.webkitAudioContext; const c = new C(); [880,660,880].forEach((f,i)=>{ const o=c.createOscillator(), g=c.createGain(); o.frequency.value=f; g.gain.setValueAtTime(0.0001,c.currentTime+i*.3); g.gain.exponentialRampToValueAtTime(.2,c.currentTime+i*.3+.02); g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+i*.3+.28); o.connect(g).connect(c.destination); o.start(c.currentTime+i*.3); o.stop(c.currentTime+i*.3+.3); }); } catch(e){} }

/* ======================= OFFICE: close reading & style ======================= */
const DEVICES = ['Cliffhanger last line','One-line paragraph','Comic aside','Pop-culture reference','Repeated refrain','Rhetorical question','Flashback','Withheld information','Time jump','Sentence fragment','Second-person generalising','Dialogue-only run'];
const office = [
 { name:'Close-reading workbench', desc:'The chapter’s three exercises, step by step, with a notebook for each.', render(el, c){
   el.innerHTML = c.d.close.map((x,i)=>`<article class="close"><h4>${esc(x.focus)}</h4><p class="cite">Find it: ${esc(x.cite)}</p><ol class="checks">${x.steps.map((s,j)=>{const k='cr'+c.ch+':'+i+':'+j; return `<li><label><input type="checkbox" data-pk="${k}" ${S().ticks[k]?'checked':''}> ${esc(s)}</label></li>`;}).join('')}</ol><p class="ask">${esc(x.ask)}</p>${note('close:c'+c.ch+':'+(i+1),'Your reading, in your own words',5)}</article>`).join(''); } },
 { name:'Sentence-rhythm meter', desc:'Type a passage from your own copy and see its sentence lengths drawn as a skyline.', render(el){
   el.innerHTML = `<p class="fine">Copy a paragraph by hand from your book (typing it slowly is itself close reading). Nothing leaves your browser.</p><textarea rows="6" class="rhy" aria-label="Passage to measure"></textarea><button class="btn">Measure</button><div class="rout" aria-live="polite"></div>`;
   el.querySelector('button').onclick = () => { const t = el.querySelector('.rhy').value.trim(); const sents = t.split(/(?<=[.!?])\s+(?=[A-Z“"'(])/).filter(s=>s.trim()); const lens = sents.map(s=>s.split(/\s+/).filter(Boolean).length);
     if (!lens.length) return; const avg = lens.reduce((a,b)=>a+b,0)/lens.length; const frag = lens.filter(n=>n<=4).length;
     el.querySelector('.rout').innerHTML = bars(lens, Math.max(...lens), {label:'Sentence lengths', lab:i=>'Sentence '+(i+1)}) + `<p>${lens.length} sentences, average ${avg.toFixed(1)} words. Longest ${Math.max(...lens)}, shortest ${Math.min(...lens)}. ${frag} of four words or fewer.</p><p class="fine">Thriller prose often alternates long, clause-heavy sentences of thought with short punches of fact. Where do the short ones land?</p>`; }; } },
 { name:'Device spotter', desc:'Tag the stylistic moves in this chapter and see where they cluster across the book.', render(el, c){
   const key = 'dev:c'+c.ch; el.innerHTML = `<p>Which of these does chapter ${c.ch} use?</p>${chips(key, DEVICES)}<div class="conc"></div>`;
   const draw = () => { const rows = DEVICES.map(dv => `<tr><th>${esc(dv)}</th>${Array.from({length:S().ch},(_,i)=>`<td class="${(S().vals['dev:c'+(i+1)]||{})[dv]?'on':''}" title="Chapter ${i+1}"></td>`).join('')}</tr>`).join('');
     el.querySelector('.conc').innerHTML = `<div class="scrollx"><table class="concord"><caption>Your tags, chapters 1 to ${S().ch}</caption>${rows}</table></div>`; };
   el.querySelector('[data-chips]')._after = draw; draw(); } },
 { name:'Tension curve', desc:'Rate how hard each chapter’s ending pulls you on. Watch the shape of the book appear.', render(el, c){
   const host = document.createElement('div'); host.setAttribute('data-redraw','1');
   host.innerHTML = slider('tension:c'+c.ch, 1, 10, 1, 5, 'Pull of chapter '+c.ch+'’s ending', ['I could stop here','I had to keep going']) + '<div class="tc"></div>';
   el.appendChild(host); host._redraw = () => host.querySelector('.tc').innerHTML = lines([{name:'Pull', color:'var(--brick)', vals:Array.from({length:S().ch},(_,i)=>S().vals['tension:c'+(i+1)])}], S().ch, 10, {label:'Tension by chapter'}); host._redraw(); } },
 { name:'Register press', desc:'Retell the chapter’s key moment three ways and feel what voice does.', render(el, c){
   el.innerHTML = [['memo','As a dry legal memo to the file'],['text','As a breathless group text from a sideline parent'],['report','As a flat police incident report']].map(([k,l])=>`<h4>${esc(l)}</h4>${note('register:c'+c.ch+':'+k, l, 4)}`).join('') + `<p class="fine">Then reread the original scene. Which of your versions is closest to Coben’s register, and which words gave it away?</p>`; } },
 { name:'Point-of-view lens', desc:'Whose head are we in, and how close? Track the camera across the book.', render(el, c){
   const host = document.createElement('div'); host.setAttribute('data-redraw','1');
   host.innerHTML = `<p>Chapter ${c.ch} is told through <strong>${esc(c.d.pov)}</strong>.</p>` + slider('pov:c'+c.ch, 1, 5, 1, 3, 'Narrative distance', ['Far, outside looking in','Inside their thoughts']) + note('pov:c'+c.ch, 'What does this point of view let us know, and what does it hide?', 3) + '<div class="pv"></div>';
   el.appendChild(host);
   host._redraw = () => { const povs = CF.CHAPTERS.slice(0,S().ch).map(x=>x[2]); const who = [...new Set(povs)];
     host.querySelector('.pv').innerHTML = `<div class="scrollx"><table class="concord"><caption>Whose chapter is it?</caption>${who.map(w=>`<tr><th>${esc(w)}</th>${povs.map((p,i)=>`<td class="${p===w?'on':''}" title="Chapter ${i+1}"></td>`).join('')}</tr>`).join('')}</table></div>` + bars(Array.from({length:S().ch},(_,i)=>S().vals['pov:c'+(i+1)]), 5, {label:'Your distance ratings', lab:chLab}); };
   host._redraw(); } }
];

/* ======================= CLASSROOM: themes & ideas ======================= */
const classroom = [
 { name:'Motif concordance', desc:'Which ideas surface in which chapters? A grid of the novel’s preoccupations.', render(el){
   el.innerHTML = '<p class="loading">Gathering chapters…</p>'; upTo().then(chs => { const M = Object.keys(CF.MOTIFS);
     el.innerHTML = `<div class="scrollx"><table class="concord"><caption>Motifs, chapters 1 to ${S().ch}. Hover a square for the chapter.</caption>${M.map(m=>`<tr><th title="${esc(CF.MOTIFS[m][1])}">${esc(CF.MOTIFS[m][0])}</th>${chs.map(d=>`<td class="${d.motifs.includes(m)?'on':''}" title="Chapter ${d.n}: ${esc(d.title)}"></td>`).join('')}</tr>`).join('')}</table></div>
     <p class="fine">Which motif appears most so far? Which has gone quiet, and why might the author be saving it?</p>${note('motifs:c'+S().ch,'What pattern do you see?',3)}`; }); } },
 { name:'Secrets ledger', desc:'Every secret so far: who keeps it, who knows, and whether it’s out.', render(el){
   el.innerHTML = '<p class="loading">Opening the ledger…</p>'; upTo().then(chs => { const rows = []; chs.forEach(d => (d.secrets||[]).forEach(s => rows.push([d.n].concat(s))));
     el.innerHTML = `<div class="scrollx"><table class="data"><thead><tr><th>Ch</th><th>Who keeps it</th><th>The secret</th><th>Status</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table></div><p class="fine">${rows.length} entries so far. Sort them in your head: which secrets protect someone, and which protect only the keeper?</p>`; }); } },
 { name:'Debate deck', desc:'Draw a book-club question, pick a side at random, and argue it for three minutes.', render(el){
   el.innerHTML = '<p class="loading">Shuffling…</p>'; upTo().then(chs => { const pool = []; chs.forEach(d => d.questions.forEach(q => { if (q[1]) pool.push([d.n, q[0]]); }));
     const draw = () => { const [n, q] = pool[Math.floor(Math.random()*pool.length)]; const side = Math.random()<.5 ? 'Argue yes, or for the first option.' : 'Argue no, or against the obvious answer.';
       el.querySelector('.card').innerHTML = `<p class="kick">From chapter ${n}</p><p class="qq">${esc(q)}</p><p><strong>${side}</strong></p>`; };
     el.innerHTML = `<div class="card deck"></div><button class="btn">Draw another</button> ${timerHTML(180)}`; el.querySelector('.btn').onclick = draw; draw(); }); } },
 { name:'Chapter quiz', desc:'Five questions on what happened. Good for checking you caught the details.', render(el, c){ quiz(el, c.d.quiz, 'quiz:c'+c.ch); } },
 { name:'Theme statement builder', desc:'Turn a hunch into an arguable claim, one clause at a time.', render(el, c){
   el.innerHTML = `<p>A theme is a claim the book makes, not a topic. Fill the frame, then try to break it.</p>
   <ol class="frame"><li>In <cite>The Stranger</cite>, Coben suggests that… ${note('theme:c'+c.ch+':claim','…what about secrets, marriage, money, towns, parents?',2)}</li><li>…because in chapter ${c.ch}… ${note('theme:c'+c.ch+':because','…which moment shows it?',2)}</li><li>…yet the book complicates this when… ${note('theme:c'+c.ch+':yet','…what pushes back?',2)}</li></ol>`; } },
 { name:'Values sliders', desc:'Where does the novel seem to stand right now? Track how its sympathies shift.', render(el, c){
   const host = document.createElement('div'); host.setAttribute('data-redraw','1');
   const ax = [['privacy','Privacy matters more','Truth matters more'],['family','Protect your own','Be fair to all'],['town','The dream is real','The dream is a stage set']];
   host.innerHTML = ax.map(a=>slider('v:'+a[0]+':c'+c.ch, 0, 10, 1, 5, 'Chapter '+c.ch+': '+a[1]+' or '+a[2]+'?', [a[1],a[2]])).join('') + '<div class="vc"></div>';
   el.appendChild(host); const cols = ['var(--cedar)','var(--brick)','var(--glow)'];
   host._redraw = () => host.querySelector('.vc').innerHTML = lines(ax.map((a,i)=>({name:a[0], color:cols[i], vals:Array.from({length:S().ch},(_,j)=>S().vals['v:'+a[0]+':c'+(j+1)])})), S().ch, 10, {label:'Your readings of the novel’s values'}); host._redraw(); } }
];

/* ======================= RECORDS: history & author ======================= */
const NAMES = [['John Bonner',29],['Freddie Friednash',6],['Leonard (Len) Gilman',2],['Andy Gribbel',5],['Johanna Griffin',26],['Rick Gusherowski',11],['Kristin Hoy',3],['John Kuntz',14],['Norbert Pendergast',26],['Sally Perryman',35],['Paul Williams',6]];
const TECH = [
  [3,'Online card statements','Adam searches two years of Visa charges from the home computer. Discreet billing names hide what was bought.'],
  [15,'E-ZPass toll records','Electronic tolling logs where a tagged car passed and when. Adam thinks of it as a trail.'],
  [20,'Phone-locator apps','Family location sharing: a dot for each phone, and a password nobody but Mom was meant to use.'],
  [17,'IP addresses','Websites promise anonymity, but servers log which connection posted what.'],
  [28,'Silk Road and Bitcoin','A hidden marketplace reached through Tor, paid in a cryptocurrency. Shut down by the FBI in 2013, two years before the novel.'],
  [36,'VPNs and bounced routers','Tools to hide where traffic comes from, layered so a trace jumps elsewhere.'],
  [37,'Facebook friend networks','Friends of friends of friends: how a public holiday photo becomes a lead.'],
  [8,'Sugar-dating sites','Real sites of the period marketed "mutually beneficial arrangements".'],
  [36,'Viber','A free calling and messaging app, used here to place a call that is harder to trace.']
];
const COBEN = [['Play Dead',1990],['Miracle Cure',1991],['Deal Breaker',1995],['Drop Shot',1996],['Fade Away',1996],['Back Spin',1997],['One False Move',1998],['The Final Detail',1999],['Darkest Fear',2000],['Tell No One',2001],['Gone for Good',2002],['No Second Chance',2003],['Just One Look',2004],['The Innocent',2005],['Promise Me',2006],['The Woods',2007],['Hold Tight',2008],['Long Lost',2009],['Caught',2010],['Live Wire',2011],['Shelter',2011],['Stay Close',2012],['Seconds Away',2012],['Six Years',2013],['Missing You',2014],['Found',2014],['The Stranger',2015]];
const records = [
 { name:'Timeline: the real world around the novel', desc:'Law, technology and Coben’s career, dated and checked.', render(el){
   el.innerHTML = `<ol class="timeline">${CF.TIMELINE.map(([y,t])=>`<li><span class="yr">${y}</span><span>${esc(t)}</span></li>`).join('')}</ol>${note('timeline:c'+S().ch,'Which of these dates changes how you read the book?',3)}`; } },
 { name:'Names bought for charity', desc:'Several character names were auctioned for good causes. Spot them as they arrive.', render(el){
   const seen = NAMES.filter(n=>n[1]<=S().ch);
   el.innerHTML = `<p>The novel’s acknowledgments explain that a number of real people (or their families) made charitable donations in return for having their names used. Coben has run this kind of name auction for years. Names appear here once you reach the chapter where they first turn up.</p><ul class="cols">${seen.map(n=>`<li><strong>${esc(n[0])}</strong> <small>chapter ${n[1]}</small></li>`).join('')}</ul>
   <p class="fine">Does knowing a name was bought change how you feel about that character, especially the unpleasant ones?</p>${note('names:c'+S().ch,'Your reaction',3)}`; } },
 { name:'The internet of 2015', desc:'The technologies the plot turns on, and what’s changed since.', render(el){
   const t = TECH.filter(x=>x[0]<=S().ch);
   el.innerHTML = t.length ? t.map(([n,h,b],i)=>`<article class="card"><h4>${esc(h)} <small>chapter ${n}</small></h4><p>${esc(b)}</p>${note('tech:'+i,'Is this more or less private now? What would the plot need today?',2)}</article>`).join('') : '<p>Keep reading; the technology arrives in chapter 3.</p>'; } },
 { name:'Eminent domain casebook', desc:'The law behind Adam’s day job, and your verdict on the Rinsky house.', render(el){
   const host = document.createElement('div'); host.setAttribute('data-redraw','1');
   host.innerHTML = `<p>The US Constitution’s Fifth Amendment lets government take private property for public use with just compensation. Two Supreme Court cases bracket the argument:</p>
   <ul><li><strong>Berman v. Parker (1954)</strong>: a District of Columbia neighbourhood could be cleared as blighted, even shops that weren’t.</li><li><strong>Kelo v. New London (2005)</strong>: a city could take homes for private economic development. The 5–4 decision provoked new limits in many states.</li></ul>
   <p>The Rinsky case (from chapter 5) sits in that tradition: a town, a developer, an elderly couple, a better offer.</p>` + slider('ed:verdict', 0, 10, 1, 5, 'Your verdict', ['The town should be able to take it','Nobody should be able to take it']) + note('ed:why','Why? What would change your mind?',3);
   el.appendChild(host); } },
 { name:'The Coben shelf', desc:'Every earlier novel listed in the front of the book. Tick what you’ve read.', render(el){
   el.innerHTML = `<ul class="checks cols">${COBEN.map(([t,y])=>{const k='coben:'+t; return `<li><label><input type="checkbox" data-pk="${k}" ${S().ticks[k]?'checked':''}> <cite>${esc(t)}</cite> (${y})</label></li>`;}).join('')}</ul><p class="fine">Myron Bolitar, a sports agent, carries a long series starting with <cite>Deal Breaker</cite>; <cite>Tell No One</cite> (2001) began the run of standalone suburban thrillers that <cite>The Stranger</cite> belongs to.</p>`; } },
 { name:'Questions for the author', desc:'Draft the five questions you’d ask Coben, with tips for better ones.', render(el, c){
   el.innerHTML = `<p class="fine">Good author questions ask about choices, not intentions: "why does the stranger never get a point-of-view chapter until…" beats "what did you mean by…".</p>${[1,2,3,4,5].map(i=>`<label class="row">Question ${i} ${note('authorq:'+i,'',2)}</label>`).join('')}`; } }
];

/* ======================= STACKS: sources & influences ======================= */
const WEB = [
  ['wildduck','Truth-teller wrecks a family','An idealist exposes a buried secret to a household and insists the truth will free them. It doesn’t.'],
  ['milverton','The blackmailer','Holmes calls this blackmailer the worst man in London: he buys letters and sells silence.'],
  ['purloined','Hiding in plain sight','A compromising letter hidden by being left out in the open.'],
  ['wakefield','The spouse who walks away','A husband leaves home on a whim and stays away for twenty years, living around the corner.'],
  ['blackveil','The visible secret','A minister wears a veil for life; the town fixates on what he must be hiding.'],
  ['oedipus','The man who insists on knowing','Every answer he demands brings him closer to the thing he cannot survive knowing.'],
  ['allmysons','Family versus everyone else','A businessman justifies a fatal decision as protecting his family.'],
  ['salesman','The father who lost his job','Pride, debt and the image of success in a suburban house.'],
  ['revroad','The suburban trap','A couple who thought they were exceptional, in a town that says they are ordinary.'],
  ['biglies','Gossip, schools and secrets','Parents, a playground and violence beneath the gloss.'],
  ['circle','Total transparency','A tech company that believes secrets are lies and privacy is theft.'],
  ['ripley','The pleasant impostor','Charm as a skeleton key.'],
  ['eliotrock','The epigraph','Eliot’s choruses for a church pageant; the novel borrows lines about a coming Stranger who asks questions.']
];
const GENRES = [['domestic','Domestic suspense'],['procedural','Police procedural'],['conspiracy','Conspiracy / network'],['whodunit','Whodunit'],['revenge','Revenge'],['satire','Suburban satire']];
const stacks = [
 { name:'Influence web', desc:'Works this novel talks to. Click a book to see the thread that ties it to The Stranger.', render(el){
   const W=560,H=360,cx=W/2,cy=H/2;
   const nodes = WEB.map((w,i)=>{ const a = i/WEB.length*Math.PI*2 - Math.PI/2; return [cx+Math.cos(a)*200, cy+Math.sin(a)*140, w]; });
   el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="web" role="group" aria-label="Web of influences">${nodes.map(([x,y])=>`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="wl"/>`).join('')}<circle cx="${cx}" cy="${cy}" r="40" class="wc"/><text x="${cx}" y="${cy+5}" text-anchor="middle" class="wt">The Stranger</text>
   ${nodes.map(([x,y,w],i)=>`<g class="wn" tabindex="0" role="button" data-wi="${i}" transform="translate(${x} ${y})"><circle r="9"/><text y="-14" text-anchor="middle">${esc(CF.BANK[w[0]][0].replace(/^The /,'').slice(0,22))}</text></g>`).join('')}</svg><div class="wout" aria-live="polite"><p class="fine">Choose a node.</p></div>`;
   const show = i => { const w = WEB[i], b = CF.BANK[w[0]]; el.querySelector('.wout').innerHTML = `<h4><cite>${esc(b[0])}</cite>, ${esc(b[1])}, ${esc(b[2])}</h4><p><strong>${esc(w[1])}.</strong> ${esc(w[2])}</p>${note('web:'+w[0],'Where does The Stranger agree or argue with it?',3)}`; };
   el.querySelectorAll('.wn').forEach(g => { g.onclick = () => show(+g.dataset.wi); g.onkeydown = e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); show(+g.dataset.wi);} }; }); } },
 { name:'Reading shelf', desc:'All further reading suggested so far. Mark what you want, are reading, or have read.', render(el){
   el.innerHTML = '<p class="loading">Pulling books…</p>'; upTo().then(chs => { const seen = {}; chs.forEach(d => d.reading.forEach(([id,why]) => { if (!seen[id]) seen[id] = [d.n, why]; }));
     const st = ['','want','reading','read'];
     el.innerHTML = `<ul class="shelf">${Object.keys(seen).map(id=>{ const b = CF.BANK[id]; if(!b) return ''; const k='shelf:'+id; const v = S().vals[k]||0; return `<li><div><cite>${esc(b[0])}</cite> <small>${esc(b[1])}, ${esc(b[2])}. First suggested in chapter ${seen[id][0]}.</small></div><button class="btn ghost shelfbtn" data-shelf="${k}" data-v="${v}">${['Add to shelf','Want to read','Reading','Read'][v]}</button></li>`; }).join('')}</ul>`;
     el.querySelectorAll('[data-shelf]').forEach(b => b.onclick = () => { const v = ((+b.dataset.v)+1)%4; b.dataset.v = v; setVal(b.dataset.shelf, v); b.textContent = ['Add to shelf','Want to read','Reading','Read'][v]; }); }); } },
 { name:'Two-text comparer', desc:'Pick a book from the bank and map what it shares with The Stranger.', render(el){
   const ids = Object.keys(CF.BANK).filter(k => ['novel','play','story'].includes(CF.BANK[k][3]));
   const sel = S().vals['cmp:sel'] || 'wildduck';
   el.innerHTML = `<label>Compare with <select class="cmpsel">${ids.map(k=>`<option value="${k}" ${k===sel?'selected':''}>${esc(CF.BANK[k][0])} (${esc(CF.BANK[k][1])})</option>`).join('')}</select></label><div class="venn"></div>`;
   const draw = k => { el.querySelector('.venn').innerHTML = `<div class="v3"><div><h4>Only in The Stranger</h4>${note('cmp:'+k+':a','',5)}</div><div><h4>Both</h4>${note('cmp:'+k+':b','',5)}</div><div><h4>Only in ${esc(CF.BANK[k][0])}</h4>${note('cmp:'+k+':c','',5)}</div></div>`; };
   el.querySelector('.cmpsel').onchange = e => { setVal('cmp:sel', e.target.value); draw(e.target.value); }; draw(sel); } },
 { name:'Genre DNA', desc:'How much of each thriller tradition is in this chapter? Build a fingerprint.', render(el, c){
   const host = document.createElement('div'); host.setAttribute('data-redraw','1');
   host.innerHTML = GENRES.map(([k,l])=>slider('genre:'+k+':c'+c.ch, 0, 5, 1, 0, l)).join('') + '<div class="gd"></div>'; el.appendChild(host);
   host._redraw = () => { const v = GENRES.map(([k])=>S().vals['genre:'+k+':c'+c.ch]||0); host.querySelector('.gd').innerHTML = bars(v, 5, {label:'Genre fingerprint', lab:i=>GENRES[i][1], first:GENRES[0][1], last:GENRES[5][1]}); }; host._redraw(); } },
 { name:'Epigraph workshop', desc:'About the borrowed lines at the front, and choosing your own.', render(el){
   el.innerHTML = `<p>The novel opens with lines from T. S. Eliot’s choruses for <cite>The Rock</cite> (1934), a pageant play written to raise money for London churches. In Eliot’s passage the soul is told to prepare for a Stranger who asks questions and who knows the way to your door. Eliot’s poem is still in copyright, so look it up in your copy of the novel.</p>
   <p>Why might Coben choose a religious poem about judgement for a book about a young man who exposes people’s lies? Is the stranger a prophet, a judge, or something cheaper?</p>${note('epi:why','Your answer',3)}<h4>Choose your own epigraph</h4><p class="fine">Pick a line from a public-domain source (Shakespeare, the King James Bible, Dickinson, Hawthorne) that would sit over this book. Paraphrase or copy it and explain your choice.</p>${note('epi:mine','Your epigraph and why',3)}`; } },
 { name:'Allusion catcher', desc:'The real-world references in this chapter, explained.', render(el, c){
   const refs = c.d.refs || [];
   el.innerHTML = refs.length ? `<dl class="refs">${refs.map(([a,b])=>`<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl>` + note('refs:c'+c.ch,'Which reference tells you most about a character?',2) : '<p>No outside references worth noting in this chapter.</p>'; } }
];

/* ======================= TURNPIKE: setting & geography ======================= */
const proj = (lat, lon) => { const x = (lon + 83.2) / (83.2 - 72.8) * 1000, y = (42.3 - lat) / (42.3 - 39.1) * 420; return [x, y]; };
function routeMap(){ const P = CF.PLACES, ch = S().ch;
  const river = (pts, cls) => `<polyline class="${cls}" points="${pts.map(([a,b])=>proj(a,b).map(v=>v.toFixed(0)).join(',')).join(' ')}"/>`;
  const pins = Object.keys(P).filter(k=>P[k].ch<=ch).map(k=>{ const [x,y]=proj(P[k].lat,P[k].lon); return `<g class="pin" tabindex="0" role="button" data-place="${k}" transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><circle r="5"/><title>${esc(P[k].n)}</title></g>`; }).join('');
  return `<svg viewBox="0 0 1000 420" class="routemap" role="group" aria-label="Schematic map from Ohio to New York with chapter places">
    <rect width="1000" height="420" class="sea"/>
    ${river([[42.0,-81.2],[41.75,-81.4],[41.5,-81.7],[41.48,-82.6],[41.7,-83.2]],'lake')}
    ${river([[41.35,-74.7],[41.22,-74.87],[40.97,-75.13],[40.68,-75.2],[40.22,-74.76],[39.95,-75.15],[39.6,-75.55]],'river')}
    ${river([[41.7,-73.95],[41.1,-73.9],[40.7,-74.02],[40.5,-74.0]],'river')}
    ${river([[40.6,-80.5],[40.44,-80.0],[40.6,-79.6]],'river')}
    <text x="${proj(41.0,-82.4)[0]}" y="${proj(41.0,-82.4)[1]}" class="st">Ohio</text><text x="${proj(40.9,-78.2)[0]}" y="${proj(40.9,-78.2)[1]}" class="st">Pennsylvania</text>
    <text x="${proj(40.4,-74.8)[0]}" y="${proj(40.4,-74.8)[1]}" class="st">New Jersey</text><text x="${proj(41.9,-74.6)[0]}" y="${proj(41.9,-74.6)[1]}" class="st">New York</text>
    ${pins}</svg>`; }
const turnpike = [
 { name:'Route map', desc:'Every place the story has reached so far, from Ohio to the Hudson. Tap a pin.', render(el){
   el.innerHTML = routeMap() + `<div class="pout" aria-live="polite"><p class="fine">Schematic, roughly to scale. Cedarfield and Kasselton are invented and placed approximately in Bergen County.</p></div>`;
   const show = k => { const p = CF.PLACES[k]; el.querySelector('.pout').innerHTML = `<h4>${esc(p.n)}</h4><p>${esc(p.t)} <small>First appears in chapter ${p.ch}.</small></p>`; };
   el.querySelectorAll('[data-place]').forEach(g => { g.onclick = () => show(g.dataset.place); g.onkeydown = e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); show(g.dataset.place); } }; }); } },
 { name:'Distance calculator', desc:'How far, as the crow flies and roughly by road, between any two places so far.', render(el){
   const P = CF.PLACES, keys = Object.keys(P).filter(k=>P[k].ch<=S().ch); const opt = sel => keys.map(k=>`<option value="${k}" ${k===sel?'selected':''}>${esc(P[k].n)}</option>`).join('');
   el.innerHTML = `<div class="row2"><label>From <select class="a">${opt('cedarfield')}</select></label><label>To <select class="b">${opt(keys[keys.length-1])}</select></label></div><p class="dout" aria-live="polite"></p>`;
   const calc = () => { const a = P[el.querySelector('.a').value], b = P[el.querySelector('.b').value]; const R = 3958.8, t = Math.PI/180;
     const d = 2*R*Math.asin(Math.sqrt(Math.sin((b.lat-a.lat)*t/2)**2 + Math.cos(a.lat*t)*Math.cos(b.lat*t)*Math.sin((b.lon-a.lon)*t/2)**2));
     const road = d*1.25, hrs = road/50; el.querySelector('.dout').innerHTML = `${d.toFixed(0)} miles (${(d*1.609).toFixed(0)} km) in a straight line. By road, very roughly ${road.toFixed(0)} miles, about ${hrs<1? Math.round(hrs*60)+' minutes' : hrs.toFixed(1)+' hours'} at ordinary speeds.`; };
   el.querySelectorAll('select').forEach(s => s.onchange = calc); calc(); } },
 { name:'Gazetteer', desc:'Every place, real and invented, with what it means in the story.', render(el){
   const P = CF.PLACES, ch = S().ch; const list = Object.keys(P).filter(k=>P[k].ch<=ch).sort((a,b)=>P[a].ch-P[b].ch);
   el.innerHTML = `<dl class="refs">${list.map(k=>`<dt>${esc(P[k].n)} <small>ch ${P[k].ch}</small></dt><dd>${esc(P[k].t)}</dd>`).join('')}${CF.ELSEWHERE.filter(e=>e[1]<=ch).map(e=>`<dt>${esc(e[0])} <small>ch ${e[1]}</small></dt><dd>${esc(e[2])}</dd>`).join('')}</dl>`; } },
 { name:'Status ladder', desc:'Rank the towns of the novel by status, the way its characters would, then argue with yourself.', render(el){
   const base = ['Cedarfield','Kasselton','Hackensack','Beachwood, Ohio','Sparta','Fair Lawn','Nyack','Paramus'];
   let order = S().vals['ladder'] || base.slice();
   const draw = () => { el.innerHTML = `<ol class="ladder">${order.map((t,i)=>`<li><span>${esc(t)}</span><button class="btn ghost" data-up="${i}" aria-label="Move ${esc(t)} up" ${i===0?'disabled':''}>▲</button><button class="btn ghost" data-dn="${i}" aria-label="Move ${esc(t)} down" ${i===order.length-1?'disabled':''}>▼</button></li>`).join('')}</ol>${note('ladder:why','What markers of class does the novel use? Lawns, cars, sports, schools, shops…',3)}`;
     el.querySelectorAll('[data-up],[data-dn]').forEach(b => b.onclick = () => { const i = +(b.dataset.up||b.dataset.dn), j = b.dataset.up ? i-1 : i+1; [order[i],order[j]]=[order[j],order[i]]; setVal('ladder', order); draw(); }); };
   draw(); } },
 { name:'This chapter’s places', desc:'Where chapter scenes happen, with a prompt for each.', render(el, c){
   const P = CF.PLACES; const ps = (c.d.places||[]);
   el.innerHTML = ps.length ? ps.map(k => { const p = P[k]; return `<article class="card"><h4>${esc(p?p.n:k)}</h4>${p?`<p>${esc(p.t)}</p>`:''}${note('place:c'+c.ch+':'+k,'What does this place make possible, or impossible, for the people in it?',2)}</article>`; }).join('') : '<p>No mapped places this chapter.</p>'; } },
 { name:'Sense-of-place writer', desc:'Five senses, one setting. Build a paragraph the way Coben builds his.', render(el, c){
   el.innerHTML = ['What you see first','A sound underneath everything','A smell that tells you where you are','Something you touch','The one wrong detail'].map((l,i)=>`<label class="row">${esc(l)} ${note('senses:c'+c.ch+':'+i,'',2)}</label>`).join('') + `<h4>Now write the paragraph</h4>${note('senses:c'+c.ch+':para','Set a scene in a place you know, in the novel’s manner: wry, specific, a little sad.',5)}`; } }
];

/* ======================= FIELD: philosophy & ethics ======================= */
const CASES = [
  [1,'Adam','The stranger tells a husband that his wife faked a pregnancy two years ago.'],
  [8,'Heidi','He tells a mother what her college-age daughter is doing for money.'],
  [17,'Michaela','He tells a bride, four days before her wedding, who really posted a video of her.'],
  [23,'Suzanne','After she won’t pay, he tells her husband about her fake pregnancies.'],
  [28,'Dan','He tells a father his star son is on steroids, and asks for money to stay quiet.']
];
const field = [
 { name:'Dilemma scale', desc:'The chapter’s hardest choice. Pick a side and give your reasons.', render(el, c){
   const D = c.d.dilemma; el.innerHTML = `<p class="qq">${esc(D.q)}</p>` + slider('dil:c'+c.ch, 0, 10, 1, 5, 'Where do you stand?', [D.a, D.b]) + note('dil:c'+c.ch, 'Your strongest reason, and the best reason on the other side', 4); } },
 { name:'Five ethical lenses', desc:'Look at the same choice through consequences, duty, character, care and fairness.', render(el, c){
   el.innerHTML = `<p class="qq">${esc(c.d.dilemma.q)}</p>` + Object.keys(CF.LENSES).map(k => `<article class="card"><h4>${esc(CF.LENSES[k][0])}</h4><p class="fine">${esc(CF.LENSES[k][1])}</p>${note('lens:c'+c.ch+':'+k,'Through this lens…',2)}</article>`).join(''); } },
 { name:'Tell or keep? A sitting court', desc:'Rule on each of the stranger’s visits as you meet them.', render(el){
   const cs = CASES.filter(x=>x[0]<=S().ch);
   el.innerHTML = cs.map(([n,who,t])=>{ const k='court:'+who; const v=S().vals[k]; return `<article class="card"><h4>${esc(who)} <small>chapter ${n}</small></h4><p>${esc(t)}</p><div class="seg" role="group" aria-label="Verdict for ${esc(who)}">${['Right to tell','Wrong to tell','Depends'].map((l,i)=>`<button class="btn ghost ${v===i?'on':''}" data-court="${k}" data-v="${i}" aria-pressed="${v===i}">${l}</button>`).join('')}</div>${note(k,'Reasons',2)}</article>`; }).join('') + `<p class="tally fine"></p>`;
   const tally = () => { const v = cs.map(x=>S().vals['court:'+x[1]]); el.querySelector('.tally').textContent = `Your record: ${v.filter(x=>x===0).length} right, ${v.filter(x=>x===1).length} wrong, ${v.filter(x=>x===2).length} depends. Is there a rule hiding in your verdicts?`; };
   el.querySelectorAll('[data-court]').forEach(b => b.onclick = () => { setVal(b.dataset.court, +b.dataset.v); b.parentNode.querySelectorAll('button').forEach(x=>{x.classList.toggle('on', x===b); x.setAttribute('aria-pressed', x===b);}); tally(); }); tally(); } },
 { name:'Home-field simulator', desc:'Cal’s argument in numbers: how much would a slightly swayed referee matter?', render(el){
   const host = document.createElement('div'); host.setAttribute('data-redraw','1');
   host.innerHTML = `<p>In chapter 7 Cal cites research (popularised in <cite>Scorecasting</cite>, 2011) suggesting referees unconsciously favour home crowds. This toy model plays a season of evenly matched games in which each close call goes to the home side a little more often than chance.</p>` + slider('hf:bias', 50, 70, 1, 55, 'Chance a close call goes to the home team (%)') + slider('hf:calls', 1, 12, 1, 6, 'Close calls per game') + `<button class="btn">Play 1,000 games</button><p class="hout" aria-live="polite"></p>`;
   el.appendChild(host);
   host.querySelector('button').onclick = () => { const b = (S().vals['hf:bias']||55)/100, n = S().vals['hf:calls']||6; let hw=0, aw=0;
     for (let g=0; g<1000; g++){ let m = 0; for (let i=0;i<10;i++) m += Math.random()<.5?1:-1; for (let i=0;i<n;i++) m += (Math.random()<b?1:-1)*0.5; if (m>0) hw++; else if (m<0) aw++; else (Math.random()<.5?hw++:aw++); }
     host.querySelector('.hout').textContent = `Home teams won ${(hw/10).toFixed(1)}% of 1,000 games. At 50% (no bias) you would expect about 50%. A toy model, not real data: it shows how small tilts add up.`; }; } },
 { name:'The slippery slope', desc:'Build a staircase of small rationalisations and find the step where it became wrong.', render(el){
   if (S().ch < 32) { el.innerHTML = '<p>This tool opens at chapter 32.</p>'; return; }
   el.innerHTML = `<p>In chapter 32 one character describes, in general terms, how a volunteer can drift from small perks to theft. Write your own staircase: six steps, each only a little worse than the one before. Then mark the step where you’d say a line was crossed.</p><ol class="stairs">${[1,2,3,4,5,6].map(i=>`<li>${note('slope:'+i,'Step '+i,1)}<label class="tiny"><input type="radio" name="slopeline" value="${i}" ${S().vals['slope:line']===i?'checked':''}> The line is here</label></li>`).join('')}</ol>`;
   el.querySelectorAll('[name=slopeline]').forEach(r => r.onchange = () => setVal('slope:line', +r.value)); } },
 { name:'The Ring of Gyges', desc:'Plato’s invisibility ring, and the anonymous internet: who would you be unseen?', render(el){
   el.innerHTML = `<p>In Book II of Plato’s <cite>Republic</cite>, Glaucon tells of a shepherd who finds a ring that makes him invisible, and soon uses it to seize power. His challenge: anyone, given perfect secrecy, would act unjustly; we are honest only because we are watched.</p><p>The websites in this novel sell a kind of ring. The stranger’s group takes it away.</p>` + slider('gyges', 0, 10, 1, 5, 'Is Glaucon right about people?', ['No: character holds in secret','Yes: we behave because we are seen']) + note('gyges','Which character in the novel best tests Glaucon’s claim?',3); } }
];

/* ======================= BOARD: writing craft ======================= */
const board = [
 { name:'Clue board', desc:'Every planted detail so far. Mark each as clue, red herring or unsure.', render(el){
   el.innerHTML = '<p class="loading">Pinning cards…</p>'; upTo().then(chs => { const cards = []; chs.forEach(d => (d.clues||[]).forEach((cl,i) => cards.push([d.n, i, cl])));
     el.innerHTML = `<div class="cork">${cards.map(([n,i,cl])=>{ const k='clue:c'+n+':'+i, v=S().vals[k]||0; return `<div class="icard v${v}"><small>Ch ${n}</small><p>${esc(cl)}</p><button class="btn ghost" data-clue="${k}" data-v="${v}">${['Unmarked','Clue','Red herring','Unsure'][v]}</button></div>`; }).join('')}</div>`;
     el.querySelectorAll('[data-clue]').forEach(b => b.onclick = () => { const v = ((+b.dataset.v)+1)%4; b.dataset.v = v; setVal(b.dataset.clue, v); b.textContent = ['Unmarked','Clue','Red herring','Unsure'][v]; b.parentNode.className = 'icard v'+v; }); }); } },
 { name:'Strand braid', desc:'The plot lines as coloured threads. See how the novel cuts between them.', render(el){
   el.innerHTML = '<p class="loading">Braiding…</p>'; upTo().then(chs => { const keys = Object.keys(CF.STRANDS);
     el.innerHTML = `<div class="scrollx"><table class="concord braid"><caption>Which strands each chapter advances</caption>${keys.map(k=>`<tr><th><span class="sw" style="background:${CF.STRANDS[k][1]}"></span>${esc(CF.STRANDS[k][0])}</th>${chs.map(d=>`<td style="${d.strands.includes(k)?'background:'+CF.STRANDS[k][1]:''}" title="Chapter ${d.n}"></td>`).join('')}</tr>`).join('')}</table></div><p class="fine">Where does the author leave a strand hanging longest? What does the gap do to you?</p>`; }); } },
 { name:'Chapter architecture', desc:'Label each scene: setup, complication, reveal, turn or hook.', render(el, c){
   const L = ['—','Setup','Complication','Reveal','Turn','Hook'];
   el.innerHTML = `<ol class="arch">${c.d.beats.map((b,i)=>{ const k='arch:c'+c.ch+':'+i; const v=S().vals[k]||0; return `<li><span>${esc(b)}</span><select data-arch="${k}" aria-label="Label for scene ${i+1}">${L.map((l,j)=>`<option value="${j}" ${j===v?'selected':''}>${l}</option>`).join('')}</select></li>`; }).join('')}</ol><p class="fine">Most Coben chapters end on a hook or a turn. Does this one? Where is the chapter’s centre of gravity?</p>`;
   el.querySelectorAll('[data-arch]').forEach(s => s.onchange = () => setVal(s.dataset.arch, +s.value)); } },
 { name:'Suspicion meter', desc:'Who do you suspect, and of what? Track your hunches chapter by chapter.', render(el, c){
   el.innerHTML = '<p class="loading">Pulling files…</p>'; upTo().then(chs => { const names = []; chs.forEach(d => d.cast.forEach(([n]) => { if (!names.includes(n)) names.push(n); }));
     const host = document.createElement('div'); host.setAttribute('data-redraw','1');
     host.innerHTML = `<p class="fine">Rate how much you distrust each character as of chapter ${c.ch}.</p>` + names.slice(0,24).map(n => slider('sus:'+n+':c'+c.ch, 0, 10, 1, 0, n)).join('');
     el.innerHTML = ''; el.appendChild(host); }); } },
 { name:'Plant and payoff log', desc:'Note a detail when it’s planted; come back when it pays off.', render(el, c){
   const list = S().vals['plants'] || [];
   const draw = () => { el.innerHTML = `<ul class="plants">${list.map((p,i)=>`<li><strong>Ch ${p.c}:</strong> ${esc(p.t)} ${p.paid?`<em>Paid off in ch ${p.paid}</em>`:`<button class="btn ghost" data-pay="${i}">Paid off in chapter ${c.ch}</button>`}</li>`).join('')}</ul><label class="row">New plant spotted in chapter ${c.ch} <input class="pin" placeholder="A detail that feels placed on purpose"></label><button class="btn add">Pin it</button>`;
     el.querySelector('.add').onclick = () => { const v = el.querySelector('.pin').value.trim(); if (!v) return; list.push({c:c.ch, t:v}); setVal('plants', list); draw(); };
     el.querySelectorAll('[data-pay]').forEach(b => b.onclick = () => { list[+b.dataset.pay].paid = c.ch; setVal('plants', list); draw(); }); };
   draw(); } },
 { name:'Scene from another chair', desc:'Rewrite one scene from inside a different character’s head.', render(el, c){
   const names = c.d.cast.map(x=>x[0]);
   el.innerHTML = `<p>Pick someone present in chapter ${c.ch} whose thoughts we don’t get. Write 300 words of the same scene from their side. Keep the events; change what’s noticed and what’s withheld.</p><p class="fine">Present: ${names.map(esc).join(', ')}.</p>${note('chair:c'+c.ch,'Their version',8)}`; } }
];

/* ======================= DINER: art & music ======================= */
const diner = [
 { name:'The jukebox', desc:'Every song the novel names, with what it’s doing there. Press play for an original mood sketch.', render(el){
   const songs = CF.JUKEBOX.filter(s=>s.ch<=S().ch);
   el.innerHTML = songs.length ? `<ul class="juke">${songs.map((s,i)=>`<li><div><strong>${esc(s.song)}</strong> <small>${esc(s.artist)}${s.year?', '+s.year:''} · chapter ${s.ch}</small><p>${esc(s.note)}</p></div><button class="btn ghost" data-sketch="${i}">Play a sketch</button></li>`).join('')}</ul><p class="fine">The sketches are original chord loops in the right mood, not the songs. Look the songs up and listen properly; we can’t reproduce their lyrics or recordings.</p>` : '<p>The jukebox fills from chapter 2.</p>';
   el.querySelectorAll('[data-sketch]').forEach(b => b.onclick = () => { try { const C = window.AudioContext||window.webkitAudioContext, ctx = new C(); const prog = [[0,4,7],[5,9,12],[7,11,14],[0,4,7]]; const root = 196 * Math.pow(2, (+b.dataset.sketch % 5)/12);
     prog.forEach((ch,k) => ch.forEach(st => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type='triangle'; o.frequency.value = root*Math.pow(2,st/12); const t = ctx.currentTime + k*0.9; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.06,t+0.05); g.gain.exponentialRampToValueAtTime(0.0001,t+0.85); o.connect(g).connect(ctx.destination); o.start(t); o.stop(t+0.9); })); } catch(e){} }); } },
 { name:'Chapter palette', desc:'Pick three colours for this chapter. Your book becomes a strip of swatches.', render(el, c){
   const k = 'pal:c'+c.ch, v = S().vals[k] || ['#1A2C3A','#E8A33D','#8C3A2B'];
   el.innerHTML = `<div class="palpick">${v.map((col,i)=>`<label>Colour ${i+1} <input type="color" value="${col}" data-pal="${i}"></label>`).join('')}</div><div class="strip"></div>${note('pal:c'+c.ch,'Why these colours?',2)}`;
   const draw = () => { el.querySelector('.strip').innerHTML = Array.from({length:S().ch},(_,i)=>{ const p = S().vals['pal:c'+(i+1)]; return `<span class="sw3" title="Chapter ${i+1}">${p?p.map(x=>`<i style="background:${x}"></i>`).join(''):'<i></i>'}</span>`; }).join(''); };
   el.querySelectorAll('[data-pal]').forEach(inp => inp.oninput = () => { v[+inp.dataset.pal] = inp.value; setVal(k, v.slice()); draw(); }); draw(); } },
 { name:'Soundtrack builder', desc:'Assign one song of your choice to this chapter and say why.', render(el, c){
   el.innerHTML = `<label class="row">Song and artist ${note('sound:c'+c.ch+':song','e.g. a song you’d hear in the car on the way home',1)}</label><label class="row">Why it fits ${note('sound:c'+c.ch+':why','Tempo, lyric theme, era, irony…',3)}</label><p class="fine">Your full soundtrack is collected in your commonplace book.</p>`; } },
 { name:'Night sketchpad', desc:'Paint a scene from the chapter with a night palette. Saved in this browser.', render(el, c){
   const k = 'sketch:c'+c.ch;
   el.innerHTML = `<div class="sketchbar">${['#0E1822','#2E5A4C','#8C3A2B','#E8A33D','#6FA8DC','#E9EEE4'].map((col,i)=>`<button class="swatch ${i===3?'on':''}" style="background:${col}" data-col="${col}" aria-label="Colour ${col}"></button>`).join('')}<label>Brush <input type="range" min="2" max="40" value="10" class="bsz"></label><button class="btn ghost clr">Clear</button></div><canvas width="800" height="400" class="sketch" aria-label="Drawing canvas"></canvas>`;
   const cv = el.querySelector('canvas'), x = cv.getContext('2d'); let col = '#E8A33D', down = false, last = null;
   x.fillStyle = '#0E1822'; x.fillRect(0,0,800,400); const saved = S().vals[k]; if (saved) { const im = new Image(); im.onload = () => x.drawImage(im,0,0); im.src = saved; }
   const pos = e => { const r = cv.getBoundingClientRect(); const p = e.touches ? e.touches[0] : e; return [(p.clientX-r.left)*800/r.width, (p.clientY-r.top)*400/r.height]; };
   const draw = e => { if (!down) return; e.preventDefault(); const p = pos(e); x.strokeStyle = col; x.lineCap = 'round'; x.lineWidth = +el.querySelector('.bsz').value; x.globalAlpha = .85; x.beginPath(); x.moveTo(...(last||p)); x.lineTo(...p); x.stroke(); last = p; };
   const up = () => { if (down) { down = false; last = null; try { setVal(k, cv.toDataURL('image/jpeg', .7)); } catch(e){} } };
   cv.addEventListener('pointerdown', e => { down = true; last = pos(e); cv.setPointerCapture(e.pointerId); }); cv.addEventListener('pointermove', draw); cv.addEventListener('pointerup', up); cv.addEventListener('pointerleave', up);
   el.querySelectorAll('[data-col]').forEach(b => b.onclick = () => { col = b.dataset.col; el.querySelectorAll('.swatch').forEach(s=>s.classList.toggle('on', s===b)); });
   el.querySelector('.clr').onclick = () => { x.fillStyle = '#0E1822'; x.fillRect(0,0,800,400); delete S().vals[k]; CF.save(); }; } },
 { name:'Picture study', desc:'Three real artists of suburban night, and how to look at them alongside this book.', render(el){
   el.innerHTML = `<article class="card"><h4>Edward Hopper, <cite>Nighthawks</cite> (1942)</h4><p>Four figures in a lit all-night diner, seen through glass from a dark street. Look up the painting (Art Institute of Chicago). Notice there is no visible door. Who in this novel is inside the glass, and who is looking in?</p>${note('pic:hopper','',2)}</article>
   <article class="card"><h4>Gregory Crewdson, <cite>Twilight</cite> (2002)</h4><p>Staged photographs of American suburbs at dusk, lit like film sets, in which something has gone quietly wrong. Pick one image and match it to a chapter.</p>${note('pic:crewdson','',2)}</article>
   <article class="card"><h4>Bill Owens, <cite>Suburbia</cite> (1973)</h4><p>Documentary photographs of California suburbanites with their own captions: pride, boredom, barbecues. Cedarfield forty years on: what has changed?</p>${note('pic:owens','',2)}</article>`; } },
 { name:'Cover brief', desc:'Design an original cover for the novel. No film stills, no borrowed art.', render(el, c){
   el.innerHTML = `<p>Write a one-page brief for a designer: the single image, the palette, the type, what the cover must not give away.</p>${['The one image','Palette and light','Typeface feeling','What it must not reveal','Tagline (your own words)'].map((l,i)=>`<label class="row">${l} ${note('cover:'+i,'',2)}</label>`).join('')}`; } }
];

/* ======================= KITCHEN: food & making ======================= */
const MAKES = [
  ['A treasurer’s ledger notebook','Fold six sheets of green-ruled paper into a signature, pierce five holes along the fold, and pamphlet-stitch it into a card cover with waxed thread. Use it for this book’s accounts: who owes whom, in money and in truth.',60],
  ['A licence-plate notebook','Like the lot attendant’s: one evening, sit somewhere and log every car that passes, colour and make. Then write what you could deduce about the street from the list alone.',45],
  ['A family password card','Invent a password scheme the way the Prices did, from a random word in a café. Make it a small laminated card. Then ask: who else in your house knows it?',20],
  ['A lacrosse-mesh coaster set','Cut squares of mesh or open-weave fabric, back them with felt, and stitch the edges in team colours. A small homage to the sport the town runs on.',40],
  ['A two-faced portrait','Draw or collage a portrait split down the middle: the public face on one side, the private one on the other. Choose any character up to your chapter.',45],
  ['A secrets box','Line a small box with paper on which you write, in your own words, one secret from each chapter. Seal it. Open it when you finish the book and see which ones mattered.',30]
];
const kitchen = [
 { name:'Recipe cards', desc:'Original recipes for the food the novel names. Scale them for your table.', render(el){
   const rs = CF.RECIPES.filter(r=>r.ch<=S().ch);
   el.innerHTML = rs.map(r => `<article class="recipe" data-r="${r.id}"><h4>${esc(r.name)} <small>chapter ${r.ch}</small></h4><label>Serves <input type="number" min="1" max="20" value="${r.serves}" class="srv" aria-label="Servings for ${esc(r.name)}"></label><ul class="ing"></ul><ol>${r.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p class="fine">${esc(r.note)}</p><button class="btn ghost" data-shop="${r.id}">Add to shopping list</button></article>`).join('') || '<p>The first recipe arrives with chapter 5.</p>';
   el.querySelectorAll('.recipe').forEach(card => { const r = CF.RECIPES.find(x=>x.id===card.dataset.r); const draw = () => { const f = (+card.querySelector('.srv').value||r.serves)/r.serves; card.querySelector('.ing').innerHTML = r.ing.map(([q,u,n])=>`<li>${+(q*f).toFixed(q*f<1?2:1)}${u?' '+u:''} ${esc(n)}</li>`).join(''); }; card.querySelector('.srv').oninput = draw; draw(); });
   el.querySelectorAll('[data-shop]').forEach(b => b.onclick = () => { const l = S().vals['shop'] || []; const r = CF.RECIPES.find(x=>x.id===b.dataset.shop); r.ing.forEach(i => { const t = i[2]; if (!l.find(x=>x.t===t)) l.push({t, done:false}); }); setVal('shop', l); b.textContent = 'Added'; }); } },
 { name:'Table talk deck', desc:'Questions for the dinner table, drawn from the chapters you’ve read.', render(el){
   el.innerHTML = '<p class="loading">Shuffling…</p>'; upTo().then(chs => { const pool = []; chs.forEach(d => d.questions.forEach((q,i) => { if (i%3===2 || q[1]) pool.push([d.n,q[0]]); }));
     const draw = () => { const [n,q] = pool[Math.floor(Math.random()*pool.length)]; el.querySelector('.card').innerHTML = `<p class="kick">Chapter ${n}</p><p class="qq">${esc(q)}</p>`; };
     el.innerHTML = `<div class="card deck"></div><button class="btn">Next card</button><p class="fine">House rule: everybody answers before anybody argues.</p>`; el.querySelector('.btn').onclick = draw; draw(); }); } },
 { name:'Food diary', desc:'What’s eaten in this chapter and what it says about the eaters.', render(el, c){
   const f = c.d.food || [];
   el.innerHTML = (f.length ? `<ul>${f.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>` : '<p>No food to speak of in this chapter. That can be telling too.</p>') + note('food:c'+c.ch,'Who feeds whom here? Who doesn’t eat? What’s the meal really about?',3); } },
 { name:'Shopping list', desc:'Built from the recipe cards. Tick off as you shop; print it.', render(el){
   const draw = () => { const l = S().vals['shop'] || []; el.innerHTML = l.length ? `<ul class="checks">${l.map((x,i)=>`<li><label><input type="checkbox" data-shopi="${i}" ${x.done?'checked':''}> ${esc(x.t)}</label></li>`).join('')}</ul><button class="btn ghost clr">Clear list</button>` : '<p>Empty. Add ingredients from the recipe cards.</p>';
     el.querySelectorAll('[data-shopi]').forEach(c => c.onchange = () => { l[+c.dataset.shopi].done = c.checked; setVal('shop', l); }); const b = el.querySelector('.clr'); if (b) b.onclick = () => { setVal('shop', []); draw(); }; };
   draw(); } },
 { name:'Kitchen timer', desc:'For marinating, resting, and fifteen-minute activities.', render(el){
   el.innerHTML = `<div class="timers">${[[300,'5 min'],[900,'15 min'],[1800,'30 min'],[3600,'60 min']].map(([s,l])=>`<div><h4>${l}</h4>${timerHTML(s)}</div>`).join('')}</div>`; } },
 { name:'Maker’s bench', desc:'Six hands-on projects that come out of the book’s world.', render(el){
   el.innerHTML = MAKES.map(([t,d,m],i)=>{ const k='make:'+i; return `<article class="card"><h4><label><input type="checkbox" data-pk="${k}" ${S().ticks[k]?'checked':''}> ${esc(t)}</label> <small>${m} min</small></h4><p>${esc(d)}</p></article>`; }).join(''); } }
];

/* ======================= DRIVEWAY: reflective journal ======================= */
const JPROMPTS = ['What did this chapter make you remember from your own life?','Who did you feel for most, and did that surprise you?','What do you know now that a character doesn’t?','What would you have done in the car, engine off, before going inside?','Which sentence (in your own words) stayed with you, and why?','What are you afraid will happen next?'];
const MOODS = [['dread','Dread','var(--brick)'],['sympathy','Sympathy for Adam','var(--cedar)'],['trust','Trust in Corinne','var(--glow)'],['curiosity','Curiosity','var(--sodium)']];
const driveway = [
 { name:'Chapter journal', desc:'A private page per chapter, with a prompt if you want one.', render(el, c){
   el.innerHTML = `<p class="qq">${esc(JPROMPTS[(c.ch-1)%JPROMPTS.length])}</p>${note('journal:c'+c.ch,'Write freely. Only this browser sees it.',10)}`; } },
 { name:'Mood dial', desc:'Four feelings, rated each chapter. Watch your reading body change.', render(el, c){
   const host = document.createElement('div'); host.setAttribute('data-redraw','1');
   host.innerHTML = MOODS.map(([k,l])=>slider('mood:'+k+':c'+c.ch, 0, 10, 1, 5, l)).join('') + '<div class="mc"></div>'; el.appendChild(host);
   host._redraw = () => host.querySelector('.mc').innerHTML = lines(MOODS.map(([k,l,col])=>({name:l, color:col, vals:Array.from({length:S().ch},(_,i)=>S().vals['mood:'+k+':c'+(i+1)])})), S().ch, 10, {label:'Your moods by chapter'}); host._redraw(); } },
 { name:'Prediction log', desc:'Write a prediction now. Mark it right or wrong when you know.', render(el, c){
   const list = S().vals['preds'] || [];
   const draw = () => { el.innerHTML = `<ul class="plants">${list.map((p,i)=>`<li><strong>Ch ${p.c}:</strong> ${esc(p.t)} ${p.r?`<em>${p.r==='y'?'Right':p.r==='n'?'Wrong':'Half right'} (checked at ch ${p.at})</em>`:`<span class="seg"><button class="btn ghost" data-pr="${i}:y">Right</button><button class="btn ghost" data-pr="${i}:h">Half</button><button class="btn ghost" data-pr="${i}:n">Wrong</button></span>`}</li>`).join('')}</ul><label class="row">I predict… <input class="pin" placeholder="Something that hasn’t happened yet"></label><button class="btn add">Seal it</button><p class="fine">${list.filter(p=>p.r==='y').length} right, ${list.filter(p=>p.r==='n').length} wrong so far.</p>`;
     el.querySelector('.add').onclick = () => { const v = el.querySelector('.pin').value.trim(); if (!v) return; list.push({c:c.ch, t:v}); setVal('preds', list); draw(); };
     el.querySelectorAll('[data-pr]').forEach(b => b.onclick = () => { const [i,r] = b.dataset.pr.split(':'); list[+i].r = r; list[+i].at = c.ch; setVal('preds', list); draw(); }); };
   draw(); } },
 { name:'The unsent letter', desc:'Write to a character. Say what you couldn’t say in the book club.', render(el, c){
   const names = c.d.cast.map(x=>x[0]); const sel = S().vals['letter:to:c'+c.ch] || names[0];
   el.innerHTML = `<label>Dear <select class="to">${names.map(n=>`<option ${n===sel?'selected':''}>${esc(n)}</option>`).join('')}</select></label>${note('letter:c'+c.ch,'Write it. You won’t send it.',8)}`;
   el.querySelector('.to').onchange = e => setVal('letter:to:c'+c.ch, e.target.value); } },
 { name:'Reading log', desc:'Log your reading sessions. Minutes, where, with what.', render(el, c){
   const log = S().vals['log'] || [];
   const draw = () => { const total = log.reduce((a,b)=>a+(+b.m||0),0); el.innerHTML = `<div class="row2"><label>Minutes <input type="number" class="m" min="1" value="30"></label><label>Where <input class="w" placeholder="Train, bed, bath…"></label></div><button class="btn add">Log session</button><p>${log.length} sessions, ${total} minutes (${(total/60).toFixed(1)} hours).</p>${bars(log.slice(-30).map(x=>+x.m), Math.max(60,...log.map(x=>+x.m||0)), {label:'Recent sessions', lab:i=>'Session'})}<ul class="fine">${log.slice(-6).reverse().map(x=>`<li>Ch ${x.c}: ${x.m} min, ${esc(x.w||'somewhere')}</li>`).join('')}</ul>`;
     el.querySelector('.add').onclick = () => { log.push({c:c.ch, m:+el.querySelector('.m').value||0, w:el.querySelector('.w').value}); setVal('log', log); draw(); }; };
   draw(); } },
 { name:'Commonplace preview', desc:'Everything you’ve written here, gathered. Export any time.', render(el){
   el.innerHTML = `<p class="actions"><button class="btn" id="cpOpen">Open as printable page</button> <button class="btn ghost" id="cpTxt">Download as text</button></p>` + CF.commonplace(); } }
];

CF.TOOLS = { office, classroom, records, stacks, turnpike, field, board, diner, kitchen, driveway };

/* ======================= Secret rooms ======================= */
const essay = ps => `<section class="panel prose">${ps.map(p=>`<p>${esc(p)}</p>`).join('')}</section>`;
const benford = [30.1,17.6,12.5,9.7,7.9,6.7,5.8,5.1,4.6];
CF.SECRET_VIEWS = {
  burner(el){ el.innerHTML = essay(['A burner is a phone with a number and no name. Everyone in this novel wants one and almost nobody has one. Corinne’s password was the opposite of a burner: a word chosen because it meant nothing, which ended up meaning everything once Adam knew it.','Below, decode a message the way an investigator would: by pattern, not by password.'])
    + `<section class="panel"><h2>The shift cipher</h2><p>Each letter has been moved the same number of places along the alphabet. Slide until it reads.</p><p class="cipher" aria-live="polite"></p>${slider('cipher', 0, 25, 1, 0, 'Shift')}<p class="fine">When it reads, write down where you’d hide a secret if you had to.</p>${note('burner:hide','',3)}</section>`;
    const plain = 'A SECRET TOLD IS ONLY A SECRET MOVED', enc = plain.replace(/[A-Z]/g, ch => String.fromCharCode((ch.charCodeAt(0)-65+7)%26+65)), p = el.querySelector('.cipher'), host = el.querySelector('.slider'); host.setAttribute('data-redraw','1');
    host._redraw = () => { const k = S().vals['cipher']||0; p.textContent = enc.replace(/[A-Z]/g, ch => String.fromCharCode((ch.charCodeAt(0)-65-k+26*2)%26+65)); }; host._redraw(); },
  darkroom(el){ el.innerHTML = essay(['Facebook, Corinne said, is a greatest-hits album. The holiday party photo that cracks the case is the opposite: a candid nobody posed for, in which the stranger isn’t even looking at the camera. Investigators love group shots for exactly that reason.','Develop your own: describe a group photograph you appear in, and list everything a stranger could learn from it.'])
    + `<section class="panel"><h2>Develop a print</h2><p class="fine">Slide the timer to bring the image up.</p><div class="develop"><svg viewBox="0 0 400 220" role="img" aria-label="A developing photograph of a group at a party"><rect width="400" height="220" fill="#E8C9C0"/><g class="dev">${Array.from({length:9},(_,i)=>`<circle cx="${30+i*42}" cy="${110+(i%2)*10}" r="16" fill="#3A1A16"/><rect x="${16+i*42}" y="${128+(i%2)*10}" width="28" height="70" fill="#3A1A16"/>`).join('')}<circle cx="30" cy="110" r="18" fill="none" stroke="#B23A2E" stroke-width="3"/></g></svg></div>${slider('develop', 0, 100, 1, 0, 'Seconds in the developer')}${note('dark:photo','A group photo you’re in, and what it gives away',4)}</section>`;
    const host = el.querySelector('.slider'); host.setAttribute('data-redraw','1'); host._redraw = () => el.querySelector('.dev').style.opacity = (S().vals['develop']||0)/100; host._redraw(); },
  server(el){ el.innerHTML = essay(['Every promise of anonymity on the web is a promise made by a person, enforced by a person, and breakable by a person. The stranger’s group are not master hackers; they are employees with access. That is the scarier idea.','Make an inventory of the records your own week leaves behind.'])
    + `<section class="panel"><h2>Your data trail</h2><ul class="checks">${['Card payments','Toll or transit cards','Phone location history','Browser history on a shared computer','Photos with location data','Messages on someone else’s phone','Workplace door or login records','Loyalty cards','Doorbell or shop cameras','Fitness tracker'].map((t,i)=>`<li><label><input type="checkbox" data-pk="trail:${i}" ${S().ticks['trail:'+i]?'checked':''}> ${t}</label></li>`).join('')}</ul>${note('server:trail','Which one would tell a stranger most about you?',3)}</section>`; },
  lockbox(el){ el.innerHTML = essay(['Benford’s law: in many real-world sets of figures (invoices, populations, expenses), the leading digit is 1 about 30% of the time and 9 under 5%. People inventing numbers spread them too evenly. Forensic accountants use this as a first sniff test, not as proof.','Paste a column of numbers (your own bank statement, a sports table, populations) and see how close they come.'])
    + `<section class="panel"><h2>Benford tester</h2><textarea rows="6" class="bf" aria-label="Numbers to test" placeholder="One number per line, or separated by spaces"></textarea><button class="btn">Test</button><div class="bfo" aria-live="polite"></div></section>`;
    el.querySelector('button').onclick = () => { const nums = (el.querySelector('.bf').value.match(/[1-9][\d,.]*/g)||[]); const c = Array(9).fill(0); nums.forEach(n => c[+n[0]-1]++); const t = nums.length||1;
      el.querySelector('.bfo').innerHTML = `<p>${nums.length} numbers.</p><table class="data"><tr><th>Digit</th>${c.map((_,i)=>`<th>${i+1}</th>`).join('')}</tr><tr><th>Yours %</th>${c.map(v=>`<td>${(v/t*100).toFixed(0)}</td>`).join('')}</tr><tr><th>Benford %</th>${benford.map(v=>`<td>${v}</td>`).join('')}</tr></table><p class="fine">Small samples wobble. You need a few hundred numbers spanning several orders of magnitude for the test to mean much.</p>`; }; },
  storage(el){ el.innerHTML = essay(['The Prices own a two-car garage and park in the driveway, because the garage is full of things they don’t use and can’t throw away. It is the most honest room in the house.','Inventory a cupboard, drawer or garage of your own. What are you keeping, and why?'])
    + `<section class="panel"><h2>The inventory</h2>${[1,2,3,4,5,6].map(i=>`<label class="row">Item ${i}, and why it stays ${note('storage:'+i,'',1)}</label>`).join('')}</section>`; },
  motel(el){ el.innerHTML = essay(['Violence in this novel mostly happens offstage, then arrives as a photograph slid across a table. Coben keeps the camera on people who are told about it. That is a choice about what kind of book this is.','Write the scene as the novel would: from the point of view of someone who is shown the evidence afterwards.'])
    + `<section class="panel"><h2>Offstage</h2>${note('motel:scene','A scene in which the violence is only reported',8)}</section>`; },
  woods(el){ el.innerHTML = essay(['A trail into the woods is where suburban fiction buries what the town can’t hold. You have walked the whole way here: every curio in your satchel is a small, ordinary object that turned out to carry weight.','Write the epilogue you would want for one minor character, someone the ending leaves on the edge of the frame.'])
    + `<section class="panel"><h2>A minor epilogue</h2>${note('woods:epilogue','Six months later, for…',8)}</section>`; }
};
CF.SECRET_VIEWS.dossier = function(){};
})();
