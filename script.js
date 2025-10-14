document.addEventListener('DOMContentLoaded', () => {
  // ----- LOTTIE ICON -----
  const iconEl = document.getElementById('lottie-icon');
  if (iconEl && window.lottie) {
    window.lottie.loadAnimation({
      container: iconEl,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/lottie/bluebot.json',
      rendererSettings: {
        progressiveLoad: true,
        preserveAspectRatio: 'xMidYMid meet'
      }
    });
  }

  // ----- HAMBURGER TOGGLE -----
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      const next = !isOpen;

      hamburger.setAttribute('aria-expanded', String(next));
      // Show/hide drawer for a11y; CSS will animate using a class if you add it.
      if (next) {
        drawer.removeAttribute('hidden');
        drawer.classList.add('open');   // <- hook for your CSS animation
        document.body.classList.add('nav-open'); // optional page lock/blur hook
      } else {
        drawer.classList.remove('open');
        document.body.classList.remove('nav-open');
        // Delay 'hidden' until after your closing animation (match your CSS duration)
        setTimeout(() => drawer.setAttribute('hidden', ''), 200);
      }
    });
  }
});


// Count-up when .stat__value enters the viewport
document.addEventListener('DOMContentLoaded', () => {
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  const format = (val, { decimals = 0, compact = false, suffix = '' } = {}) => {
    if (compact) {
      return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(val) + suffix;
    }
    const n = Number(val);
    return (decimals ? n.toFixed(decimals) : Math.round(n).toString()) + suffix;
  };

  const animate = (el, { from = 0, to, duration = 1200, decimals = 0, compact = false, suffix = '' }) => {
    const start = performance.now();
    const step = now => {
      const t = Math.min(1, (now - start) / duration);
      const v = from + (to - from) * easeOutCubic(t);
      el.textContent = format(v, { decimals, compact, suffix });
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = format(to, { decimals, compact, suffix });
    };
    requestAnimationFrame(step);
  };

  const parseOpts = el => ({
    to: parseFloat(el.dataset.target),
    decimals: parseInt(el.dataset.decimals || '0', 10),
    compact: el.dataset.compact === 'true',
    suffix: el.dataset.suffix || '+',
    duration: 1200,
  });

  const items = Array.from(document.querySelectorAll('.stat__value'));
  const seen = new WeakSet();

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !seen.has(entry.target)) {
        seen.add(entry.target);
        animate(entry.target, parseOpts(entry.target));
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  items.forEach(el => {
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      if (!seen.has(el)) { seen.add(el); animate(el, parseOpts(el)); }
    } else {
      io.observe(el);
    }
  });
});


// <!-- ---------------- use case -------------- -->

const tabs = document.querySelectorAll('.how-tab');
const indicator = document.querySelector('.how-indicator');
const contents = document.querySelectorAll('.how-content');

function moveIndicator(index) {
  const tab = tabs[index];
  indicator.style.left = `${tab.offsetLeft}px`;
  indicator.style.width = `${tab.offsetWidth}px`;
}
function setActive(idx) {
  tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
  contents.forEach((c, i) => c.classList.toggle('active', i === idx));
  moveIndicator(idx);
}
tabs.forEach((tab, idx) => tab.addEventListener('click', () => setActive(idx)));
window.addEventListener('DOMContentLoaded', () => moveIndicator(0));
window.addEventListener('resize', () => {
  const idx = [...tabs].findIndex(tab => tab.classList.contains('active'));
  moveIndicator(idx);
});


// qa section 

document.querySelectorAll('.faq-question').forEach(function(btn) {
  btn.addEventListener('click', function() {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');

    // Close all other open items
    document.querySelectorAll('.faq-item.open').forEach(function(openItem) {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-toggle').textContent = '+';
      }
    });

    // Toggle current item
    if (isOpen) {
      item.classList.remove('open');
      btn.querySelector('.faq-toggle').textContent = '+';
    } else {
      item.classList.add('open');
      btn.querySelector('.faq-toggle').textContent = '−';
    }
  });
});
