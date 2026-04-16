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
