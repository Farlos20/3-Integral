// ==========================================
// SPARKLES GENERATOR
// ==========================================
(function() {
  const container = document.getElementById('sparkleContainer');
  if (!container) return;
  container.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:5;';
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    const colors = ['#C9953A', '#E8B85A', '#D4849A', '#F5B8CC', 'rgba(255,255,255,0.6)'];
    s.style.cssText = `
      left:${Math.random()*100}%; top:${Math.random()*100}%;
      width:${Math.random()*4+2}px; height:${Math.random()*4+2}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${Math.random()*4+3}s;
      animation-delay:${Math.random()*5}s;`;
    container.appendChild(s);
  }
})();

// ==========================================
// SCROLL REVEAL OBSERVER
// ==========================================
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal, .tl-item').forEach(el => observer.observe(el));

// ==========================================
// NAVBAR SCROLL SHADOW
// ==========================================
window.addEventListener('scroll', () => {
  const nb = document.getElementById('navbar');
  if (nb) nb.style.boxShadow = window.scrollY > 60 ? '0 4px 28px rgba(46,7,16,0.15)' : 'none';
}, { passive: true });

// ==========================================
// HAMBURGER MENU
// ==========================================
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'))
);

// ==========================================
// GALLERY TAB FILTER
// ==========================================
function filterTab(event) {
  document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.photo-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.9)';
    setTimeout(() => {
      card.style.transition = 'all 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    }, i * 45);
  });
}

// ==========================================
// VIDEO CATEGORY TABS
// ==========================================
document.querySelectorAll('.video-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.video-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.vcat;
    document.querySelectorAll('#videoGrid .video-card').forEach(card => {
      const show = cat === 'todos' || card.dataset.vcat === cat;
      card.dataset.vhidden = show ? 'false' : 'true';
      card.style.display = show ? '' : 'none';
    });
  });
});

// Pause other videos when one plays
document.addEventListener('play', e => {
  if (e.target.tagName === 'VIDEO') {
    document.querySelectorAll('video').forEach(v => { if (v !== e.target) v.pause(); });
  }
}, true);

// ==========================================
// LIGHTBOX — STORY VIEWER
// ==========================================
let lbPhotos    = [];   // [{src, caption}]
let lbCurrent   = 0;
let lbTouchX    = null;
let lbTouchY    = null;

function buildLightboxData() {
  lbPhotos = [];
  document.querySelectorAll('#galleryGrid .photo-card').forEach(card => {
    const img = card.querySelector('img');
    const lbl = card.querySelector('.photo-label');
    if (img) lbPhotos.push({
      src:     img.src,
      caption: lbl ? lbl.textContent.trim() : ''
    });
  });
}

function openLightbox(index) {
  buildLightboxData();
  lbCurrent = index;

  // Build progress segments
  const bar = document.getElementById('lbProgressBar');
  bar.innerHTML = '';
  lbPhotos.forEach((_, i) => {
    const seg = document.createElement('div');
    seg.className = 'lb-progress-seg';
    seg.dataset.idx = i;
    seg.onclick = (e) => { e.stopPropagation(); lbGoto(i); };
    const fill = document.createElement('div');
    fill.className = 'lb-progress-seg-fill';
    seg.appendChild(fill);
    bar.appendChild(seg);
  });

  lbRender(lbCurrent);

  document.getElementById('lbOverlay').classList.add('active');
  document.getElementById('lightbox').classList.add('active');
  document.body.classList.add('lb-open');

  // Keyboard
  document.addEventListener('keydown', lbKeydown);
}

function closeLightbox() {
  document.getElementById('lbOverlay').classList.remove('active');
  document.getElementById('lightbox').classList.remove('active');
  document.body.classList.remove('lb-open');
  document.removeEventListener('keydown', lbKeydown);
}

function lbRender(index, direction) {
  const photo = lbPhotos[index];
  if (!photo) return;

  const img  = document.getElementById('lbImg');
  const cap  = document.getElementById('lbCaption');
  const ts   = document.getElementById('lbTimestamp');

  // Transition out
  img.classList.add('transitioning');

  setTimeout(() => {
    img.src = photo.src;
    cap.textContent = photo.caption;
    ts.textContent  = `Foto ${index+1} de ${lbPhotos.length}`;

    // Update progress segments
    document.querySelectorAll('.lb-progress-seg').forEach((seg, i) => {
      seg.classList.remove('done','active');
      if (i < index) seg.classList.add('done');
      else if (i === index) seg.classList.add('active');
    });

    img.onload = () => img.classList.remove('transitioning');
    if (img.complete) img.classList.remove('transitioning');
  }, 180);
}

function lbNext() {
  if (lbCurrent < lbPhotos.length - 1) {
    lbCurrent++;
    lbRender(lbCurrent, 'next');
  } else {
    // Last photo — pulse the close button
    document.querySelector('.lb-close').style.background = 'rgba(107,26,43,0.6)';
    setTimeout(() => document.querySelector('.lb-close').style.background = '', 400);
  }
}

function lbPrev() {
  if (lbCurrent > 0) {
    lbCurrent--;
    lbRender(lbCurrent, 'prev');
  }
}

function lbGoto(index) {
  lbCurrent = index;
  lbRender(index);
}

