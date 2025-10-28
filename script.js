document.addEventListener('DOMContentLoaded', () => {
  // ===== LOTTIE ICON =====
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
        preserveAspectRatio: 'xMidYMid meet',
      },
    });
  }

  // ===== HAMBURGER TOGGLE =====
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      const next = !isOpen;
      hamburger.setAttribute('aria-expanded', String(next));
      if (next) {
        drawer.removeAttribute('hidden');
        drawer.classList.add('open');
        document.body.classList.add('nav-open');
      } else {
        drawer.classList.remove('open');
        document.body.classList.remove('nav-open');
        setTimeout(() => drawer.setAttribute('hidden', ''), 200);
      }
    });
  }

  // ===== Count Up Stats =====
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const format = (val, { decimals = 0, compact = false, suffix = '' } = {}) => {
    if (compact) {
      return new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(val) + suffix;
    }
    const n = Number(val);
    return (decimals ? n.toFixed(decimals) : Math.round(n).toString()) + suffix;
  };
  const animate = (
    el,
    { from = 0, to, duration = 1200, decimals = 0, compact = false, suffix = '' }
  ) => {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const v = from + (to - from) * easeOutCubic(t);
      el.textContent = format(v, { decimals, compact, suffix });
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = format(to, { decimals, compact, suffix });
    };
    requestAnimationFrame(step);
  };
  const parseOpts = (el) => ({
    to: parseFloat(el.dataset.target),
    decimals: parseInt(el.dataset.decimals || '0', 10),
    compact: el.dataset.compact === 'true',
    suffix: el.dataset.suffix || '+',
    duration: 1200,
  });
  const items = Array.from(document.querySelectorAll('.stat__value'));
  const seen = new WeakSet();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          animate(entry.target, parseOpts(entry.target));
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );
  items.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      if (!seen.has(el)) {
        seen.add(el);
        animate(el, parseOpts(el));
      }
    } else {
      io.observe(el);
    }
  });

  // ===== FAQ Toggle =====
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      if (!item) return;
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          const toggle = openItem.querySelector('.faq-toggle');
          if (toggle) toggle.textContent = '+';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        btn.querySelector('.faq-toggle').textContent = '+';
      } else {
        item.classList.add('open');
        btn.querySelector('.faq-toggle').textContent = '−';
      }
    });
  });

  // ===== CAPTCHA =====
  // function generateCaptcha(length = 6) {
  //   const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  //   let code = '';
  //   for (let i = 0; i < length; i++) {
  //     code += chars[Math.floor(Math.random() * chars.length)];
  //   }
  //   const captchaText = document.getElementById('captchaText');
  //   if (captchaText) captchaText.textContent = code;
  //   return code;
  // }

  // let currentCaptcha = generateCaptcha();

  // const refreshButton = document.querySelector('.captcha-refresh');
  // if (refreshButton) {
  //   refreshButton.onclick = () => {
  //     currentCaptcha = generateCaptcha();
  //     const captchaInput = document.getElementById('captchaInput');
  //     if (captchaInput) captchaInput.value = '';
  //   };
  // }

  // const form = document.getElementById('contactForm');
  // const formStatus = document.getElementById('formStatus');

  // if (form) {
  //   form.addEventListener('submit', function(event) {
  //     event.preventDefault();

  //     const captchaInput = document.getElementById('captchaInput');
  //     const captchaText = document.getElementById('captchaText');

  //     if (!captchaInput || !captchaText) {
  //       alert('Captcha elements missing.');
  //       return;
  //     }

  //     const userInput = captchaInput.value.trim();
  //     const captcha = captchaText.textContent;

  //     if (userInput !== captcha) {
  //       alert('Invalid captcha. Please try again.');
  //       currentCaptcha = generateCaptcha();
  //       captchaInput.value = '';
  //       return;
  //     }

  //     const formData = new FormData(form);
  //     const url = 'https://formsubmit.co/ajax/akshayp9396@gmail.com';

  //     fetch(url, {
  //       method: 'POST',
  //       body: formData,
  //       headers: { 'Accept': 'application/json' }
  //     })
  //     .then(response => {
  //       if (response.ok) {
  //         formStatus.style.color = 'green';
  //         formStatus.innerHTML = '&#10003; Form submitted successfully!';
  //         form.reset();
  //         currentCaptcha = generateCaptcha(); // regenerate captcha
  //       } else {
  //         formStatus.style.color = 'red';
  //         formStatus.textContent = 'Submission failed. Please try again.';
  //       }
  //     })
  //     .catch(error => {
  //       formStatus.style.color = 'red';
  //       formStatus.textContent = 'An error occurred. Try again later.';
  //       console.error('Error:', error);
  //     });
  //   });
  // }
//  fadein animation trusted section 

 const elements = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        entry.target.classList.add('animated');
        // If you want to animate only once:
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.90 }); // Trigger when 10% of element is visible

  elements.forEach(el => {
    // Trigger animation on load
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });

  // --------about-----------------
 const about = document.querySelector('.about-chatbot-section.reveal');
  if (!about) return;

  // show immediately if already in view, else observe
  const show = () => about.classList.add('show');

  const rect = about.getBoundingClientRect();
  const inView = rect.top < window.innerHeight && rect.bottom > 0;
  if (inView) {
    show();
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (isIntersecting) {
          target.classList.add('show');
          obs.unobserve(target);
        }
      });
    }, { threshold: 0.15 });
    io.observe(about);
  }




 // Mark hero "in" to start the directional entrances
  const hero = document.querySelector('.hero');
  if (hero) {

    requestAnimationFrame(() => hero.classList.add('is-in'));

    // Soft parallax on waves for depth (safe + performant)
    const waves = hero.querySelector('.hero__waves');
    if (waves) {
      let ticking = false;
      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const y = Math.min(window.scrollY * 0.12, 36);
            waves.style.transform = `translateX(-50%) translateY(${y}px)`;
            ticking = false;
          });
          ticking = true;
        }
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }


// -------------------------
  const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Verify Google reCAPTCHA response
    const recaptchaResponse = grecaptcha.getResponse();
    if (recaptchaResponse.length === 0) {
      alert('Please complete the reCAPTCHA.');
      return;
    }

    const formData = new FormData(form);
    // Append recaptcha response to form data
    formData.append('g-recaptcha-response', recaptchaResponse);

    const url = 'https://formsubmit.co/ajax/sales@amyntortech.com';

    fetch(url, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        formStatus.style.color = 'green';
        formStatus.innerHTML = '&#10003; Form submitted successfully!';
        form.reset();
        grecaptcha.reset(); // reset reCAPTCHA widget
      } else {
        formStatus.style.color = 'red';
        formStatus.textContent = 'Submission failed. Please try again.';
      }
    })
    .catch(error => {
      formStatus.style.color = 'red';
      formStatus.textContent = 'An error occurred. Try again later.';
      console.error('Error:', error);
    });
  });
}

});

