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

// ─── HAMBURGER MENU TOGGLE ───
// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// Active nav link highlight on scroll
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a, .mobile-menu a');

const sectionNavMap = {
  'home':        '#home',
  'topics':      '#topics',
  'hanapbuhay':  '#hanapbuhay',
};

const observer = new IntersectionObserver(
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

sections.forEach(s => observer.observe(s));

// Subtle fade-in on scroll for cards
const fadeEls = document.querySelectorAll(
  '.card, .qnav-item, .feature-text, .feature-gallery, .rcard, .researchers-page-intro'
);

const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

fadeEls.forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(28px)';
  el.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
  fadeObserver.observe(el);
});

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