function lbKeydown(e) {
  if (e.key === 'ArrowRight' || e.key === ' ')  { e.preventDefault(); lbNext(); }
  if (e.key === 'ArrowLeft')                     { e.preventDefault(); lbPrev(); }
  if (e.key === 'Escape')                         closeLightbox();
}

// Touch / Swipe support
const lbEl = document.getElementById('lightbox');
if (lbEl) {
  lbEl.addEventListener('touchstart', e => {
    lbTouchX = e.changedTouches[0].clientX;
    lbTouchY = e.changedTouches[0].clientY;
  }, { passive: true });

  lbEl.addEventListener('touchend', e => {
    if (lbTouchX === null) return;
    const dx = e.changedTouches[0].clientX - lbTouchX;
    const dy = e.changedTouches[0].clientY - lbTouchY;
    // Only treat as horizontal swipe if dx > dy (avoid vertical scroll)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) lbNext();
      else         lbPrev();
    }
    // Swipe down to close
    if (dy > 90 && Math.abs(dx) < 60) closeLightbox();
    lbTouchX = null; lbTouchY = null;
  }, { passive: true });
}

// ==========================================
// COUNTDOWN
// ==========================================
function updateCountdown() {
  const target = new Date('2026-12-12T19:00:00');
  const diff = target - new Date();
  if (diff <= 0) {
    ['days','hours','minutes','seconds'].forEach((id,i) => {
      const el = document.getElementById(id);
      if (el) el.textContent = i === 0 ? '🎓' : '00';
    });
    return;
  }
  const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = String(val).padStart(2,'0'); };
  set('days',    Math.floor(diff/86400000));
  set('hours',   Math.floor((diff%86400000)/3600000));
  set('minutes', Math.floor((diff%3600000)/60000));
  set('seconds', Math.floor((diff%60000)/1000));
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ==========================================
// MODAL MANAGEMENT
// ==========================================
function openModal(id)  { document.getElementById(id).classList.add('active');    document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('active'); document.body.style.overflow = ''; }
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', function(e) { if (e.target === this) closeModal(this.id); });
});

// ==========================================
// ADDERS (Testimonial, Mural, Dream)
// ==========================================
const avatarColors = [
  'linear-gradient(135deg,#6B1A2B,#A83A50)',
  'linear-gradient(135deg,#4A0E1B,#8B2539)',
  'linear-gradient(135deg,#A83A50,#C4607A)',
  'linear-gradient(135deg,#2E0710,#6B1A2B)',
];
let testimonialCount = 3;

function addTestimonial() {
  const name = document.getElementById('t-name').value.trim();
  const role = document.getElementById('t-role').value;
  const text = document.getElementById('t-text').value.trim();
  if (!name || !text) { alert('Por favor, preencha seu nome e depoimento.'); return; }
  const card = document.createElement('div');
  card.className = 'testimonial-card';
  card.innerHTML = `
    <p class="t-text">${text}</p>
    <div class="t-author">
      <div class="t-avatar" style="background:${avatarColors[testimonialCount%avatarColors.length]};">${name[0].toUpperCase()}</div>
      <div><div class="t-name">${name}</div><div class="t-role">${role||'Membro da Turma Vinho'}</div></div>
    </div>`;
  document.getElementById('testimonialsContainer').appendChild(card);
  testimonialCount++;
  ['t-name','t-text'].forEach(id => document.getElementById(id).value='');
  document.getElementById('t-role').value='';
  closeModal('testimonialModal');
  card.scrollIntoView({behavior:'smooth',block:'center'});
}

function addMural() {
  const name = document.getElementById('m-name').value.trim();
  const text = document.getElementById('m-text').value.trim();
  if (!name || !text) { alert('Preencha seu nome e sua mensagem.'); return; }
  const note = document.createElement('div');
  note.className = 'mural-note';
  note.innerHTML = `<p class="mural-text">"${text}"</p><span class="mural-from">— ${name}</span>`;
  document.getElementById('muralContainer').appendChild(note);
  ['m-name','m-text'].forEach(id => document.getElementById(id).value='');
  closeModal('muralModal');
  note.scrollIntoView({behavior:'smooth',block:'center'});
}

const defaultEmojis = ['🌟','🚀','💡','🌎','🎯','✨','🎓','💻','🏥','🎨','📚','🌱','🏆','🎵','✈️'];
let dreamCount = 4;

function addDream() {
  const name  = document.getElementById('f-name').value.trim();
  const emoji = document.getElementById('f-emoji').value.trim() || defaultEmojis[dreamCount%defaultEmojis.length];
  const text  = document.getElementById('f-text').value.trim();
  const year  = document.getElementById('f-year').value.trim() || '2030';
  if (!name || !text) { alert('Preencha seu nome e seu sonho.'); return; }
  const card = document.createElement('div');
  card.className = 'futuro-card reveal reveal-delay-1';
  card.innerHTML = `<span class="f-emoji">${emoji}</span><div class="f-name">${name}</div><div class="f-dream">"${text}"</div><div class="f-year">📆 Revisitar em ${year}</div>`;
  document.getElementById('futuroContainer').appendChild(card);
  observer.observe(card);
  dreamCount++;
  ['f-name','f-emoji','f-text','f-year'].forEach(id => document.getElementById(id).value='');
  closeModal('futuroModal');
  setTimeout(() => card.scrollIntoView({behavior:'smooth',block:'center'}), 100);
}
