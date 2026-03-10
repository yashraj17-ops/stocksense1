// ── Custom cursor ───────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
if (cursor) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animCursor() {
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  })();
}

// ── Scroll effects ──────────────────────────────────────────────────────
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── Fade-up on scroll ───────────────────────────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

// ── Counter animation ───────────────────────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const isDecimal = String(target).includes('.');
  let start = null;
  const duration = 1500;
  function step(ts) {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    const val = target * ease;
    el.textContent = prefix + (isDecimal ? val.toFixed(2) : Math.round(val)) + suffix;
    if (prog < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = '1';
      animateCounter(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

// ── Mini chart ──────────────────────────────────────────────────────────
const chartWrap = document.getElementById('chartBars');
if (chartWrap) {
  const days   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const actual = [22, 18, 25, null, null, null, null];
  const fcst   = [null, null, null, 28, 35, 61, 82];
  const maxV   = 82;
  days.forEach((d, i) => {
    const g = document.createElement('div'); g.className = 'bar-group';
    if (actual[i] !== null) {
      const b = document.createElement('div'); b.className = 'bar bar-actual';
      b.style.height = (actual[i] / maxV * 100) + 'px'; g.appendChild(b);
    } else if (fcst[i] !== null) {
      const b = document.createElement('div'); b.className = 'bar bar-forecast';
      b.style.height = '0px'; g.appendChild(b);
      setTimeout(() => { b.style.height = (fcst[i] / maxV * 100) + 'px'; }, 300 + i * 80);
    }
    const lbl = document.createElement('div'); lbl.className = 'bar-label';
    lbl.textContent = d; g.appendChild(lbl);
    chartWrap.appendChild(g);
  });
}

// ── FAQ accordion ───────────────────────────────────────────────────────
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ── Billing toggle ──────────────────────────────────────────────────────
let billingMode = 'monthly';
function setBilling(mode) {
  billingMode = mode;
  const thumb = document.getElementById('toggleThumb');
  const track = document.querySelector('.toggle-track');
  const mOpt  = document.getElementById('toggleMonthly');
  const aOpt  = document.getElementById('toggleAnnual');
  if (mode === 'annual') {
    thumb && thumb.classList.add('annual');
    track && track.classList.add('annual');
    mOpt && mOpt.classList.remove('active');
    aOpt && aOpt.classList.add('active');
  } else {
    thumb && thumb.classList.remove('annual');
    track && track.classList.remove('annual');
    aOpt && aOpt.classList.remove('active');
    mOpt && mOpt.classList.add('active');
  }
  document.querySelectorAll('.price-val').forEach(el => {
    el.textContent = mode === 'annual' ? el.dataset.annual : el.dataset.monthly;
  });
}
function toggleBilling() {
  setBilling(billingMode === 'monthly' ? 'annual' : 'monthly');
}

// ── Modals ──────────────────────────────────────────────────────────────
function openModal(id, plan) {
  const el = document.getElementById(id);
  if (!el) return;
  if (id === 'trialModal' && plan) {
    const note = document.getElementById('trialPlanNote');
    if (note) note.textContent = `Starting with the ${plan} plan. No credit card needed.`;
  }
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
  document.body.style.overflow = '';
}
function closeModalOutside(e, id) {
  if (e.target.id === id) closeModal(id);
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

// ── Toast ───────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ── Form validation helper ──────────────────────────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Trial form submit ───────────────────────────────────────────────────
function submitTrial() {
  const store    = document.getElementById('trialStore');
  const email    = document.getElementById('trialEmail');
  const platform = document.getElementById('trialPlatform');
  if (!store || !email || !platform) return;

  if (!store.value.trim()) { store.focus(); showToast('Please enter your store name.', 'error'); return; }
  if (!validateEmail(email.value)) { email.focus(); showToast('Please enter a valid email address.', 'error'); return; }
  if (!platform.value) { platform.focus(); showToast('Please select your platform.', 'error'); return; }

  // Simulate submission
  closeModal('trialModal');
  const t = document.getElementById('successTitle');
  const m = document.getElementById('successMsg');
  if (t) t.textContent = "You're in!";
  if (m) m.textContent = `We've sent setup instructions to ${email.value}. It takes about 3 minutes to connect ${store.value}.`;
  openModal('successModal');
  store.value = ''; email.value = ''; platform.value = '';

  // Save to localStorage-like simulation (sessionStorage)
  try { sessionStorage.setItem('ss_trial_started', '1'); } catch(e) {}
}

// ── Contact form submit ─────────────────────────────────────────────────
function submitContact() {
  const name  = document.getElementById('contactName');
  const email = document.getElementById('contactEmail');
  if (!name || !email) return;

  if (!name.value.trim()) { name.focus(); showToast('Please enter your name.', 'error'); return; }
  if (!validateEmail(email.value)) { email.focus(); showToast('Please enter a valid email address.', 'error'); return; }

  closeModal('contactModal');
  const t = document.getElementById('successTitle');
  const m = document.getElementById('successMsg');
  if (t) t.textContent = 'Message received!';
  if (m) m.textContent = `Thanks ${name.value.split(' ')[0]}! Our team will reach out to ${email.value} within 1 business day.`;
  openModal('successModal');
  name.value = ''; email.value = '';
  const msg = document.getElementById('contactMsg');
  if (msg) msg.value = '';
}

// ── CTA email form ──────────────────────────────────────────────────────
function handleCTASubmit() {
  const input   = document.getElementById('ctaEmail');
  const form    = document.getElementById('ctaForm');
  const success = document.getElementById('ctaSuccess');
  if (!input) return;
  if (!validateEmail(input.value)) { input.focus(); showToast('Please enter a valid email address.', 'error'); return; }
  if (form) form.style.display = 'none';
  if (success) success.style.display = 'block';
  showToast('✅ You\'re on the list!', 'success');
}

// ── Mobile menu ─────────────────────────────────────────────────────────
const hamburger    = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose  = document.getElementById('mobileClose');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}
if (mobileClose) {
  mobileClose.addEventListener('click', () => {
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  });
}
if (mobileOverlay) {
  mobileOverlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Live widget animation (hero) ────────────────────────────────────────
(function liveWidgetLoop() {
  const updates = [
    { id: 'pr1', fill: '65%', color: 'var(--ok)', num: '130 u', tag: 'OK', tagClass: 'tag-ok' },
    { id: 'pr2', fill: '15%', color: 'var(--danger)', num: '12 u', tag: 'Order', tagClass: 'tag-danger' },
    { id: 'pr3', fill: '12%', color: 'var(--danger)', num: '5 u',  tag: 'Order', tagClass: 'tag-danger' },
    { id: 'pr4', fill: '80%', color: 'var(--ok)', num: '290 u', tag: 'OK', tagClass: 'tag-ok' },
  ];
  let idx = 0;
  setInterval(() => {
    const u = updates[idx % updates.length];
    const row = document.getElementById(u.id);
    if (row) {
      const fill = row.querySelector('.stock-fill');
      const num  = row.querySelector('.stock-num');
      const tag  = row.querySelector('.status-tag');
      if (fill) { fill.style.width = u.fill; fill.style.background = u.color; }
      if (num) num.textContent = u.num;
      if (tag) { tag.textContent = u.tag; tag.className = 'status-tag ' + u.tagClass; }
    }
    idx++;
  }, 3000);
})();
