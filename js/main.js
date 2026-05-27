/* ============================================
   WEQ.SE – JavaScript
   ============================================ */

// ── Scroll: shrink navbar
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animated stat counters
function animateCounter(el, target, suffix = '') {
  const duration = 1600;
  const start = performance.now();
  const isDecimal = String(target).includes('.');

  requestAnimationFrame(function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = isDecimal
      ? (ease * target).toFixed(1)
      : Math.round(ease * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  el.textContent = '0' + (el.dataset.suffix || '');
  statsObserver.observe(el);
});

// ── Contact form (mailto fallback)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const company = form.company.value.trim();
    const message = form.message.value.trim();

    const subject = encodeURIComponent(`Bokningsförfrågan – ${company || name}`);
    const body    = encodeURIComponent(
      `Hej Joaquim,\n\nJag heter ${name} och jobbar på ${company}.\n\n${message}\n\nKontakta mig på: ${email}`
    );

    window.location.href = `mailto:joaquim@cxdesign.se?subject=${subject}&body=${body}`;
  });
}
