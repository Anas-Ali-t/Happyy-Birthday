(() => {
const C = window.CONTENT, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
const wait = (f, ms) => setTimeout(f, rm ? 0 : ms);
const get = (o, p) => p.split('.').reduce((a, k) => a && a[k], o);
$$('[data-c]').forEach(e => e.textContent = get(C, e.dataset.c) || '');
document.title = 'For ' + C.name + ' ♡';

/* drifting petals / dust */
function drift(el, n, glyphs) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'pt'; s.textContent = glyphs[i % glyphs.length];
    s.style.cssText = `left:${Math.random() * 100}%;--d:${10 + Math.random() * 8}s;--l:${-Math.random() * 14}s;font-size:${11 + Math.random() * 8}px`;
    el.append(s);
  }
}
const dust = document.createElement('div'); dust.className = 'petals'; dust.setAttribute('aria-hidden', 'true');
$('#intro').prepend(dust); drift(dust, 9, ['·', '♡', '✿', '·']);
drift($('#petals'), 9, ['✿', '❀', '♡']);

/* envelopes */
function openEnv(env, btn, done) {
  if (env.classList.contains('open')) return;
  env.classList.add('open'); btn.disabled = true; env.disabled = true;
  wait(done, 1700);
}
const intro = $('#intro');
function openIntro() {
  openEnv($('#env1'), $('#open1'), () => {
    intro.classList.add('gone'); document.body.classList.remove('locked'); scrollTo(0, 0);
    wait(() => intro.hidden = true, 850);
  });
}
$('#env1').onclick = $('#open1').onclick = openIntro;

/* cake */
function confetti(p) {
  if (rm) return;
  const cols = ['#F9DFE8', '#F2B9CA', '#D98CA7', '#98566E'];
  for (let i = 0; i < 32; i++) {
    const s = document.createElement('i'), a = Math.random() * 6.28, r = 70 + Math.random() * 120;
    s.className = 'cf';
    s.style.cssText = `--x:${Math.cos(a) * r}px;--y:${Math.sin(a) * r - 60}px;--r:${Math.random() * 540}deg;background:${cols[i % 4]}`;
    p.append(s); setTimeout(() => s.remove(), 1100);
  }
}
const candles = $$('.candle'); let out = 0;
candles.forEach(c => c.onclick = () => {
  if (c.classList.contains('out')) return;
  c.classList.add('out'); c.setAttribute('aria-label', 'Candle blown out');
  if (++out === candles.length) {
    $('#hint').hidden = true; confetti($('.cake'));
    const w = $('#wish'); w.hidden = false; w.classList.add('in');
  }
});

/* gallery + lightbox */
const P = C.photos, lb = $('#lb'), li = $('#lbimg'); let cur = 0;
$('#gallery').innerHTML = P.map((p, i) => `<figure class="pol rv" style="--r:${[-3, 2.5, -1.5, 3, -2.5, 1.5][i % 6]}deg"><button class="ph" data-i="${i}" aria-label="Open photo ${i + 1} full screen"><img src="${p.src}" alt="${p.alt}" width="720" height="960" loading="lazy" decoding="async"></button>${p.caption ? `<figcaption class="hand">${p.caption}</figcaption>` : ''}<svg class="stk" aria-hidden="true"><use href="#fl"/></svg></figure>`).join('');
function show(i) {
  cur = (i + P.length) % P.length; li.src = P[cur].src; li.alt = P[cur].alt;
  $('#lbcap').textContent = P[cur].caption || ''; lb.hidden = false;
  document.body.classList.add('locked'); $('#lbx').focus();
}
function hide() { lb.hidden = true; document.body.classList.remove('locked'); }
$('#gallery').onclick = e => { const b = e.target.closest('.ph'); if (b) show(+b.dataset.i); };
$('#lbx').onclick = hide; $('#lbp').onclick = () => show(cur - 1); $('#lbn').onclick = () => show(cur + 1);
lb.onclick = e => { if (e.target === lb) hide(); };
addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') hide(); else if (e.key === 'ArrowLeft') show(cur - 1); else if (e.key === 'ArrowRight') show(cur + 1);
});
let sx = 0;
lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); });

/* folded notes */
$('#notes').innerHTML = C.notes.map((t, i) => `<details class="note rv" style="--r:${i % 2 ? 1.5 : -1.5}deg"><summary class="hand">${C.noteLabel}</summary><p>${t}</p></details>`).join('');

