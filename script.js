/* ════════════════════════════════════
   JULIE MANHAUDIER — script.js
   ════════════════════════════════════ */

/* ── HERO TYPEWRITER ── */
const heroPairs = [
  { w1: 'idea',    w2: 'impact'      },
  { w1: 'script',  w2: 'screen'      },
  { w1: 'stories', w2: 'communities' },
  { w1: 'scroll',  w2: 'connection'  },
  { w1: 'content', w2: 'conversion'  },
];
let hIdx = 0, hPhase = 'typing', hChar = 0;
const hw1   = document.getElementById('hw1');
const hw2   = document.getElementById('hw2');
const hDot  = document.getElementById('h-dot');
const hCur1 = document.getElementById('hcur1');
const hCur2 = document.getElementById('hcur2');

const TYPE_SPEED   = 110;   // ms per character when typing
const DEL_SPEED    = 60;    // ms per character when deleting
const PAUSE_AFTER  = 3200;  // ms to wait after fully typed
const PAUSE_BEFORE = 500;   // ms before typing next pair

function heroType() {
  if (!hw1 || !hw2) return;
  const { w1, w2 } = heroPairs[hIdx];
  const longer = Math.max(w1.length, w2.length);

  if (hPhase === 'typing') {
    hChar++;
    hw1.textContent = w1.slice(0, hChar);
    hw2.textContent = w2.slice(0, Math.min(hChar, w2.length));

    if (hChar >= longer) {
      // Fully typed — hide both cursors, show dot, pause
      if (hCur1) hCur1.style.opacity = '0';
      if (hCur2) hCur2.style.opacity = '0';
      if (hDot)  hDot.classList.add('visible');
      setTimeout(() => {
        if (hDot)  hDot.classList.remove('visible');
        if (hCur1) hCur1.style.opacity = '';
        if (hCur2) hCur2.style.opacity = '';
        hPhase = 'deleting';
        setTimeout(heroType, 120);
      }, PAUSE_AFTER);
      return;
    }
    setTimeout(heroType, TYPE_SPEED);

  } else {
    // Deleting
    hChar--;
    hw1.textContent = w1.slice(0, hChar);
    hw2.textContent = w2.slice(0, Math.min(hChar, w2.length));

    if (hChar <= 0) {
      hw1.textContent = '';
      hw2.textContent = '';
      hIdx = (hIdx + 1) % heroPairs.length;
      hPhase = 'typing';
      hChar = 0;
      setTimeout(heroType, PAUSE_BEFORE);
      return;
    }
    setTimeout(heroType, DEL_SPEED);
  }
}

/* ── PHONE TILT ON CURSOR PROXIMITY ── */
const phoneScene = document.getElementById('phone-scene');
const phoneEl    = phoneScene?.querySelector('.phone');

if (phoneScene && phoneEl) {
  const TILT_RADIUS = 340;   // px — distance beyond which there's no effect
  const TILT_MAX    = 14;    // degrees max tilt
  const MOVE_MAX    = 10;    // px max translate

  window.addEventListener('mousemove', e => {
    const rect = phoneScene.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = e.clientX - cx;
    const dy   = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > TILT_RADIUS) {
      // Too far — reset gently
      phoneEl.style.transform = '';
      return;
    }

    // Normalise 0→1 (1 = at center)
    const strength = 1 - dist / TILT_RADIUS;

    const rotY  =  (dx / TILT_RADIUS) * TILT_MAX * strength;
    const rotX  = -(dy / TILT_RADIUS) * TILT_MAX * strength;
    const tx    =  (dx / TILT_RADIUS) * MOVE_MAX * strength;
    const ty    =  (dy / TILT_RADIUS) * MOVE_MAX * strength;

    // Blend with the existing bob animation by overriding transform
    phoneEl.style.transition = 'transform 0.15s ease-out';
    phoneEl.style.transform  =
      `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate(${tx}px, ${ty}px)`;
  }, { passive: true });

  // When cursor leaves the window — restore animation
  document.addEventListener('mouseleave', () => {
    phoneEl.style.transition = '';
    phoneEl.style.transform  = '';
  });
}

/* ── LOADER ── */
const loaderEl   = document.getElementById('loader');
const loaderFill = document.getElementById('loader-fill');
let progress = 0;

const loadInterval = setInterval(() => {
  progress += Math.random() * 18;
  if (progress >= 100) { progress = 100; clearInterval(loadInterval); }
  loaderFill.style.width = progress + '%';
}, 80);

window.addEventListener('load', () => {
  clearInterval(loadInterval);
  loaderFill.style.width = '100%';
  setTimeout(() => {
    loaderEl.classList.add('hidden');
    document.body.classList.remove('is-loading');
    heroEntrance();
  }, 400);
});

/* ── HERO ENTRANCE ── */
function heroEntrance() {
  // Lines slide up staggered
  document.querySelectorAll('#hero .line-inner').forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), 100 + i * 120);
  });

  // Start typewriter after lines revealed
  setTimeout(heroType, 700);

  // Fade elements
  document.querySelectorAll('#hero .reveal-fade').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 500 + i * 100);
  });
}

/* ── CUSTOM CURSOR ── */
const cursorDot   = document.querySelector('.cursor-dot');
const cursorRing  = document.querySelector('.cursor-ring');
const cursorLabel = document.getElementById('cursor-label');

let mX = window.innerWidth / 2;
let mY = window.innerHeight / 2;
let rX = mX, rY = mY;
let dotX = mX, dotY = mY;

window.addEventListener('mousemove', e => { mX = e.clientX; mY = e.clientY; });

