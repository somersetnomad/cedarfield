/* Painted-at-night SVG art. One style throughout: flat gouache shapes, wobbly edges via displacement,
   sodium-lamp glows, film grain. Everything is drawn in code; nothing is copied from any edition or adaptation. */
(function(){
const P = { n1:'#0E1822', n2:'#1A2C3A', n3:'#26404F', cedar:'#2E5A4C', cedarD:'#1E3D34', brick:'#8C3A2B', brickD:'#5E261D',
  sodium:'#E8A33D', sodiumL:'#F6D08A', glow:'#6FA8DC', paper:'#E9EEE4', ink:'#0B1117', grey:'#59656B', greyL:'#8E9A9C', aqua:'#4F9A93', red:'#B23A2E' };
CF.PAL = P;
let uid = 0;

function defs(id){
  return `<defs>
  <filter id="paint${id}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="${id%9+1}" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>
  <filter id="grain${id}"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.09 0"/></filter>
  <filter id="soft${id}"><feGaussianBlur stdDeviation="6"/></filter>
  <linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.n1}"/><stop offset=".7" stop-color="${P.n2}"/><stop offset="1" stop-color="${P.n3}"/></linearGradient>
  <radialGradient id="lamp${id}"><stop offset="0" stop-color="${P.sodiumL}" stop-opacity=".95"/><stop offset=".25" stop-color="${P.sodium}" stop-opacity=".45"/><stop offset="1" stop-color="${P.sodium}" stop-opacity="0"/></radialGradient>
  <radialGradient id="blue${id}"><stop offset="0" stop-color="#CFE6FA" stop-opacity=".9"/><stop offset=".3" stop-color="${P.glow}" stop-opacity=".35"/><stop offset="1" stop-color="${P.glow}" stop-opacity="0"/></radialGradient>
  <radialGradient id="red${id}"><stop offset="0" stop-color="#FF8A70" stop-opacity=".9"/><stop offset=".35" stop-color="${P.red}" stop-opacity=".4"/><stop offset="1" stop-color="${P.red}" stop-opacity="0"/></radialGradient>
  </defs>`;
}
const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647);
function stars(id, n, seed, h){ const r = rnd(seed); let o=''; for(let i=0;i<n;i++){ o+=`<circle cx="${(r()*1200).toFixed(0)}" cy="${(r()*h).toFixed(0)}" r="${(r()*1.4+.3).toFixed(1)}" fill="${P.paper}" opacity="${(r()*.5+.2).toFixed(2)}"/>`; } return o; }
function lamp(id,x,y,h,r){ r=r||110; return `<rect x="${x-2}" y="${y}" width="4" height="${h}" fill="${P.ink}"/><path d="M${x-14} ${y} q14 -10 28 0 z" fill="${P.ink}"/><circle cx="${x}" cy="${y+4}" r="${r}" fill="url(#lamp${id})"/><circle cx="${x}" cy="${y+3}" r="4" fill="${P.sodiumL}"/>`; }
function windows(x,y,cols,rows,w,h,gx,gy,lit,seed,col){ const r=rnd(seed); let o=''; for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){ const on=r()<lit; o+=`<rect x="${x+i*(w+gx)}" y="${y+j*(h+gy)}" width="${w}" height="${h}" fill="${on?(col||P.sodiumL):P.n1}" opacity="${on?(.75+r()*.25).toFixed(2):.85}"/>`; } return o; }
function curio(room,x,y,shape){
  return `<g class="curio" data-curio="${room}" tabindex="0" role="button" aria-label="Something small in the picture" transform="translate(${x} ${y})"><circle r="22" fill="transparent"/>${shape}</g>`;
}
function wrap(id, inner, opts){
  opts = opts || {};
  return `<svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${opts.label||'Painted scene'}" class="paint">${defs(id)}
  <g filter="url(#paint${id})">${inner}</g><rect width="1200" height="400" filter="url(#grain${id})" pointer-events="none"/>${opts.top||''}</svg>`;
}

