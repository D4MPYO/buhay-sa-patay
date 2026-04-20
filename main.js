// ─── EMOJI RAIN ───
function triggerRain(emoji) {
  // Create or reuse rain container
  let container = document.getElementById('rainContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'rainContainer';
    container.className = 'rain-container';
    document.body.appendChild(container);
  }

  const count = 38;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'rain-particle';
    particle.textContent = emoji;

    // Random horizontal spread
    const left = Math.random() * 98;
    // Random duration & delay for natural look
    const duration = 1.4 + Math.random() * 2.2;
    const delay    = Math.random() * 1.2;
    const size     = 1.1 + Math.random() * 1.2;

    particle.style.left        = `${left}%`;
    particle.style.fontSize    = `${size}rem`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay    = `${delay}s`;

    container.appendChild(particle);

    // Remove particle after animation ends
    particle.addEventListener('animationend', () => particle.remove());
  }
}

// Attach click handlers to strip items
document.querySelectorAll('.strip-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const emoji = btn.dataset.emoji;
    if (emoji) triggerRain(emoji);
  });
});

// Trigger staged intro animations once first paint has settled
requestAnimationFrame(() => {
  document.body.classList.add('page-ready');
});

// Landing cards: ghost wake animation before navigation
(function () {
  const cards = document.querySelectorAll('.topics .card[href]');
  if (!cards.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function drawGhost(ctx, x, y, size, mood, alpha) {
    const w = size;
    const h = size * (1.16 + Math.random() * 0.08);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, 1);
    ctx.globalAlpha = alpha;
    ctx.filter = 'blur(0.4px)';

    const grad = ctx.createRadialGradient(0, -h * 0.35, size * 0.15, 0, h * 0.1, size * 0.9);
    if (mood === 0) {
      grad.addColorStop(0, 'rgba(255,255,255,0.98)');
      grad.addColorStop(0.52, 'rgba(236,239,248,0.92)');
      grad.addColorStop(1, 'rgba(173,183,208,0.8)');
    } else if (mood === 1) {
      grad.addColorStop(0, 'rgba(255,255,255,0.97)');
      grad.addColorStop(0.52, 'rgba(228,243,247,0.9)');
      grad.addColorStop(1, 'rgba(165,198,208,0.78)');
    } else if (mood === 2) {
      grad.addColorStop(0, 'rgba(255,255,255,0.98)');
      grad.addColorStop(0.52, 'rgba(235,228,248,0.9)');
      grad.addColorStop(1, 'rgba(184,172,214,0.78)');
    } else {
      grad.addColorStop(0, 'rgba(255,255,255,0.98)');
      grad.addColorStop(0.52, 'rgba(240,231,214,0.9)');
      grad.addColorStop(1, 'rgba(205,186,158,0.78)');
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-w * 0.42, -h * 0.2);
    ctx.quadraticCurveTo(-w * 0.48, -h * 0.62, 0, -h * 0.64);
    ctx.quadraticCurveTo(w * 0.5, -h * 0.62, w * 0.44, -h * 0.18);
    ctx.quadraticCurveTo(w * 0.48, h * 0.3, w * 0.28, h * 0.48);
    ctx.quadraticCurveTo(w * 0.18, h * 0.58, w * 0.09, h * 0.46);
    ctx.quadraticCurveTo(0, h * 0.63, -w * 0.1, h * 0.47);
    ctx.quadraticCurveTo(-w * 0.2, h * 0.62, -w * 0.28, h * 0.47);
    ctx.quadraticCurveTo(-w * 0.5, h * 0.31, -w * 0.42, -h * 0.2);
    ctx.closePath();
    ctx.fill();

    ctx.filter = 'none';
    ctx.fillStyle = 'rgba(15,15,18,0.84)';
    ctx.beginPath();
    ctx.ellipse(-w * 0.14, -h * 0.24, w * 0.07, h * 0.07, 0.12, 0, Math.PI * 2);
    ctx.ellipse(w * 0.14, -h * 0.24, w * 0.07, h * 0.07, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    if (mood % 2 === 0) {
      ctx.ellipse(0, -h * 0.06, w * 0.1, h * 0.07, 0, 0.1, Math.PI - 0.1);
      ctx.strokeStyle = 'rgba(18,18,22,0.7)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
    } else {
      ctx.ellipse(0, -h * 0.07, w * 0.06, h * 0.09, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function runGhostBurst(card) {
    return new Promise((resolve) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width * 0.5;
      const baseY = rect.top + rect.height * 0.65;
      const total = 8 + Math.floor(Math.random() * 5);

      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.position = 'fixed';
      canvas.style.inset = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '160';
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      const start = performance.now();
      const duration = 980;

      const ghosts = Array.from({ length: total }, () => ({
        x: centerX + (Math.random() - 0.5) * Math.min(rect.width * 0.92, 170),
        y: baseY + (Math.random() - 0.5) * Math.min(rect.height * 0.34, 36),
        size: 28 + Math.random() * 42,
        rise: 170 + Math.random() * 260,
        drift: (Math.random() - 0.5) * 180,
        sway: 10 + Math.random() * 18,
        mood: Math.floor(Math.random() * 4),
        delay: Math.random() * 120,
        angle: (Math.random() - 0.5) * 0.34,
      }));

      function frame(now) {
        const elapsed = now - start;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let finishedCount = 0;
        ghosts.forEach((g) => {
          const t = Math.max(0, Math.min(1, (elapsed - g.delay) / duration));
          if (t >= 1) {
            finishedCount += 1;
            return;
          }

          const easeOut = 1 - Math.pow(1 - t, 3);
          const wakePop = t < 0.18 ? t / 0.18 : 1;
          const x = g.x + g.drift * easeOut + Math.sin((elapsed * 0.008) + g.angle) * g.sway;
          const y = g.y - g.rise * easeOut;
          const alpha = t < 0.18 ? wakePop : (1 - Math.pow(t, 1.55));

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(g.angle + Math.sin((elapsed * 0.003) + g.angle) * 0.18);
          drawGhost(ctx, 0, 0, g.size * (0.72 + wakePop * 0.32), g.mood, alpha);
          ctx.restore();
        });

        if (finishedCount === ghosts.length || elapsed > duration + 220) {
          canvas.remove();
          resolve();
          return;
        }

        requestAnimationFrame(frame);
      }

      requestAnimationFrame(frame);
    });
  }

  cards.forEach(card => {
    card.addEventListener('click', (event) => {
      if (reduceMotion) return;
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const href = card.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      if (card.dataset.ghostBusy === '1') {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      card.dataset.ghostBusy = '1';
      card.classList.add('ghost-awake');

      runGhostBurst(card).then(() => {
        document.body.classList.add('page-exit');
        setTimeout(() => {
          window.location.href = href;
        }, 260);
      });
    });
  });
})();

// ─── HAMBURGER MENU TOGGLE ───
// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
}

// Active nav link highlight on scroll
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a, .mobile-menu a');

const sectionNavMap = {
  'home':        '#home',
  'topics':      '#topics',
  'hanapbuhay':  '#hanapbuhay',
};

const navObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const href = sectionNavMap[entry.target.id];
        if (!href) return;
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="${href}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
);

sections.forEach(s => navObserver.observe(s));

// Scroll-reveal on landing page with staggered timing
const revealEls = document.querySelectorAll([
  '.topics .section-label',
  '.topics .section-title',
  '.topics .section-sub',
  '.topics .card',
  '.feature-text > *',
  '.feature-gallery .gallery-card-link',
  '.quote-section blockquote',
  '.researchers-page-intro',
  '.rcard'
].join(', '));

if (revealEls.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observerRef) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observerRef.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal-on-scroll');
    el.style.setProperty('--reveal-delay', `${(i % 8) * 70}ms`);
    revealObserver.observe(el);
  });
}

