import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/StoreContext.jsx';
import { formatPrice, products } from '../data/products.jsx';

const paths = {
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5a5.5 5.5 0 0 0 1.1-8.9Z"/>,
  bag: <><path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
};
const Icon = ({ name }) => <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
const Brand = ({ light = false }) => <Link className={`brand${light ? ' brand-light' : ''}`} to="/" aria-label="SRK Fragrance home"><span>SRK</span><small>FRAGRANCE</small></Link>;
const links = [['/', 'Home'], ['/arrival?category=all', 'Collections'], ['/about', 'About'], ['/contact', 'Contact']];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart, favorites } = useStore();
  const navigate = useNavigate();
  const closeSearch = () => { setSearchOpen(false); setSearchQuery(''); };
  const searchResults = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    if (!needle) return products.filter((product) => product.isFeatured).slice(0, 4);
    return products.filter((product) => `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(needle)).slice(0, 6);
  }, [searchQuery]);
  useEffect(() => {
    document.body.classList.toggle('overlay-open', menuOpen || searchOpen);
    const close = (event) => event.key === 'Escape' && (setMenuOpen(false), closeSearch());
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('keydown', close); document.body.classList.remove('overlay-open'); };
  }, [menuOpen, searchOpen]);
  const navigation = links.map(([to, label]) => <NavLink key={label} to={to} onClick={() => setMenuOpen(false)}>{label}</NavLink>);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="announcement">Complimentary delivery on orders above ₹999</div>
    <header className="site-header"><div className="header-inner container">
      <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => { setSearchOpen(false); setMenuOpen((open) => !open); }}><Icon name={menuOpen ? 'close' : 'menu'} /><span>{menuOpen ? 'Close' : 'Menu'}</span></button>
      <Brand /><nav className="desktop-nav" aria-label="Primary navigation">{navigation}</nav>
      <div className="header-actions"><button className="icon-button search-toggle" aria-label="Search fragrances" onClick={() => { setMenuOpen(false); setSearchOpen(true); }}><Icon name="search" /></button><Link className="icon-button badge-link" to="/favorites" aria-label="Favorites"><Icon name="heart"/><span>{favorites.length}</span></Link><Link className="icon-button badge-link" to="/cart" aria-label="Shopping cart"><Icon name="bag"/><span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span></Link></div>
    </div></header>
    <div className="mobile-panel" id="mobile-navigation" aria-hidden={!menuOpen}><div className="mobile-panel-top"><Brand/><button className="mobile-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><Icon name="close"/><span>Close</span></button></div><div className="mobile-panel-body"><p className="eyebrow">Explore SRK</p><nav aria-label="Mobile navigation">{navigation}</nav></div></div>
    <div className="search-panel" aria-hidden={!searchOpen} onMouseDown={(event) => event.target === event.currentTarget && closeSearch()}><section className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title"><div className="search-dialog-head"><div><p className="eyebrow">Discover your fragrance</p><h2 id="search-title">Search our collection</h2></div><button className="icon-button search-close" type="button" aria-label="Close search" onClick={closeSearch}><Icon name="close"/></button></div><form className="search-form" onSubmit={(event) => { event.preventDefault(); const q = searchQuery.trim(); closeSearch(); navigate(`/arrival?q=${encodeURIComponent(q)}`); }}><label className="sr-only" htmlFor="site-search">Search fragrances and products</label><div className="search-input-wrap"><Icon name="search"/><input autoFocus={searchOpen} id="site-search" name="q" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Try “oud”, “attar” or “gift set”" autoComplete="off"/><button className="button button-dark" type="submit">View all</button></div></form><div className="search-results" aria-live="polite"><div className="search-results-head"><span>{searchQuery.trim() ? `${searchResults.length} result${searchResults.length === 1 ? '' : 's'}` : 'Popular fragrances'}</span>{searchQuery.trim() && <Link to={`/arrival?q=${encodeURIComponent(searchQuery.trim())}`} onClick={closeSearch}>See all</Link>}</div>{searchResults.length ? <div className="search-result-list">{searchResults.map((product) => <Link className="search-result" key={product.id} to={`/product?id=${product.id}`} onClick={closeSearch}><span className="search-result-image"><img src={product.image} alt=""/></span><span className="search-result-copy"><strong>{product.name}</strong><small>{product.category} · {product.size}</small></span><b>{formatPrice(product.price)}</b></Link>)}</div> : <p className="search-empty">No fragrances found. Try a broader search.</p>}</div></section></div>
  </>;
}

function NewsletterForm({ className = '' }) {
  const [status, setStatus] = useState('');
  return <><form className={className} onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); setStatus('Welcome to the journal.'); }}><label className="sr-only" htmlFor={`email-${className || 'footer'}`}>Email address</label><input id={`email-${className || 'footer'}`} type="email" placeholder={className ? 'Your email address' : 'Email address'} required/><button type="submit" aria-label="Subscribe">{className ? 'Subscribe →' : '→'}</button></form><small aria-live="polite">{status}</small></>;
}

function Footer() {
  return <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><Brand light/><p>Contemporary fragrance, rooted in the rich tradition of Indian attar craft.</p><div className="socials"><a href="#instagram" aria-label="Instagram">IG</a><a href="#facebook" aria-label="Facebook">FB</a><a href="#youtube" aria-label="YouTube">YT</a></div></div><div><h2>Explore</h2><Link to="/">Home</Link><Link to="/arrival">New Arrivals</Link><Link to="/arrival?category=all">Collections</Link><Link to="/about">Our Story</Link><Link to="/contact">Contact</Link></div><div><h2>Shop</h2>{['Attar','Perfume Spray','Royal Attar','Bakhoor','Gift Set'].map((name) => <Link key={name} to={`/arrival?category=${encodeURIComponent(name)}`}>{name === 'Attar' ? 'Attars' : name}</Link>)}</div><div><h2>Customer care</h2><Link to="/contact">Contact</Link><Link to="/contact#delivery">Shipping & delivery</Link><Link to="/contact#returns">Returns</Link><Link to="/contact">Privacy policy</Link><Link to="/contact">Terms</Link></div><div className="footer-newsletter"><h2>The fragrance journal</h2><p>New releases, rituals, and private offers—sent thoughtfully.</p><NewsletterForm /></div></div><div className="container footer-bottom"><span>© 2026 SRK Fragrance</span><span>Mumbai, India</span></div></footer>;
}

function Toast() {
  const { toast, dismissToast } = useStore();
  if (!toast) return null;
  return <div className="toast" role="status"><span>{toast.message}</span>{toast.showCart && <Link to="/cart" onClick={dismissToast}>View cart</Link>}<button aria-label="Dismiss" onClick={dismissToast}>×</button></div>;
}

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return <><Header/><Outlet/><Footer/><Toast/></>;
}

export { NewsletterForm };
