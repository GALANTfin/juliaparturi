const menuBtn = document.querySelector('[data-menu-btn]');
const nav = document.querySelector('[data-nav]');
const navClose = document.querySelector('[data-nav-close]');
const header = document.getElementById('topHeader');

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
document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

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

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 24);
  const heroParallax = document.querySelector('.hero-parallax');
  if (heroParallax) heroParallax.style.transform = `translateY(${window.scrollY * 0.22}px)`;
}, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Before/after slider
const beforeAfter = document.querySelector('[data-before-after]');
if (beforeAfter) {
  const slider = beforeAfter.querySelector('[data-before-after-slider]');
  const afterWrapper = beforeAfter.querySelector('[data-after-wrapper]');
  const update = () => {
    afterWrapper.style.width = `${slider.value}%`;
    slider.style.left = `${slider.value}%`;
  };
  slider.addEventListener('input', update);
  update();
}

// Gallery lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');

document.querySelectorAll('[data-lightbox]').forEach((item) => {
  item.addEventListener('click', (event) => {
    event.preventDefault();
    lightboxImage.src = item.href;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

document.querySelector('[data-lightbox-close]')?.addEventListener('click', () => {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
});

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
});

// Reviews (Google Places API ready + fallback)
const GOOGLE_PLACE_ID = 'REPLACE_WITH_PLACE_ID';
const GOOGLE_API_KEY = '';
const FALLBACK_REVIEWS = [
  { author_name: 'Helena R', profile_photo_url: 'https://i.pravatar.cc/80?img=11', rating: 5, text: 'Erittäin tyytyväinen. Suosittelen lämpimästi!' },
  { author_name: 'Timo K', profile_photo_url: 'https://i.pravatar.cc/80?img=12', rating: 5, text: 'Siististi ja nopeasti leikattu. Todella ammattitaitoista.' },
  { author_name: 'Linda N', profile_photo_url: 'https://i.pravatar.cc/80?img=5', rating: 5, text: 'Ihana työnjälki ja ystävällinen palvelu.' },
  { author_name: 'Olli K', profile_photo_url: 'https://i.pravatar.cc/80?img=31', rating: 5, text: 'Loistavaa ja tarkkaa työtä. Vahva suositus.' },
  { author_name: 'Virpi J', profile_photo_url: 'https://i.pravatar.cc/80?img=32', rating: 5, text: 'Ammattitaitoinen palvelu ja moderni tunnelma.' },
  { author_name: 'Sara J', profile_photo_url: 'https://i.pravatar.cc/80?img=33', rating: 5, text: 'Nopea ja taitava. Tosi kiva kokemus!' },
  { author_name: 'Elina T', profile_photo_url: 'https://i.pravatar.cc/80?img=34', rating: 5, text: 'Hiusväri onnistui täydellisesti.' },
  { author_name: 'Mia P', profile_photo_url: 'https://i.pravatar.cc/80?img=35', rating: 5, text: 'Rauhallinen tunnelma ja todella hyvä lopputulos.' }
];

const reviewsGrid = document.getElementById('reviewsGrid');
const showMoreBtn = document.getElementById('showMoreReviews');

const makeStars = (count) => '★'.repeat(Math.round(count));

const renderReviews = (reviews = [], rating = 4.8) => {
  if (!reviewsGrid) return;
  reviewsGrid.innerHTML = '';

  reviews.forEach((review, index) => {
    const card = document.createElement('article');
    card.className = `review-card reveal ${index >= 6 ? 'hidden extra-review' : ''}`;
    card.innerHTML = `
      <div class="review-head">
        <img src="${review.profile_photo_url || 'https://i.pravatar.cc/80'}" alt="${review.author_name}" loading="lazy" />
        <div>
          <strong>${review.author_name}</strong>
          <div class="stars">${makeStars(review.rating)}</div>
        </div>
      </div>
      <p>${review.text || ''}</p>
    `;
    reviewsGrid.appendChild(card);
    observer.observe(card);
  });

  const ratingSummary = document.getElementById('ratingSummary');
  if (ratingSummary) ratingSummary.textContent = `${rating.toFixed(1)} ★ Google arvosteluista`;
};

if (showMoreBtn) {
  showMoreBtn.addEventListener('click', () => {
    document.querySelectorAll('.extra-review').forEach((card, index) => {
      setTimeout(() => {
        card.classList.remove('hidden');
        card.classList.add('visible');
      }, 90 * index);
    });
    showMoreBtn.remove();
  });
}

const fetchGoogleReviews = async () => {
  if (!GOOGLE_API_KEY || GOOGLE_PLACE_ID === 'REPLACE_WITH_PLACE_ID') {
    renderReviews(FALLBACK_REVIEWS, 4.8);
    return;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=rating,reviews&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const result = data.result || {};
    const reviews = (result.reviews || []).slice(0, 9);
    renderReviews(reviews.length ? reviews : FALLBACK_REVIEWS, result.rating || 4.8);
  } catch {
    renderReviews(FALLBACK_REVIEWS, 4.8);
  }
};

fetchGoogleReviews();