const SCENES = {
  hall(id){ return wrap(id, `<rect width="1200" height="400" fill="url(#sky${id})"/>${stars(id,60,7,180)}
    <rect x="0" y="300" width="1200" height="100" fill="#151E24"/>
    <path d="M0 300 L1200 300" stroke="${P.greyL}" stroke-width="1" opacity=".3"/>
    ${[160,300,440,920,1060].map((x,i)=>`<path d="M${x} 330 h70" stroke="${P.paper}" stroke-width="3" opacity=".25"/>`).join('')}
    <rect x="360" y="150" width="480" height="150" fill="${P.brick}"/><rect x="360" y="150" width="480" height="150" fill="${P.brickD}" opacity=".35"/>
    <path d="M340 152 L600 108 L860 152 Z" fill="${P.brickD}"/>
    <rect x="560" y="210" width="80" height="90" fill="${P.n1}"/><rect x="566" y="216" width="68" height="84" fill="${P.sodium}" opacity=".35"/>
    <rect x="400" y="190" width="120" height="60" fill="${P.n1}"/><rect x="680" y="190" width="120" height="60" fill="${P.n1}"/>
    <text x="460" y="230" text-anchor="middle" font-family="Big Shoulders Display, sans-serif" font-size="30" fill="#FF6B5A" opacity=".95">BAR</text>
    <circle cx="460" cy="222" r="70" fill="url(#red${id})" opacity=".7"/>
    <text x="740" y="230" text-anchor="middle" font-family="Big Shoulders Display, sans-serif" font-size="26" fill="${P.glow}">OPEN</text>
    <circle cx="740" cy="222" r="70" fill="url(#blue${id})" opacity=".7"/>
    <rect x="530" y="160" width="140" height="28" fill="${P.ink}" opacity=".6"/><text x="600" y="180" text-anchor="middle" font-family="Newsreader, serif" font-size="15" fill="${P.paper}" opacity=".85">AMERICAN LEGION</text>
    <rect x="596" y="40" width="3" height="110" fill="${P.ink}"/><path d="M599 44 h52 v30 h-52 z" fill="${P.brick}" opacity=".8"/>
    ${lamp(id,180,140,160)}${lamp(id,1020,140,160)}
    <g><rect x="150" y="296" width="130" height="34" rx="10" fill="${P.grey}"/><rect x="170" y="280" width="80" height="24" rx="8" fill="${P.grey}"/><circle cx="175" cy="330" r="10" fill="${P.ink}"/><circle cx="255" cy="330" r="10" fill="${P.ink}"/></g>
    <g><rect x="880" y="300" width="150" height="34" rx="10" fill="${P.n3}"/><rect x="905" y="282" width="90" height="24" rx="8" fill="${P.n3}"/><circle cx="905" cy="334" r="10" fill="${P.ink}"/><circle cx="1005" cy="334" r="10" fill="${P.ink}"/>
    <path d="M1030 312 L1200 290 L1200 345 Z" fill="${P.sodiumL}" opacity=".18"/></g>
    <rect x="60" y="240" width="54" height="60" fill="${P.n3}"/><rect x="68" y="250" width="38" height="20" fill="${P.sodiumL}" opacity=".6"/>`
    + curio('hall',318,330,`<rect x="-9" y="-6" width="18" height="12" fill="${P.paper}" transform="rotate(-14)"/><path d="M-6 -2 h12 M-6 2 h10" stroke="${P.ink}" stroke-width="1" transform="rotate(-14)"/>`), {label:'The American Legion Hall at night: a low brick building with neon in the windows, a parking lot and sodium lamps.'}); },

  office(id){ return wrap(id, `<rect width="1200" height="400" fill="url(#sky${id})"/>${stars(id,30,3,140)}
    <rect x="0" y="340" width="1200" height="60" fill="#121A20"/>
    <rect x="380" y="80" width="460" height="260" fill="${P.n3}"/>${windows(392,92,9,6,40,30,10,12,.08,4)}
    <rect x="640" y="216" width="40" height="30" fill="${P.sodiumL}"/><circle cx="660" cy="232" r="60" fill="url(#lamp${id})"/>
    <path d="M652 240 l8 -14 l8 14 z" fill="${P.ink}"/>
    <rect x="380" y="80" width="460" height="260" fill="none" stroke="${P.greyL}" stroke-width="2" opacity=".4"/>
    <rect x="120" y="190" width="200" height="150" fill="${P.n2}"/>${windows(132,202,5,4,28,22,10,12,.15,11)}
    <rect x="900" y="160" width="220" height="180" fill="${P.n2}"/>${windows(912,172,6,5,24,20,10,10,.12,23)}
    ${lamp(id,340,230,110,80)}${lamp(id,880,230,110,80)}
    <text x="610" y="70" font-family="Big Shoulders Display, sans-serif" font-size="20" fill="${P.greyL}" opacity=".6" text-anchor="middle">MIDLAND AVE</text>`
    + curio('office',505,328,`<ellipse rx="7" ry="3" cy="9" fill="${P.paper}" opacity=".8"/><path d="M-5 9 q5 -22 10 0 z" fill="${P.paper}"/><circle cy="-8" r="4.5" fill="${P.paper}"/><path d="M-4 -12 h8" stroke="${P.brick}" stroke-width="2"/>`), {label:'A glass office block at night with one lit window and a desk lamp.'}); },

  classroom(id){ return wrap(id, `<rect width="1200" height="400" fill="url(#sky${id})"/>${stars(id,40,5,150)}
    <rect x="0" y="320" width="1200" height="80" fill="#17221E"/>
    <rect x="140" y="140" width="920" height="180" fill="#5E676A"/><rect x="140" y="140" width="920" height="16" fill="${P.aqua}" opacity=".75"/><rect x="140" y="230" width="920" height="8" fill="${P.aqua}" opacity=".6"/>
    ${windows(170,170,12,1,58,46,16,0,.15,8)}${windows(170,252,12,1,58,46,16,0,.1,19)}
    <rect x="690" y="252" width="58" height="46" fill="${P.sodiumL}" opacity=".95"/><text x="719" y="282" font-family="Big Shoulders Display, sans-serif" font-size="20" fill="${P.ink}" text-anchor="middle">233</text>
    <rect x="560" y="260" width="80" height="60" fill="${P.n1}"/><rect x="566" y="266" width="68" height="54" fill="${P.glow}" opacity=".25"/>
    <rect x="1100" y="60" width="4" height="260" fill="${P.greyL}"/><path d="M1104 64 h60 v36 h-60 z" fill="${P.brick}" opacity=".7"/>
    ${lamp(id,90,200,120,90)}<text x="600" y="128" font-family="Big Shoulders Display, sans-serif" font-size="24" fill="${P.paper}" text-anchor="middle" opacity=".7">CEDARFIELD HIGH SCHOOL</text>`
    + curio('classroom',470,336,`<rect x="-9" y="-9" width="18" height="18" fill="${P.sodium}"/><text y="4" font-size="10" text-anchor="middle" fill="${P.ink}" font-family="Newsreader, serif">Au</text>`), {label:'A grey 1970s high school with faded aqua trim; one window marked 233 is lit.'}); },

  records(id){ return wrap(id, `<rect width="1200" height="400" fill="url(#sky${id})"/>${stars(id,50,9,140)}
    <rect x="0" y="330" width="1200" height="70" fill="#131C22"/>
    <rect x="360" y="160" width="480" height="170" fill="#C9C2B0" opacity=".85"/><path d="M340 162 L600 100 L860 162 Z" fill="#B3AB98"/>
    ${[400,470,540,630,700,770].map(x=>`<rect x="${x}" y="176" width="22" height="140" fill="#E4DFD2"/>`).join('')}
    <rect x="560" y="40" width="80" height="64" fill="#B3AB98"/><path d="M552 42 L600 6 L648 42 Z" fill="${P.cedarD}"/><circle cx="600" cy="72" r="20" fill="${P.paper}"/><path d="M600 72 v-13 M600 72 l9 4" stroke="${P.ink}" stroke-width="2.5"/>
    <rect x="580" y="250" width="40" height="80" fill="${P.sodium}" opacity=".6"/>
    <rect x="330" y="316" width="540" height="14" fill="#A39C8B"/>
    ${lamp(id,250,220,110,90)}${lamp(id,950,220,110,90)}`
    + curio('records',700,338,`<rect x="-11" y="-7" width="22" height="14" fill="${P.paper}" transform="rotate(8)"/><text x="0" y="4" font-size="9" text-anchor="middle" fill="${P.brick}" transform="rotate(8)" font-family="Big Shoulders Display, sans-serif">#27</text>`), {label:'A columned town hall with a clock cupola, lit by streetlamps.'}); },

  stacks(id){ const r=rnd(31); let books=''; for(let s=0;s<5;s++){ let x=60; const y=70+s*62; while(x<1140){ const w=10+r()*16, h=38+r()*16; const c=[P.cedar,P.brick,P.n3,'#7A6A3A','#3E5566','#6C4A5E',P.greyL][Math.floor(r()*7)]; books+=`<rect x="${x.toFixed(0)}" y="${(y+54-h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${c}"/>`; x+=w+2+(r()<.08?40:0);} }
    return wrap(id, `<rect width="1200" height="400" fill="#18222A"/>${books}
    ${[0,1,2,3,4,5].map(s=>`<rect x="40" y="${124+s*62-62+54}" width="1120" height="8" fill="#3A2C22"/>`).join('')}
    <rect x="590" y="0" width="2" height="60" fill="${P.ink}"/><path d="M570 60 h42 l-8 12 h-26 z" fill="${P.ink}"/><circle cx="591" cy="72" r="230" fill="url(#lamp${id})" opacity=".55"/>
    <rect x="760" y="300" width="160" height="70" fill="#4A3A2E"/><circle cx="780" cy="378" r="10" fill="${P.ink}"/><circle cx="900" cy="378" r="10" fill="${P.ink}"/>
    <path d="M790 300 l40 -16 l40 16 z" fill="${P.paper}" opacity=".85"/>`
    + curio('stacks',880,290,`<rect x="-3" y="-14" width="7" height="24" fill="${P.brick}"/><path d="M-3 10 l3.5 -4 l3.5 4" fill="${P.brick}"/>`), {label:'Library shelves at night under a single hanging lamp, with an open book on a cart.'}); },

  turnpike(id){ return wrap(id, `<rect width="1200" height="400" fill="url(#sky${id})"/>${stars(id,30,13,120)}
    <path d="M0 400 L520 200 L680 200 L1200 400 Z" fill="#1A2329"/>
    ${[0,1,2,3].map(i=>`<path d="M${540+i*40} 200 L${180+i*280} 400" stroke="${P.paper}" stroke-dasharray="14 18" stroke-width="2" opacity=".35"/>`).join('')}
    <rect x="300" y="150" width="600" height="26" fill="${P.greyL}"/><rect x="300" y="176" width="600" height="6" fill="${P.sodium}" opacity=".7"/>
    ${[340,450,560,670,780,860].map(x=>`<rect x="${x}" y="182" width="16" height="60" fill="#3C474D"/><rect x="${x+20}" y="200" width="36" height="44" fill="${P.n3}"/><rect x="${x+24}" y="206" width="28" height="14" fill="${P.sodiumL}" opacity=".7"/>`).join('')}
    ${[360,470,580,690,800].map((x,i)=>`<circle cx="${x+50}" cy="165" r="5" fill="${i%2?'#7CE38B':'#FF6B5A'}"/>`).join('')}
    <path d="M0 330 C300 300 400 260 560 240" stroke="#FF4D3D" stroke-width="5" opacity=".55"/><path d="M1200 360 C900 320 760 270 660 240" stroke="${P.sodiumL}" stroke-width="6" opacity=".5"/>
    <path d="M40 370 C320 320 420 280 570 245" stroke="#FF4D3D" stroke-width="3" opacity=".35"/>
    <text x="600" y="140" font-family="Big Shoulders Display, sans-serif" font-size="22" fill="${P.paper}" text-anchor="middle" opacity=".8">TOLL PLAZA · E-ZPASS ONLY LANES 1–3</text>`
    + curio('turnpike',465,214,`<rect x="-8" y="-5" width="16" height="10" rx="2" fill="${P.paper}"/><circle cx="4" r="2" fill="${P.cedar}"/>`), {label:'A toll plaza at night with red tail lights and white headlights streaking past.'}); },

  field(id){ return wrap(id, `<rect width="1200" height="400" fill="url(#sky${id})"/>
    <path d="M0 260 L1200 260 L1200 400 L0 400 Z" fill="#2B6B4A"/><path d="M0 260 L1200 260 L1200 300 L0 300 Z" fill="#245C40"/>
    <path d="M600 260 L600 400" stroke="${P.paper}" stroke-width="3" opacity=".7"/><ellipse cx="600" cy="330" rx="60" ry="18" fill="none" stroke="${P.paper}" stroke-width="2" opacity=".6"/>
    <path d="M140 300 h70 v-52 h-70 z M140 248 l35 -18 l35 18" fill="none" stroke="#FF8A3D" stroke-width="4"/><path d="M990 300 h70 v-52 h-70 z M990 248 l35 -18 l35 18" fill="none" stroke="#FF8A3D" stroke-width="4"/>
    ${[100,1100].map(x=>`<rect x="${x-3}" y="40" width="6" height="220" fill="${P.ink}"/><rect x="${x-40}" y="30" width="80" height="26" fill="${P.ink}"/>${windows(x-36,34,6,2,10,8,3,2,1,1,'#FFF6DA')}<circle cx="${x}" cy="44" r="230" fill="url(#lamp${id})" opacity=".55"/>`).join('')}
    ${[280,320,360,800,850].map((x,i)=>`<path d="M${x} 300 l14 -26 l14 26 M${x+4} 284 h20" stroke="${P.ink}" stroke-width="3" fill="none"/><circle cx="${x+14}" cy="${262-(i%2)*6}" r="8" fill="${P.ink}"/><rect x="${x+6}" y="${268-(i%2)*6}" width="16" height="22" fill="${P.ink}"/>`).join('')}
    <rect x="420" y="296" width="260" height="10" fill="#3A2C22"/>`
    + curio('field',540,294,`<ellipse rx="9" ry="5" fill="none" stroke="#2EE07A" stroke-width="3.5"/>`), {label:'A floodlit lacrosse field at night with orange goals, folding chairs and a bench.'}); },

  board(id){ const cards=[[120,60,'#F2EFE4'],[300,90,'#F2EFE4'],[520,50,'#F6E7A8'],[760,80,'#F2EFE4'],[960,60,'#F6E7A8'],[200,230,'#F6E7A8'],[440,220,'#F2EFE4'],[680,240,'#F2EFE4'],[900,220,'#F6E7A8']];
    return wrap(id, `<rect width="1200" height="400" fill="#6E4F33"/><rect width="1200" height="400" fill="#4A341F" opacity=".35"/>
    ${cards.map(([x,y,c],i)=>`<rect x="${x}" y="${y}" width="140" height="${i%3?100:120}" fill="${c}" transform="rotate(${(i%4-1.5)*2} ${x} ${y})"/><path d="M${x+14} ${y+30} h100 M${x+14} ${y+48} h80 M${x+14} ${y+66} h90" stroke="${P.n3}" stroke-width="2" opacity=".5"/><circle cx="${x+70}" cy="${y+10}" r="6" fill="${P.red}"/>`).join('')}
    <path d="M190 70 L370 100 L590 60 L830 90 L1030 70 M370 100 L270 240 L510 230 L750 250 L970 230 M590 60 L510 230" stroke="${P.red}" stroke-width="2.5" fill="none"/>
    <circle cx="1080" cy="340" r="34" fill="none" stroke="#3A2414" stroke-width="5" opacity=".5"/>
    <rect x="300" y="250" width="70" height="90" fill="${P.n3}" transform="rotate(-6 300 250)"/><rect x="306" y="258" width="58" height="56" fill="${P.greyL}" transform="rotate(-6 300 250)"/>`
    + curio('board',860,262,`<rect x="-14" y="-2.5" width="26" height="5" fill="${P.sodium}" transform="rotate(-30)"/><path d="M12 -2.5 l6 2.5 l-6 2.5 z" fill="${P.paper}" transform="rotate(-30)"/>`), {label:'A corkboard covered with index cards, photographs and red string.'}); },

  diner(id){ return wrap(id, `<rect width="1200" height="400" fill="url(#sky${id})"/>${stars(id,40,17,140)}
    <rect x="0" y="330" width="1200" height="70" fill="#141B21"/>
    <rect x="230" y="170" width="740" height="160" rx="70" fill="#B8C3C6"/><rect x="230" y="250" width="740" height="10" fill="${P.red}"/><rect x="230" y="300" width="740" height="8" fill="${P.red}" opacity=".8"/>
    ${windows(290,190,10,1,52,50,14,0,1,2,P.sodiumL)}
    <rect x="770" y="190" width="52" height="50" fill="#FFB08A"/><rect x="780" y="196" width="32" height="40" rx="14" fill="${P.red}"/><rect x="786" y="204" width="20" height="12" fill="${P.sodiumL}"/>
    <text x="600" y="150" font-family="Big Shoulders Display, sans-serif" font-size="46" fill="#FF6B5A" text-anchor="middle">DINER</text><circle cx="600" cy="136" r="120" fill="url(#red${id})" opacity=".6"/>
    <text x="600" y="290" font-family="Newsreader, serif" font-size="16" fill="${P.ink}" text-anchor="middle">OPEN 24 HOURS</text>
    ${lamp(id,120,210,120,90)}${lamp(id,1080,210,120,90)}`
    + curio('diner',880,340,`<rect x="-9" y="-6" width="18" height="12" fill="${P.paper}"/><path d="M-6 -1 h12" stroke="${P.red}" stroke-width="2"/>`), {label:'A chrome all-night diner with red neon and a glowing jukebox in the window.'}); },

  kitchen(id){ return wrap(id, `<rect width="1200" height="400" fill="#2A2420"/><rect x="0" y="0" width="1200" height="250" fill="#3A322B"/>
    <rect x="80" y="40" width="300" height="170" fill="${P.n1}"/>${stars(id,18,23,160).replace(/cy="(\d+)"/g,(m,a)=>`cy="${50+(+a%150)}"`).replace(/cx="(\d+)"/g,(m,a)=>`cx="${90+(+a%280)}"`)}
    <rect x="80" y="40" width="300" height="170" fill="none" stroke="#C9BFA9" stroke-width="8"/><path d="M230 40 v170 M80 125 h300" stroke="#C9BFA9" stroke-width="5"/>
    ${[560,720,880].map(x=>`<path d="M${x} 0 v90" stroke="${P.ink}" stroke-width="2"/><path d="M${x-24} 90 h48 l-10 22 h-28 z" fill="${P.ink}"/><circle cx="${x}" cy="118" r="160" fill="url(#lamp${id})" opacity=".55"/>`).join('')}
    <rect x="460" y="230" width="560" height="40" fill="#4B3A2A"/><rect x="460" y="270" width="560" height="130" fill="#3A2C22"/>
    <rect x="520" y="214" width="120" height="16" fill="${P.paper}" transform="rotate(-4 520 214)"/><rect x="660" y="210" width="90" height="20" fill="${P.paper}" opacity=".9"/>
    <path d="M700 218 h30 M700 224 h24" stroke="${P.glow}" stroke-width="1"/>
    <rect x="1060" y="60" width="110" height="260" fill="#C7CCCB"/><path d="M1068 180 h94" stroke="${P.grey}" stroke-width="3"/><rect x="1150" y="100" width="6" height="50" fill="${P.grey}"/><rect x="1150" y="200" width="6" height="60" fill="${P.grey}"/>`
    + curio('kitchen',930,222,`<path d="M-11 -5 l22 2 l-2 8 l-20 -2 z" fill="${P.paper}"/><path d="M-6 -2 l12 1" stroke="${P.brick}" stroke-width="2"/>`), {label:'A suburban kitchen at night: pendant lamps over a dark granite island, papers spread out, a window onto the dark.'}); },

  driveway(id){ return wrap(id, `<rect width="1200" height="400" fill="url(#sky${id})"/>${stars(id,70,29,170)}
    <rect x="0" y="300" width="1200" height="100" fill="#13201A"/>
    <path d="M330 300 L230 400 L560 400 L520 300 Z" fill="#2A2F33"/>
    <rect x="400" y="140" width="420" height="160" fill="#3D4A52"/><path d="M380 142 L610 60 L840 142 Z" fill="#2B353B"/>
    ${windows(430,170,6,2,44,40,22,26,1,5)}
    <rect x="590" y="236" width="40" height="64" fill="${P.n1}"/><rect x="594" y="240" width="32" height="20" fill="${P.sodiumL}" opacity=".7"/>
    <rect x="840" y="200" width="200" height="100" fill="#323D44"/><path d="M856 220 h168 M856 240 h168 M856 260 h168 M856 280 h168" stroke="#283138" stroke-width="3"/>
    <g><rect x="300" y="318" width="170" height="44" rx="12" fill="${P.grey}"/><rect x="330" y="296" width="100" height="30" rx="10" fill="${P.grey}"/><rect x="340" y="302" width="80" height="18" fill="${P.n1}"/><circle cx="330" cy="362" r="13" fill="${P.ink}"/><circle cx="440" cy="362" r="13" fill="${P.ink}"/></g>
    <circle cx="200" cy="230" r="70" fill="${P.cedarD}"/><circle cx="160" cy="260" r="50" fill="${P.cedar}"/><rect x="190" y="270" width="12" height="40" fill="${P.ink}"/>
    ${lamp(id,1100,180,120,100)}`
    + curio('driveway',650,302,`<path d="M-12 0 q6 -10 12 0 q6 10 12 0" fill="none" stroke="${P.red}" stroke-width="3"/><circle cx="13" r="3" fill="${P.greyL}"/>`), {label:'A suburban house with every window lit; a car sits in the dark driveway.'}); },

  /* Secret rooms */
  burner(id){ return wrap(id, `<rect width="1200" height="400" fill="#121619"/><rect x="0" y="260" width="1200" height="140" fill="#2A2018"/>
    <rect x="520" y="200" width="160" height="80" rx="10" fill="#1B1F22" transform="rotate(-8 600 240)"/><rect x="535" y="210" width="130" height="58" rx="4" fill="${P.glow}" opacity=".85" transform="rotate(-8 600 240)"/><circle cx="600" cy="240" r="200" fill="url(#blue${id})" opacity=".6"/>
    <text x="600" y="246" font-family="Newsreader, serif" font-size="14" fill="${P.ink}" text-anchor="middle" transform="rotate(-8 600 240)">1 new message</text>`, {label:'A cheap phone glowing blue on a dark table.'}); },
  darkroom(id){ return wrap(id, `<rect width="1200" height="400" fill="#1A0B0A"/><circle cx="600" cy="40" r="380" fill="url(#red${id})" opacity=".8"/>
    <path d="M0 120 C400 140 800 140 1200 120" stroke="${P.ink}" stroke-width="2" fill="none"/>
    ${[120,300,480,660,840,1020].map((x,i)=>`<rect x="${x}" y="${130+i%2*6}" width="110" height="140" fill="#E8C9C0" opacity=".85"/><rect x="${x+8}" y="${138+i%2*6}" width="94" height="96" fill="#5E2A24"/>${[0,1,2,3,4].map(k=>`<circle cx="${x+20+k*18}" cy="${200+i%2*6}" r="6" fill="#2A1210"/>`).join('')}<rect x="${x+48}" y="${122+i%2*6}" width="14" height="14" fill="${P.ink}"/>`).join('')}`, {label:'A darkroom under red safelight with prints of a group photo hanging to dry.'}); },
  server(id){ return wrap(id, `<rect width="1200" height="400" fill="#0B1014"/>
    ${[260,480,700,920].map((x,k)=>`<rect x="${x}" y="40" width="180" height="340" fill="#1B242B"/>${Array.from({length:14},(_,j)=>`<rect x="${x+10}" y="${50+j*23}" width="160" height="16" fill="#111820"/>${[0,1,2,3,4,5].map(i=>`<circle cx="${x+22+i*10}" cy="${58+j*23}" r="2.4" fill="${(i+j+k)%5===0?'#FF6B5A':(i+j)%3?'#7CE38B':P.glow}"/>`).join('')}`).join('')}`).join('')}
    <circle cx="600" cy="200" r="300" fill="url(#blue${id})" opacity=".25"/>`, {label:'Server racks in a dark closet, blinking green, blue and red.'}); },
  lockbox(id){ return wrap(id, `<rect width="1200" height="400" fill="#1A1E20"/><rect x="0" y="280" width="1200" height="120" fill="#3A2C22"/>
    <rect x="420" y="170" width="360" height="150" fill="#59656B"/><rect x="420" y="150" width="360" height="30" fill="#6F7B80"/><rect x="580" y="210" width="40" height="40" fill="${P.ink}"/><circle cx="600" cy="230" r="8" fill="${P.sodium}"/>
    <rect x="180" y="250" width="200" height="40" fill="${P.paper}" transform="rotate(-4 180 250)"/>${[0,1,2,3,4,5,6,7].map(i=>`<path d="M${200+i*22} 254 v32" stroke="${P.cedar}" stroke-width="1" transform="rotate(-4 180 250)"/>`).join('')}
    <circle cx="600" cy="120" r="260" fill="url(#lamp${id})" opacity=".5"/>`, {label:'A steel cash box on a table beside a green-ruled ledger.'}); },
  storage(id){ return wrap(id, `<rect width="1200" height="400" fill="#1E2224"/><rect x="0" y="330" width="1200" height="70" fill="#2C3134"/>
    ${[[100,210],[230,240],[360,180],[760,220],[900,190],[1030,250]].map(([x,y])=>`<rect x="${x}" y="${y}" width="120" height="${330-y}" fill="#8A6E4E"/><path d="M${x} ${y+20} h120" stroke="#6B5338" stroke-width="3"/>`).join('')}
    <path d="M520 330 L560 120 M545 128 l30 -24 l10 14 l-30 20 z" stroke="${P.paper}" stroke-width="5" fill="none"/>
    <circle cx="650" cy="290" r="40" fill="none" stroke="${P.greyL}" stroke-width="5"/><circle cx="740" cy="290" r="40" fill="none" stroke="${P.greyL}" stroke-width="5"/><path d="M650 290 l45 -40 l45 40" stroke="${P.greyL}" stroke-width="5" fill="none"/>
    <circle cx="600" cy="30" r="260" fill="url(#lamp${id})" opacity=".45"/>`, {label:'A crowded garage full of boxes, a lacrosse stick and a bicycle: no room for a car.'}); },
  motel(id){ return wrap(id, `<rect width="1200" height="400" fill="url(#sky${id})"/>${stars(id,60,37,150)}
    <rect x="0" y="320" width="1200" height="80" fill="#151C20"/>
    <rect x="200" y="200" width="800" height="120" fill="#5B5045"/>${[0,1,2,3,4,5,6].map(i=>`<rect x="${230+i*110}" y="230" width="40" height="90" fill="${P.n1}"/><rect x="${276+i*110}" y="240" width="40" height="30" fill="${i===4?P.sodiumL:P.n2}"/><text x="${250+i*110}" y="226" font-size="12" fill="${P.paper}" font-family="Newsreader, serif" text-anchor="middle">${i+1}</text>`).join('')}
    <rect x="1040" y="90" width="12" height="230" fill="${P.ink}"/><rect x="990" y="80" width="110" height="60" fill="${P.ink}"/><text x="1045" y="120" font-size="28" fill="#FF6B5A" font-family="Big Shoulders Display, sans-serif" text-anchor="middle">MOTEL</text><circle cx="1045" cy="110" r="90" fill="url(#red${id})" opacity=".6"/>
    <text x="1045" y="160" font-size="16" fill="#7CE38B" font-family="Big Shoulders Display, sans-serif" text-anchor="middle">VACANCY</text>`, {label:'A roadside motel at night with a red neon sign and one lit room.'}); },
  woods(id){ const r=rnd(41); let trees=''; for(let i=0;i<34;i++){ const x=r()*1200, h=200+r()*200, w=10+r()*16; trees+=`<rect x="${x.toFixed(0)}" y="${(400-h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${['#141D17','#1C2A20','#24352A'][i%3]}"/>`; }
    return wrap(id, `<rect width="1200" height="400" fill="#2B3A44"/><rect y="200" width="1200" height="200" fill="#3B3A2E"/><circle cx="900" cy="120" r="300" fill="url(#lamp${id})" opacity=".35"/>${trees}
    <path d="M520 400 C560 330 640 300 700 260" stroke="#6E604A" stroke-width="30" fill="none" opacity=".6"/>`, {label:'Dusk in dense woods, a faint path leading into the trees.'}); },
  dossier(id){ return wrap(id, `<rect width="1200" height="400" fill="#1C1A17"/><rect y="250" width="1200" height="150" fill="#3A2C22"/>
    <rect x="420" y="150" width="380" height="200" fill="#C9A96E" transform="rotate(-3 600 250)"/><rect x="430" y="140" width="140" height="24" fill="#C9A96E" transform="rotate(-3 600 250)"/>
    <rect x="460" y="190" width="300" height="140" fill="${P.paper}" transform="rotate(2 600 250)"/>${[0,1,2,3,4,5].map(i=>`<path d="M480 ${214+i*18} h${200+i%3*30}" stroke="${P.n3}" stroke-width="2" opacity=".5" transform="rotate(2 600 250)"/>`).join('')}
    <circle cx="600" cy="60" r="300" fill="url(#lamp${id})" opacity=".6"/>`, {label:'A manila dossier open under a desk lamp.'}); }
};

