import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/StoreContext.jsx';

const paths = {
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5a5.5 5.5 0 0 0 1.1-8.9Z"/>,
  bag: <><path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
};
const Icon = ({ name }) => <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
const Brand = ({ light = false }) => <Link className={`brand${light ? ' brand-light' : ''}`} to="/" aria-label="SRK Fragrance home"><span>SRK</span><small>FRAGRANCE</small></Link>;
const links = [['/', 'Home'], ['/arrival', 'New Arrivals'], ['/arrival?category=all', 'Collections'], ['/about', 'About'], ['/contact', 'Contact']];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cart, favorites } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.toggle('overlay-open', menuOpen || searchOpen);
    const close = (event) => event.key === 'Escape' && (setMenuOpen(false), setSearchOpen(false));
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('keydown', close); document.body.classList.remove('overlay-open'); };
  }, [menuOpen, searchOpen]);
  const navigation = links.map(([to, label]) => <NavLink key={label} to={to} onClick={() => setMenuOpen(false)}>{label}</NavLink>);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="announcement">Complimentary delivery on orders above ₹999</div>
    <header className="site-header"><div className="header-inner container">
      <button className="icon-button menu-toggle" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Icon name="menu" /></button>
      <Brand /><nav className="desktop-nav" aria-label="Primary navigation">{navigation}</nav>
      <div className="header-actions"><button className="icon-button search-toggle" aria-label="Search fragrances" onClick={() => setSearchOpen(true)}><Icon name="search" /></button><Link className="icon-button badge-link" to="/favorites" aria-label="Favorites"><Icon name="heart"/><span>{favorites.length}</span></Link><Link className="icon-button badge-link" to="/cart" aria-label="Shopping cart"><Icon name="bag"/><span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span></Link></div>
    </div>
    <div className="mobile-panel" aria-hidden={!menuOpen}><button className="icon-button mobile-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><Icon name="close"/></button><p className="eyebrow">Explore SRK</p><nav aria-label="Mobile navigation">{navigation}</nav></div>
    <div className="search-panel" aria-hidden={!searchOpen}><form className="container search-form" onSubmit={(event) => { event.preventDefault(); const q = new FormData(event.currentTarget).get('q'); setSearchOpen(false); navigate(`/arrival?q=${encodeURIComponent(q)}`); }}><label htmlFor="site-search">Search our collection</label><div><input autoFocus={searchOpen} id="site-search" name="q" type="search" placeholder="Try “oud” or “attar”" autoComplete="off"/><button className="button button-dark">Search</button><button className="icon-button search-close" type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}><Icon name="close"/></button></div></form></div>
    </header>
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
