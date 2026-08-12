import { counts } from './store.js';

const icon = (name) => {
  const paths = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5a5.5 5.5 0 0 0 1.1-8.9Z"/>',
    bag: '<path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>'
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
};

export function renderShell() {
  const header = document.querySelector('[data-site-header]');
  const footer = document.querySelector('[data-site-footer]');
  if (header) header.innerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="announcement">Complimentary delivery on orders above ₹999</div>
    <header class="site-header">
      <div class="header-inner container">
        <button class="icon-button menu-toggle" aria-label="Open menu" aria-expanded="false">${icon('menu')}</button>
        <a class="brand" href="index.html" aria-label="SRK Fragrance home"><span>SRK</span><small>FRAGRANCE</small></a>
        <nav class="desktop-nav" aria-label="Primary navigation">
          <a href="index.html">Home</a><a href="arrival.html">New Arrivals</a><a href="arrival.html?category=all">Collections</a><a href="about.html">About</a><a href="contact.html">Contact</a>
        </nav>
        <div class="header-actions">
          <button class="icon-button search-toggle" aria-label="Search fragrances">${icon('search')}</button>
          <a class="icon-button badge-link" href="favorites.html" aria-label="Favorites">${icon('heart')}<span data-favorites-count>0</span></a>
          <a class="icon-button badge-link" href="cart.html" aria-label="Shopping cart">${icon('bag')}<span data-cart-count>0</span></a>
        </div>
      </div>
      <div class="mobile-panel" aria-hidden="true">
        <button class="icon-button mobile-close" aria-label="Close menu">${icon('close')}</button>
        <p class="eyebrow">Explore SRK</p>
        <nav aria-label="Mobile navigation"><a href="index.html">Home</a><a href="arrival.html">New Arrivals</a><a href="arrival.html?category=all">Collections</a><a href="about.html">About</a><a href="contact.html">Contact</a></nav>
      </div>
      <div class="search-panel" aria-hidden="true">
        <form class="container search-form" action="arrival.html">
          <label for="site-search">Search our collection</label>
          <div><input id="site-search" name="q" type="search" placeholder="Try “oud” or “attar”" autocomplete="off"><button class="button button-dark" type="submit">Search</button><button class="icon-button search-close" type="button" aria-label="Close search">${icon('close')}</button></div>
        </form>
      </div>
    </header>`;
  if (footer) footer.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand"><a class="brand brand-light" href="index.html"><span>SRK</span><small>FRAGRANCE</small></a><p>Contemporary fragrance, rooted in the rich tradition of Indian attar craft.</p><div class="socials"><a href="#" aria-label="Instagram">IG</a><a href="#" aria-label="Facebook">FB</a><a href="#" aria-label="YouTube">YT</a></div></div>
        <div><h2>Explore</h2><a href="index.html">Home</a><a href="arrival.html">New Arrivals</a><a href="arrival.html?category=all">Collections</a><a href="about.html">Our Story</a><a href="contact.html">Contact</a></div>
        <div><h2>Shop</h2><a href="arrival.html?category=Attar">Attars</a><a href="arrival.html?category=Perfume%20Spray">Perfume Sprays</a><a href="arrival.html?category=Royal%20Attar">Royal Attars</a><a href="arrival.html?category=Bakhoor">Bakhoor</a><a href="arrival.html?category=Gift%20Set">Gift Sets</a></div>
        <div><h2>Customer care</h2><a href="contact.html">Contact</a><a href="contact.html#delivery">Shipping & delivery</a><a href="contact.html#returns">Returns</a><a href="contact.html">Privacy policy</a><a href="contact.html">Terms</a></div>
        <div class="footer-newsletter"><h2>The fragrance journal</h2><p>New releases, rituals, and private offers—sent thoughtfully.</p><form data-newsletter><label class="sr-only" for="footer-email">Email address</label><input id="footer-email" type="email" placeholder="Email address" required><button type="submit" aria-label="Subscribe">→</button></form><small data-newsletter-status aria-live="polite"></small></div>
      </div>
      <div class="container footer-bottom"><span>© 2026 SRK Fragrance</span><span>Mumbai, India</span></div>
    </footer>`;
  bindShell();
}

function bindShell() {
  const body = document.body;
  const menu = document.querySelector('.mobile-panel');
  const search = document.querySelector('.search-panel');
  const menuToggle = document.querySelector('.menu-toggle');
  const setOpen = (panel, open) => {
    panel?.setAttribute('aria-hidden', String(!open));
    body.classList.toggle('overlay-open', open);
    if (panel === menu) menuToggle?.setAttribute('aria-expanded', String(open));
  };
  menuToggle?.addEventListener('click', () => setOpen(menu, true));
  document.querySelector('.mobile-close')?.addEventListener('click', () => { setOpen(menu, false); menuToggle?.focus(); });
  document.querySelector('.search-toggle')?.addEventListener('click', () => { setOpen(search, true); requestAnimationFrame(() => document.querySelector('#site-search')?.focus()); });
  document.querySelector('.search-close')?.addEventListener('click', () => setOpen(search, false));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { setOpen(menu, false); setOpen(search, false); } });
  document.querySelectorAll('[data-newsletter]').forEach((form) => form.addEventListener('submit', (event) => { event.preventDefault(); form.reset(); form.nextElementSibling.textContent = 'Welcome to the journal.'; }));
  updateCounts();
  window.addEventListener('srk:state', updateCounts);
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll(`a[href="${current}"]`).forEach((link) => link.setAttribute('aria-current', 'page'));
}

export function updateCounts() {
  const value = counts();
  document.querySelectorAll('[data-favorites-count]').forEach((node) => node.textContent = value.favorites);
  document.querySelectorAll('[data-cart-count]').forEach((node) => node.textContent = value.cart);
}
