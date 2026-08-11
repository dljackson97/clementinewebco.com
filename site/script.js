// Clementine Web Co. — small, framework-free enhancements

document.getElementById('year').textContent = new Date().getFullYear();

// Measure the real header height so the hero (.hero, styles.css) can fill
// exactly the rest of the viewport on load — the header's height shifts
// slightly between breakpoints (mobile hamburger vs. full nav), so this is
// more reliable than hard-coding a number.
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const setHeaderHeight = () => {
    document.documentElement.style.setProperty('--header-h', `${siteHeader.offsetHeight}px`);
  };
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);
}

// In-page nav links (header nav, hero buttons, brand logo) scroll smoothly
// without ever writing a #hash into the URL — otherwise refreshing the page
// re-triggers the browser's native jump-to-anchor and lands mid-page instead
// of at the top. The skip-link is left alone on purpose (instant jump for
// keyboard/screen-reader users, not an animated scroll).
document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

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
// Grid groups get a staggered delay per item so they don't all pop in at
// once — reads as a much more deliberate, noticeable reveal.
const revealGroups = [
  document.querySelectorAll('.case-grid > .case-card'),
  document.querySelectorAll('.process-list > li'),
  document.querySelectorAll('.price-grid > .price-card'),
];
revealGroups.forEach((group) => {
  group.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.15}s`;
  });
});
document.querySelectorAll('.about-inner, .contact-inner').forEach((el) => {
  el.classList.add('reveal');
});

const revealTargets = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
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