// Subtle hero parallax for atmosphere
const hero = document.querySelector('.hero');
const heroOverlay = hero ? hero.querySelector('.hero-overlay') : null;
if (hero && heroOverlay) {
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY, 420);
    heroOverlay.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
  }, { passive: true });
}

// ─── NAVBAR SHRINK ON SCROLL ───
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.transition = 'background 0.35s ease, backdrop-filter 0.35s ease';
      navbar.style.background = 'rgba(14,14,14,0.72)';
    } else {
      navbar.style.background = 'rgba(14,14,14,0.45)';
    }
  }, { passive: true });
}

// ─── NEWSPAPER LAYOUT BUILDER ───
// Floats the image into the top corner so text wraps around it.
// Pages 1,3,5 (odd) → section 0 starts LEFT; Pages 2,4,6 (even) → section 0 starts RIGHT.
// First section image is larger (.news-img-first).
(function () {
  const sections = document.querySelectorAll('.detail-section');
  if (!sections.length) return;

  // Determine starting side from page parity attribute on <body>
  const parity    = document.body.dataset.pageParity; // 'odd' | 'even'
  const startLeft = parity === 'odd';

  sections.forEach((section, index) => {
    const body = section.querySelector('.detail-section-body');
    if (!body) return;

    // Use existing image or create placeholder
    let imgEl = body.querySelector('img.news-img');
    if (!imgEl) {
      imgEl = document.createElement('div');
      imgEl.className = 'news-img-placeholder';
      imgEl.textContent = 'Larawan';
    }

    // Alternate float direction based on starting side
    const isLeft   = startLeft ? (index % 2 === 0) : (index % 2 !== 0);
    const floatClass = isLeft ? 'float-left' : 'float-right';
    imgEl.classList.add(floatClass);

    // First image on the page gets a larger size
    if (index === 0) imgEl.classList.add('news-img-first');

    // Insert image as FIRST child so it floats at the top
    body.insertBefore(imgEl, body.firstChild);
  });
})();

