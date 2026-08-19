import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const KEYS = { cart: 'srk-cart', favorites: 'srk-favorites' };
const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const persist = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage can be unavailable. */ }
};

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCartState] = useState(() => read(KEYS.cart, []));
  const [favorites, setFavoritesState] = useState(() => read(KEYS.favorites, []));
  const [toast, setToast] = useState(null);

  const setCart = (updater) => setCartState((current) => {
    const next = typeof updater === 'function' ? updater(current) : updater;
    persist(KEYS.cart, next); return next;
  });
  const setFavorites = (updater) => setFavoritesState((current) => {
    const next = typeof updater === 'function' ? updater(current) : updater;
    persist(KEYS.favorites, next); return next;
  });
  const notify = useCallback((message, showCart = false) => {
    setToast({ message, showCart, id: Date.now() });
    window.setTimeout(() => setToast((current) => current?.message === message ? null : current), 4000);
  }, []);

  const value = useMemo(() => ({
    cart, favorites, toast, notify, dismissToast: () => setToast(null),
    isFavorite: (id) => favorites.includes(Number(id)),
    toggleFavorite: (id) => {
      const value = Number(id); const active = !favorites.includes(value);
      setFavorites((items) => active ? [...items, value] : items.filter((item) => item !== value));
      notify(active ? 'Saved to your collection' : 'Removed from favorites');
    },
    addToCart: (id, quantity = 1) => {
      const value = Number(id); const amount = Math.max(1, Number(quantity) || 1);
      setCart((items) => items.some((item) => item.id === value)
        ? items.map((item) => item.id === value ? { ...item, quantity: item.quantity + amount } : item)
        : [...items, { id: value, quantity: amount }]);
      notify('Added to your bag', true);
    },
    updateCart: (id, quantity) => setCart((items) => items.map((item) => item.id === Number(id) ? { ...item, quantity: Math.max(1, quantity) } : item)),
    removeFromCart: (id) => setCart((items) => items.filter((item) => item.id !== Number(id))),
  }), [cart, favorites, toast, notify]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// The provider and its colocated hook intentionally share this module.
// eslint-disable-next-line react-refresh/only-export-components
export const useStore = () => useContext(StoreContext);
