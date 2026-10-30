const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
const mobileNavigation = window.matchMedia('(max-width: 620px)');

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
}

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
});
mobileNavigation.addEventListener('change', closeMenu);

document.querySelectorAll('[data-service]').forEach((link) => {
  link.addEventListener('click', () => {
    document.getElementById('service').value = link.dataset.service;
  });
});

const email = 'azariushhussain@gmail.com';
document.getElementById('copyEmail').addEventListener('click', async () => {
  const status = document.getElementById('copyStatus');
  try {
    await navigator.clipboard.writeText(email);
    status.textContent = 'Email address copied.';
  } catch {
    status.textContent = `You can copy this address: ${email}`;
  }
});

document.getElementById('projectForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = data.get('name').trim();
  const replyTo = data.get('email').trim();
  const service = data.get('service') || 'New project';
  const brief = data.get('brief').trim();
  const body = `Hi Azariush,\n\nI'm ${name}.\n\nProject type: ${service}\n\n${brief}\n\nReply to: ${replyTo}`;
  const mailto = `mailto:${email}?subject=${encodeURIComponent(`Project enquiry: ${service}`)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
  document.getElementById('formStatus').textContent = 'Your email app should open with the draft. Review and send it there. If nothing opens, email me directly using the address on this page.';
});

document.getElementById('year').textContent = new Date().getFullYear();
