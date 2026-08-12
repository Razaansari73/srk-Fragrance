import { bindProductActions, productCard } from './app.js';
import { products } from './products.js';
import { getFavorites } from './store.js';

const grid = document.querySelector('[data-favorites-grid]');
const empty = document.querySelector('[data-favorites-empty]');
function render() {
  const favoriteProducts = products.filter((item) => getFavorites().includes(item.id));
  grid.innerHTML = favoriteProducts.map(productCard).join('');
  empty.innerHTML = favoriteProducts.length ? '' : '<div class="empty-state"><div class="empty-icon">♡</div><h2>Your collection is waiting.</h2><p>Save fragrances you love and find them here anytime.</p><a class="button button-dark" href="arrival.html">Explore collection</a></div>';
}
bindProductActions(); window.addEventListener('srk:state', render); render();
