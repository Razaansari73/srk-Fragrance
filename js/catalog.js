import { bindProductActions, productCard } from './app.js';
import { products } from './products.js';

const params = new URLSearchParams(location.search);
const categories = ['all', ...new Set(products.map((item) => item.category))];
const state = { query: params.get('q') || '', category: params.get('category') || 'all', sort: params.get('sort') || 'featured', max: Infinity };
const grid = document.querySelector('[data-catalog]');
const search = document.querySelector('[data-catalog-search]');
const sort = document.querySelector('[data-sort]');
search.value = state.query; sort.value = state.sort;
document.querySelector('[data-category-filters]').innerHTML = categories.map((category) => `<button class="${category === state.category ? 'is-active' : ''}" data-category="${category}">${category === 'all' ? 'All fragrances' : category}</button>`).join('');

function render() {
  const query = state.query.trim().toLowerCase();
  let result = products.filter((product) => (state.category === 'all' || product.category === state.category) && product.price <= state.max && (!query || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query)));
  const sorters = { newest: (a,b) => Number(b.isNew)-Number(a.isNew), low: (a,b) => a.price-b.price, high: (a,b) => b.price-a.price, az: (a,b) => a.name.localeCompare(b.name), featured: (a,b) => Number(b.isFeatured)-Number(a.isFeatured) };
  result.sort(sorters[state.sort]);
  grid.innerHTML = result.map(productCard).join('');
  document.querySelector('[data-result-count]').textContent = `${result.length} fragrance${result.length === 1 ? '' : 's'}`;
  document.querySelector('[data-no-results]').innerHTML = result.length ? '' : '<div class="empty-state"><div class="empty-icon">◇</div><h2>No fragrances found</h2><p>Try a broader search or clear your filters.</p><button class="button button-dark" data-clear>Clear filters</button></div>';
}
search.addEventListener('input', () => { state.query = search.value; render(); });
sort.addEventListener('change', () => { state.sort = sort.value; render(); });
document.querySelector('[data-category-filters]').addEventListener('click', (event) => { const button = event.target.closest('[data-category]'); if (!button) return; state.category = button.dataset.category; document.querySelectorAll('[data-category]').forEach((node) => node.classList.toggle('is-active', node === button)); document.querySelector('.filters').classList.remove('is-open'); render(); });
document.querySelector('[data-apply-price]').addEventListener('click', () => { state.max = Number(document.querySelector('[data-price]').value) || Infinity; render(); });
document.querySelector('.filter-toggle').addEventListener('click', () => document.querySelector('.filters').classList.toggle('is-open'));
document.querySelector('[data-no-results]').addEventListener('click', (event) => { if (!event.target.closest('[data-clear]')) return; Object.assign(state, { query: '', category: 'all', max: Infinity }); search.value = ''; document.querySelector('[data-price]').value = ''; document.querySelectorAll('[data-category]').forEach((node) => node.classList.toggle('is-active', node.dataset.category === 'all')); render(); });
bindProductActions(); render();