/* scratch cards */
$('#scratch').innerHTML = C.scratch.cards.map((s, i) => `<div class="sc paper rv" style="--r:${[-1.5, 1, -1][i % 3]}deg"><svg class="stk" aria-hidden="true"><use href="#fl"/></svg><h3>${s.title}</h3><div class="sbox"><p>${s.text}</p><canvas aria-hidden="true"></canvas></div><button class="sm">${C.scratch.reveal}</button></div>`).join('');
$$('.sc').forEach(card => {
  const cv = $('canvas', card), box = cv.parentNode, btn = $('.sm', card), x = cv.getContext('2d', { willReadFrequently: true });
  let done = false, down = false, n = 0, last, w = 0;
  const fit = () => {
    if (done) return;
    cv.width = box.clientWidth; cv.height = box.clientHeight;
    const g = x.createLinearGradient(0, 0, cv.width, cv.height);
    g.addColorStop(0, '#F2B9CA'); g.addColorStop(.5, '#F9DFE8'); g.addColorStop(1, '#D98CA7');
    x.fillStyle = g; x.fillRect(0, 0, cv.width, cv.height);
    x.fillStyle = '#98566E'; x.font = '28px Caveat,cursive'; x.textAlign = 'center'; x.fillText('✿ scratch here ✿', cv.width / 2, cv.height / 2 + 8);
  };
  const reveal = () => { if (done) return; done = true; cv.classList.add('off'); btn.hidden = true; };
  const check = () => {
    const d = x.getImageData(0, 0, cv.width, cv.height).data; let c = 0, t = 0;
    for (let i = 3; i < d.length; i += 64) { t++; if (!d[i]) c++; }
    if (c / t > .5) reveal();
  };
  const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const stroke = e => {
    const p = pos(e);
    x.globalCompositeOperation = 'destination-out'; x.lineWidth = 36; x.lineCap = 'round';
    x.beginPath(); x.moveTo(last[0], last[1]); x.lineTo(p[0], p[1]); x.stroke(); last = p;
    if (++n % 6 === 0) check();
  };
  cv.onpointerdown = e => { down = true; cv.setPointerCapture(e.pointerId); last = pos(e); stroke(e); };
  cv.onpointermove = e => { if (down) stroke(e); };
  cv.onpointerup = cv.onpointercancel = () => { if (down) { down = false; check(); } };
  btn.onclick = reveal;
  new ResizeObserver(() => { if (box.clientWidth !== w) { w = box.clientWidth; fit(); } }).observe(box);
  if (document.fonts) document.fonts.ready.then(() => { if (!done && !n) fit(); });
});

/* audio players (independent, never autoplay) */
function player(root, src) {
  const a = new Audio(), b = $('.pp', root), bar = $('.bar', root), t = $('.time', root);
  const f = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00';
  const fail = () => { b.disabled = bar.disabled = true; $('.msg', root).hidden = false; };
  a.preload = 'metadata'; a.src = src; a.onerror = fail;
  b.onclick = () => a.paused ? a.play().catch(fail) : a.pause();
  a.onplay = a.onpause = () => {
    const p = !a.paused; root.classList.toggle('playing', p);
    b.textContent = p ? '❚❚' : '▶'; b.setAttribute('aria-label', p ? 'Pause' : 'Play');
  };
  a.onloadedmetadata = () => t.textContent = '0:00 / ' + f(a.duration);
  a.ontimeupdate = () => { bar.value = a.duration ? a.currentTime / a.duration * 100 : 0; t.textContent = f(a.currentTime) + ' / ' + f(a.duration); };
  a.onended = () => { a.currentTime = 0; };
  bar.oninput = () => { if (a.duration) a.currentTime = bar.value / 100 * a.duration; };
}
player($('#music'), C.music.src);

/* final letter */
$('#letterBody').innerHTML = C.final.letter.map((p, i) => `<p style="--i:${i}">${p}</p>`).join('');
function openFinal() {
  openEnv($('#env2'), $('#open2'), () => {
    const wrap = $('#envwrap'), l = $('#letter');
    wrap.classList.add('away');
    wait(() => {
      wrap.hidden = true; l.hidden = false; void l.offsetWidth; l.classList.add('on');
      $('#final').scrollIntoView({ block: 'start' });
    }, 600);
  });
}
$('#env2').onclick = $('#open2').onclick = openFinal;

/* gentle reveal on scroll */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
$$('.rv').forEach(e => io.observe(e));
})();
