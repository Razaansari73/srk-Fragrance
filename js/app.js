import { discountFor, formatPrice } from './products.js';
import { addToCart, isFavorite, toggleFavorite } from './store.js';
import { renderShell } from './components.js';

export function productCard(product) {
  return `<article class="product-card" data-product-id="${product.id}">
    <div class="product-media">
      <a href="product.html?id=${product.id}" aria-label="View ${product.name}"><img src="${product.image}" alt="${product.name} — ${product.size}" loading="lazy"></a>
      ${product.isNew ? '<span class="product-badge">New</span>' : ''}
      <button class="favorite-button ${isFavorite(product.id) ? 'is-active' : ''}" data-favorite="${product.id}" aria-label="${isFavorite(product.id) ? 'Remove from' : 'Add to'} favorites" aria-pressed="${isFavorite(product.id)}">♡</button>
    </div>
    <div class="product-info"><p class="product-category">${product.category} · ${product.size}</p><h3><a href="product.html?id=${product.id}">${product.name}</a></h3><div class="rating" aria-label="Rated ${product.rating} out of 5">★ <span>${product.rating}</span></div><div class="price-row"><strong>${formatPrice(product.price)}</strong><s>${formatPrice(product.originalPrice)}</s><span>${discountFor(product)}% off</span></div><button class="button button-outline add-button" data-add="${product.id}">Add to cart</button></div>
  </article>`;
}

export function bindProductActions(root = document) {
  root.addEventListener('click', (event) => {
    const favorite = event.target.closest('[data-favorite]');
    const add = event.target.closest('[data-add]');
    if (favorite) {
      const active = toggleFavorite(favorite.dataset.favorite);
      favorite.classList.toggle('is-active', active);
      favorite.setAttribute('aria-pressed', active);
      favorite.setAttribute('aria-label', `${active ? 'Remove from' : 'Add to'} favorites`);
      toast(active ? 'Saved to your collection' : 'Removed from favorites');
    }
    if (add) { addToCart(add.dataset.add); toast('Added to your bag', true); }
  });
}

export function toast(message, showCart = false) {
  document.querySelector('.toast')?.remove();
  const node = document.createElement('div');
  node.className = 'toast';
  node.setAttribute('role', 'status');
  node.innerHTML = `<span>${message}</span>${showCart ? '<a href="cart.html">View cart</a>' : ''}<button aria-label="Dismiss">×</button>`;
  document.body.append(node);
  node.querySelector('button').addEventListener('click', () => node.remove());
  setTimeout(() => node.remove(), 4000);
}

renderShell();
