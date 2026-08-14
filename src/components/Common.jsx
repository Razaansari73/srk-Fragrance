import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { discountFor, formatPrice } from '../data/products.jsx';
import { useStore } from '../store/StoreContext.jsx';

export function Breadcrumbs({ items }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link>{items.map((item) => <Fragment key={item.label}><span>/</span>{item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}</Fragment>)}</nav>;
}

export function PageHero({ eyebrow, title, breadcrumb = title, children }) {
  return <header className="page-hero"><div className="container"><Breadcrumbs items={[{ label: breadcrumb }]}/><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{children}</div></header>;
}

export function ProductCard({ product }) {
  const { addToCart, isFavorite, toggleFavorite } = useStore();
  const active = isFavorite(product.id);
  return <article className="product-card"><div className="product-media"><Link to={`/product?id=${product.id}`} aria-label={`View ${product.name}`}><img src={product.image} alt={`${product.name} — ${product.size}`} loading="lazy"/></Link>{product.isNew && <span className="product-badge">New</span>}<button className={`favorite-button${active ? ' is-active' : ''}`} onClick={() => toggleFavorite(product.id)} aria-label={`${active ? 'Remove from' : 'Add to'} favorites`} aria-pressed={active}>♡</button></div><div className="product-info"><p className="product-category">{product.category} · {product.size}</p><h3><Link to={`/product?id=${product.id}`}>{product.name}</Link></h3><div className="rating" aria-label={`Rated ${product.rating} out of 5`}>★ <span>{product.rating}</span></div><div className="price-row"><strong>{formatPrice(product.price)}</strong><s>{formatPrice(product.originalPrice)}</s><span>{discountFor(product)}% off</span></div><button className="button button-outline add-button" onClick={() => addToCart(product.id)}>Add to cart</button></div></article>;
}

export function ProductGrid({ products }) {
  return <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product}/>)}</div>;
}

export function EmptyState({ icon = '◇', title, message, action, to }) {
  return <div className="empty-state"><div className="empty-icon">{icon}</div><h2>{title}</h2><p>{message}</p>{to && <Link className="button button-dark" to={to}>{action}</Link>}</div>;
}

export function Benefits({ items }) {
  return <div className="benefit-grid">{items.map((item, index) => <article className="benefit" key={item.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>;
}
