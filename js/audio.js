/* Live Web Audio soundscapes, generated in the browser. Off by default; crossfade between rooms. */
(function(){
let ctx = null, master = null, current = null, timers = [];
const A = CF.audio = { on: false, vol: 0.5 };

function noiseBuf(kind){
  const len = ctx.sampleRate * 3, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
  let last = 0, b0=0,b1=0,b2=0;
  for(let i=0;i<len;i++){ const w = Math.random()*2-1;
    if(kind==='brown'){ last = (last + 0.02*w)/1.02; d[i] = last*3.5; }
    else if(kind==='pink'){ b0=.99765*b0+w*.099046; b1=.963*b1+w*.2965164; b2=.57*b2+w*1.0526913; d[i]=(b0+b1+b2+w*.1848)*.18; }
    else d[i] = w*.5; }
  return b;
}
function noise(out, kind, type, freq, q, gain){
  const s = ctx.createBufferSource(); s.buffer = noiseBuf(kind); s.loop = true;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q||0.7;
  const g = ctx.createGain(); g.gain.value = gain; s.connect(f).connect(g).connect(out); s.start();
  return { s, f, g, stop(){ try{s.stop();}catch(e){} } };
}
function tone(out, type, freq, gain, lfoRate, lfoDepth){
  const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq; const g = ctx.createGain(); g.gain.value = gain; o.connect(g).connect(out); o.start();
  let l; if(lfoRate){ l = ctx.createOscillator(); l.frequency.value = lfoRate; const lg = ctx.createGain(); lg.gain.value = lfoDepth; l.connect(lg).connect(g.gain); l.start(); }
  return { stop(){ try{o.stop(); l&&l.stop();}catch(e){} } };
}
function blip(out, freq, dur, gain, type, slide){
  const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(); o.type = type||'sine'; o.frequency.setValueAtTime(freq, t);
  if(slide) o.frequency.exponentialRampToValueAtTime(slide, t+dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t+0.01); g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
  o.connect(g).connect(out); o.start(t); o.stop(t+dur+0.05);
}
function burst(out, dur, freq, gain, type){
  const t = ctx.currentTime, s = ctx.createBufferSource(); s.buffer = noiseBuf('white'); const f = ctx.createBiquadFilter(); f.type = type||'bandpass'; f.frequency.value = freq; f.Q.value = 1.2;
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(gain, t+dur*0.3); g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
  s.connect(f).connect(g).connect(out); s.start(t); s.stop(t+dur+0.05);
}
function every(ms, jitter, fn){ const loop = () => { fn(); const h = setTimeout(loop, ms + Math.random()*jitter); timers.push(h); }; const h = setTimeout(loop, Math.random()*ms); timers.push(h); }

const SCAPES = {
  hall(o){ const a=[noise(o,'pink','bandpass',500,0.6,0.22), noise(o,'brown','lowpass',180,0.7,0.25), tone(o,'sawtooth',120,0.004,0.3,0.002)];
    every(1800,2600,()=>blip(o,2600+Math.random()*900,0.35,0.05,'sine')); every(5000,7000,()=>burst(o,0.25,900,0.08)); return a; },
  office(o){ const a=[noise(o,'brown','lowpass',220,0.5,0.35), tone(o,'sine',60,0.02)]; every(1000,0,()=>blip(o,1800,0.03,0.04,'square'));
    every(4000,9000,()=>{ for(let i=0;i<6;i++) setTimeout(()=>blip(o,600+Math.random()*300,0.03,0.03,'square'), i*110+Math.random()*60); }); return a; },
  classroom(o){ const a=[tone(o,'sawtooth',120,0.006), tone(o,'sine',240,0.004,0.5,0.003), noise(o,'pink','bandpass',1200,0.5,0.05)];
    every(14000,12000,()=>{ blip(o,880,1.6,0.05,'triangle'); setTimeout(()=>blip(o,660,1.8,0.05,'triangle'),180); }); every(3500,5000,()=>burst(o,0.12,3000,0.04,'highpass')); return a; },
  records(o){ const a=[noise(o,'brown','lowpass',150,0.5,0.3)]; let tk=0; every(900,0,()=>{ blip(o, tk++%2?1400:1200, 0.04, 0.05,'square'); }); every(9000,9000,()=>burst(o,0.6,2500,0.05)); return a; },
  stacks(o){ const a=[noise(o,'brown','lowpass',120,0.5,0.25), tone(o,'sawtooth',100,0.003)]; every(3000,6000,()=>burst(o,0.4,4000,0.05,'highpass')); every(9000,8000,()=>blip(o,180,0.15,0.04,'sine')); return a; },
  turnpike(o){ const a=[noise(o,'brown','lowpass',300,0.5,0.35)];
    every(2600,3000,()=>{ const t=ctx.currentTime, s=ctx.createBufferSource(); s.buffer=noiseBuf('pink'); const f=ctx.createBiquadFilter(); f.type='bandpass'; f.Q.value=0.8; f.frequency.setValueAtTime(300,t); f.frequency.exponentialRampToValueAtTime(1400,t+1.2); f.frequency.exponentialRampToValueAtTime(250,t+2.6); const g=ctx.createGain(); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.5,t+1.2); g.gain.exponentialRampToValueAtTime(0.0001,t+2.8); s.connect(f).connect(g).connect(o); s.start(t); s.stop(t+3); });
    every(7000,6000,()=>blip(o,1900,0.08,0.04,'sine')); return a; },
  field(o){ const w = noise(o,'pink','bandpass',600,0.4,0.12); const l=ctx.createOscillator(), lg=ctx.createGain(); l.frequency.value=0.07; lg.gain.value=300; l.connect(lg).connect(w.f.frequency); l.start();
    every(8000,9000,()=>{ blip(o,2800,0.25,0.05,'square',2600); }); every(5000,6000,()=>burst(o,0.9,700,0.08)); return [w,{stop(){try{l.stop()}catch(e){}}}]; },
  board(o){ const a=[noise(o,'white','bandpass',1800,0.4,0.03), tone(o,'sine',60,0.015)]; every(6000,8000,()=>{ burst(o,0.5,1500,0.08); setTimeout(()=>blip(o,1200,0.12,0.04,'square'),520); }); every(1200,0,()=>blip(o,2000,0.02,0.02,'square')); return a; },
  diner(o){ const a=[noise(o,'pink','bandpass',450,0.6,0.15), tone(o,'sine',60,0.01)];
    const prog=[[220,277,330],[196,247,294],[175,220,262],[196,247,294]]; let k=0;
    every(2400,0,()=>{ const ch=prog[k++%4]; ch.forEach((f,i)=>blip(o,f,2.2,0.03,'triangle')); blip(o, ch[0]/2, 0.5, 0.05, 'sine'); });
    every(4000,5000,()=>blip(o,3000,0.3,0.04,'sine')); return a; },
  kitchen(o){ const a=[tone(o,'sine',55,0.025,0.1,0.01), tone(o,'sine',110,0.008), noise(o,'white','highpass',4000,0.7,0.025)];
    every(5000,7000,()=>blip(o,1500+Math.random()*800,0.2,0.04,'sine')); every(9000,9000,()=>burst(o,0.2,800,0.06)); return a; },
  driveway(o){ const a=[noise(o,'brown','lowpass',200,0.5,0.15)];
    every(700,900,()=>{ const f=4200+Math.random()*400; for(let i=0;i<3;i++) setTimeout(()=>blip(o,f,0.05,0.02,'sine'), i*60); });
    every(11000,9000,()=>{ const t=ctx.currentTime; const s=ctx.createBufferSource(); s.buffer=noiseBuf('pink'); const f=ctx.createBiquadFilter(); f.type='lowpass'; f.frequency.value=500; const g=ctx.createGain(); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.2,t+2); g.gain.exponentialRampToValueAtTime(0.0001,t+4.5); s.connect(f).connect(g).connect(o); s.start(t); s.stop(t+5); }); return a; },
  burner(o){ const a=[tone(o,'sine',50,0.02)]; every(6000,5000,()=>{ for(let i=0;i<3;i++) setTimeout(()=>blip(o,180,0.18,0.08,'square'), i*260); }); return a; },
  darkroom(o){ const a=[tone(o,'sawtooth',100,0.004), noise(o,'brown','lowpass',150,0.5,0.15)]; every(2500,3000,()=>blip(o,900+Math.random()*400,0.12,0.03,'sine')); return a; },
  server(o){ const a=[noise(o,'pink','lowpass',900,0.5,0.3), tone(o,'sine',117,0.01,0.2,0.006)]; every(500,700,()=>blip(o,3000+Math.random()*2000,0.02,0.015,'square')); return a; },
  lockbox(o){ const a=[noise(o,'brown','lowpass',140,0.5,0.25)]; every(3000,4000,()=>{ blip(o,700,0.04,0.05,'square'); setTimeout(()=>blip(o,520,0.05,0.05,'square'),90); }); return a; },
  storage(o){ const a=[noise(o,'brown','lowpass',110,0.5,0.25)]; every(7000,7000,()=>burst(o,0.4,300,0.08,'lowpass')); return a; },
  motel(o){ const a=[tone(o,'sawtooth',120,0.006,0.8,0.005), noise(o,'brown','lowpass',250,0.5,0.2)]; every(9000,7000,()=>burst(o,2.4,800,0.15)); return a; },
  woods(o){ const w=noise(o,'pink','bandpass',500,0.5,0.15); every(3000,5000,()=>{ const f=2000+Math.random()*1500; blip(o,f,0.12,0.03,'sine',f*1.3); setTimeout(()=>blip(o,f*1.1,0.1,0.025,'sine'),150); }); every(6000,8000,()=>burst(o,0.15,1800,0.06,'highpass')); return [w]; },
  dossier(o){ const a=[noise(o,'brown','lowpass',160,0.5,0.2), tone(o,'sine',220,0.006,0.05,0.004), tone(o,'sine',330,0.004,0.07,0.003)]; return a; }
};

