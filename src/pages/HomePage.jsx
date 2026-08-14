import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Benefits, ProductGrid } from '../components/Common.jsx';
import { NewsletterForm } from '../components/Layout.jsx';
import { categories, products } from '../data/products.jsx';

const slides = [
  { eyebrow: 'The art of fragrance', title: 'Discover your signature scent.', copy: 'Timeless attars and refined perfumes, composed for the moments people remember.', image: '/images/p.jpg', alt: 'Shanaya perfume bottle in a warm luxury setting', actions: [['/arrival','Explore collection'], ['/arrival?sort=newest','Shop new arrivals']] },
  { eyebrow: 'A timeless ritual', title: 'Luxury attars. Enduring tradition.', copy: 'Concentrated, non-alcoholic fragrances that unfold beautifully on the skin.', image: '/images/aqwa 2.jpg', alt: 'AQ Aqua attar collection', actions: [['/arrival?category=Attar','Discover attars']] },
  { eyebrow: 'Make it memorable', title: 'Fragrance for every occasion.', copy: 'From considered gifts to everyday signatures, find a scent with presence.', image: '/images/p8.jpg', alt: 'Premium Safira perfume presentation', actions: [['/arrival?category=Gift%20Set','Explore gift sets']] },
];

function HeroCarousel() {
  const [active, setActive] = useState(0); const [paused, setPaused] = useState(false); const timer = useRef(); const touch = useRef(0);
  const show = (index) => setActive((index + slides.length) % slides.length);
  useEffect(() => { if (!paused) timer.current = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 6500); return () => clearInterval(timer.current); }, [active, paused]);
  return <section className="hero-carousel" aria-roledescription="carousel" aria-label="Featured fragrances" tabIndex="0" onKeyDown={(e) => e.key === 'ArrowRight' ? show(active + 1) : e.key === 'ArrowLeft' && show(active - 1)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={(e) => touch.current = e.changedTouches[0].clientX} onTouchEnd={(e) => { const distance = e.changedTouches[0].clientX - touch.current; if (Math.abs(distance) > 45) show(active + (distance < 0 ? 1 : -1)); }}>
    {slides.map((slide, index) => <article key={slide.title} className={`hero-slide${index === active ? ' is-active' : ''}`} aria-hidden={index !== active}><div className="hero-copy"><p className="eyebrow">{slide.eyebrow}</p><h1>{slide.title}</h1><p>{slide.copy}</p><div className="hero-actions">{slide.actions.map(([to,label], i) => <Link key={to} className={`button ${i ? 'button-ghost' : 'button-light'}`} to={to}>{label}</Link>)}</div></div><div className="hero-image"><img src={slide.image} alt={slide.alt}/></div></article>)}
    <div className="carousel-controls"><div className="carousel-dots" aria-label="Choose slide">{slides.map((slide, i) => <button key={slide.title} className={i === active ? 'is-active' : ''} aria-label={`Go to slide ${i + 1}`} onClick={() => show(i)}/>)}</div><button aria-label="Previous slide" onClick={() => show(active - 1)}>←</button><button aria-label="Next slide" onClick={() => show(active + 1)}>→</button></div>
  </section>;
}

const benefits = [
  { title: 'Authentic fragrances', copy: 'Considered scents rooted in a rich perfumery tradition.' }, { title: 'Premium quality', copy: 'Carefully selected compositions and elegant presentation.' }, { title: 'Long-lasting scent', copy: 'Expressive fragrance designed to evolve beautifully.' }, { title: 'Crafted with care', copy: 'A focused collection made for meaningful daily rituals.' },
];

export default function HomePage() {
  useEffect(() => { document.title = 'SRK Fragrance — The Art of Fragrance'; }, []);
  return <main id="main"><HeroCarousel/>
    <section className="section container"><div className="section-header"><div><p className="eyebrow">Curated for you</p><h2>Signature collection</h2><p>Distinctive compositions selected for character, longevity, and effortless refinement.</p></div><Link className="text-link" to="/arrival">View all fragrances</Link></div><ProductGrid products={products.filter((item) => item.isFeatured).slice(0, 4)}/></section>
    <section className="section container"><div className="section-header"><div><p className="eyebrow">Find your ritual</p><h2>Shop by collection</h2></div><p>Move from fresh daily signatures to rich traditional oud, with every collection only a touch away.</p></div><div className="category-grid">{categories.map((category) => <Link className="category-card" key={category.name} to={`/arrival?category=${encodeURIComponent(category.name)}`}><img src={category.image} alt={`Explore ${category.name}`} loading="lazy"/><div><h3>{category.name}</h3><p>{category.label} →</p></div></Link>)}</div></section>
    <section className="section story-section"><div className="container story-grid"><div className="story-image"><img src="/images/shop 2.webp" alt="Traditional attar bottles and fragrance craft" loading="lazy"/></div><div className="story-copy"><p className="eyebrow">Our heritage</p><h2>The essence of tradition</h2><p>SRK Fragrance connects the intimacy of traditional attar craft with a clean, contemporary sensibility. Each fragrance is chosen to feel personal—unfolding with warmth, depth, and a character all its own.</p><Link className="button button-outline" to="/about">Discover our story</Link></div></div></section>
    <section className="section container"><div className="section-header"><div><p className="eyebrow">Just arrived</p><h2>New expressions</h2></div><Link className="text-link" to="/arrival?sort=newest">Shop new arrivals</Link></div><ProductGrid products={products.filter((item) => item.isNew).slice(0, 4)}/></section>
    <section className="section-compact container"><Benefits items={benefits}/></section>
    <section className="section newsletter-banner"><div className="container"><p className="eyebrow">Private notes</p><h2>Enter the fragrance journal</h2><p>Be first to discover new compositions and considered offers.</p><NewsletterForm className="newsletter-inline"/></div></section>
  </main>;
}
