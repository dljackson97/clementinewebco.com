// Clementine Web Co. — small, framework-free enhancements

document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const open = primaryNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll reveal — fade/rise elements in as they enter the viewport.
// Classes are added here, not in the HTML/CSS, so content stays fully
// visible by default if JS never runs.
const revealTargets = document.querySelectorAll(
  '.case-card, .process-list li, .price-card, .about-inner, .contact-inner'
);
if ('IntersectionObserver' in window && revealTargets.length) {
  revealTargets.forEach((el) => el.classList.add('reveal'));
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));
}

// Bottom-right contact popup — shows once per browser session, 3s after load.
const popup = document.getElementById('sitePopup');
const popupClose = document.getElementById('sitePopupClose');
if (popup && popupClose) {
  let dismissed = false;
  try {
    dismissed = sessionStorage.getItem('popupDismissed') === '1';
  } catch (err) {
    /* sessionStorage unavailable (e.g. private mode) — just show it every time */
  }
  if (!dismissed) {
    setTimeout(() => popup.classList.add('is-visible'), 3000);
  }
  const dismiss = () => {
    popup.classList.remove('is-visible');
    try {
      sessionStorage.setItem('popupDismissed', '1');
    } catch (err) {
      /* ignore */
    }
  };
  popupClose.addEventListener('click', dismiss);
  popup.querySelector('a')?.addEventListener('click', dismiss);
}

// Contact form — progressive enhancement over Web3Forms.
// If fetch fails or JS is off, the form still works via its normal action/method.
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

if (form && status) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Sending…';
    status.removeAttribute('data-state');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const result = await response.json();

      if (result.success) {
        status.textContent = "Got it — I'll be in touch soon.";
        status.setAttribute('data-state', 'success');
        form.reset();
      } else {
        throw new Error(result.message || 'Something went wrong.');
      }
    } catch (err) {
      status.textContent = "Couldn't send that — try emailing devin@clementinewebco.com directly.";
      status.setAttribute('data-state', 'error');
    }
  });
}