CF.art = {
  scene(name){ uid++; return (SCENES[name] || SCENES.hall)(uid); },
  /* The illustrated town map: places linked as a graph. */
  map(state){
    const id = ++uid, R = CF.ROOMS, L = CF.LINKS;
    const W = 1000, H = 640, px = r => [R[r].x*W/100, R[r].y*H/100];
    let roads = '', seen = {};
    Object.keys(L).forEach(a => L[a].forEach(b => { const k=[a,b].sort().join(); if(seen[k]) return; seen[k]=1; const [x1,y1]=px(a),[x2,y2]=px(b); const mx=(x1+x2)/2+(y2-y1)*.12, my=(y1+y2)/2-(x2-x1)*.12;
      roads += `<path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" stroke="#2F3B43" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" stroke="${P.sodium}" stroke-opacity=".35" stroke-width="2" stroke-dasharray="8 10" fill="none"/>`; }));
    const r = rnd(77); let houses = '';
    for(let i=0;i<90;i++){ const x=r()*W, y=r()*H; const near = CF.ROOM_ORDER.some(k => { const [a,b]=px(k); return Math.hypot(a-x,b-y)<70; }); if(near) continue;
      houses += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><rect x="-9" y="-6" width="18" height="12" fill="#2A353C"/><path d="M-11 -6 L0 -14 L11 -6 Z" fill="#222C32"/>${r()<.55?`<rect x="-5" y="-3" width="4" height="4" fill="${P.sodiumL}" opacity=".8"/>`:''}</g>`; }
    for(let i=0;i<40;i++){ const x=r()*W, y=r()*H; houses += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(8+r()*10).toFixed(0)}" fill="${P.cedarD}" opacity=".8"/>`; }
    const icons = CF.ROOM_ORDER.map(k => { const [x,y]=px(k); const done = state && state.roomPct ? state.roomPct(k) : 0; const main = k==='hall';
      return `<a href="#/room/${k}" class="mapnode" aria-label="${R[k].name}: ${R[k].subject}"><g transform="translate(${x} ${y})">
        <circle r="${main?60:44}" fill="url(#lamp${id})" opacity="${.35+done*.65}"/>
        <rect x="${main?-30:-22}" y="${main?-20:-16}" width="${main?60:44}" height="${main?36:30}" fill="${main?P.brick:'#3D4A52'}"/><path d="M${main?-34:-26} ${main?-20:-16} L0 ${main?-40:-32} L${main?34:26} ${main?-20:-16} Z" fill="${main?P.brickD:'#2B353B'}"/>
        <rect x="-6" y="${main?-6:-6}" width="12" height="12" fill="${P.sodiumL}"/>
        <text y="${main?40:34}" text-anchor="middle" class="maplabel">${R[k].short}</text></g></a>`; }).join('');
    const secretMarks = Object.keys(CF.SECRETS).filter(k => state && state.has && state.has('open_'+k)).map((k,i) => { const [x,y]=px(CF.SECRETS[k].where); return `<a href="#/secret/${k}" aria-label="${CF.SECRETS[k].name}"><g transform="translate(${x+46} ${y-30})"><circle r="9" fill="${P.red}"/><path d="M-3 0 h6 M0 -3 v6" stroke="${P.paper}" stroke-width="2"/></g></a>`; }).join('');
    return `<svg viewBox="0 0 ${W} ${H}" class="townmap" role="group" aria-label="Map of Cedarfield. Each lit building is a room.">${defs(id)}
      <rect width="${W}" height="${H}" fill="#101A21"/><g filter="url(#paint${id})">${houses}${roads}</g>${icons}${secretMarks}
      <rect width="${W}" height="${H}" filter="url(#grain${id})" pointer-events="none"/>
      <text x="20" y="${H-18}" class="mapnote">Cedarfield, New Jersey · a fictional town · not to scale</text></svg>`;
  },
  /* Cover art for print. */
  cover(){ return SCENES.driveway(++uid).replace(/<g class="curio"[\s\S]*?<\/g><\/g>/,'</g>'); }
};
})();
