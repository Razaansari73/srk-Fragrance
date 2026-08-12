import { bindProductActions, productCard } from './app.js';
import { categories, products } from './products.js';

document.querySelector('[data-featured-products]').innerHTML = products.filter((item) => item.isFeatured).slice(0, 4).map(productCard).join('');
document.querySelector('[data-new-products]').innerHTML = products.filter((item) => item.isNew).slice(0, 4).map(productCard).join('');
document.querySelector('[data-categories]').innerHTML = categories.map((category) => `<a class="category-card" href="arrival.html?category=${encodeURIComponent(category.name)}"><img src="${category.image}" alt="Explore ${category.name}" loading="lazy"><div><h3>${category.name}</h3><p>${category.label} →</p></div></a>`).join('');
bindProductActions();

const carousel = document.querySelector('.hero-carousel');
const slides = [...document.querySelectorAll('.hero-slide')];
const dots = document.querySelector('.carousel-dots');
let active = 0;
let timer;
let touchStart = 0;

slides.forEach((_, index) => {
  const button = document.createElement('button');
  button.type = 'button'; button.setAttribute('aria-label', `Go to slide ${index + 1}`);
  button.addEventListener('click', () => show(index)); dots.append(button);
});

function show(index) {
  active = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => { slide.classList.toggle('is-active', i === active); slide.setAttribute('aria-hidden', String(i !== active)); });
  [...dots.children].forEach((dot, i) => dot.classList.toggle('is-active', i === active));
  restart();
}
function restart() { clearInterval(timer); timer = setInterval(() => show(active + 1), 6500); }
document.querySelector('[data-carousel-next]').addEventListener('click', () => show(active + 1));
document.querySelector('[data-carousel-prev]').addEventListener('click', () => show(active - 1));
carousel.addEventListener('mouseenter', () => clearInterval(timer)); carousel.addEventListener('mouseleave', restart);
carousel.addEventListener('keydown', (event) => { if (event.key === 'ArrowRight') show(active + 1); if (event.key === 'ArrowLeft') show(active - 1); });
carousel.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
carousel.addEventListener('touchend', (event) => { const distance = event.changedTouches[0].clientX - touchStart; if (Math.abs(distance) > 45) show(active + (distance < 0 ? 1 : -1)); }, { passive: true });
show(0);
