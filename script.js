// script.js — Replace your existing file with this

/* -------------------------
   THEME (light / dark)
   ------------------------- */
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  // theme: 'dark' or 'light'
  if (theme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
    themeToggle.setAttribute('aria-pressed', 'true');
  } else {
    document.body.classList.remove('dark');
    themeToggle.textContent = '🌙';
    themeToggle.setAttribute('aria-pressed', 'false');
  }
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {
    // localStorage may be unavailable in some privacy modes — ignore safely
  }
}

// initialize theme (stored > prefers-color-scheme > light)
(function initTheme() {
  let stored = null;
  try {
    stored = localStorage.getItem('theme');
  } catch (e) {
    stored = null;
  }

  if (stored === 'dark' || stored === 'light') {
    applyTheme(stored);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
})();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const active = document.body.classList.contains('dark') ? 'dark' : 'light';
    applyTheme(active === 'dark' ? 'light' : 'dark');
  });
}

/* -------------------------
   SMOOTH SCROLL / NAV
   ------------------------- */
function scrollToSection(id) {
  // close mobile menu if open
  closeMobileMenu();

  const section = document.getElementById(id);
  if (section) {
    // offset for fixed navbar (adjust if navbar height changes)
    const offset = 70;
    const top = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

// add click handlers to all nav buttons (desktop + mobile)
document.querySelectorAll('[data-section]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const sectionId = btn.getAttribute('data-section');
    if (sectionId) {
      scrollToSection(sectionId);
    }
  });
});

/* -------------------------
   ACTIVE SECTION HIGHLIGHT
   ------------------------- */
const sections = Array.from(document.querySelectorAll('section'));
const navButtons = Array.from(document.querySelectorAll('[data-section]'));

function updateActiveSection() {
  const scrollPos = window.scrollY + 200; // same offset logic used previously

  for (const sec of sections) {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    if (scrollPos >= top && scrollPos < top + height) {
      const id = sec.id;
      navButtons.forEach((btn) => {
        if (btn.dataset.section === id) btn.classList.add('active');
        else btn.classList.remove('active');
      });
      break;
    }
  }
}

window.addEventListener('scroll', updateActiveSection);
window.addEventListener('resize', updateActiveSection);
updateActiveSection();

/* -------------------------
   MOBILE MENU TOGGLE
   ------------------------- */
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

function openMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.style.display = 'flex';
  mobileMenu.setAttribute('aria-hidden', 'false');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
}

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.style.display = 'none';
  mobileMenu.setAttribute('aria-hidden', 'true');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
}

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    if (!mobileMenu) return;
    const isOpen = mobileMenu.style.display === 'flex';
    if (isOpen) closeMobileMenu();
    else openMobileMenu();
  });
}

// close mobile menu when clicking any mobile nav link
document.querySelectorAll('#mobile-menu [data-section]').forEach((btn) => {
  btn.addEventListener('click', () => {
    closeMobileMenu();
  });
});

/* -------------------------
   FOOTER YEAR (keeps existing behaviour)
   ------------------------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* -------------------------
   Accessibility improvement:
   - close mobile menu on ESC
   ------------------------- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileMenu();
});