// ─── AUDIO BUTTONS + FLOATING PLAYER ───
(function () {
  const iconPlay  = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
  const iconPause = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

  let currentAudio   = null;
  let currentBtn     = null;
  let currentTitle   = '';
  let btnIsVisible   = true;

  // Floating player elements (only present on detail pages)
  const fp          = document.getElementById('floatingPlayer');
  const fpTitle     = document.getElementById('fpTitle');
  const fpPlayPause = document.getElementById('fpPlayPause');
  const fpStop      = document.getElementById('fpStop');

  // ── Show / hide floating player ──────────────────────────────
  function updateFloatingPlayer() {
    if (!fp) return;
    // Show when: there is an active audio (playing OR paused) AND the H2 button is scrolled out of view
    if (currentAudio && !btnIsVisible) {
      fpTitle.textContent = currentTitle;
      fpPlayPause.innerHTML = currentAudio.paused ? iconPlay : iconPause;
      fp.classList.add('fp-visible');
      fp.setAttribute('aria-hidden', 'false');
    } else {
      fp.classList.remove('fp-visible');
      fp.setAttribute('aria-hidden', 'true');
    }
  }

  // ── Stop everything ──────────────────────────────────────────
  function stopCurrent() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    if (currentBtn) {
      currentBtn.classList.remove('playing');
      currentBtn.innerHTML = iconPlay;
    }
    currentAudio = null;
    currentBtn   = null;
    currentTitle = '';
    updateFloatingPlayer();
  }

  // ── IntersectionObserver: track if current button is visible ─
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.target === currentBtn) {
        btnIsVisible = entry.isIntersecting;
        updateFloatingPlayer();
      }
    });
  }, { threshold: 0.5 });

  // ── Wire each audio button ───────────────────────────────────
  document.querySelectorAll('.audio-btn').forEach(function (btn) {
    // Get the H2 text as title (text before the button)
    observer.observe(btn);

    btn.addEventListener('click', function () {
      const src = btn.dataset.audio;
      // Derive section title from H2 text (strip button text)
      const h2 = btn.closest('h2');
      const sectionTitle = h2 ? h2.childNodes[0].textContent.trim() : '';

      // Clicked same button that's playing → pause
      if (currentBtn === btn && currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        btn.classList.remove('playing');
        btn.innerHTML = iconPlay;
        updateFloatingPlayer();
        return;
      }

      // Clicked same button that's paused → resume
      if (currentBtn === btn && currentAudio && currentAudio.paused) {
        currentAudio.play();
        btn.classList.add('playing');
        btn.innerHTML = iconPause;
        updateFloatingPlayer();
        return;
      }

      // Different button → stop current, start new
      stopCurrent();

      const audio = new Audio(src);
      currentAudio = audio;
      currentBtn   = btn;
      currentTitle = sectionTitle;
      btnIsVisible = true; // assume visible since user just clicked it

      btn.classList.add('playing');
      btn.innerHTML = iconPause;

      audio.play().catch(function () { stopCurrent(); });
      audio.addEventListener('ended', function () { stopCurrent(); });

      updateFloatingPlayer();
    });
  });

  // ── Floating player controls ─────────────────────────────────
  if (fpPlayPause) {
    fpPlayPause.addEventListener('click', function () {
      if (!currentAudio) return;
      if (currentAudio.paused) {
        currentAudio.play();
        if (currentBtn) { currentBtn.classList.add('playing'); currentBtn.innerHTML = iconPause; }
        fpPlayPause.innerHTML = iconPause;
      } else {
        currentAudio.pause();
        if (currentBtn) { currentBtn.classList.remove('playing'); currentBtn.innerHTML = iconPlay; }
        fpPlayPause.innerHTML = iconPlay;
        updateFloatingPlayer();
      }
    });
  }

  if (fpStop) {
    fpStop.addEventListener('click', function () { stopCurrent(); });
  }
})();

// ─── RESEARCHER MODALS ───
(function () {
  var cards = document.querySelectorAll('[data-modal]');
  cards.forEach(function (card) {
    card.addEventListener('click', openModal);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal.call(card); }
    });
  });

  document.querySelectorAll('.researcher-modal__overlay, .researcher-modal__close').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  function openModal() {
    var id = this.getAttribute('data-modal');
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    var close = modal.querySelector('.researcher-modal__close');
    if (close) close.focus();
  }

  function closeModal() {
    document.querySelectorAll('.researcher-modal.is-open').forEach(function (m) {
      m.classList.remove('is-open');
    });
    document.body.style.overflow = '';
  }
})();