function ensure(){ if(ctx) return true; const C = window.AudioContext || window.webkitAudioContext; if(!C) return false; ctx = new C(); master = ctx.createGain(); master.gain.value = A.vol; master.connect(ctx.destination); return true; }

A.play = function(name){
  A.room = name;
  if(!A.on) return;
  if(!ensure()) return;
  if(ctx.state === 'suspended') ctx.resume();
  const old = current, oldTimers = timers; timers = [];
  if(old){ const t = ctx.currentTime; old.g.gain.cancelScheduledValues(t); old.g.gain.setValueAtTime(old.g.gain.value, t); old.g.gain.linearRampToValueAtTime(0, t+1.6);
    setTimeout(()=>{ old.parts.forEach(p=>p.stop && p.stop()); old.g.disconnect(); }, 1800); oldTimers.forEach(clearTimeout); }
  const g = ctx.createGain(); g.gain.value = 0; g.connect(master); g.gain.linearRampToValueAtTime(1, ctx.currentTime+1.6);
  const parts = (SCAPES[name] || SCAPES.hall)(g) || [];
  current = { g, parts };
};
A.toggle = function(force){ A.on = typeof force === 'boolean' ? force : !A.on;
  if(A.on){ A.play(A.room || 'hall'); }
  else if(ctx && current){ const c=current; current=null; timers.forEach(clearTimeout); timers=[]; c.g.gain.linearRampToValueAtTime(0, ctx.currentTime+0.6); setTimeout(()=>{ c.parts.forEach(p=>p.stop&&p.stop()); c.g.disconnect(); },700); }
  return A.on; };
A.setVol = function(v){ A.vol = v; if(master) master.gain.setTargetAtTime(v, ctx.currentTime, 0.1); };
A.has = name => !!SCAPES[name];
})();