(function animateCursor() {
  // Dot — snappy
  dotX += (mX - dotX) * 0.55;
  dotY += (mY - dotY) * 0.55;
  cursorDot.style.left = dotX + 'px';
  cursorDot.style.top  = dotY + 'px';

  // Ring — smooth lag
  rX += (mX - rX) * 0.1;
  rY += (mY - rY) * 0.1;
  cursorRing.style.left = rX + 'px';
  cursorRing.style.top  = rY + 'px';
  cursorLabel.style.left = rX + 'px';
  cursorLabel.style.top  = rY + 'px';

  requestAnimationFrame(animateCursor);
})();

// Hover state on interactive elements
document.querySelectorAll('a, button, .service-card, .work-item, .float-badge, .values-list li, .open-chips span').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ── MAGNETIC BUTTONS — nav CTA only (isolated button) ── */
document.querySelectorAll('.nav-cta').forEach(btn => {
  let cx = 0, cy = 0;

  btn.addEventListener('mouseenter', () => {
    btn.style.transform = '';
    const r = btn.getBoundingClientRect();
    cx = r.left + r.width  / 2;
    cy = r.top  + r.height / 2;
  });

  btn.addEventListener('mousemove', e => {
    const dx = (e.clientX - cx) * 0.22;
    const dy = (e.clientY - cy) * 0.22;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── NAV SCROLL ── */
const navbar = document.getElementById('navbar');
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 50);
  if (y < 80) {
    navbar.classList.remove('compact');
  } else if (y > lastScrollY) {
    navbar.classList.add('compact');    // scrolling down → pill
  } else {
    navbar.classList.remove('compact'); // scrolling up → normal
  }
  lastScrollY = y;
}, { passive: true });

/* ── BURGER ── */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('open');
  navLinks.classList.remove('open');
}));

/* ── INTERSECTION OBSERVER — reveal ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;

    // Line-inner headings
    el.querySelectorAll('.line-inner').forEach((l, i) => {
      setTimeout(() => l.classList.add('revealed'), i * 100);
    });

    // reveal-up children
    el.querySelectorAll('.reveal-up').forEach((u, i) => {
      setTimeout(() => u.classList.add('visible'), i * 80);
    });

    revealObs.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

// Directly observe .reveal-up elements outside sections
document.querySelectorAll('.reveal-up').forEach((el, i) => {
  el.style.transitionDelay = (i % 5) * 70 + 'ms';
  revealObs.observe(el);
});

// Observe sections for line reveals
document.querySelectorAll('section').forEach(s => revealObs.observe(s));

/* ── STAT COUNTER ── */
function animateCount(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = '1';
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();

  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(animateCount);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stats-bar, .work-item').forEach(el => statObs.observe(el));

/* ── POLAROID STACK — tap to fan on mobile + hint animation ── */
const polaroidStack = document.getElementById('polaroidStack');
if (polaroidStack) {
  polaroidStack.addEventListener('click', () => {
    polaroidStack.classList.toggle('fanned');
  });

  // Hint: partial fan after 1.8s when stack scrolls into view
  const hintObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          const cards = polaroidStack.querySelectorAll('.polaroid');
          cards.forEach(c => {
            c.classList.add('hint-animate');
            c.addEventListener('animationend', () => c.classList.remove('hint-animate'), { once: true });
          });
        }, 600);
        hintObs.unobserve(polaroidStack);
      }
    });
  }, { threshold: 0.5 });
  hintObs.observe(polaroidStack);
}

/* ── PHOTO 3D TILT — gentle scatter reveal ── */
document.querySelectorAll('.photo-tilt').forEach(wrapper => {
  const inner = wrapper.querySelector('.photo-tilt-inner');
  const shine = wrapper.querySelector('.photo-shine');

  wrapper.addEventListener('mousemove', e => {
    const r    = inner.getBoundingClientRect();
    const x    = (e.clientX - r.left)  / r.width;   // 0→1
    const y    = (e.clientY - r.top)   / r.height;  // 0→1
    const rotX = (0.5 - y) * 10;   // subtle tilt ±10°
    const rotY = (x - 0.5) * 10;

    inner.style.transform =
      `rotate(0deg) translateY(-14px) scale(1.05) perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

    shine.style.setProperty('--sx', `${x * 100}%`);
    shine.style.setProperty('--sy', `${y * 100}%`);
  });

  wrapper.addEventListener('mouseleave', () => {
    inner.style.transform = '';
  });
});

/* ── BADGE MAGNETIC PROXIMITY ── */
const floatBadges = document.querySelectorAll('.float-badge');
const BADGE_RADIUS = 180;   // px — zone of influence
const BADGE_PUSH   = 14;    // px max displacement

window.addEventListener('mousemove', e => {
  floatBadges.forEach(badge => {
    const rect = badge.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > BADGE_RADIUS) {
      badge.style.transform = '';
      badge.style.boxShadow = '';
      badge.style.borderColor = '';
      return;
    }

    const strength = 1 - dist / BADGE_RADIUS;
    const tx = (dx / dist) * BADGE_PUSH * strength;
    const ty = (dy / dist) * BADGE_PUSH * strength;

    badge.style.transform   = `translate(${tx}px, ${ty}px) scale(${1 + strength * 0.05})`;
    badge.style.boxShadow   = `0 ${8 + strength * 12}px ${20 + strength * 20}px rgba(13,13,13,${0.1 + strength * 0.1})`;
    badge.style.borderColor = `rgba(201,113,74,${strength * 0.8})`;
  });
}, { passive: true });

// Reset on mouse leave
document.addEventListener('mouseleave', () => {
  floatBadges.forEach(b => {
    b.style.transform = '';
    b.style.boxShadow = '';
    b.style.borderColor = '';
  });
});

/* ── ACTIVE NAV ── */
const sections  = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-links a:not(.nav-cta)');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 220) current = s.id; });
  navItems.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
  });
}, { passive: true });
