import { bindProductActions, productCard, toast } from './app.js';
import { discountFor, findProduct, formatPrice, products } from './products.js';
import { addToCart, isFavorite, toggleFavorite } from './store.js';

const product = findProduct(new URLSearchParams(location.search).get('id'));
const root = document.querySelector('[data-product-detail]');
if (!product) {
  root.innerHTML = '<div class="empty-state"><div class="empty-icon">◇</div><h1>Fragrance not found</h1><p>The product link may be incomplete or no longer available.</p><a class="button button-dark" href="arrival.html">Explore collection</a></div>';
  document.querySelector('[data-related]').closest('section').remove();
} else {
  document.title = `${product.name} — SRK Fragrance`;
  document.querySelector('[data-product-crumb]').textContent = product.name;
  root.innerHTML = `<div class="product-detail"><div><button class="product-gallery-main" aria-label="Open full-screen image viewer"><img src="${product.gallery[0]}" alt="${product.name}"><span class="zoom-hint">Click to enlarge</span></button><div class="gallery-thumbs" aria-label="Product images">${product.gallery.map((image, index) => `<button class="${index === 0 ? 'is-active' : ''}" data-image-index="${index}" aria-label="View image ${index + 1}"><img src="${image}" alt=""></button>`).join('')}</div></div><div class="product-detail-copy"><p class="eyebrow">${product.category}</p><h1>${product.name}</h1><div class="rating" aria-label="Rated ${product.rating} out of 5">★★★★★ <span>${product.rating} / 5</span></div><div class="detail-price"><strong>${formatPrice(product.price)}</strong><s>${formatPrice(product.originalPrice)}</s><span>Save ${discountFor(product)}%</span></div><p class="detail-description">${product.description}</p><p class="detail-size"><strong>Size:</strong> ${product.size}</p><div class="purchase-row"><div class="quantity"><button data-qty-minus aria-label="Decrease quantity">−</button><input data-quantity value="1" inputmode="numeric" aria-label="Quantity"><button data-qty-plus aria-label="Increase quantity">+</button></div><button class="button button-dark" data-detail-add>Add to cart</button><button class="detail-favorite ${isFavorite(product.id) ? 'is-active' : ''}" data-detail-favorite aria-label="Toggle favorite" aria-pressed="${isFavorite(product.id)}">♡</button></div><div class="detail-accordions"><details open><summary>Product information</summary><p>A premium ${product.category.toLowerCase()} presented in ${product.size}. Store in a cool, dry place away from direct sunlight.</p></details><details><summary>Delivery information</summary><p>Complimentary standard delivery on orders above ₹999. Delivery times are shown before checkout.</p></details><details><summary>Returns information</summary><p>Unopened products may be returned within 7 days of delivery. Contact us and we will guide you through the process.</p></details></div></div></div>`;
  document.querySelector('[data-related]').innerHTML = products.filter((item) => item.id !== product.id && (item.category === product.category || item.isFeatured)).slice(0, 4).map(productCard).join('');
  bindProductActions(document.querySelector('[data-related]').parentElement);
  const quantity = document.querySelector('[data-quantity]');
  document.querySelector('[data-qty-minus]').addEventListener('click', () => quantity.value = Math.max(1, (Number(quantity.value) || 1) - 1));
  document.querySelector('[data-qty-plus]').addEventListener('click', () => quantity.value = (Number(quantity.value) || 1) + 1);
  document.querySelector('[data-detail-add]').addEventListener('click', () => { addToCart(product.id, quantity.value); toast('Added to your bag', true); });
  document.querySelector('[data-detail-favorite]').addEventListener('click', (event) => { const active = toggleFavorite(product.id); event.currentTarget.classList.toggle('is-active', active); event.currentTarget.setAttribute('aria-pressed', active); toast(active ? 'Saved to your collection' : 'Removed from favorites'); });
  setupGallery(product);
}

function setupGallery(item) {
  let index = 0; let startX = 0;
  const main = document.querySelector('.product-gallery-main img');
  const lightbox = document.querySelector('.lightbox'); const viewer = lightbox.querySelector('img');
  const select = (next) => { index = (next + item.gallery.length) % item.gallery.length; main.src = item.gallery[index]; viewer.src = item.gallery[index]; viewer.alt = `${item.name}, image ${index + 1}`; document.querySelectorAll('[data-image-index]').forEach((node, i) => node.classList.toggle('is-active', i === index)); };
  document.querySelector('.gallery-thumbs').addEventListener('click', (event) => { const button = event.target.closest('[data-image-index]'); if (button) select(Number(button.dataset.imageIndex)); });
  document.querySelector('.product-gallery-main').addEventListener('click', () => { select(index); lightbox.classList.add('is-open'); document.body.classList.add('overlay-open'); lightbox.querySelector('.lightbox-close').focus(); });
  const close = () => { lightbox.classList.remove('is-open'); document.body.classList.remove('overlay-open'); };
  lightbox.querySelector('.lightbox-close').addEventListener('click', close);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => select(index - 1)); lightbox.querySelector('.lightbox-next').addEventListener('click', () => select(index + 1));
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) close(); });
  lightbox.addEventListener('touchstart', (event) => startX = event.changedTouches[0].clientX, { passive: true }); lightbox.addEventListener('touchend', (event) => { const distance = event.changedTouches[0].clientX - startX; if (Math.abs(distance) > 40) select(index + (distance < 0 ? 1 : -1)); }, { passive: true });
  document.addEventListener('keydown', (event) => { if (!lightbox.classList.contains('is-open')) return; if (event.key === 'Escape') close(); if (event.key === 'ArrowLeft') select(index - 1); if (event.key === 'ArrowRight') select(index + 1); });
}
