// Checks every content/chapter-NN.js for the required depth. Run: node scripts/check-content.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const ctx = { window: {} }; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8'), ctx);
const rooms = ctx.CF.STUDY_ROOMS; let bad = 0, total = { q: 0, acts: 0 };
const files = fs.readdirSync(path.join(root, 'content')).filter(f => /^chapter-\d\d\.js$/.test(f)).sort();
for (const f of files) {
  vm.runInContext(fs.readFileSync(path.join(root, 'content', f), 'utf8'), ctx);
  const n = +f.match(/\d+/)[0], d = ctx.CF.CH[n], errs = [];
  if (!d) { console.log(f, 'NO DATA'); bad++; continue; }
  const need = (c, m) => { if (!c) errs.push(m); };
  need(d.n === n, 'n mismatch');
  need(d.summary && d.summary.length >= 3, 'summary paras <3');
  need(d.questions.length === 30, 'questions ' + d.questions.length);
  need(d.questions.filter(q => q[1]).length === 6, 'club ' + d.questions.filter(q => q[1]).length);
  need(d.close.length === 3 && d.close.every(c => c.steps.length >= 4 && c.cite && c.ask), 'close');
  need(d.prompts.length === 3, 'prompts ' + d.prompts.length);
  need(d.reading.length === 9 && d.reading.every(r => ctx.CF.BANK[r[0]]), 'reading ' + d.reading.map(r => ctx.CF.BANK[r[0]] ? '' : r[0]).join(' '));
  need(new Set(d.reading.map(r => r[0])).size === 9, 'reading dupes');
  need(d.projects.length === 6 && d.projects.every(p => p.rooms.length >= 2 && p.steps.length >= 4 && p.rooms.every(r => rooms.includes(r))), 'projects');
  need(d.quiz.length >= 5 && d.quiz.every(q => q[1][q[2]] !== undefined), 'quiz');
  need(d.beats.length >= 5, 'beats'); need(d.cast.length >= 2, 'cast');
  need(d.dilemma && d.dilemma.q && d.dilemma.a && d.dilemma.b, 'dilemma');
  need(d.motifs.every(m => ctx.CF.MOTIFS[m]), 'motif ids ' + d.motifs.filter(m => !ctx.CF.MOTIFS[m]));
  need(d.strands.every(s => ctx.CF.STRANDS[s]), 'strands');
  need((d.places || []).every(p => ctx.CF.PLACES[p]), 'places ' + (d.places || []).filter(p => !ctx.CF.PLACES[p]));
  for (const r of rooms) { need(d.lenses[r] && d.lenses[r].length > 120, 'lens ' + r); need(d.acts[r] && d.acts[r].length === 9 && d.acts[r].every(a => a[0] && a[1] && a[2] >= 10 && a[2] <= 60), 'acts ' + r + ' ' + (d.acts[r] || []).length); }
  // crude quote scan: long runs inside straight or curly double quotes
  const strs = []; (function walk(o){ if (typeof o === 'string') strs.push(o); else if (o && typeof o === 'object') Object.values(o).forEach(walk); })(d);
  const txt = strs.join(' \n '); const qs = strs.flatMap(s => s.match(/[“"][^“”"]{25,}[”"]/g) || []);
  total.q += d.questions.length; total.acts += rooms.reduce((a, r) => a + (d.acts[r] || []).length, 0);
  const words = txt.split(/\s+/).length;
  console.log(f, errs.length ? 'FAIL ' + errs.join('; ') : 'ok', words + ' words', qs.length ? 'CHECK-QUOTES: ' + qs.join(' | ') : '');
  if (errs.length) bad++;
}
console.log(files.length + ' chapters, ' + total.q + ' questions, ' + total.acts + ' activities; ' + bad + ' failing');
process.exit(bad ? 1 : 0);
