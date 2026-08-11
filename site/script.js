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
