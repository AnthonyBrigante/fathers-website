/* ============================================================
   BUMDEE COMICS — Merchandise Page JS
   ============================================================ */

// ── DOM refs ────────────────────────────────────────────────
const grid      = document.getElementById('productGrid');
const searchBox = document.getElementById('searchInput');
const countEl   = document.getElementById('itemCount');
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbName    = document.getElementById('lbName');
const lbNum     = document.getElementById('lbNum');
const lbClose   = document.getElementById('lbClose');

// ── All products (populated after JSON fetch) ────────────────
let ALL_PRODUCTS = [];

// ── Render grid ─────────────────────────────────────────────
function renderGrid(products) {
  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML = '<div class="empty-state">No items found — try a different search!</div>';
    countEl.textContent = '0 items';
    return;
  }

  countEl.textContent = `${products.length} item${products.length !== 1 ? 's' : ''}`;

  products.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${idx * 0.04}s`;

    card.innerHTML = `
      <div class="img-wrap">
        <img
          src="${p.image}"
          alt="${p.name}"
          loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <div class="img-fallback" style="display:none;">${p.id}</div>
      </div>
      <div class="card-info">
        <div class="prod-name">${p.name}</div>
        <div class="prod-num">Item #${String(p.id).padStart(2,'0')}</div>
      </div>
    `;

    card.addEventListener('click', () => openLightbox(p));
    grid.appendChild(card);
  });
}

// ── Search / filter ─────────────────────────────────────────
function filterProducts() {
  const q = searchBox.value.trim().toLowerCase();
  const filtered = q
    ? ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || String(p.id).includes(q))
    : ALL_PRODUCTS;
  renderGrid(filtered);
}

searchBox.addEventListener('input', filterProducts);

// ── Lightbox ─────────────────────────────────────────────────
function openLightbox(p) {
  lbImg.src  = p.image;
  lbImg.alt  = p.name;
  lbName.textContent = p.name;
  lbNum.textContent  = `Item #${String(p.id).padStart(2,'0')}`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';

  lbImg.onerror = () => {
    lbImg.src = '';
    lbImg.alt = 'Image not found';
  };
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ── Show loading state ───────────────────────────────────────
function showLoading() {
  grid.innerHTML = '<div class="empty-state">Loading products...</div>';
  countEl.textContent = '';
}

// ── Show error state ─────────────────────────────────────────
function showError(msg) {
  grid.innerHTML = `<div class="empty-state">⚠ ${msg}</div>`;
  countEl.textContent = '';
}

// ── Fetch products.json and initialise ───────────────────────
showLoading();

fetch('products.json')
  .then(res => {
    if (!res.ok) throw new Error(`Could not load products.json (${res.status})`);
    return res.json();
  })
  .then(data => {
    ALL_PRODUCTS = data;
    renderGrid(ALL_PRODUCTS);
  })
  .catch(err => {
    console.error(err);
    showError('Could not load products. Make sure products.json is in the same folder.');
  });
  /* ============================================================
   BUMDEE COMICS — Events Page JS
   ============================================================ */

// ── Event Data ───────────────────────────────────────────────
// Edit these objects to add/change your real events.
// 'lat' and 'lng' are used to generate the embedded map URL.
const EVENTS = [
  {
    month: 'OCT',
    day: '12',
    name: 'Comic-Con',
    location: 'Jacob K. Javits Convention Center, New York, NY',
    description: 'The biggest comic convention of the year. Find us at Booth #214 — packed with vintage comics, limited-edition pin sets, rare action figures, and Pokémon cards.',
    tag: 'Convention',
    lat: 40.7577,
    lng: -74.0021,
  },
  {
    month: 'NOV',
    day: '5',
    name: 'Toy Fair',
    location: 'Javits Center, New York, NY',
    description: 'A premier collectibles and toy show. We\'ll be showcasing our full merchandise lineup including exclusive limited-edition items available only at the show.',
    tag: 'Trade Show',
    lat: 40.7577,
    lng: -74.0021,
  },
  {
    month: 'DEC',
    day: '7',
    name: 'Holiday Collectors Expo',
    location: 'Brooklyn Expo Center, Brooklyn, NY',
    description: 'Stock up on gifts for the comic lover in your life. Vintage graded comics, superhero statues, and special holiday bundles available at our table.',
    tag: 'Expo',
    lat: 40.6892,
    lng: -73.9995,
  },
  {
    month: 'JAN',
    day: '18',
    name: 'Winter Con',
    location: 'Queens Hall of Science, Queens, NY',
    description: 'Kick off the new year with us at Winter Con! New arrivals in stock — classic Silver Age books, CGC-graded slabs, and brand-new action figures fresh from the distributor.',
    tag: 'Convention',
    lat: 40.7489,
    lng: -73.8454,
  },
];

// ── Render Events ────────────────────────────────────────────
const listEl = document.getElementById('eventsList');

EVENTS.forEach((ev, i) => {
  const card = document.createElement('div');
  card.className = 'event-card';
  card.style.animationDelay = `${i * 0.1}s`;
  card.innerHTML = `
    <div class="event-date-block">
      <span class="month">${ev.month}</span>
      <span class="day">${ev.day}</span>
    </div>
    <div class="event-body">
      <div class="event-name">${ev.name}</div>
      <div class="event-loc">
        <span>📍</span> ${ev.location}
      </div>
      <div class="event-desc">${ev.description}</div>
      <span class="event-tag">${ev.tag}</span>
    </div>
  `;
  listEl.appendChild(card);
});

// ── Map Setup ────────────────────────────────────────────────
// Uses an OpenStreetMap embed (no API key required).
// The map centers on the first event's coordinates.
const mapFrame = document.getElementById('mapFrame');
const mapStatic = document.getElementById('mapStatic');

const firstEv = EVENTS[0];
const osmSrc =
  `https://www.openstreetmap.org/export/embed.html` +
  `?bbox=${firstEv.lng - 0.02}%2C${firstEv.lat - 0.012}%2C${firstEv.lng + 0.02}%2C${firstEv.lat + 0.012}` +
  `&layer=mapnik` +
  `&marker=${firstEv.lat}%2C${firstEv.lng}`;

mapFrame.src = osmSrc;

// If iframe fails to load (e.g. CSP), show the static fallback
mapFrame.addEventListener('error', () => {
  mapFrame.style.display = 'none';
  mapStatic.style.display = 'block';
});

// ── Location tag update ──────────────────────────────────────
// Shows the first event's address below the map
const locTagEl = document.getElementById('mapLocationTag');
if (locTagEl) {
  locTagEl.textContent = firstEv.location;
}