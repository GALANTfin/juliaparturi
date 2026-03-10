const menuBtn = document.querySelector('[data-menu-btn]');
const nav = document.querySelector('[data-nav]');
const navClose = document.querySelector('[data-nav-close]');

const closeMenu = () => {
  nav?.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
};

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

navClose?.addEventListener('click', closeMenu);
document.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

const setLanguage = (lang) => {
  document.documentElement.lang = lang;
  localStorage.setItem('siteLang', lang);
  document.querySelectorAll('[data-lang]').forEach((el) => {
    el.classList.toggle('show', el.dataset.lang === lang);
  });
  document.querySelectorAll('[data-set-lang]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.setLang === lang);
  });
  const fixedBook = document.querySelector('.mobile-book');
  if (fixedBook) fixedBook.textContent = lang === 'fi' ? 'Varaa aika' : 'Book appointment';
};

setLanguage(localStorage.getItem('siteLang') || 'fi');
document.querySelectorAll('[data-set-lang]').forEach((btn) => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.setLang));
});

document.querySelectorAll('[data-lightbox] a').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const box = document.querySelector('.lightbox');
    const img = box?.querySelector('img');
    if (!box || !img) return;
    img.src = link.href;
    img.alt = link.querySelector('img')?.alt || 'Gallery image';
    box.classList.add('open');
  });
});

document.querySelector('.lightbox')?.addEventListener('click', () => {
  document.querySelector('.lightbox')?.classList.remove('open');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));