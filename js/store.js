const KEYS = { cart: 'srk-cart', favorites: 'srk-favorites' };

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

const write = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
};

export const getCart = () => read(KEYS.cart, []);
export const getFavorites = () => read(KEYS.favorites, []);
export const isFavorite = (id) => getFavorites().includes(Number(id));

export function toggleFavorite(id) {
  const value = Number(id);
  const favorites = getFavorites();
  const next = favorites.includes(value) ? favorites.filter((item) => item !== value) : [...favorites, value];
  write(KEYS.favorites, next);
  window.dispatchEvent(new CustomEvent('srk:state'));
  return next.includes(value);
}

export function addToCart(id, quantity = 1) {
  const value = Number(id);
  const cart = getCart();
  const item = cart.find((entry) => entry.id === value);
  if (item) item.quantity += Math.max(1, Number(quantity));
  else cart.push({ id: value, quantity: Math.max(1, Number(quantity)) });
  write(KEYS.cart, cart);
  window.dispatchEvent(new CustomEvent('srk:state'));
}

export function updateCart(id, quantity) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === Number(id));
  if (item) item.quantity = Math.max(1, Number(quantity));
  write(KEYS.cart, cart);
  window.dispatchEvent(new CustomEvent('srk:state'));
}

export function removeFromCart(id) {
  write(KEYS.cart, getCart().filter((entry) => entry.id !== Number(id)));
  window.dispatchEvent(new CustomEvent('srk:state'));
}

export const counts = () => ({
  favorites: getFavorites().length,
  cart: getCart().reduce((sum, item) => sum + item.quantity, 0)
});
